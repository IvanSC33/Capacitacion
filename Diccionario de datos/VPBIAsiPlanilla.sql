IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIAsiPlanilla]'))
DROP VIEW [c01].[VPBIAsiPlanilla]
GO
 
CREATE VIEW [c01].[VPBIAsiPlanilla] AS
SELECT 
    -- 1. Llave generada para evitar duplicados en BI
    CD.CodigoUnico + CD.AnioPeriodo + CD.CodigoPeriodo + CD.CodigoPlanilla + CAST(CD.IdConcepto AS VARCHAR) AS id_transaccion_resumen,

    -- 2. Contexto del Empleado y Periodo
    CD.CodigoUnico AS id_trabajador,
    CD.CodigoCompania AS codigo_compania,
    CD.TipoTrabajador AS tipo_trabajador,
    CD.AnioPeriodo AS anio_planilla,
    CD.CodigoPeriodo AS mes_planilla,
    CD.CodigoPlanilla AS codigo_tipo_planilla,

    -- 3. Datos Origen (El cálculo de Asistencia)
    CD.IdConcepto AS id_concepto_asistencia,
    C.Abreviatura AS abreviatura_asistencia,
    C.Descripcion AS nombre_concepto_asistencia,

    -- 4. VALOR CALCULADO (Lo que se va a pagar/descontar)
    CD.Importe AS importe_calculado_centesimal,

    -- 5. Datos Destino (A dónde viaja en la Planilla)
    CP.CodigoConcepto AS codigo_concepto_planilla,
    ISNULL(PC.nombre_concepto, 'SIN MAPEO EN PLANILLA') AS nombre_concepto_planilla,
    
    -- 6. Auditoría
    CD.SituacionRegistro AS estado_calculo

FROM c01.ASIConceptoDetalle CD

-- Unimos con el catálogo de asistencia para traer el nombre
INNER JOIN c01.ASIConcepto C 
    ON CD.IdConcepto = C.IdConcepto

-- Unimos con el mapeador para saber a qué concepto de planilla apunta
INNER JOIN c01.ASIConceptoPlanilla CP
    ON CD.IdConcepto = CP.IdConcepto
    AND CD.CodigoCompania = CP.CodigoCompania
    AND CD.TipoTrabajador = CP.TipoTrabajador
    AND CD.CodigoPlanilla = CP.CodigoPlanilla

-- Unimos con la tabla maestra de Planillas (PLLConcepto) para traer la descripción final de Finanzas
LEFT JOIN c01.PLLConcepto PC
    ON CP.CodigoConcepto = PC.codigo_concepto
    -- Asumiendo base '01' general o puedes omitirlo si codigo_concepto es único por Cia
    AND PC.codigo_base_concepto IN (SELECT codigo_base_concepto FROM c01.admtipotrabajador WHERE tipo_trabajador = CD.TipoTrabajador AND compania = CD.CodigoCompania)

WHERE CD.SituacionRegistro = 'A'
  AND CP.SituacionRegistro = 'A';
GO

 