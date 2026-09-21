 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Día calendario del evento generador del sobretiempo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'FechaMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasificador del origen del sobretiempo. Vincula con ASITipoHoraExtra (Ej. Antes de ingreso, Después de salida).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'IdTipoHHEE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora de inicio real del trabajo en sobretiempo detectada por el reloj.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'InicioHHEE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora de fin real del trabajo en sobretiempo detectada por el reloj.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'FinHHEE'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Total de tiempo bruto generado (HHMM) sin considerar topes de autorización.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'HorasNoCompensadasProc'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tope de tiempo avalado formalmente tras cruzar con autorizaciones (HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'HorasAutorizadas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Saldo a favor del trabajador que aún no ha sido pagado ni canjeado (HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'HorasNoCompensadas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad del tiempo acumulado que ya ha sido canjeado por ausencias, tardanzas o permisos (HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'HorasCompensadas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad del tiempo acumulado que fue transferido para abono económico en nómina (HHMM).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIHoraExtra', @level2type=N'COLUMN', @level2name=N'HorasPagadas'
GO