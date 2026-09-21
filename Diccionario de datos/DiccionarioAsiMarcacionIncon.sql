 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del día procesado para el trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'IdInconsistencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Turno que el sistema identificó que le tocaba hacer al empleado este día.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'IdTurno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha calendario del día analizado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'FechaMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora definitiva de entrada calculada por el motor (formato militar HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'HoraInicio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora definitiva de salida calculada por el motor (formato militar HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'HoraFin'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Si dice MANUAL, indica que RRHH modificó/insertó las horas a mano, puenteando el reloj.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'TipoMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de estado resultante (Ej: 1=OK, 2=Sin marca salida). Cruza con ASITipoInconsistencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'IdTipoInconsistencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Latitud de la marcación que el sistema tomó como Hora de Inicio.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'Latitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Latitud de la marcación que el sistema tomó como Hora de Fin.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIMarcacionIncon', @level2type=N'COLUMN', @level2name=N'LatitudFin'
GO