CREATE VIEW [c01].[vPBIASIReloj] AS
SELECT 
    CodigoCompania,
    IdReloj,
    CodigoReloj,
    Descripcion,
    UbicacionReferencial,
    
    -- Clasificación estratégica basada en tu regla de negocio
    CASE 
        WHEN IdReloj = 1 THEN 'Virtual / Portal Web'
        ELSE 'Dispositivo Físico / Biométrico'
    END AS tipo_marcacion,

    IdEstado,
    CASE 
        WHEN IdEstado = 1 THEN 'Operativo'
        ELSE 'Fuera de Servicio'
    END AS estado_dispositivo,

    SituacionRegistro,
    CASE 
        WHEN SituacionRegistro = 'A' THEN 'Vigente'
        ELSE 'Baja'
    END AS estado_registro

FROM c01.ASIReloj;