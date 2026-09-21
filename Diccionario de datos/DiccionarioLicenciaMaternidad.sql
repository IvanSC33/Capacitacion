 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Secuencia o número de embarazo/licencia tomada por la trabajadora en la empresa.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'secuencia_licencia_maternidad'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único de la trabajadora (Llave Foránea).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de inicio del descanso pre-natal (usualmente 49 días antes del parto).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'fecha_inicio_pre_natal'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que ocurrió el parto real.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'fecha_parto_real'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de inicio del descanso post-natal.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'fecha_inicio_post_natal'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que la trabajadora debe retornar a sus labores físicas.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'fecha_reingreso'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que el sistema inicia el cálculo 100% subsidiado por EsSalud.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'fecha_salida_planilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que la nómina vuelve a calcular el sueldo regular a cargo de la empresa.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'fecha_reingreso_planilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Observaciones del área de Bienestar (Ej: Gestación múltiple, descanso acumulado).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'observacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año base para el cálculo del promedio de las 12 últimas remuneraciones para el subsidio de EsSalud.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'AnioContingencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes base para calcular el subsidio de EsSalud.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'MesContingencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag de parto múltiple. Si aplica, el descanso se extiende de 98 a 128 días según ley peruana.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMLicenciaMaternidad', @level2type=N'COLUMN', @level2name=N'IndMultiple'
GO