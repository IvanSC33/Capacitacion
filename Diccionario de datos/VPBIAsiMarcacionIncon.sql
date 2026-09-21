IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIAsiMarcacionIncon]'))
DROP VIEW [c01].[VPBIAsiMarcacionIncon]
GO

CREATE OR ALTER VIEW [c01].[VPBIAsiMarcacionIncon] AS
SELECT 
    I.IdInconsistencia AS id_registro_asistencia,
    I.CodigoCompania, I.AnioPeriodo, I.CodigoPeriodo,
    I.CodigoUnico AS id_trabajador, I.TipoTrabajador AS tipo_trabajador,
    I.FechaMarcacion AS fecha_calendario, I.IdTurno,

    -- ========================================================================
    -- BLINDAJE DE TIEMPO: Respeta si viene como HH:MM:SS o si viene como HHMM
    -- ========================================================================
    CASE 
        WHEN I.HoraInicio LIKE '%:%' THEN LEFT(CAST(I.HoraInicio AS VARCHAR), 5)
        WHEN I.HoraInicio IS NOT NULL AND RTRIM(I.HoraInicio) <> '' THEN LEFT(RIGHT('0000' + LTRIM(RTRIM(I.HoraInicio)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(I.HoraInicio)), 4), 2) 
        ELSE 'Sin Marca' 
    END AS hora_ingreso_real_txt,

    CASE 
        WHEN I.HoraFin LIKE '%:%' THEN LEFT(CAST(I.HoraFin AS VARCHAR), 5)
        WHEN I.HoraFin IS NOT NULL AND RTRIM(I.HoraFin) <> '' THEN LEFT(RIGHT('0000' + LTRIM(RTRIM(I.HoraFin)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(I.HoraFin)), 4), 2) 
        ELSE 'Sin Marca' 
    END AS hora_salida_real_txt,

    CASE 
        WHEN I.HoraInicio LIKE '%:%' THEN TRY_CAST(I.HoraInicio AS TIME)
        ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(I.HoraInicio)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(I.HoraInicio)), 4), 2) AS TIME) 
    END AS hora_ingreso_real_time,

    CASE 
        WHEN I.HoraFin LIKE '%:%' THEN TRY_CAST(I.HoraFin AS TIME)
        ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(I.HoraFin)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(I.HoraFin)), 4), 2) AS TIME) 
    END AS hora_salida_real_time,
    
    I.IdTipoInconsistencia, 
    ISNULL(TI.Descripcion, 'ESTADO DESCONOCIDO') AS resultado_del_dia,
    ISNULL(I.TipoMarcacion, 'RELOJ') AS origen_marcacion,
    CASE WHEN I.TipoMarcacion = 'MANUAL' THEN 1 ELSE 0 END AS flag_intervencion_manual,
    
    I.IndGeoLocalizacion AS flag_gps_ingreso, I.Latitud AS latitud_ingreso, I.Longitud AS longitud_ingreso,
    ISNULL(I.IndGeoLocalizacionFin, 0) AS flag_gps_salida, ISNULL(I.LatitudFin, 0) AS latitud_salida, ISNULL(I.LongitudFin, 0) AS longitud_salida,
    I.SituacionRegistro

FROM c01.ASIMarcacionIncon I
LEFT JOIN c01.ASITipoInconsistencia TI ON I.IdTipoInconsistencia = TI.IdTipoInconsistencia
WHERE I.SituacionRegistro = 'A';
GO

 