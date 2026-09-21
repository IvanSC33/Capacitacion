 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del colaborador que generó la infracción de tiempo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASITardanza', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha calendario en la que ocurrió la tardanza o salida anticipada.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASITardanza', @level2type=N'COLUMN', @level2name=N'FechaTardanza'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasificador de la falta: I = Ingreso Tardío, S = Salida Anticipada.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASITardanza', @level2type=N'COLUMN', @level2name=N'TipoTardanza'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Turno que el empleado debía cumplir al momento de la infracción.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASITardanza', @level2type=N'COLUMN', @level2name=N'IdTurno'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Hora real militar HHMM en la que marcó el reloj provocando la falta.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASITardanza', @level2type=N'COLUMN', @level2name=N'HoraTardanza'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tiempo bruto acumulado de la penalidad en formato militar HHMM. Requiere conversión matemática (Ej. 0104 = 64 minutos).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASITardanza', @level2type=N'COLUMN', @level2name=N'TiempoTardanza'
GO