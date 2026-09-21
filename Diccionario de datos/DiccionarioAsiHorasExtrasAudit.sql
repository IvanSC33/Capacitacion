 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tabla de Auditoría Diaria de Horas Extras. Desglosa matemáticamente cómo el motor de asistencia dividió los minutos de sobretiempo del día (25%, 35%, 100%, Diurno, Nocturno).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit'
GO
--EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del registro de auditoría.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit', @level2type=N'COLUMN', @level2name=N'AuditId'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Día exacto en el que se generó la fracción de hora extra.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit', @level2type=N'COLUMN', @level2name=N'FechaMarcacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Total de minutos que el motor reconoció como válidos para pago/compensación en ese día.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit', @level2type=N'COLUMN', @level2name=N'MinutosPagados'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fracción en MINUTOS que corresponde a Horas Extras Diurnas al 25%.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit', @level2type=N'COLUMN', @level2name=N'HE25D'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fracción en MINUTOS que corresponde a Horas Extras Diurnas al 35%.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit', @level2type=N'COLUMN', @level2name=N'HE35D'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Marca de tiempo real (DateTime) donde inició el sobretiempo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'AsiHorasExtrasAudit', @level2type=N'COLUMN', @level2name=N'MarcaInicioCompleta'
GO