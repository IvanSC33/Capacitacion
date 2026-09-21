
--select 
--codigo_base_concepto
--,codigo_base_variable
--,nombre_base_concepto
--,descripcion_base_concepto
--from [c01].[PLLBaseConcepto] 



--select 
--tipo_trabajador
--,compania
--,descripcion_corta_tipo_trab
--,descripcion_larga_tipo_trab
--,codigo_base_concepto
--,situacion_registro
--from c01.admtipotrabajador

 

--select codigo_concepto,  
--codigo_base_concepto, 
--nombre_concepto, 
--equi_sunat, 
--descripcion_concepto
--from c01.PLLConcepto c 

--select 
--codigo_planilla
--,codigo_base_concepto
--,nombre_planilla
--,descripcion_planilla
--from c01.PLLPlanilla



--select 
--codigo_concepto
--,codigo_planilla
--,codigo_base_concepto
--,codigo_origen_concepto
--,indicador_figura_boleta
--,situacion_registro
--from c01.PLLConceptoPlanilla


	
	/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIMatrizConceptosPlanilla]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

 

 CREATE or alter VIEW [c01].[vPBIMatrizConceptosPlanilla] AS
SELECT 
    -- =========================================================
    -- 1. CONTEXTO ORGANIZACIONAL (¿A quién aplica?)
    -- =========================================================
    TT.compania,
    BC.codigo_base_concepto,
    BC.nombre_base_concepto,
    TT.tipo_trabajador,
    TT.descripcion_larga_tipo_trab AS regimen_laboral,

    -- =========================================================
    -- 2. EVENTO DE PLANILLA (¿Cuándo se evalúa?)
    -- =========================================================
    PL.codigo_planilla,
    PL.nombre_planilla,
    PL.descripcion_planilla,

    -- =========================================================
    -- 3. EL CONCEPTO O RUBRO (¿Qué se está pagando/descontando?)
    -- =========================================================
    C.codigo_concepto,
    C.nombre_concepto,
    C.descripcion_concepto,
    ISNULL(C.equi_sunat, 'NO DECLARADO') AS codigo_plame_sunat,

    -- =========================================================
    -- 4. REGLAS DEL MOTOR DE CÁLCULO (¿Cómo se procesa?)
    -- =========================================================
    CP.codigo_origen_concepto,
    CASE CP.codigo_origen_concepto
        WHEN 'C' THEN 'Calculado Interno'
        WHEN 'D' THEN 'Digitado (Manual)'
        WHEN 'F' THEN 'Fórmula / Script'
        WHEN 'S' THEN 'Sumatoria / Agrupador'
        ELSE CP.codigo_origen_concepto
    END AS naturaleza_calculo,
    
    CP.indicador_figura_boleta,
    CASE 
        WHEN CP.indicador_figura_boleta = 1 THEN 'SÍ IMPRIME'
        WHEN CP.indicador_figura_boleta = 0 OR CP.indicador_figura_boleta IS NULL THEN 'OCULTO / INTERNO'
    END AS visibilidad_boleta,
    
    CP.situacion_registro AS estado_en_matriz

FROM c01.PLLConceptoPlanilla CP

-- Unimos con el Catálogo de Conceptos
INNER JOIN c01.PLLConcepto C
    ON CP.codigo_concepto = C.codigo_concepto
    AND CP.codigo_base_concepto = C.codigo_base_concepto

-- Unimos con el Catálogo de Planillas
INNER JOIN c01.PLLPlanilla PL
    ON CP.codigo_planilla = PL.codigo_planilla
    AND CP.codigo_base_concepto = PL.codigo_base_concepto

-- Unimos con la Base de Conceptos
INNER JOIN c01.PLLBaseConcepto BC
    ON CP.codigo_base_concepto = BC.codigo_base_concepto

-- Unimos con los Tipos de Trabajador (LEFT JOIN porque 1 base aplica a muchos tipos)
LEFT JOIN c01.admtipotrabajador TT
    ON CP.codigo_base_concepto = TT.codigo_base_concepto
    AND TT.situacion_registro = 'A'; -- Traemos solo los regímenes activos

 

   

 