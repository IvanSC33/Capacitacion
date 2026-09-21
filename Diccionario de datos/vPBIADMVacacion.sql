 DROP VIEW [c01].[vPBIADMVacacion]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE   VIEW [c01].[vPBIADMVacacion]
AS

select 
 
secuencia_vacaciones
,codigo_unico
,tipo_vacacion
,ejercicio_vacacion
,fecha_inicio_vacacion
,fecha_fin_vacacion
,fecha_solicitud_vacacion

,motivo_vacacion
,nro_de_dias
,nro_solicitud_vacacion
,dias_pendientes
,estado_pago_vacaciones
,indicador_abonado
,usuario
,fecha_registro

,codigo_cia
,ano_pago
,mes_pago
,tipo_adelanto
,dias_tomados

from   c01.ADMVacacion 
 
 
 