 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del registro de solicitud de permiso.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'IdPermiso'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador que solicita el permiso.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del motivo del permiso (Ej: 000005 = Cumpleaños). Relacionado a PRMTablaDetalle(0008).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'TipoPermiso'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de inicio de la autorización.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'FechaInicio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de fin de la autorización.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'FechaFin'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Explicación o sustento digitado por el trabajador o RRHH para justificar la salida/ingreso.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'Observacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasificador de modo: M = Día Completo (No viene), S = Salida Anticipada, I = Ingreso Retrasado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'Para'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Bolsa de tiempo autorizado en formato militar HHMM (Ej: 0200 = 2 horas). Aplica para los modos S e I.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'HoraMinuto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de aprobación en el flujo del sistema.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'IdEstadoFlujo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Vigencia del registro (A = Activo / Válido para anular descuentos).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIPermiso', @level2type=N'COLUMN', @level2name=N'SituacionRegistro'
GO