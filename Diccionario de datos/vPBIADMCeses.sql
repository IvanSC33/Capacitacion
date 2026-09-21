-- =========================================================================
-- OBJETO: c01.vPBIADMCeses
-- DESCRIPCIÓN: Consolida la historia real de salidas (Ceses).
-- BLINDAJE: Deduplica a nivel Año-Mes (mata diferencias de horas/días).
-- PRIORIDAD: Pendiente > Histórico > Boleta. Incluye Catálogo SUNAT.
-- =========================================================================
CREATE OR ALTER VIEW c01.vPBIADMCeses AS

-- 1. Aislar y Deduplicar las Boletas del mes (1 fila por empleado y mes)
WITH CTE_UltimaBoletaPorMes AS (
    SELECT 
        codigo_unico, ano_periodo, codigo_periodo,
        sueldo_basico, unidad_funcional_organica, puesto_organico,
        codigo_compania as compania, sucursal, ubicacion_fisica,
        ROW_NUMBER() OVER(PARTITION BY codigo_unico, ano_periodo, codigo_periodo ORDER BY TRY_CAST(sueldo_basico AS DECIMAL(18,2)) DESC) as rn_boleta
    FROM c01.ADMHistoricoBoletaId
),

-- 2. Recolectar TODOS los ceses con la nueva Jerarquía (Prioridad 1 al 4)
CTE_Universo_Ceses AS (
    -- Prioridad 1: Pendientes
    SELECT codigo_unico, CAST(fecha_efectivo_renuncia AS DATE) AS Fecha_Cese, tipo_retiro AS codigo_cese, 1 AS Prioridad, 'PENDIENTE' AS Fuente 
    FROM c01.admpendienteretiro WHERE fecha_efectivo_renuncia IS NOT NULL
    
    UNION ALL
    -- Prioridad 2: Histórico Oficial
    SELECT codigo_unico, CAST(fecha_retiro AS DATE) AS Fecha_Cese, tipo_retiro AS codigo_cese, 2 AS Prioridad, 'HISTORICO' AS Fuente 
    FROM c01.ADMHistoricoCese WHERE fecha_retiro IS NOT NULL
    
    UNION ALL
    -- Prioridad 3: Boletas
    SELECT codigo_unico, CAST(fecha_retiro AS DATE) AS Fecha_Cese, codigo_cese AS codigo_cese, 3 AS Prioridad, 'BOLETA' AS Fuente 
    FROM c01.ADMHistoricoBoletaId WHERE fecha_retiro IS NOT NULL AND situacion_trabajador = 'C'
    
    UNION ALL
    -- Prioridad 4: Maestro Actual (Último recurso)
    SELECT codigo_unico, CAST(fecha_retiro AS DATE) AS Fecha_Cese, NULL AS codigo_cese, 4 AS Prioridad, 'MAESTRO' AS Fuente 
    FROM c01.ADMTrabajador WHERE fecha_retiro IS NOT NULL
),

-- 3. EL BLINDAJE: 1 Cese por Empleado, Año y Mes (Mata horas distintas o desfases de un día)
CTE_Ceses_Limpios AS (
    SELECT *,
        ROW_NUMBER() OVER(
            PARTITION BY codigo_unico, YEAR(Fecha_Cese), MONTH(Fecha_Cese) 
            ORDER BY Prioridad ASC, Fecha_Cese DESC
        ) as rn_cese
    FROM CTE_Universo_Ceses
)

-- 4. Ensamble Final
SELECT 
    c.codigo_unico,
    t.numero_documento,
    c.Fecha_Cese,
    'CESE' AS Tipo_Evento,
    -- Aquí tomamos la descripción del Catálogo, si no existe, dice RETIRO
    ISNULL(cm.descripcion_cese, 'RETIRO') AS Motivo_Evento,
    ISNULL(cm.equi_sunat, '00') AS Codigo_Sunat_Cese,
    
    -- Atributos Point-In-Time (Foto de la boleta de ese mes)
    ISNULL(hb.sueldo_basico, t.sueldo_basico) AS sueldo_basico,
    ISNULL(hb.unidad_funcional_organica, t.unidad_funcional_organica) AS unidad_funcional_organica,
    ISNULL(hb.puesto_organico, t.puesto_organica) AS puesto_organica,
    ISNULL(hb.compania, t.compania) AS compania,
    ISNULL(hb.sucursal, t.sucursal) AS sucursal,
    ISNULL(hb.ubicacion_fisica, t.ubicacion_fisica) AS ubicacion_fisica,
    
    c.codigo_cese,
    c.Fuente
FROM CTE_Ceses_Limpios c
INNER JOIN c01.ADMTrabajador t ON c.codigo_unico = t.codigo_unico
-- Cruce con el Catálogo de Cese Motivo
LEFT JOIN c01.ADMCeseMotivo cm ON c.codigo_cese = cm.codigo_cese
-- Cruce con la Boleta Deduplicada
LEFT JOIN CTE_UltimaBoletaPorMes hb 
    ON c.codigo_unico = hb.codigo_unico 
    AND hb.ano_periodo = CAST(YEAR(c.Fecha_Cese) AS VARCHAR(4))
    AND hb.codigo_periodo = RIGHT('0' + CAST(MONTH(c.Fecha_Cese) AS VARCHAR(2)), 2)
    AND hb.rn_boleta = 1
WHERE c.rn_cese = 1;
GO


-- ---Buscamos a alguien que sepamos que ha tenido varios ciclos
--SELECT 
--    numero_documento, 
--    Fecha_Cese, 
--    Motivo_Evento, 
--    sueldo_basico, 
--    Fuente 
--FROM c01.vPBIADMCeses 
--WHERE codigo_unico IN (SELECT codigo_unico FROM c01.vPBIADMReingresos)
--ORDER BY numero_documento, Fecha_Cese;
 
 