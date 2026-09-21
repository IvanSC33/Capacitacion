 DROP VIEW [c01].[vPBIADMPrestamoPlanPago]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMPrestamoPlanPago]
AS

SELECT
  
	codigo_unico,
	secuencia_tipo_prestamo,
	ano_periodo,
	codigo_periodo,
	numero_cuota,
	tipo_prestamo,
	secuencia_prestamo,
	indicador_pago,
	situacion_plan_pago,
	usuario,
	fecha_registro_usuario,
	saldo_prestamo,
	monto_amortizacion,
	isnull(amortizacion_extraordinaria,'') as amortizacion_extraordinaria,
	monto_descuento_mensual,
	monto_descuento_gratificacion,
 	isnull(situacion_registro,'') as situacion_registro
 	from c01.ADMPrestamoPlanPago
 