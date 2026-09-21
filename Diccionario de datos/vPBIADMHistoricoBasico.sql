                                                       
 /****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIADMHistoricoBasico]
GO

/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMHistoricoBasico]
AS
 

select 
 
 hb.codigo_unico
,hb.secuencia_basico
,hb.codigo_compania
,hb.fecha_aumento
,hb.motivo_aumento
,desc_motivo_aumento = (select descripcion_registro
					from PRMTablaDetalle 
						where codigo_tabla = '0010'
						and codigo_registro = hb.motivo_aumento)
,hb.monto_aumento
,hb.porcentaje_aumento
,hb.nuevo_basico
,hb.periodo_planilla
,hb.ano_planilla
,hb.indicador_procesado_planilla
,hb.indicador_planilla_del_periodo
,hb.usuario
,hb.fecha_registro_usuario
,hb.situacion_registro
from c01.ADMHistoricoBasico hb
 