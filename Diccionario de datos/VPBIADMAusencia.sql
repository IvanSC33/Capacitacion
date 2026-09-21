IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIADMAusencia]'))
DROP VIEW [c01].[VPBIADMAusencia]
GO

CREATE VIEW [c01].[VPBIADMAusencia] AS
SELECT 
    A.codigo_cia AS CodigoCompania,
    A.ano_pago,
    A.mes_pago,
    A.codigo_unico AS codigo_unico,
    
    -- Limpieza de Fecha para el Modelo Dimensional
    CAST(A.fecha_ausencia AS DATE) AS fecha_inasistencia,
    
    A.motivo_ausencia,
    ISNULL(M.descripcion_motivo, 'MOTIVO DESCONOCIDO') AS descripcion_motivo,
    
    -- ========================================================================
    -- LÓGICA DE NEGOCIO: AUTOMATIZACIÓN VS MANUAL (CRÍTICO PARA KPI)
    -- ========================================================================
    CASE 
        WHEN A.motivo_ausencia = '08' OR LTRIM(RTRIM(A.usuario)) = 'JOBASI' THEN 'Automático (Por Reloj)'
        ELSE 'Manual (Por RRHH)'
    END AS origen_ausencia,

    -- Banderas del maestro de motivos (Para costeo y legal)
    ISNULL(M.indicador_justifica_ausencia, 0) AS flag_falta_justificada,
    ISNULL(M.indicador_descontar_planilla, 0) AS flag_descuenta_sueldo,

    A.observaciones,
    A.usuario AS usuario_registro,
    A.fecha_registro,
    A.situacion_ausencia

FROM c01.ADMAusencia A
-- Cruzamos con la tabla maestra de motivos para traer las descripciones y reglas
LEFT JOIN c01.ADMMotivoAusencia M
    ON A.motivo_ausencia = M.codigo_motivo
    
WHERE A.situacion_ausencia = 'A'; -- Solo traemos inasistencias válidas para descuento
GO

 