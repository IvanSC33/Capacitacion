 

-- =========================================================================
-- 1. TABLA: c01.ADMPendienteRetiro (Gestión de Ceses del Personal)
-- =========================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del trabajador cesado (FK a ADMTrabajador).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Correlativo de retiro. Un trabajador con reingresos puede tener secuencia 1, 2, 3, etc.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'secuencia_retiro'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Último día de vínculo laboral (Fecha de cese).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'fecha_efectivo_renuncia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código interno del motivo de cese (Cruza con ADMCeseMotivo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'tipo_retiro'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag que indica si la Liquidación de Beneficios Sociales ya fue procesada por el sistema.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'indicador_procesado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Comentarios o notas adicionales del analista sobre la salida del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'observaciones'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Regla de pago: 1=Paga días en Boleta normal y truncos en Liquidación. 0=Todo (días + truncos) se consolida y paga en la Liquidación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPendienteRetiro', @level2type=N'COLUMN', @level2name=N'pago_boleta'
GO

-- =========================================================================
-- 2. TABLA: c01.ADMCeseMotivo (Catálogo de Motivos de Cese y SUNAT)
-- =========================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Descripción legible del motivo del cese (Ej. Renuncia Voluntaria).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMCeseMotivo', @level2type=N'COLUMN', @level2name=N'descripcion_cese'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código oficial de la Tabla 17 de SUNAT usado para reportar la baja en PLAME/T-Registro.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMCeseMotivo', @level2type=N'COLUMN', @level2name=N'equi_sunat'
GO