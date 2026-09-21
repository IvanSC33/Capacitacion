/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIADMPendienteRetiro]
GO

/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMPendienteRetiro]
AS

select 
 pr.codigo_unico
,pr.secuencia_retiro
,pr.fecha_efectivo_renuncia
,pr.tipo_retiro
, desc_tipo_retiro = mc.descripcion_cese
,equi_sunat =  isnull(mc.equi_sunat,'')  
--,pr.indicador_liquida
,pr.indicador_procesado
,pr.usuario
,pr.fecha_registro_usuario
,pr.observaciones
,pr.pago_boleta
,pr.situacion_registro
from c01.ADMPendienteRetiro pr
LEFT JOIN c01.ADMCeseMotivo mc on pr.tipo_retiro = mc.codigo_cese 