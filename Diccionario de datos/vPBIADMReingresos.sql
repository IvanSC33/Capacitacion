IF  EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[vPBIADMReingresos]'))
DROP VIEW [c01].[vPBIADMReingresos]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
 
CREATE VIEW [c01].[vPBIADMReingresos]
AS

WITH HistorialDeduplicado AS (
    -- 1. HISTORIA PURA: Extrayendo sueldo y puesto del pasado, NO del presente.
    SELECT 
        numero_documento, codigo_unico, tipo_trabajador, codigo_compania,
        fecha_ingreso_compania, fecha_ingreso_coorporacion, fecha_retiro,
        situacion_trabajador, indicador_planilla, ano_periodo, codigo_periodo,
        puesto_organico AS puesto_organica, -- Extraído de la fuente histórica
        sueldo_basico,                      -- Extraído de la fuente histórica
        ROW_NUMBER() OVER(
            PARTITION BY numero_documento, fecha_retiro 
            ORDER BY ano_periodo DESC, codigo_periodo DESC
        ) AS rn_ultimo_periodo
    FROM c01.admhistoricoboletaid
    WHERE fecha_retiro IS NOT NULL 
      AND situacion_trabajador = 'C'
),
CiclosHistoricos AS (
    SELECT * FROM HistorialDeduplicado WHERE rn_ultimo_periodo = 1
),
MaestraVigente AS (
    -- 2. PRESENTE PURO
    SELECT 
        t.matricula, t.codigo_unico, t.tipo_trabajador, t.compania AS codigo_compania,
        t.puesto_organica, t.sueldo_basico,
        t.fecha_ingreso_compania, t.fecha_ingreso_coorporacion, t.fecha_retiro,
        t.situacion_trabajador, t.indicador_planilla, t.numero_documento,
        p.ano_periodo, p.codigo_periodo,
        ROW_NUMBER() OVER(
            PARTITION BY t.numero_documento 
            ORDER BY t.fecha_ingreso_compania DESC, t.codigo_unico DESC
        ) AS rn_maestra
    FROM c01.admtrabajador t
    LEFT JOIN c01.pllperiodovigente p 
        ON t.tipo_trabajador = p.tipo_trabajador AND t.compania = p.codigo_compania
),
LineaTiempoCompleta AS (
    -- 3. UNIÓN DE LÍNEA DE TIEMPO (Sin contaminación cruzada)
    SELECT 
        matricula, codigo_unico, tipo_trabajador, codigo_compania AS compania, 
        puesto_organica, sueldo_basico,
        fecha_ingreso_compania AS fecha_de_reingreso, fecha_ingreso_coorporacion, fecha_retiro,
        situacion_trabajador, indicador_planilla, ano_periodo, codigo_periodo, numero_documento
    FROM MaestraVigente
    WHERE rn_maestra = 1

    UNION ALL

    SELECT 
        m.matricula, h.codigo_unico, h.tipo_trabajador, h.codigo_compania AS compania, 
        h.puesto_organica, -- CORRECCIÓN: Puesto  del momento exacto del cese
        h.sueldo_basico,   -- CORRECCIÓN:Sueldo  del momento exacto del cese
        h.fecha_ingreso_compania AS fecha_de_reingreso, h.fecha_ingreso_coorporacion, h.fecha_retiro,
        h.situacion_trabajador, h.indicador_planilla, h.ano_periodo, h.codigo_periodo, h.numero_documento
    FROM CiclosHistoricos h
    LEFT JOIN MaestraVigente m ON h.numero_documento = m.numero_documento AND m.rn_maestra = 1
    WHERE (m.fecha_ingreso_compania IS NULL OR h.fecha_ingreso_compania <> m.fecha_ingreso_compania)
),
AnalisisBrecha AS (
    -- 4. VENTANAS TEMPORALES PREVIAS AL FILTRO DE REINGRESOS
    SELECT 
        *,
        MAX(fecha_retiro) OVER(
            PARTITION BY numero_documento 
            ORDER BY fecha_de_reingreso ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
        ) AS retiro_anterior,
        LAG(sueldo_basico) OVER(
            PARTITION BY numero_documento 
            ORDER BY fecha_de_reingreso ASC
        ) AS sueldo_anterior,
        LAG(tipo_trabajador) OVER(
            PARTITION BY numero_documento 
            ORDER BY fecha_de_reingreso ASC
        ) AS tipo_trabajador_anterior,
        LAG(puesto_organica) OVER(
            PARTITION BY numero_documento 
            ORDER BY fecha_de_reingreso ASC
        ) AS puesto_anterior
    FROM LineaTiempoCompleta
),
EventosReingreso AS (
    -- 5. FILTRO EXCLUSIVO DE EVENTOS DE REINGRESO Y CÁLCULOS BASE
    SELECT 
        *,
        DATEDIFF(day, retiro_anterior, fecha_de_reingreso) AS dias_gap_laboral,
        DATEDIFF(day, fecha_de_reingreso, ISNULL(fecha_retiro, GETDATE())) AS dias_trabajados_ciclo
    FROM AnalisisBrecha
    WHERE retiro_anterior IS NOT NULL 
      AND DATEDIFF(day, retiro_anterior, fecha_de_reingreso) >= 2
)
-- 6. MODELADO DIMENSIONAL FINAL (LISTO PARA POWER BI)
SELECT 
    numero_documento,
    matricula, 
    codigo_unico, 
    compania, 
    
    -- BLOQUE FECHAS Y GAPS
    fecha_ingreso_coorporacion,
    retiro_anterior,
    fecha_de_reingreso,
    fecha_retiro,
    dias_gap_laboral,
    CASE 
        WHEN dias_gap_laboral <= 2 THEN 'ADMINISTRATIVO'
        WHEN dias_gap_laboral <= 30 THEN 'CORTO'
        WHEN dias_gap_laboral <= 180 THEN 'MEDIO'
        ELSE 'LARGO'
    END AS tipo_reingreso,

    -- BLOQUE PERMANENCIA Y ESTABILIDAD
    dias_trabajados_ciclo,
    CASE 
        WHEN dias_trabajados_ciclo < 90 THEN 'CORTO'
        WHEN dias_trabajados_ciclo < 365 THEN 'MEDIO'
        ELSE 'LARGO'
    END AS tipo_permanencia,

    -- BLOQUE ECONÓMICO (Blindado contra sueldos 0.01)
    CASE WHEN sueldo_basico > 10 THEN 1 ELSE 0 END AS flag_sueldo_valido,
    sueldo_anterior,
    sueldo_basico,
    CASE 
        WHEN sueldo_basico > 10 AND sueldo_anterior > 10 THEN (sueldo_basico - sueldo_anterior)
        ELSE NULL 
    END AS incremento_sueldo,
    CASE 
        WHEN sueldo_basico > 10 AND sueldo_anterior > 10 AND sueldo_basico > sueldo_anterior THEN 1 
        ELSE 0 
    END AS tuvo_incremento,

    -- BLOQUE MOVILIDAD INTERNA Y ASCENSOS
    tipo_trabajador_anterior,
    tipo_trabajador,
    CASE 
        WHEN tipo_trabajador <> tipo_trabajador_anterior THEN 1 
        ELSE 0 
    END AS cambio_tipo_trabajador,
    puesto_anterior,
    puesto_organica,
    CASE 
        WHEN puesto_organica <> puesto_anterior THEN 1 
        ELSE 0 
    END AS cambio_puesto,

    -- BLOQUE ADMINISTRATIVO
    situacion_trabajador, 
    indicador_planilla, 
    ano_periodo, 
    codigo_periodo, 
    ROW_NUMBER() OVER(PARTITION BY numero_documento ORDER BY fecha_de_reingreso ASC) AS secuencia_reingreso

FROM EventosReingreso
go