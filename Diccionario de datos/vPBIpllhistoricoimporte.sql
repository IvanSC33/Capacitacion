 DROP VIEW [c01].[vPBIpllhistoricoimporte]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE or alter VIEW [c01].[vPBIpllhistoricoimporte] AS
SELECT 
    HI.ano_periodo,
    HI.codigo_periodo  ,
    HI.codigo_compania,
    HI.codigo_unico ,
    HI.tipo_trabajador,
    ISNULL(TT.descripcion_corta_tipo_trab, 'NO DEFINIDO') AS regimen_laboral,
    HI.codigo_planilla,
    ISNULL(P.nombre_planilla, 'PLANILLA NO DEFINIDA') AS nombre_planilla,
    
    -- Clasificación visual para armar filtros en Power BI o Excel
    CASE 
        WHEN HI.codigo_concepto BETWEEN '1000' AND '2999' THEN '1. Ingresos'
        WHEN HI.codigo_concepto BETWEEN '3000' AND '4999' THEN '2. Descuentos'
        WHEN HI.codigo_concepto BETWEEN '5000' AND '5999' THEN '3. Aportes Empleador'
        WHEN HI.codigo_concepto BETWEEN '6000' AND '6999' THEN '6. Cálculos / Promedios'
        WHEN HI.codigo_concepto BETWEEN '7000' AND '7999' THEN '0. Control de Tiempo (Días/Hrs)'
        WHEN HI.codigo_concepto BETWEEN '8000' AND '8999' THEN '4. Agrupadores / Totales'
        WHEN HI.codigo_concepto >= '9000' THEN '5. Acumulados / Netos'
        ELSE 'Otros'
    END AS clasificacion_concepto,

    HI.codigo_concepto,
    ISNULL(C.nombre_concepto, 'CONCEPTO DESCONOCIDO') AS nombre_concepto,
    HI.importe_concepto

FROM c01.pllhistoricoimporte HI

-- 1. Buscamos el tipo de trabajador para obtener su Base de Concepto (Ej: Empleado -> 01)
LEFT JOIN c01.admtipotrabajador TT
    ON HI.tipo_trabajador = TT.tipo_trabajador
    AND HI.codigo_compania = TT.compania

-- 2. Traemos el nombre del Concepto cruzando por la Base de Concepto del trabajador
LEFT JOIN c01.PLLConcepto C
    ON HI.codigo_concepto = C.codigo_concepto
    AND TT.codigo_base_concepto = C.codigo_base_concepto

-- 3. Traemos el nombre de la Planilla
LEFT JOIN c01.PLLPlanilla P
    ON HI.codigo_planilla = P.codigo_planilla
    AND TT.codigo_base_concepto = P.codigo_base_concepto

-- 4. Omitimos los importes en cero para no saturar los reportes
WHERE HI.importe_concepto <> 0;