-- SELECT 
--    objname AS Nombre_Columna, 
--    value AS Descripcion
--FROM fn_listextendedproperty(NULL, 'schema', 'c01', 'table', 'ADMContrato', 'column', default);
---- 1. Identificadores y Relaciones


EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Identificador único del trabajador titular del contrato.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código alfanumérico que identifica el número físico o lógico del documento de contrato.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'numero_contrato'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Compañía o razón social bajo la cual se establece el contrato legal (Ej: 01, 02, 03).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'compania'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Correlativo histórico de renovaciones o adendas de un mismo trabajador.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'secuencia_contrato'
GO

-- 2. Clasificación del Contrato
EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Código de la modalidad contractual (Cruza con ADMTipoContrato). Ej: E=Indeterminado, K=Plazo Fijo.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'tipo_contrato'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Indicador (1 o 0) que confirma si el contrato es de naturaleza indeterminada/indefinida (sin fecha de término).', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'indicador_indeterminado'
GO

-- 3. Fechas y Vigencia
EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Fecha oficial de inicio de vigencia de esta secuencia contractual.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'fecha_inicio'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Fecha oficial de fin de vigencia. Suele ser NULL en contratos a plazo indeterminado.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'fecha_termino'
GO

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', @value=N'Estado de la secuencia (A = Activo, I = Inactivo). Un colaborador tiene historial, pero idealmente solo un registro Activo.', 
    @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMContrato', @level2type=N'COLUMN', @level2name=N'situacion_contrato'
GO