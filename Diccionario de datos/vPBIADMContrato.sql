/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIADMContrato]
GO

/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMContrato]
AS
 

select 
 
 codigo_unico
,numero_contrato
,compania
,secuencia_contrato
,tipo_contrato
,desc_tipo_contrato = (SELECT
				descripcion_contrato
			FROM c01.ADMTipoContrato
			WHERE compania = c.compania
			AND tipo_contrato = c.tipo_contrato)
,fecha_inicio
,fecha_termino
,situacion_contrato
,indicador_indeterminado
from c01.ADMContrato c
