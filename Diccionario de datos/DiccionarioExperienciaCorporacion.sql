 
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del colaborador (Llave Foránea a ADMTrabajador).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la unidad funcional o área de ORIGEN (Antes del cambio).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'unidad_funcional_organica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la unidad funcional o área de DESTINO (Nuevo área).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'unidad_funcional_organica_new'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del cargo o puesto de ORIGEN.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'puesto_desempenado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del cargo o puesto de DESTINO (Ascenso o movimiento lateral).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'puesto_desempenado_new'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la categoría jerárquica de ORIGEN.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'categoria_jerarquica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la categoría jerárquica de DESTINO.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'categoria_jerarquica_new'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que el colaborador inició en el nuevo cargo/área de este registro.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'fecha_inicio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que el colaborador dejó este cargo/área. Si es NULL, es su posición vigente.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'fecha_termino'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la sede o ubicación física de ORIGEN.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'ubicacion_fisica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la sede o ubicación física de DESTINO.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'ubicacion_fisica_new'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la unidad de negocio o sucursal de ORIGEN.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'Sucursal'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la unidad de negocio o sucursal de DESTINO.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMExperienciaCorporacion', @level2type=N'COLUMN', @level2name=N'Sucursal_new'
GO