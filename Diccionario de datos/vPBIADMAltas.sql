-- =========================================================================
-- OBJETO: c01.vPBIADMAltas
-- DESCRIPCIÓN: Consolida Inicios de ciclo. INCLUYE DEDUPLICADOR DIARIO.
-- =========================================================================
CREATE OR ALTER VIEW c01.vPBIADMAltas AS
WITH CTE_Ciclos_Desde_Boletas AS (
    -- 1. Buscamos el primer mes de cada ciclo en las boletas
    SELECT 
        numero_documento, fecha_ingreso_compania, codigo_unico, codigo_compania as compania,
        sucursal, unidad_funcional_organica, puesto_organico as puesto_organica,
        sueldo_basico, ubicacion_fisica,
        ROW_NUMBER() OVER(PARTITION BY numero_documento, fecha_ingreso_compania ORDER BY ano_periodo ASC, codigo_periodo ASC) as rn_primer_mes
    FROM c01.admhistoricoboletaid
    WHERE fecha_ingreso_compania IS NOT NULL
),
CTE_Universo_Altas AS (
    -- 2. Juntamos el Maestro con las Boletas
    SELECT numero_documento, fecha_ingreso_compania, codigo_unico, compania, sucursal, unidad_funcional_organica, puesto_organica, sueldo_basico, ubicacion_fisica
    FROM c01.ADMTrabajador
    WHERE fecha_ingreso_compania IS NOT NULL
    UNION 
    SELECT numero_documento, fecha_ingreso_compania, codigo_unico, compania, sucursal, unidad_funcional_organica, puesto_organica, sueldo_basico, ubicacion_fisica
    FROM CTE_Ciclos_Desde_Boletas
    WHERE rn_primer_mes = 1
),
CTE_Deduplicador_Diario AS (
    -- 3. ¡EL BLINDAJE! Si hay 2 ingresos el mismo día, nos quedamos con la foto de mayor sueldo
    SELECT *,
           ROW_NUMBER() OVER(PARTITION BY numero_documento, fecha_ingreso_compania ORDER BY sueldo_basico DESC) as rn_unico_dia
    FROM CTE_Universo_Altas
),
CTE_Linea_Tiempo AS (
    -- 4. Clasificamos: Nuevo Ingreso vs Reingreso (Garantizado sin duplicados)
    SELECT *,
           ROW_NUMBER() OVER(PARTITION BY numero_documento ORDER BY fecha_ingreso_compania ASC) as Numero_De_Ciclo
    FROM CTE_Deduplicador_Diario
    WHERE rn_unico_dia = 1
)
-- 5. RESULTADO FINAL
SELECT 
    t.codigo_unico,
    t.numero_documento,
    t.compania,
    t.fecha_ingreso_compania AS Fecha_Evento,
    'ALTA' AS Tipo_Evento,
    CASE WHEN t.Numero_De_Ciclo = 1 THEN 'NUEVO INGRESO' ELSE 'REINGRESO' END AS Motivo_Evento,
    t.sucursal,
    t.unidad_funcional_organica,
    t.puesto_organica,
    t.ubicacion_fisica,
    t.sueldo_basico,
    r.dias_gap_laboral AS Dias_Gap_Reingreso,
    ISNULL(r.tipo_reingreso, 'NO APLICA') AS Tipo_Reingreso,
    r.sueldo_anterior,
    r.incremento_sueldo
FROM CTE_Linea_Tiempo t
LEFT JOIN c01.vPBIADMReingresos r 
    ON t.numero_documento = r.numero_documento 
    AND t.fecha_ingreso_compania = r.fecha_de_reingreso;
GO

-- SELECT 
--    CASE 
--        WHEN t.numero_documento IS NOT NULL THEN '1. FOTO ACTUAL (Coincide con ADMTrabajador)'
--        ELSE '2. FOTO HISTÓRICA (Rescatada de las Boletas)' 
--    END AS Origen_Dato,
--    COUNT(*) AS Total_Registros
--FROM c01.vPBIADMAltas a
--LEFT JOIN c01.ADMTrabajador t 
--    ON a.numero_documento = t.numero_documento 
--    AND a.Fecha_Evento = t.fecha_ingreso_compania
--GROUP BY 
--    CASE 
--        WHEN t.numero_documento IS NOT NULL THEN '1. FOTO ACTUAL (Coincide con ADMTrabajador)'
--        ELSE '2. FOTO HISTÓRICA (Rescatada de las Boletas)' 
--    END
--ORDER BY Origen_Dato;

--SELECT 
--    numero_documento, 
--    MAX(sueldo_basico) as Ultimo_Sueldo,
--    COUNT(*) AS Cantidad_De_Ciclos_Laborales
--FROM c01.vPBIADMAltas
--GROUP BY numero_documento
--HAVING COUNT(*) > 1
--ORDER BY Cantidad_De_Ciclos_Laborales DESC;