CREATE VIEW [c01].[vPBIAsihorarioFijo ] AS
SELECT 
    HF.CodigoCompania,
    HF.CodigoUnico AS id_trabajador,
    
    -- Información del Día
    HF.Dia AS numero_dia_semana,
    HF.DescripcionDia AS nombre_dia_semana,
    
    -- Información del Turno Asignado
    HF.IdTurno,
    T.codigo_turno_corto,
    T.nombre_turno,
    T.hora_ingreso_txt,
    T.hora_salida_txt,
    
    -- Datos Matemáticos del Turno (Para cálculos de costo mensual proyectado si lo necesitas)
    T.jornada_trabajo_centesimal,
    T.tolerancia_tardanza_minutos,
    
    -- Control de Estado
    HF.SituacionRegistro AS estado_plantilla

FROM c01.asihorariofijo HF
-- Unimos con la vista optimizada de Turnos que creamos anteriormente
LEFT JOIN c01.vPBIAsiTurno T
    ON HF.IdTurno = T.IdTurno
    AND HF.CodigoCompania = T.CodigoCompania

WHERE HF.SituacionRegistro = 'A';

