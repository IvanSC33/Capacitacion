 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del cargo en el catálogo de puestos. Se cruza con PSTPuestoCompania.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGPlaneamientoPuesto', @level2type=N'COLUMN', @level2name=N'puesto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del área o departamento en el organigrama. Se cruza con ORGUnidadFuncional.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGPlaneamientoPuesto', @level2type=N'COLUMN', @level2name=N'unidad_funcional'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Headcount Presupuestado: Cantidad de plazas aprobadas u óptimas para este cargo en esta área.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGPlaneamientoPuesto', @level2type=N'COLUMN', @level2name=N'personal_teorico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Headcount Actual: Cantidad de trabajadores actualmente contratados ocupando esta plaza. La diferencia con el teórico da el número de vacantes.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGPlaneamientoPuesto', @level2type=N'COLUMN', @level2name=N'personal_real'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ORGPlaneamientoPuesto', @level2type=N'COLUMN', @level2name=N'compania'
GO