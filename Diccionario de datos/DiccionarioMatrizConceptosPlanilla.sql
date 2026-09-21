 
 

-- Documentación para PLLBaseConcepto
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del paquete de configuración de cálculos y conceptos de planilla.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLBaseConcepto', @level2type=N'COLUMN', @level2name=N'codigo_base_concepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre de la base de conceptos.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLBaseConcepto', @level2type=N'COLUMN', @level2name=N'nombre_base_concepto'
GO

-- Documentación para admtipotrabajador
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del régimen o tipo de trabajador (Ej: P = Practicante, E = Empleado).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admtipotrabajador', @level2type=N'COLUMN', @level2name=N'tipo_trabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía a la que pertenece esta configuración.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admtipotrabajador', @level2type=N'COLUMN', @level2name=N'compania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Llave foránea a PLLBaseConcepto. Define qué fórmulas y conceptos de nómina aplican a este tipo de trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'admtipotrabajador', @level2type=N'COLUMN', @level2name=N'codigo_base_concepto'
GO


 

-- Documentación para PLLConcepto
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID Inteligente del concepto: 1-2(Ingresos), 3-4(Desctos), 5(Aportes), 6(Promedios), 7(Dias/Horas), 8(Totales), 9(Netos).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLConcepto', @level2type=N'COLUMN', @level2name=N'codigo_concepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Equivalencia con el código tributario del PDT PLAME (SUNAT).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLConcepto', @level2type=N'COLUMN', @level2name=N'equi_sunat'
GO

-- Documentación para PLLPlanilla
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del tipo de proceso de nómina (01=Mensual, 05=CTS, 09=Utilidades, 10=Liquidación).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLPlanilla', @level2type=N'COLUMN', @level2name=N'codigo_planilla'
GO

-- Documentación para PLLConceptoPlanilla
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Origen del cálculo: C (Calculado internamente), D (Digitado/Manual), F (Fórmula compleja).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'codigo_origen_concepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag (1/0). Determina si el concepto se imprime y es visible en la boleta de pago del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PLLConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'indicador_figura_boleta'
GO