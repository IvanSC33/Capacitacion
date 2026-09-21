

-- 1. Identificación y Datos Personales
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Llave principal única con la cual se identifica a cada trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'codigo_unico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código mediante el cual los usuarios identifican a cada trabajador (único por compañía).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'matricula'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identifica el sexo del colaborador (1 = Masculino, 2 = Femenino).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'sexo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del estado Civil (1=SOLTERO, 2=CASADO, 3=VIUDO, 4=DIVORCIADO, 5=CONVIVIENTE, 0=OTROS).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'estado_civil'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Representa la nacionalidad del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'nacionalidad'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del tipo de documento (01=DNI, 04=CE, 07=PASAPORTE, 11=PARTIDA NACIMIENTO).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_documento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de nacimiento del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'fecha_nacimiento'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del país de nacimiento del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'pais_nacimiento'
GO

-- 2. Fechas de Ingreso y Datos Contractuales
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de primer ingreso a la corporación (se mantiene inalterable ante reingresos).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'fecha_ingreso_coorporacion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de ingreso a la compañía actual (se actualiza si hay reingreso).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'fecha_ingreso_compania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del tipo de contrato laboral del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_contrato'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de trabajador que afecta el régimen de planillas (Ej. empleado, obrero, director).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_trabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicador de situación laboral (A=Activo, C=Cesado, P=Pendiente ingreso futuro).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'situacion_trabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Habilita al colaborador para el cálculo de nómina (1 = Sí, 0 = No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_planilla'
GO

-- 3. Organización y Puestos
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasifica el rol o régimen laboral macro (Ej. Académico, Administrativo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'categoria_jerarquica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del área o departamento según el organigrama.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'unidad_funcional_organica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la sede o lugar geográfico donde labora físicamente.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'ubicacion_fisica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador de la unidad de negocio, división legal o sucursal.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'sucursal'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del cargo o puesto de trabajo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'puesto_organica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nivel o banda salarial asignado al puesto dentro de la escala corporativa.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'grado_salarial_organica'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasificación legal: 0=Ordinario, 1=Dirección, 2=Confianza (Afecta horas extras).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_personal_direccion'
GO

-- 4. Remuneraciones y Nómina
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Define algoritmo de cálculo: 0=Bruto, 1=Neto, 2=Bruto Integral.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_remuneracion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Importe del sueldo base para el cálculo de planillas.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'sueldo_basico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de moneda para el cálculo (S = Soles, D = Dólares).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_moneda'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Cantidad de sueldos anuales proyectados (Ej. 12, 14). Afecta renta de 5ta.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'regimen_salarial'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicador de Asignación Familiar (1=Aplica 10% RMV, 0=No Aplica).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'asignacion_conyuge'
GO

-- 5. AFP, Seguros y Beneficios
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica si está en AFP (1=Sí) o en ONP (0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_inscrito_AFP'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la AFP a la que pertenece el trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'codigo_afp'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Fecha de inicio de afiliación a la AFP.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'fecha_ingreso_afp'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica tipo de comisión AFP: 1 = Mixta, 0 = Flujo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_comision_mixta'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica si es jubilado (1=Sí). Si lo es, no se descuenta pensión.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_jubilado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica si está inscrito en EsSalud (1=Sí, 0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_inscrito_IPSS'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Afiliación a Seguro de Vida adicional opcional (1=Sí, 0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'inscrito_seguro_vida'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Afiliación a Seguro de Vida Ley obligatorio (1=Sí, 0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'inscrito_ley_4916'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Afiliación al Seguro Complementario de Trabajo de Riesgo - SCTR (1=Sí, 0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_sctr'
GO

-- 6. T-Registro y PLAME (SUNAT)
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Clasifica el rol operativo según la Tabla 8 de SUNAT (Ej. 21 EMPLEADO).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_trabajador_sunat'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Agrupador macro de SUNAT que define el vínculo principal (Trabajador, Tercero).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'categoria_trabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Grado de instrucción máximo alcanzado según Tabla 9 de SUNAT.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'nivel_educativo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica si está afiliado a un sindicato (1=Sí, 0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'sindicalizado'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica fiscalización de horario (1=Sí, 0=No). Si es 1 tiene derecho a horas extra.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'control_inmediato'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indica si es persona con discapacidad para cuota SUNAFIL (1=Sí, 0=No).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'discapacidad'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Define el marco legal laboral (Ej. 1 = REGIMEN PRIVADO).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'regimen_laboral'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Frecuencia de proceso y abono de nómina (Ej. 1=Mensual, 2=Quincenal).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'periodicidad_remuneracion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Forma de entrega de dinero (Ej. 2=Depósito, 1=Efectivo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'modalidad_de_pago'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código RUC de la Entidad Prestadora de Salud (EPS). "0" si no aplica.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'ruc_eps'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Entidad para cobertura médica de SCTR (1=ESSALUD, 2=EPS, 0=Ninguno).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_sctr_salud'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Entidad para pensión de SCTR (1=ONP, 2=SEGURO PRIVADO, 0=Ninguno).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'tipo_sctr_pension'
GO

-- 7. Asistencia, Vacaciones y Ubicación
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Departamento de residencia del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'departamento_domicilio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Provincia de residencia del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'provincia_domicilio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Distrito de residencia del colaborador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'distrito_domicilio'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código numérico que determina fiscalización (1=Fiscalizable/Paga Extras, 0=No Fiscalizable).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'indicador_personal_confianza'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Días de vacaciones que acumula por año (30 para ordinarios, 0 para practicantes/honorarios).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'esquema_vacacional'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicador (1=Sí, 0=No) que activa el cálculo de faltas y tardanzas en nómina.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'ProcesarAsistencia'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Compañía o Razón Social principal al que pertenece el trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ADMTrabajador', @level2type=N'COLUMN', @level2name=N'compania'
GO