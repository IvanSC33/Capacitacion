IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIASITardanza]'))
DROP VIEW [c01].[VPBIASITardanza]
GO

CREATE OR ALTER VIEW [c01].[VPBIASITardanza] AS
SELECT 
    CodigoCompania, AnioPeriodo, CodigoPeriodo,
    CodigoUnico AS id_trabajador, TipoTrabajador AS tipo_trabajador,
    CAST(FechaTardanza AS DATE) AS fecha_incidente, IdTurno,

    TipoTardanza,
    CASE 
        WHEN TipoTardanza = 'I' THEN 'Tardanza al Ingreso'
        WHEN TipoTardanza = 'S' THEN 'Salida Anticipada'
        ELSE 'Otra Infracción'
    END AS descripcion_infraccion,

    -- ========================================================================
    -- BLINDAJE DE TIEMPO REAL
    -- ========================================================================
    CASE WHEN HoraTardanza LIKE '%:%' THEN LEFT(CAST(HoraTardanza AS VARCHAR), 5) ELSE LEFT(RIGHT('0000' + LTRIM(RTRIM(HoraTardanza)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HoraTardanza)), 4), 2) END AS hora_evento_txt,
    CASE WHEN HoraTardanza LIKE '%:%' THEN TRY_CAST(HoraTardanza AS TIME) ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(HoraTardanza)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HoraTardanza)), 4), 2) AS TIME) END AS hora_evento_time,

    -- MATEMÁTICA SEGURA (Maneja tanto formato HHMM como Minutos Enteros)
    TiempoTardanza AS tiempo_penalidad_raw,
    
    (CAST(LEFT(RIGHT('0000' + REPLACE(CAST(TiempoTardanza AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(TiempoTardanza AS VARCHAR), ':', ''), 4), 2) AS INT) AS total_minutos_descuento,
    ((CAST(LEFT(RIGHT('0000' + REPLACE(CAST(TiempoTardanza AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(TiempoTardanza AS VARCHAR), ':', ''), 4), 2) AS INT)) / 60.0 AS total_horas_descuento_centesimal,

    SituacionRegistro

FROM c01.ASITardanza
WHERE SituacionRegistro = 'A';
GO