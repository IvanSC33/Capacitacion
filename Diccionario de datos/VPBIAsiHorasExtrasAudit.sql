IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIAsiHorasExtrasAudit]'))
DROP VIEW [c01].[VPBIAsiHorasExtrasAudit]
GO

CREATE VIEW [c01].[VPBIAsiHorasExtrasAudit] AS
SELECT 
   -- Au.AuditId AS id_auditoria,
    Au.CodigoCompania,
    Au.CodigoUnico AS codigo_unico,
    Au.TipoTrabajador AS tipo_trabajador,
    Au.AnnoPeriodo AS anio_planilla,
    Au.CodigoPeriodo AS mes_planilla,

    -- Ejes de Fecha Puros para Power BI
    CAST(Au.FechaMarcacion AS DATE) AS fecha_marcacion,
    
    -- Información del Turno
    Au.IdTurno,
    ISNULL(TU.Abreviatura, 'S/T') AS codigo_turno_corto,
    ISNULL(TU.Descripcion, 'Sin Turno') AS nombre_turno,
    CAST(Au.HoraIngresoTurno AS TIME) AS hora_ingreso_teorica,
    CAST(Au.HoraSalidaTurno AS TIME) AS hora_salida_teorica,

    CASE WHEN Au.EsNocturno = 1 THEN 'Sí' ELSE 'No' END AS es_turno_nocturno,
    CASE WHEN Au.Guardia = 1 THEN 'Sí' ELSE 'No' END AS es_guardia,

    -- Origen de la Hora Extra
    Au.IdTipoHHEE,
    ISNULL(THE.Abreviatura, 'S/T') AS tipo_he_abreviatura,

    -- Información de la Marcación Real
    CAST(Au.MarcaInicioCompleta AS DATETIME) AS marca_inicio_real_dt,
    CAST(Au.MarcaFinCompleta AS DATETIME) AS marca_fin_real_dt,
    
    Au.TotalHorasReales AS tiempo_total_en_empresa_minutos,

    -- ========================================================================
    -- DESGLOSE DE TIEMPOS (MINUTOS PUROS Y HORAS CENTESIMALES PARA COSTEO)
    -- ========================================================================
    Au.MinutosPagados AS total_minutos_extras_reconocidos,
    (Au.MinutosPagados / 60.0) AS total_horas_extras_centesimal,

    -- Al 25%
    Au.HE25D AS he25_diurno_minutos,
    (Au.HE25D / 60.0) AS he25_diurno_centesimal,
    Au.HE25N AS he25_nocturno_minutos,
    (Au.HE25N / 60.0) AS he25_nocturno_centesimal,

    -- Al 35%
    Au.HE35D AS he35_diurno_minutos,
    (Au.HE35D / 60.0) AS he35_diurno_centesimal,
    Au.HE35N AS he35_nocturno_minutos,
    (Au.HE35N / 60.0) AS he35_nocturno_centesimal,

    -- Al 100%
    Au.HE100D AS he100_diurno_minutos,
    (Au.HE100D / 60.0) AS he100_diurno_centesimal,
    Au.HE100N AS he100_nocturno_minutos,
    (Au.HE100N / 60.0) AS he100_nocturno_centesimal,

    -- Feriados y Descansos
    Au.FeriadoD AS feriado_diurno_minutos,
    (Au.FeriadoD / 60.0) AS feriado_diurno_centesimal,
    Au.FeriadoN AS feriado_nocturno_minutos,
    (Au.FeriadoN / 60.0) AS feriado_nocturno_centesimal,
    
    Au.DescansoD AS descanso_diurno_minutos,
    (Au.DescansoD / 60.0) AS descanso_diurno_centesimal,
    Au.DescansoN AS descanso_nocturno_minutos,
    (Au.DescansoN / 60.0) AS descanso_nocturno_centesimal

FROM c01.AsiHorasExtrasAudit Au

-- JOIN Limpio para evitar Subconsultas en el SELECT
LEFT JOIN c01.ASITurno TU 
    ON Au.IdTurno = TU.IdTurno

LEFT JOIN c01.ASITipoHoraExtra THE 
    ON Au.IdTipoHHEE = THE.IdTipoHoraExtra;
GO

 