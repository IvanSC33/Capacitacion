-- =========================================================================
-- OBJETO: c01.vPBINominaEjecutada
-- DESCRIPCIÓN: Unifica la Planilla Abierta (Actual) con la Histórica (Cerrada).
-- CORRECCIÓN: Deduplicación inteligente priorizando el Histórico sobre el Vigente.
-- OPTIMIZACIÓN EXTREMA: Uso de Anti-Semi-Join (NOT EXISTS) para evitar 
-- colapsos de memoria y permitir Predicate Pushdown.
-- =========================================================================
-- =========================================================================
CREATE OR ALTER VIEW c01.vPBINominaEjecutada AS

    -- 1. HISTORIA CERRADA (Prioridad 1 - Pasa Directo)
    SELECT 
        ano_periodo, codigo_periodo, codigo_compania, codigo_unico, 
        tipo_trabajador, codigo_planilla, codigo_concepto, importe_concepto,
        '1_HISTORICO' AS Fuente_Dato
    FROM c01.pllhistoricoimporte
    WHERE importe_concepto <> 0

    UNION ALL

    -- 2. MES ACTUAL VIGENTE (Prioridad 2 - Entra SOLO si no está en histórico)
    SELECT 
        VIG.ano_periodo, VIG.codigo_periodo, VIG.codigo_compania, VIG.codigo_unico, 
        VIG.tipo_trabajador, VIG.codigo_planilla, VIG.codigo_concepto, VIG.importe_concepto,
        '2_VIGENTE' AS Fuente_Dato
    FROM c01.PLLImporte VIG
    WHERE VIG.importe_concepto <> 0
      -- LA MAGIA: El Anti-Semi-Join bloquea a los clones antes de que nazcan
      AND NOT EXISTS (
          SELECT 1 
          FROM c01.pllhistoricoimporte HIST
          WHERE HIST.ano_periodo = VIG.ano_periodo
            AND HIST.codigo_periodo = VIG.codigo_periodo
            AND HIST.codigo_compania = VIG.codigo_compania
            AND HIST.codigo_unico = VIG.codigo_unico
            AND HIST.tipo_trabajador = VIG.tipo_trabajador
            AND HIST.codigo_planilla = VIG.codigo_planilla
            AND HIST.codigo_concepto = VIG.codigo_concepto
      );
GO