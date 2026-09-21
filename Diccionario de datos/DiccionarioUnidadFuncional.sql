 

-- =========================================================================
-- 1. TABLA: c01.ORGUnidadFuncional (Tabla Maestra del Organigrama)
-- =========================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único de la estructura orgánica de la empresa (Área, Gerencia, etc).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'unidad_funcional'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre oficial de la unidad funcional o departamento.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'nombre_unidad_funcional'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo Estructural: 1=DEPARTAMENTO, 2=AREA, 3=SECCION, 0=Ninguno.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'tipo_unidad_funcional'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Matrícula del colaborador que ejerce la jefatura o responsabilidad de esta área (Cruza con ADMTrabajador).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'matricula_responsable'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del área padre a la que reporta. Si es 00000000, es el primer nivel del organigrama.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'unidad_funcional_superior'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la sede o ubicación física del área.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'codigo_ubicacion_fisica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nivel de profundidad jerárquica.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'nivel_jerarquico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la sucursal o unidad de negocio a la que pertenece.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'codigo_sucursal'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Centro de costo por defecto. Si el colaborador no tiene un C.C. distribuido, la planilla carga el 100% del gasto a este código.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'centro_costo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado en el sistema (A = Activa).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGUnidadFuncional', @level2type=N'COLUMN', @level2name=N'situacion_unidad_funcional'
GO

-- =========================================================================
-- 2. TABLA: c01.PRMUbicacionFisica (Sedes / Ubicaciones)
-- =========================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre descriptivo del recinto, campus o sede geográfica.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PRMUbicacionFisica', @level2type=N'COLUMN', @level2name=N'descripcion_ubicacion_fisica'
GO

-- =========================================================================
-- 3. TABLA: c01.ADMSucursal (Sucursales / División de Negocio)
-- =========================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre de la sucursal, instituto, escuela o división principal del negocio.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMSucursal', @level2type=N'COLUMN', @level2name=N'nombre_sucursal'
GO

-- =========================================================================
-- 4. TABLA: c01.ADMCentroCosto (Catálogo de Centros de Costo)
-- =========================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descripción contable y presupuestal del centro de costo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMCentroCosto', @level2type=N'COLUMN', @level2name=N'descripcion_centro_costo'
GO