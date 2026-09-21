 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único de la solicitud de autorización de sobretiempo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'IdAutorizacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador autorizado (FK).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasificador del momento de la hora extra (I = Antes del ingreso, S = Después de la salida, O = Día libre).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'Tipo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tope de Horas autorizadas por la jefatura.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'Horas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tope de Minutos autorizados por la jefatura.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'Minutos'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Define si se pagará en dinero (2) o se acumulará como compensación de días libres (1).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'Destino'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del estado actual en el flujo de aprobación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'IdEstadoFlujo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tiempo real pagado tras cruzar la autorización con las marcaciones reales del reloj (formato continuo HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'HorasPagadas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tiempo real que se envió al banco de horas tras cruzar con el reloj (formato continuo HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtraAutorizada', @level2type=N'COLUMN', @level2name=N'HorasCompensadas'
GO