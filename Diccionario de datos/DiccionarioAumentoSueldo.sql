 

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del trabajador (Llave foránea a ADMTrabajador).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Correlativo del historial de sueldos (1 = Inicial, 2 = 1er Aumento, etc). El número mayor es el sueldo vigente.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'secuencia_basico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la compañía.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'codigo_compania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha exacta a partir de la cual rige el nuevo sueldo para el cálculo de nómina.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'fecha_aumento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del motivo del cambio salarial (03=Inicial, 01=Mérito, 04=Promoción, 09=Ajuste RMV). Cruza con PRMTablaDetalle 0010.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'motivo_aumento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Importe monetario neto que se suma al sueldo anterior.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'monto_aumento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Porcentaje de incremento aplicado sobre el salario anterior.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'porcentaje_aumento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Sueldo bruto resultante. ESTE VALOR ACTUALIZA la tabla maestra ADMTrabajador (sueldo_basico).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'nuevo_basico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes de la nómina en la cual se hará efectivo el pago con el nuevo sueldo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'periodo_planilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año de la nómina en la cual se hará efectivo el pago.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'ano_planilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag (1 o NULL) que indica si el proceso de cálculo de planilla ya consideró este aumento.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'indicador_procesado_planilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado del registro: A = Activo (Vigente), E = Eliminado/Extornado (Aumento revertido).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMHistoricoBasico', @level2type=N'COLUMN', @level2name=N'situacion_registro'
GO