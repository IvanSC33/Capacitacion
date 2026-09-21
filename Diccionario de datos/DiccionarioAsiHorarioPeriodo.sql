 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del registro de turno asignado por día.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'IdHorarioPeriodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador al que se le exige cumplir el turno.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'CodigoCompania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo o régimen del trabajador en ese periodo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'TipoTrabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año correspondiente al periodo de asistencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'AnioPeriodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes correspondiente al periodo de asistencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'CodigoPeriodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Día consecutivo dentro del periodo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'Secuencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha calendario exacta en la que aplica el turno.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'FechaTurno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID del turno que el trabajador debe cumplir (FK a asiturno).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'IdTurno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicador si el turno fue asignado manualmente rompiendo el patrón automático (Excepción).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'IndicadorExcepcion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de validez del registro (A = Activo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHorarioPeriodo', @level2type=N'COLUMN', @level2name=N'SituacionRegistro'
GO