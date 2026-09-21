 
-- ==============================================================
-- 1. DOCUMENTAR TABLA: c01.PSTPuestoCompania (Maestro de Puestos)
-- ==============================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía a la que pertenece el puesto.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'compania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador alfanumérico único del cargo o puesto de trabajo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'puesto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre oficial del puesto en la estructura organizacional.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'descripcion_puesto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Letra que categoriza el nivel de responsabilidad macro del puesto (Cruza con PSTGrupoSalarial).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'grupo_salarial'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código que agrupa los puestos según la naturaleza de sus funciones (Cruza con PSTGrupoFuncional).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'grupo_funcional'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nivel que ubica al puesto dentro de la escala de bandas salariales de la empresa (Cruza con PSTGradoSalarial).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'grado_salarial'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica si el puesto está activo (A) en la estructura.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTPuestoCompania', @level2type=N'COLUMN', @level2name=N'situacion_registro'
GO

-- ==============================================================
-- 2. DOCUMENTAR TABLA: c01.PSTGradoSalarial (Bandas Salariales)
-- ==============================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTGradoSalarial', @level2type=N'COLUMN', @level2name=N'compania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nivel numérico de la escala salarial.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTGradoSalarial', @level2type=N'COLUMN', @level2name=N'grado_salarial'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Etiqueta descriptiva del grado (Ej: JEFATURA, ANALISTA).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTGradoSalarial', @level2type=N'COLUMN', @level2name=N'descripcion_grado_salarial'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Sueldo base o piso establecido por las políticas de compensación para los puestos en este grado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTGradoSalarial', @level2type=N'COLUMN', @level2name=N'minimo_sueldo_teorico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Punto medio (Target) al que un trabajador en este grado debería aspirar tras ganar experiencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTGradoSalarial', @level2type=N'COLUMN', @level2name=N'promedio_sueldo_teorico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tope máximo que se le puede pagar a un trabajador sin tener que ascenderlo de grado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'PSTGradoSalarial', @level2type=N'COLUMN', @level2name=N'maximo_sueldo_teorico'
GO