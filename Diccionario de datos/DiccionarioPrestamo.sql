 

-- 1. Identificadores y Tipo
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del colaborador titular del préstamo o adelanto.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Correlativo secuencial de los préstamos, adelantos o descuentos de un mismo trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'secuencia_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la naturaleza del préstamo/descuento (Adelanto, Mensual, Convenio, etc). Cruza con ADMPrestamoTipo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'tipo_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Subcategoría interna o indicador del motivo del préstamo (0 o 1).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'motivo_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de transacción del portal, ticket o nombre abreviado del concepto (Ej: SP000001, GIM, FOT).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'CodigoPrestamo'
GO

-- 2. Importes y Moneda
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Dinero solicitado originalmente por el trabajador o costo total del beneficio.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'monto_solicitado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Dinero real aprobado y otorgado al trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'monto_aprobado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Divisa del préstamo (S = Soles).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'tipo_moneda'
GO

-- 3. Plan de Descuentos (Cuotas)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad de meses (fracciones) en los que se dividió la deuda para su recupero por planilla.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'cantidad_cuotas'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Monto fijo de la cuota que el sistema de nómina retendrá en la boleta mensual ordinaria.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'monto_descuento_mensual'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Monto fijo que el sistema retendrá específicamente en las planillas de Gratificación (Julio/Diciembre).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'monto_descuento_gratificacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del mes (01-12) contable en el que inicia la retención de cuotas.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'codigo_inicio_pago'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año fiscal en el que se efectuará el primer descuento por planilla.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'ano_inicio_pago'
GO

-- 4. Fechas y Estados
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que el colaborador generó la petición formal.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'fecha_solicitud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que RRHH/Finanzas aprobó la operación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'fecha_aprobado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que Finanzas realizó el abono o transferencia a la cuenta del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'fecha_entrega_efectivo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de la deuda: Indica si el préstamo está Activo (A) para que el motor de planillas efectúe los descuentos.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'situacion_prestamo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de registro en base de datos (A = Activo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMPrestamo', @level2type=N'COLUMN', @level2name=N'situacion_registro'
GO