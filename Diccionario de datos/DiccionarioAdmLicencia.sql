 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del colaborador (FK a ADMTrabajador).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Correlativo secuencial de las licencias o descansos tomados por el colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'secuencia_licencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que inicia la licencia o descanso médico.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'fecha_inicio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que finaliza la licencia. Sirve para calcular los días totales de ausencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'fecha_termino'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código interno del motivo de licencia (Cruza con PRMTablaDetalle 0047). Ej: 4 = Enfermedad (20 primeros días a cargo del empleador).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'tipo_licencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Número del CITT (Certificado de Incapacidad Temporal) emitido por EsSalud. Clave para recupero de subsidios.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'numero_citt'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código SUNAT para declarar los días no laborados en el PDT PLAME (Ej: 20=Enfermedad 20 días, 21=Subsidio).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'tipo_dias_no_laborados'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag (1/0). Si es 1, el trabajador superó los 20 días de enfermedad y entra a la fórmula de cálculo de subsidio EsSalud.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'indicador_subsidio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año en el que inició la contingencia (enfermedad). Se usa para promediar las 12 remuneraciones previas para el cálculo del subsidio.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'AnioContingencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes en el que inició la contingencia. Fija el punto de inicio para el promedio de 12 meses previos exigido por ley.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admlicencia', @level2type=N'COLUMN', @level2name=N'MesContingencia'
GO