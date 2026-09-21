 DROP VIEW [c01].[vPBIPLLImporte]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE or   alter VIEW   [c01].[vPBIPLLImporte] AS
SELECT 
    I.ano_periodo,
    I.codigo_periodo,  
    I.codigo_compania,
    I.codigo_unico , 
    TT.descripcion_corta_tipo_trab , 
    P.nombre_planilla,
    
    -- Clasificamos visualmente el concepto para el reporte
    CASE 
        WHEN I.codigo_concepto BETWEEN '1000' AND '2999' THEN '1. Ingresos'
        WHEN I.codigo_concepto BETWEEN '3000' AND '4999' THEN '2. Descuentos'
        WHEN I.codigo_concepto BETWEEN '5000' AND '5999' THEN '3. Aportes Empleador'
        WHEN I.codigo_concepto BETWEEN '7000' AND '7999' THEN '0. Control de Tiempo (Días/Horas)'
        WHEN I.codigo_concepto BETWEEN '8000' AND '8999' THEN '4. Totales'
        WHEN I.codigo_concepto >= '9000' THEN '5. Acumulados Anuales'
        ELSE 'Otros Cálculos'
    END AS tipo_rubro,

    I.codigo_concepto,
    C.nombre_concepto,
    I.importe_concepto

FROM c01.PLLImporte I
-- Traemos los nombres de los conceptos
INNER JOIN c01.PLLConcepto C
    ON I.codigo_concepto = C.codigo_concepto
    AND I.tipo_trabajador = C.codigo_base_concepto -- Suponiendo que la base cruza con el tipo, ajusta si es necesario
-- Traemos los nombres de las planillas
INNER JOIN c01.PLLPlanilla P
    ON I.codigo_planilla = P.codigo_planilla
-- Traemos el tipo de trabajador
LEFT JOIN c01.admtipotrabajador TT
    ON I.tipo_trabajador = TT.tipo_trabajador
    AND I.codigo_compania = TT.compania

-- Filtramos los ceros para no ensuciar el reporte y ver solo lo real
WHERE I.importe_concepto <> 0;