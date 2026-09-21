 
-- 1. Relación con el Trabajador
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Identificador único del colaborador titular. Permite relacionar a cada familiar con el trabajador.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO

-- 2. Datos del Parentesco
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Código del vínculo familiar que tiene la persona con el trabajador (C=Cónyuge, H=Hijo, O=Concubino, P=Padres).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'tipo_familiar'
GO

EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Número secuencial que diferencia a los familiares de un mismo trabajador (Correlativo).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'secuencia_familia'
GO

-- 3. Datos Demográficos e Identificación
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Identifica el género del familiar (1 = Masculino, 2 = Femenino).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'sexo'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Define la clase de documento con el que se identificó al familiar (DNI, Partida de Nacimiento, etc).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'tipo_documento'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Fecha de nacimiento del familiar. Clave para el control de mayoría de edad.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'fecha_nacimiento'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Fecha de defunción del familiar. Si está vivo, guarda por defecto 1900-01-01.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'fecha_fallecimiento'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Nacionalidad del familiar registrado.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'nacionalidad'
GO

-- 4. Planilla y T-Registro
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Indicador clave para planillas. Determina si por este familiar el trabajador recibe Asignación Familiar (1=Sí, 0=No).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'inscrito_escolaridad'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Indica si el familiar está activo en el sistema (A o 10).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'situacion_familia'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Fecha en la que el familiar fue dado de alta formalmente en el T-Registro.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'fecha_alta'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Fecha en la que el familiar perdió la condición de derechohabiente en T-Registro.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'fecha_baja'
GO
EXEC sys.sp_updateextendedproperty 
    @name=N'MS_Description', @value=N'Código del motivo de baja en T-Registro (Ej: 07=Hijo mayor de edad, 04=Divorcio, 02=Fallecimiento).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMFamilia', @level2type=N'COLUMN', @level2name=N'tipo_baja'
GO