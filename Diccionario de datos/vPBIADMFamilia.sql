/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIADMFamilia]
GO

/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMFamilia]
AS
SELECT 
 F.codigo_unico
,F.tipo_familiar
,des_tipo_familiar = (
						select descripcion_familia from c01.admtipofamilia tf
						where situacion_registro = 'A'
					and tf.tipo_familiar = F.tipo_familiar) 

,F.secuencia_familia
,F.sexo
,F.inscrito_escolaridad
,F.situacion_familia
,tipo_documento = [c01].[ADRWSS_OBT_DES_DETALLE_TAB] (F.tipo_documento, 'R005')
,F.fecha_nacimiento
,f.apellido_paterno
,f.apellido_materno
,f.nombre
,F.fecha_fallecimiento
,F.tipo_baja
,F.fecha_alta
,F.fecha_baja
 ,nacionalidad = (SELECT descripcion_pais FROM c01.PRMNacionalidad WHERE codigo_pais = F.nacionalidad)
 , numero_documento
FROM   c01.ADMFamilia F
       --INNER JOIN c01.ADMTrabajador T ON (T.codigo_unico = F.codigo_unico)
WHERE  F.situacion_registro = 'A'
GO


