IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIASIPermiso]'))
DROP VIEW [c01].[VPBIASIPermiso]
GO

CREATE VIEW [c01].[VPBIASIPermiso] AS
SELECT 
    P.IdPermiso,
    P.CodigoCompania,
    P.CodigoUnico AS CodigoUnico,
    
    -- Eje de Fecha
    CAST(P.FechaInicio AS DATE) AS fecha_inicio_permiso,
    CAST(P.FechaFin AS DATE) AS fecha_fin_permiso,
    
    -- Datos del Motivo
    P.TipoPermiso AS id_tipo_permiso,
    ISNULL(TD.descripcion_registro, 'MOTIVO DESCONOCIDO') AS descripcion_permiso,
    P.Observacion AS sustento_trabajador,

    -- ========================================================================
    -- MODOS DE APLICACIÓN EN EL RELOJ (M, I, S)
    -- ========================================================================
    P.Para AS modo_permiso_raw,
    CASE 
        WHEN P.Para = 'M' THEN 'Día Completo (Ausencia Justificada)'
        WHEN P.Para = 'I' THEN 'Ingreso Retrasado (Tolerancia Extra)'
        WHEN P.Para = 'S' THEN 'Salida Anticipada (Tolerancia Extra)'
        ELSE 'Otro'
    END AS modo_permiso_desc,

    -- ========================================================================
    -- MATEMÁTICA DE LA BOLSA DE TIEMPO (Convertimos HHMM a Minutos Enteros)
    -- Para restar de la tabla de tardanzas.
    -- Ej: '0200' -> (2 * 60) + 0 = 120 minutos de gracia.
    -- ========================================================================
    P.HoraMinuto AS bolsa_tiempo_concedida_raw,
    
    CASE 
        WHEN P.HoraMinuto IS NULL OR P.HoraMinuto = '' THEN 0
        ELSE 
            (CAST(LEFT(RIGHT('0000' + REPLACE(CAST(P.HoraMinuto AS VARCHAR), ':', ''), 4), 2) AS INT) * 60) + 
            CAST(RIGHT(RIGHT('0000' + REPLACE(CAST(P.HoraMinuto AS VARCHAR), ':', ''), 4), 2) AS INT) 
    END AS minutos_gracia_concedidos,

    -- Status General
    P.IdEstadoFlujo,
    P.SituacionRegistro

FROM c01.ASIPermiso P

-- Traemos los nombres de los permisos desde la tabla auxiliar general
LEFT JOIN dbo.PRMTablaDetalle TD
    ON P.TipoPermiso = TD.codigo_registro
    AND TD.codigo_tabla = '0008'

WHERE P.SituacionRegistro = 'A'; -- Traemos solo permisos vigentes/aprobados
GO



 