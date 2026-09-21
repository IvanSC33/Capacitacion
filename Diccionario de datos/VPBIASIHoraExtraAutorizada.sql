IF EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[c01].[VPBIASIHoraExtraAutorizada]'))
DROP VIEW [c01].[VPBIASIHoraExtraAutorizada]
GO
 
CREATE OR ALTER VIEW [c01].[VPBIASIHoraExtraAutorizada] AS
SELECT 
    HA.IdAutorizacion,
    HA.CodigoUnico AS codigo_unico,
    TR.compania AS codigo_compania, 
    
    -- Ejes de Fecha Puros
    CAST(HA.FechaInicio AS DATE) AS fecha_inicio_autorizacion,
    CAST(HA.FechaFin AS DATE) AS fecha_fin_autorizacion,

    -- ========================================================================
    -- CLASIFICACIÓN Y NATURALEZA
    -- ========================================================================
    CASE 
        WHEN HA.Tipo = 'I' THEN 'Previo al Turno (Ingreso)'
        WHEN HA.Tipo = 'S' THEN 'Posterior al Turno (Salida)'
        WHEN HA.Tipo = 'O' THEN 'Día Libre / Feriado'
        ELSE 'No Definido' 
    END AS momento_hora_extra,

    CASE 
        WHEN HA.Destino = 1 THEN 'Banco de Horas (Compensación)'
        WHEN HA.Destino = 2 THEN 'Planilla (Pago Dinero)'
        ELSE 'No Definido' 
    END AS modalidad_pago,

    -- ========================================================================
    -- BLINDAJE MATEMÁTICO (Del Código Nuevo): Tratar todo como MINUTOS reales
    -- ========================================================================
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HA.Minutos AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HA.Minutos AS INT), 0) % 60 AS VARCHAR), 2) AS tiempo_aprobado_txt,
    ISNULL(TRY_CAST(HA.Minutos AS INT), 0) AS tope_aprobado_minutos,
    ISNULL(TRY_CAST(HA.Minutos AS INT), 0) / 60.0 AS tope_aprobado_centesimal,

    RIGHT('00' + CAST(ISNULL(TRY_CAST(HA.HorasPagadas AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HA.HorasPagadas AS INT), 0) % 60 AS VARCHAR), 2) AS ejecutado_pagado_txt,
    ISNULL(TRY_CAST(HA.HorasPagadas AS INT), 0) AS ejecutado_pagado_minutos,
    ISNULL(TRY_CAST(HA.HorasPagadas AS INT), 0) / 60.0 AS ejecutado_pagado_centesimal,
    
    RIGHT('00' + CAST(ISNULL(TRY_CAST(HA.HorasCompensadas AS INT), 0) / 60 AS VARCHAR), 2) + ':' + RIGHT('00' + CAST(ISNULL(TRY_CAST(HA.HorasCompensadas AS INT), 0) % 60 AS VARCHAR), 2) AS ejecutado_compensado_txt,
    ISNULL(TRY_CAST(HA.HorasCompensadas AS INT), 0) AS ejecutado_compensado_minutos,
    ISNULL(TRY_CAST(HA.HorasCompensadas AS INT), 0) / 60.0 AS ejecutado_compensado_centesimal,

    -- ========================================================================
    -- AUDITORÍA Y ESTADOS (Del Código Antiguo): CRUCE SEGURO CON WORKFLOW
    -- ========================================================================
    HA.Observacion AS sustento_jefatura, 
    HA.IdEstadoFlujo,
    ISNULL(FE.Descripcion, 'ESTADO DESCONOCIDO') AS estado_aprobacion, 
    HA.SituacionRegistro

FROM C01.ASIHoraExtraAutorizada HA

-- 1. Encontramos la compañía del trabajador
LEFT JOIN c01.admtrabajador TR 
    ON HA.CodigoUnico = TR.codigo_unico

-- 2. Buscamos el ID de Proceso Exacto (RESTAURO FILTROS DEL CÓDIGO ANTIGUO)
LEFT JOIN c01.FLTProceso FP 
    ON FP.CodigoCompania = TR.compania
    AND FP.IdAplicacion = 4      -- Módulo de Asistencia
    AND FP.IdOpcion = 4016       -- Opción específica: Horas Extras
    AND FP.IdSubOpcion = '0001'  
    AND FP.IndicadorRegistro = 'A'

-- 3. Cruzamos el Estado de forma segura (RESTAURO CRUCE DEL CÓDIGO ANTIGUO)
LEFT JOIN C01.FLTEstado FE 
    ON HA.IdEstadoFlujo = FE.EstadoAsignado
    AND FE.IdProceso = FP.IdProceso

-- 4. RESTAURO FILTRO DE ACTIVOS
WHERE HA.SituacionRegistro = 'A';
GO

---select * from c01.VPBIASIHoraExtraAutorizada