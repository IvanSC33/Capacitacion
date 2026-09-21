 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único autogenerado del registro de plantilla de horario.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'IdHorarioFijo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía a la que pertenece el trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'CodigoCompania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del trabajador (Llave foránea al Maestro de Personal).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Número del día de la semana (1 = Lunes, 2 = Martes, etc.).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'Dia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre descriptivo del día de la semana.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'DescripcionDia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del turno asignado para ese día (Llave foránea a asiturno).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'IdTurno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de la asignación. A = Activo (el sistema lo leerá el próximo mes).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asihorariofijo', @level2type=N'COLUMN', @level2name=N'SituacionRegistro'
GO