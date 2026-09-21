DROP VIEW [c01].[vPBIADMLicenciaMaternidad]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMLicenciaMaternidad]
AS
 
select 
  secuencia_licencia_maternidad
, codigo_unico
, fecha_inicio_pre_natal
, compania
, fecha_parto_real
, fecha_inicio_post_natal
, fecha_reingreso
, fecha_salida_planilla
, fecha_reingreso_planilla
, situacion_licencia
, observacion
, usuario
, fecha_registro_usuario
, situacion_registro
, AnioContingencia
, MesContingencia
, IndMultiple
from c01.ADMLicenciaMaternidad