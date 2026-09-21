IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIAsimarcacionProcesada]'))
DROP VIEW [c01].[VPBIAsimarcacionProcesada]
GO
 
CREATE OR ALTER VIEW [c01].[VPBIAsimarcacionProcesada] AS
SELECT 
    IdMarcacion,
    CodigoCompania,
    AnioPeriodo,
    CodigoPeriodo,
    CodigoUnico AS id_trabajador,
    
    -- 1. FECHA PURA
    CAST(FechaMarcacion AS DATE) AS fecha_marcacion,
    
    -- ========================================================================
    -- 2. BLOQUE DE TIEMPO (BLINDADO CON TRY_CAST Y LIKE)
    -- ========================================================================
    HoraMarcacion AS hora_marcacion_raw, 
    
    CASE 
        WHEN HoraMarcacion LIKE '%:%' THEN LEFT(CAST(HoraMarcacion AS VARCHAR), 5)
        ELSE LEFT(RIGHT('0000' + LTRIM(RTRIM(HoraMarcacion)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HoraMarcacion)), 4), 2) 
    END AS hora_marcacion_txt,
    
    CASE 
        WHEN HoraMarcacion LIKE '%:%' THEN TRY_CAST(HoraMarcacion AS TIME)
        ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(HoraMarcacion)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HoraMarcacion)), 4), 2) AS TIME) 
    END AS hora_marcacion_time,

    TRY_CAST(CAST(CAST(FechaMarcacion AS DATE) AS VARCHAR) + ' ' + 
        CASE 
            WHEN HoraMarcacion LIKE '%:%' THEN LEFT(CAST(HoraMarcacion AS VARCHAR), 8)
            ELSE LEFT(RIGHT('0000' + LTRIM(RTRIM(HoraMarcacion)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HoraMarcacion)), 4), 2) + ':00' 
        END AS DATETIME) AS fecha_hora_marcacion,
    -- ========================================================================

    TipoMarcacion,
    CASE 
        WHEN TipoMarcacion = 'I' THEN 'Ingreso'
        WHEN TipoMarcacion = 'S' THEN 'Salida'
        ELSE 'Otro'
    END AS tipo_marcacion_desc,

    IdReloj,
    
    -- ¡CUIDADO AQUÍ! Restaurando los nombres de columnas originales de la BD
    IPAddress AS direccion_ip,
    
    -- Datos de Geolocalización (Restaurando nombres originales)
    IndGeoLocalizacion AS flag_gps,
    CASE 
        WHEN IndGeoLocalizacion = 1 THEN 'Ubicación Capturada'
        ELSE 'Sin Permisos GPS'
    END AS estado_gps,
    
    Latitud,
    Longitud,

    SituacionRegistro
    
FROM c01.ASIMarcacionProcesada
WHERE SituacionRegistro = 'A'; -- ¡FILTRO DE ACTIVOS RESTAURADO!
GO
 