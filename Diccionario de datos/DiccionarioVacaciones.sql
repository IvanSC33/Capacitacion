 
-- 1. Identificadores y Parámetros
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Correlativo que identifica cada registro o fracción de vacaciones tomadas por el trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'secuencia_vacaciones'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único del colaborador titular.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código que define el tipo o clase de vacación en el sistema.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'tipo_vacacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año de aniversario del cual se están descontando los días. Se calcula en base a la fecha de ingreso.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'ejercicio_vacacion'
GO

-- 2. Fechas y Días
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha oficial en la que el colaborador inicia su periodo de descanso físico.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'fecha_inicio_vacacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha oficial en la que finaliza el descanso vacacional.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'fecha_fin_vacacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha en la que se solicitó el descanso a través del flujo de aprobación (si aplica).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'fecha_solicitud_vacacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad de días calendarios efectivos que dura el periodo vacacional.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'nro_de_dias'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Días efectivos que se rebajan del récord del empleado. Generalmente coincide con nro_de_dias.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'dias_tomados'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad de días que le quedan pendientes al colaborador por tomar en ese ejercicio específico.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'dias_pendientes'
GO

-- 3. Tipología y Solicitud
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasificación: 1=Vacaciones Gozadas, 2=Compensadas (Vendidas), 3=Perdidas.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'motivo_vacacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'ID de la solicitud. Si es NULL, el registro fue ingresado directamente por un administrador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'nro_solicitud_vacacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado del registro vacacional (A = Activo/Vigente).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'estado_pago_vacaciones'
GO

-- 4. Pagos y Planilla
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag (1 o 0) que confirma si el motor de nómina ya calculó y pagó estos días.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'indicador_abonado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Compañía o razón social a la que pertenece el trabajador en este periodo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'codigo_cia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año fiscal en el cual la planilla procesa y abona este periodo vacacional.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'ano_pago'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes contable en el cual la planilla procesa y abona este periodo vacacional.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'mes_pago'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Política de pago: 5=Sin adelanto (pago normal a fin de mes), 1=Mes siguiente, 2=Adelanto especial.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'tipo_adelanto'
GO

-- 5. Auditoría
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Usuario de red que creó el registro vacacional en el sistema.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'usuario'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha y hora de creación del registro en base de datos.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMVacacion', @level2type=N'COLUMN', @level2name=N'fecha_registro'
GO