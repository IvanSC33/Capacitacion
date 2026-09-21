 
-- Documentación para la tabla c01.PLLImporte
EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código único del trabajador. Identificador principal del colaborador.', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código del mes o periodo vigente de pago (Ej: 08 para Agosto).', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'codigo_periodo'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Año fiscal correspondiente al periodo de cálculo (Ej: 2025).', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'ano_periodo'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código del tipo de planilla procesada (Ej: 01 = Mensual, 05 = CTS, 10 = Liquidación).', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'codigo_planilla'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código del concepto de planilla evaluado por el motor (Ingresos, Descuentos, Aportes, Días o Totales).', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'codigo_concepto'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código de la compañía (razón social) que procesa la nómina.', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'codigo_compania'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código del régimen o tipo de trabajador en el periodo (Ej: E = Empleado, M = Profesor por horas).', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'tipo_trabajador'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Importe económico (S/ o $), o cantidad (de días/horas) resultante del cálculo para el periodo vigente.', 
    @level0type=N'SCHEMA', @level0name=N'c01', 
    @level1type=N'TABLE', @level1name=N'PLLImporte', 
    @level2type=N'COLUMN', @level2name=N'importe_concepto'
GO