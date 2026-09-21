IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[vPBIAsiTurno]'))
DROP VIEW [c01].[vPBIAsiTurno]
GO

 

 CREATE OR ALTER VIEW [c01].[vPBIAsiTurno] AS
SELECT 
    IdTurno, CodigoCompania,
    Abreviatura AS codigo_turno_corto,
    Descripcion AS nombre_turno,

    -- ========================================================================
    -- BLINDAJE DE TIEMPO (Formatos HH:MM:SS vs HHMM)
    -- ========================================================================
    CASE WHEN HoraIngreso LIKE '%:%' THEN LEFT(CAST(HoraIngreso AS VARCHAR), 5) ELSE LEFT(RIGHT('0000' + CAST(HoraIngreso AS VARCHAR), 4), 2) + ':' + RIGHT('0000' + CAST(HoraIngreso AS VARCHAR), 2) END AS hora_ingreso_txt,
    CASE WHEN HoraSalida LIKE '%:%' THEN LEFT(CAST(HoraSalida AS VARCHAR), 5) ELSE LEFT(RIGHT('0000' + CAST(HoraSalida AS VARCHAR), 4), 2) + ':' + RIGHT('0000' + CAST(HoraSalida AS VARCHAR), 2) END AS hora_salida_txt,
    
    CASE WHEN HoraInicioRefrigerio = '0' OR HoraInicioRefrigerio = '0000' THEN 'Sin Ref.' WHEN HoraInicioRefrigerio LIKE '%:%' THEN LEFT(CAST(HoraInicioRefrigerio AS VARCHAR), 5) ELSE LEFT(RIGHT('0000' + CAST(HoraInicioRefrigerio AS VARCHAR), 4), 2) + ':' + RIGHT('0000' + CAST(HoraInicioRefrigerio AS VARCHAR), 2) END AS inicio_refrigerio_txt,
    CASE WHEN HoraFinRefrigerio = '0' OR HoraFinRefrigerio = '0000' THEN 'Sin Ref.' WHEN HoraFinRefrigerio LIKE '%:%' THEN LEFT(CAST(HoraFinRefrigerio AS VARCHAR), 5) ELSE LEFT(RIGHT('0000' + CAST(HoraFinRefrigerio AS VARCHAR), 4), 2) + ':' + RIGHT('0000' + CAST(HoraFinRefrigerio AS VARCHAR), 2) END AS fin_refrigerio_txt,

    -- Tolerancias (Se mantiene el REPLACE seguro para cálculos HHMM)
    HoraIngresoTolPost AS tolerancia_tardanza_raw,
    (CAST(LEFT(RIGHT('0000' + REPLACE(CAST(HoraIngresoTolPost AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(HoraIngresoTolPost AS VARCHAR), ':', ''), 4), 2) AS INT) AS tolerancia_tardanza_minutos,
    
    HoraIngresoTolPre AS tolerancia_he_previo_raw,
    (CAST(LEFT(RIGHT('0000' + REPLACE(CAST(HoraIngresoTolPre AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(HoraIngresoTolPre AS VARCHAR), ':', ''), 4), 2) AS INT) AS tolerancia_he_previo_minutos,
    
    HoraSalidaTolPost AS tolerancia_he_posterior_raw,
    (CAST(LEFT(RIGHT('0000' + REPLACE(CAST(HoraSalidaTolPost AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(HoraSalidaTolPost AS VARCHAR), ':', ''), 4), 2) AS INT) AS tolerancia_he_posterior_minutos,
    
    HoraSalidaTolPre AS tolerancia_salida_temprana_raw,
    (CAST(LEFT(RIGHT('0000' + REPLACE(CAST(HoraSalidaTolPre AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(HoraSalidaTolPre AS VARCHAR), ':', ''), 4), 2) AS INT) AS tolerancia_salida_temprana_minutos,

    -- Jornadas
    HorasTrabajo AS jornada_efectiva_raw, HorasRefrigerio AS tiempo_refrigerio_raw,
    CAST(LEFT(RIGHT('0000' + REPLACE(CAST(HorasTrabajo AS VARCHAR), ':', ''), 4), 2) AS FLOAT) + (CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(HorasTrabajo AS VARCHAR), ':', ''), 4), 2) AS FLOAT) / 60.0) AS jornada_trabajo_centesimal,
    CAST(LEFT(RIGHT('0000' + REPLACE(CAST(HorasRefrigerio AS VARCHAR), ':', ''), 4), 2) AS FLOAT) + (CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(HorasRefrigerio AS VARCHAR), ':', ''), 4), 2) AS FLOAT) / 60.0) AS tiempo_refrigerio_centesimal,

    -- Estados
    EsNocturno AS flag_nocturno,
    CASE WHEN EsNocturno = 1 THEN 'Turno Nocturno (Sobretasa)' ELSE 'Turno Diurno' END AS descripcion_nocturnidad,
    IdEstado, SituacionRegistro
FROM c01.asiturno
WHERE SituacionRegistro = 'A';
GO
 
