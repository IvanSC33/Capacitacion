

  
IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIHEProcesadas]'))
DROP VIEW [c01].[VPBIHEProcesadas]
GO

 CREATE OR ALTER VIEW [c01].[VPBIHEProcesadas] AS
SELECT 
    -- 1. Llaves e Identificadores
    RTRIM(LTRIM(ISNULL(HE.CodigoUnico, ''))) + RTRIM(LTRIM(ISNULL(HE.AnioPeriodo, ''))) + RTRIM(LTRIM(ISNULL(HE.CodigoPeriodo, ''))) + RTRIM(LTRIM(ISNULL(CAST(HE.Secuencia AS VARCHAR), ''))) AS indice_he,
    HE.CodigoUnico AS codigo_unico, 
    HE.CodigoCompania, 
    HE.AnioPeriodo, 
    HE.CodigoPeriodo,
    CAST(HE.FechaMarcacion AS DATE) AS fecha_marcacion, 
    ISNULL(THE.Descripcion, 'DESCONOCIDO') AS descripcion_tipo, 
    HE.IdTurno,
    
    -- 2. Protección de Tiempo Real HH:MM:SS
    CASE WHEN HE.InicioHHEE LIKE '%:%' THEN TRY_CAST(HE.InicioHHEE AS TIME) ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(HE.InicioHHEE)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HE.InicioHHEE)), 4), 2) AS TIME) END AS hora_inicio_he,
    CASE WHEN HE.FinHHEE LIKE '%:%' THEN TRY_CAST(HE.FinHHEE AS TIME) ELSE TRY_CAST(LEFT(RIGHT('0000' + LTRIM(RTRIM(HE.FinHHEE)), 4), 2) + ':' + RIGHT(RIGHT('0000' + LTRIM(RTRIM(HE.FinHHEE)), 4), 2) AS TIME) END AS hora_fin_he,

    -- ========================================================================
    -- 1. TOTAL HORAS (RESTAURADO: Horas brutas detectadas por el reloj)
    -- ========================================================================
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasNoCompensadasProc AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasNoCompensadasProc AS INT), 0) % 60 AS VARCHAR), 2) AS TotalHoras_txt,
    ISNULL(TRY_CAST(HE.HorasNoCompensadasProc AS INT), 0) AS TotalHoras_min,
    ISNULL(TRY_CAST(HE.HorasNoCompensadasProc AS INT), 0) / 60.0 AS TotalHoras_cent,

    -- ========================================================================
    -- 2. HORAS AUTORIZADAS (Lo que aprobó la jefatura)
    -- ========================================================================
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasAutorizadas AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasAutorizadas AS INT), 0) % 60 AS VARCHAR), 2) AS HorasAutorizadas_txt,
    ISNULL(TRY_CAST(HE.HorasAutorizadas AS INT), 0) AS HorasAutorizadas_min,
    ISNULL(TRY_CAST(HE.HorasAutorizadas AS INT), 0) / 60.0 AS HorasAutorizadas_cent,

    -- ========================================================================
    -- 3. HORAS NO COMPENSADAS (El Saldo actual a favor del empleado)
    -- ========================================================================
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasNoCompensadas AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasNoCompensadas AS INT), 0) % 60 AS VARCHAR), 2) AS HorasNoCompensadas_txt,
    ISNULL(TRY_CAST(HE.HorasNoCompensadas AS INT), 0) AS HorasNoCompensadas_min,
    ISNULL(TRY_CAST(HE.HorasNoCompensadas AS INT), 0) / 60.0 AS HorasNoCompensadas_cent,

    -- ========================================================================
    -- 4. HORAS COMPENSADAS (El tiempo que ya canjeó/descansó)
    -- ========================================================================
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasCompensadas AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasCompensadas AS INT), 0) % 60 AS VARCHAR), 2) AS HorasCompensadas_txt,
    ISNULL(TRY_CAST(HE.HorasCompensadas AS INT), 0) AS HorasCompensadas_min,
    ISNULL(TRY_CAST(HE.HorasCompensadas AS INT), 0) / 60.0 AS HorasCompensadas_cent,

    -- ========================================================================
    -- 5. HORAS PAGADAS (El tiempo liquidado en dinero en boleta)
    -- ========================================================================
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasPagadas AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HE.HorasPagadas AS INT), 0) % 60 AS VARCHAR), 2) AS HorasPagadas_txt,
    ISNULL(TRY_CAST(HE.HorasPagadas AS INT), 0) AS HorasPagadas_min,
    ISNULL(TRY_CAST(HE.HorasPagadas AS INT), 0) / 60.0 AS HorasPagadas_cent,

    -- RESTAURADO: Auditoría y Estados
    HE.FlagAutorizado,
    HE.SituacionRegistro

FROM c01.ASIHoraExtra HE
-- RESTAURADO: El Join Original Seguro
LEFT JOIN c01.ASITipoHoraExtra THE 
    ON HE.IdTipoHHEE = THE.IdTipoHoraExtra
-- RESTAURADO: Filtro de Activos
WHERE HE.SituacionRegistro = 'A';
GO