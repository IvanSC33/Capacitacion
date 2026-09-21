  
 DROP VIEW [c01].[vPBIadmlicencia]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

 
CREATE or alter VIEW [c01].[vPBIadmlicencia]
AS
 
 select 
   lic.codigo_unico
, lic.compania
, lic.fecha_inicio
, lic.fecha_termino
, lic.secuencia_licencia
, lic.tipo_licencia
 , des_tipo_licencia = (  select  descripcion_registro from  PRMTablaDetalle
							 where codigo_tabla = '0047'
							 and codigo_registro =lic.tipo_licencia )
 , lic.comentario as Observaciones
,lic.situacion_licencia
,lic.usuario
,lic.fecha_registro_usuario
,lic.numero_citt
,lic.tipo_dias_no_laborados
, desc_tipo_dias_no_laborados =  ( select  descripcion_registro from  PRMTablaDetalle
							 where codigo_tabla = 'R032'
							 and codigo_registro =lic.tipo_dias_no_laborados)
  , indicador_subsidio
  , ano_pago
,mes_pago
,situacion_registro
 
,lic.AnioContingencia
,lic.MesContingencia
 from c01.admlicencia lic
 
 
                                                              
 