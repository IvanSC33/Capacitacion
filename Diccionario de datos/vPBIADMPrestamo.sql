 DROP VIEW [c01].[vPBIADMPrestamo]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMPrestamo]
AS	

 
select
 
 p.codigo_unico
,p.secuencia_prestamo
,p.tipo_prestamo
, desc_tipo_prestamo = (select t.descripcion_tipo_prestamo 
						from c01.ADMPrestamoTipo t
						where t.tipo_prestamo =p.tipo_prestamo
						and t.compania = tr.compania)
, motivo_prestamo
, p.fecha_solicitud
, p.monto_solicitado
, p.situacion_prestamo
, p.tipo_moneda
, p.fecha_aprobado
, p.codigo_inicio_pago
, p.ano_inicio_pago
 ,p.monto_aprobado
,p.monto_descuento_mensual
,p.monto_descuento_gratificacion

 ,	p.cantidad_cuotas
,	p.situacion_registro
,	p.CodigoPrestamo
,	p.fecha_entrega_efectivo
 from  [c01].[ADMPrestamo] p 
 inner join c01.admtrabajador tr on p.codigo_unico= tr.codigo_unico
 
 

 