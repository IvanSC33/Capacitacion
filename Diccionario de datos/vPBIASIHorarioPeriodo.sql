 IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[vPBIASIHorarioPeriodo]'))
DROP VIEW [c01].[vPBIASIHorarioPeriodo]
GO

CREATE VIEW [c01].[vPBIASIHorarioPeriodo] AS
SELECT 
    HP.IdHorarioPeriodo,
    HP.CodigoCompania,
    HP.AnioPeriodo,
    HP.CodigoPeriodo,
    HP.CodigoUnico AS id_trabajador,
    HP.TipoTrabajador AS tipo_trabajador,
    
    -- Eje de Fecha
    CAST(HP.FechaTurno AS DATE) AS fecha_asignada,
    
    -- Datos del Turno Esperado (Cruzando con el Maestro de Turnos)
    HP.IdTurno,
    T.codigo_turno_corto,
    T.nombre_turno,
    
    -- ========================================================================
    -- SOLUCIÓN AL ERROR: Convertimos el campo 'TXT' a 'TIME' directamente aquí
    -- ========================================================================
    TRY_CAST(T.hora_ingreso_txt AS TIME) AS hora_ingreso_esperada,
    TRY_CAST(T.hora_salida_txt AS TIME) AS hora_salida_esperada,
    
    -- Tolerancias para el cálculo de tardanzas/extras
    T.tolerancia_tardanza_minutos,
    T.tolerancia_he_posterior_minutos,
    
    -- Jornada para costeo
    T.jornada_trabajo_centesimal AS horas_teoricas_a_trabajar,

    -- Auditoría
    ISNULL(HP.IndicadorExcepcion, 0) AS flag_excepcion_manual,
    HP.SituacionRegistro

FROM c01.ASIHorarioPeriodo HP

-- JOIN con la vista maestra de turnos que creaste
LEFT JOIN c01.vPBIAsiTurno T
    ON HP.IdTurno = T.IdTurno
    AND HP.CodigoCompania = T.CodigoCompania

WHERE HP.SituacionRegistro = 'A';
GO
 