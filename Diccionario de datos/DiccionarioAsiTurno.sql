 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del horario/turno configurado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'IdTurno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía a la que aplica este horario.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'CodigoCompania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Abreviatura o código rápido del turno (Ej: ADM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'Abreviatura'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descripción formal de la jornada.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'Descripcion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora oficial de entrada en formato militar HHMM (Ej: 0830).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraIngreso'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora oficial de salida en formato militar HHMM (Ej: 1830).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraSalida'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora de inicio del tiempo de refrigerio (HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraInicioRefrigerio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora de fin del tiempo de refrigerio (HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraFinRefrigerio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Minutos de gracia posteriores a la Hora de Ingreso. Si se excede, se cuenta tardanza desde el minuto 0.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraIngresoTolPost'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Minutos previos a la Hora de Ingreso. Si se marca antes de este margen, se generan Horas Extras previas.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraIngresoTolPre'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Minutos de tolerancia posteriores a la Hora de Salida. Las marcaciones después de este margen generan Horas Extras.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraSalidaTolPost'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Minutos previos a la Hora de Salida permitidos sin que se considere salida injustificada/temprana.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'HoraSalidaTolPre'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag (1/0) que indica si el turno abarca la jornada nocturna de ley (10pm-6am) y exige sobretasa.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'asiturno', @level2type=N'COLUMN', @level2name=N'EsNocturno'
GO