IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIASIEventoTrabajador]'))
DROP VIEW [c01].[VPBIASIEventoTrabajador]
GO

CREATE OR ALTER VIEW [c01].[VPBIASIEventoTrabajador] AS
SELECT 
    RTRIM(LTRIM(ISNULL(ET.CodigoUnico, ''))) + '|' + CAST(ET.IdEvento AS VARCHAR) + '|' + RTRIM(LTRIM(ISNULL(ET.AnioPeriodo, ''))) + '|' + RTRIM(LTRIM(ISNULL(ET.CodigoPeriodo, ''))) + '|' + CAST(ET.Secuencia AS VARCHAR) AS id_transaccion,
    ET.CodigoUnico AS id_trabajador, ET.CodigoCompania, ET.Indice AS indice_he_origen, 
    CAST(ET.FechaInicioEvento AS DATE) AS fecha_consumo,
    
    ET.IdEvento,
    CASE ET.IdEvento
        WHEN 9 THEN 'Compensación (Tiempo Libre)'
        WHEN 12 THEN 'Pago (Nómina)' ELSE 'Otro'
    END AS tipo_consumo,
    
    -- ========================================================================
    -- BLINDAJE DE TIEMPO REAL
    -- ========================================================================
    CASE WHEN ET.HoraInicioEvento LIKE '%:%' THEN TRY_CAST(ET.HoraInicioEvento AS TIME) ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(ET.HoraInicioEvento)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(ET.HoraInicioEvento)), 4), 2) AS TIME) END AS hora_inicio_descanso,
    CASE WHEN ET.HoraFinEvento LIKE '%:%' THEN TRY_CAST(ET.HoraFinEvento AS TIME) ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(ET.HoraFinEvento)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(ET.HoraFinEvento)), 4), 2) AS TIME) END AS hora_fin_descanso,

    -- Matemáticas
    LEFT(RIGHT('0000' + ISNULL(NULLIF(REPLACE(ET.Horas, ':', ''), ''), '0000'), 4), 2) + ':' + RIGHT(RIGHT('0000' + ISNULL(NULLIF(REPLACE(ET.Horas, ':', ''), ''), '0000'), 4), 2) AS tiempo_consumido_txt,
    (CAST(LEFT(RIGHT('0000' + ISNULL(NULLIF(REPLACE(ET.Horas, ':', ''), ''), '0000'), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + ISNULL(NULLIF(REPLACE(ET.Horas, ':', ''), ''), '0000'), 4), 2) AS INT) AS tiempo_consumido_min,
    CAST(LEFT(RIGHT('0000' + ISNULL(NULLIF(REPLACE(ET.Horas, ':', ''), ''), '0000'), 4), 2) AS FLOAT) + (CAST(RIGHT(RIGHT('0000' + ISNULL(NULLIF(REPLACE(ET.Horas, ':', ''), ''), '0000'), 4), 2) AS FLOAT) / 60.0) AS tiempo_consumido_cent,

    ET.IdEstadoFlujo, ISNULL(E.Descripcion, 'DESCONOCIDO') AS estado_solicitud, ET.SituacionRegistro

FROM c01.ASIEventoTrabajador ET
LEFT JOIN c01.FLTEstado E ON ET.IdEstadoFlujo = E.IdEstado
WHERE ET.SituacionRegistro = 'A' AND ET.IdEvento IN (9, 12);
GO
 