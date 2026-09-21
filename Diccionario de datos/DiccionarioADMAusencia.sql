 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha exacta en la que el colaborador no laboró (Día de Inasistencia).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'fecha_ausencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador ausente (FK).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Motivo de la inasistencia (Ej: 08=Falta por Marcación, 01=Enfermedad). Cruza con ADMMotivoAusencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'motivo_ausencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha y hora en la que se inyectó el registro en la base de datos.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'fecha_registro'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado del registro (A = Activo para descuento en planilla).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'situacion_ausencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Notas adicionales ingresadas manualmente por Recursos Humanos.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'observaciones'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Usuario creador. Si es JOBASI, fue generado automáticamente por el motor nocturno de relojes al no detectar fotocheck.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'usuario'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Compañía que procesa el descuento de la falta.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'codigo_cia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año contable/planilla donde se cobrará o justificará esta falta.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'ano_pago'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes contable/planilla donde se cobrará o justificará esta falta.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMAusencia', @level2type=N'COLUMN', @level2name=N'mes_pago'
GO