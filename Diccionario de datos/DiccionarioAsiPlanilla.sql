 

-- =====================================================================================================
-- 1. TABLA: ASIConcepto (Catálogo Maestro de Asistencia)
-- =====================================================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Catálogo maestro interno del módulo de Asistencia. Define los rubros (Días, Tardanzas, Extras) que el sistema puede consolidar.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConcepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único (PK) del concepto de asistencia.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConcepto', @level2type=N'COLUMN', @level2name=N'IdConcepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código corto o mnemónico usado por el motor para identificar el rubro (Ej: DLAB, MTAR, HE25).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConcepto', @level2type=N'COLUMN', @level2name=N'Abreviatura'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Nombre descriptivo y legible del concepto (Ej: Minutos Tardanza, Horas Extras 25%).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConcepto', @level2type=N'COLUMN', @level2name=N'Descripcion'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Flag (1/0) que indica si el motor de asistencia debe procesar y cuantificar matemáticamente este concepto.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConcepto', @level2type=N'COLUMN', @level2name=N'IndicadorEjecutar'
GO

-- =====================================================================================================
-- 2. TABLA: ASIConceptoPlanilla (Mapeador / Tabla Puente)
-- =====================================================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tabla Puente (Mapeador). Relaciona un concepto del módulo de Asistencia con un CodigoConcepto del módulo de Nómina (PLLConcepto) según régimen y compañía.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador único (PK) de la regla de homologación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'IdConceptoPlanilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la empresa en la que aplica esta regla de homologación.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'CodigoCompania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Régimen laboral al que aplica la regla (Ej: E=Empleados, O=Obreros, P=Practicantes). Permite mapeos diferenciados por régimen.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'TipoTrabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la planilla destino (Ej: 01=Mensual, 10=Liquidación).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'CodigoPlanilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del concepto origen en el módulo de Asistencia (FK a ASIConcepto).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'IdConcepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código del concepto contable destino en el módulo de Planilla (FK a PLLConcepto). Aquí se depositará el dinero/descuento.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'CodigoConcepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Abreviatura del concepto de asistencia (Espejo de ASIConcepto). Funciona como llave alterna visual.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'Tipo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado de vigencia del mapeo (A = Activo).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoPlanilla', @level2type=N'COLUMN', @level2name=N'SituacionRegistro'
GO

-- =====================================================================================================
-- 3. TABLA: ASIConceptoDetalle (Resultados Finales del Mes)
-- =====================================================================================================
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tabla de Hechos (Fact). Contiene el resumen final calculado por trabajador y periodo (Días, Horas, Minutos) listo para viajar a PLLMovimiento.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código único del empleado evaluado (FK).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'CodigoUnico'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Código de la empresa del trabajador.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'CodigoCompania'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Régimen laboral del trabajador en el periodo evaluado.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'TipoTrabajador'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Año de la planilla donde se liquidará el concepto (Ej: 2026).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'AnioPeriodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Mes de la planilla donde se liquidará el concepto (Ej: 08).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'CodigoPeriodo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Secuencia o correlativo del cálculo dentro del mismo mes.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'Numero'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Tipo de planilla destino (Ej: 01=Mensual, 03=Practicantes).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'CodigoPlanilla'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Abreviatura del rubro liquidado (Ej: HLAB, MTAR, HE25).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'Tipo'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Identificador del concepto de asistencia evaluado (FK a ASIConcepto).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'IdConcepto'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'DATO CRÍTICO: Valor numérico consolidado final. Si son días, es entero (Ej. 15.0000). Si son horas, es decimal centesimal (Ej. 140.03333) listo para costeo directo.', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'Importe'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Estado del registro (A = Activo / Válido para transferirse a la nómina).', @level0type=N'SCHEMA', @level0name=N'c01', @level1type=N'TABLE', @level1name=N'ASIConceptoDetalle', @level2type=N'COLUMN', @level2name=N'SituacionRegistro'
GO

 

