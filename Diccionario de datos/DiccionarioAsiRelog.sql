 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único (PK). El ID 1 se reserva para marcaciones virtuales/web desde el portal del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'IdReloj'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía a la que pertenece el reloj.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'CodigoCompania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código lógico o número de serie del reloj de asistencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'CodigoReloj'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre comercial o descripción del dispositivo de marcación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'Descripcion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descripción del lugar físico donde está instalado (Ej: Recepción principal).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'UbicacionReferencial'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado operativo del reloj (1 = Activo, en funcionamiento).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'IdEstado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Situación del registro en el sistema (A = Vigente, Activo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIReloj', @level2type=N'COLUMN', @level2name=N'SituacionRegistro'
GO