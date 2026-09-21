 
-- 1. Llaves y Relaciones
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del colaborador titular de la deuda.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Secuencia interna que agrupa las cuotas de un mismo plan de pago o refinanciamiento.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'secuencia_tipo_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del tipo de préstamo o descuento al que pertenece esta cuota.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'tipo_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del préstamo maestro al que pertenece la cuota (Cruza con ADMPrestamo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'secuencia_prestamo'
GO

-- 2. Cronograma (Tiempo)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año fiscal en el cual está programado el cobro de esta cuota.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'ano_periodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes contable (01-12) en el que se aplicará el descuento de esta cuota.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'codigo_periodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Número de orden de la cuota dentro del cronograma de amortización.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'numero_cuota'
GO

-- 3. Estado de la Cuota
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag de estado de cobranza: 1 = Ya descontado/Pagado por planilla, 0 = Pendiente de cobro.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'indicador_pago'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Situación lógica de la cuota en el sistema de cuentas por cobrar (A=Activa).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'situacion_plan_pago'
GO

-- 4. Importes Monetarios
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Monto restante de la deuda capital DESPUÉS de haber aplicado el cobro de esta cuota (En la última cuota llega a 0.00).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'saldo_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Porción de la cuota que amortiza o reduce directamente la deuda principal del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'monto_amortizacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Pagos directos o extraordinarios abonados para adelantar la deuda, fuera del descuento regular.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'amortizacion_extraordinaria'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Monto programado para ser descontado de la planilla ordinaria mensual.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'monto_descuento_mensual'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Monto programado para ser descontado exclusivamente de la planilla de Gratificación (Julio o Diciembre).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'monto_descuento_gratificacion'
GO

-- 5. Auditoría
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Usuario de base de datos o sistema que generó el cronograma de pago.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'usuario'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Timestamp de la creación de la cuota en el sistema.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'fecha_registro_usuario'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado del registro en la tabla física.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamoPlanPago', @level2type=N'COLUMN', @level2name=N'situacion_registro'
GO