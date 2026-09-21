 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del trabajador. Llave de identificación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Régimen o tipo de trabajador que tenía en el mes de cálculo histórico.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'tipo_trabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año de cierre de la planilla.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'ano_periodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes (periodo) de cierre de la planilla.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'codigo_periodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del concepto o rubro calculado en la historia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'codigo_concepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de planilla procesada (Normal, Utilidades, Liquidaciones, etc).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'codigo_planilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía / razón social.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'codigo_compania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Importe monetario, días u horas resultantes del cierre de esa planilla histórica.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'pllhistoricoimporte', @level2type=N'COLUMN', @level2name=N'importe_concepto'
GO