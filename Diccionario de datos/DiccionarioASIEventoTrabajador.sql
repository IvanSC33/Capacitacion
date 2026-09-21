 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador que consume/retiro tiempo de su banco de horas.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIEventoTrabajador', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de evento ejecutado. 9 = Compensación por descanso, 12 = Pago en Nómina.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIEventoTrabajador', @level2type=N'COLUMN', @level2name=N'IdEvento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Llave foránea crítica que enlaza con el código Indice de la tabla ASIHoraExtra. Identifica qué hora extra original se está consumiendo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIEventoTrabajador', @level2type=N'COLUMN', @level2name=N'Indice'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha calendario en la que se aplicó el pago o el descanso.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIEventoTrabajador', @level2type=N'COLUMN', @level2name=N'FechaInicioEvento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad bruta de tiempo consumido en la transacción en formato HHMM (Ej: 0157 = 1 hora 57 min).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIEventoTrabajador', @level2type=N'COLUMN', @level2name=N'Horas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de aprobación de la ejecución (Ej. Aprobado). Relacionado directo a FLTEstado.IdEstado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIEventoTrabajador', @level2type=N'COLUMN', @level2name=N'IdEstadoFlujo'
GO