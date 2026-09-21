	
	/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIADMExperienciaCorporacion]
GO

/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIADMExperienciaCorporacion]
AS
	SELECT  
		T.codigo_unico
	    ,unidad_antes = ISNULL((SELECT
				u.nombre_unidad_funcional
			FROM c01.ORGUnidadFuncional u
			WHERE u.unidad_funcional = E.unidad_funcional_organica
			AND u.compania = T.compania)
		, '')
 
	   ,unidad_ahora = ISNULL((SELECT
				u.nombre_unidad_funcional
			FROM c01.ORGUnidadFuncional u
			WHERE u.unidad_funcional = E.unidad_funcional_organica_new
			AND u.compania = T.compania)
		, '')
  	   ,puesto_antes = ISNULL((SELECT
				p.descripcion_puesto
			FROM c01.PSTPuestoCompania p
			WHERE p.puesto = E.puesto_desempenado
			AND p.compania = T.compania)
		, '')
 
	   ,puesto_ahora = ISNULL((SELECT
				p.descripcion_puesto
			FROM c01.PSTPuestoCompania p
			WHERE p.puesto = E.puesto_desempenado_new
			AND p.compania = T.compania)
		, '')
 	   ,categoria_antes = ISNULL
		((SELECT
				c.categoria
			FROM c01.ADMCategoriaJerarquica c
			WHERE c.codigo = E.categoria_jerarquica
			AND c.compania = T.compania)
		, '')
  	   ,categoria_ahora = ISNULL((SELECT
				c.categoria
			FROM c01.ADMCategoriaJerarquica c

			WHERE c.codigo = E.categoria_jerarquica_new
			AND c.compania = T.compania)
		, '')
 	   ,E.fecha_inicio
	   ,E.fecha_termino
	   
	   ,ubicacion_antes = ISNULL((SELECT
				k.descripcion_ubicacion_fisica
			FROM c01.PRMUbicacionFisica k
			WHERE k.codigo_ubicacion_fisica = E.ubicacion_fisica
			AND k.compania = T.compania)
		, '')
 	   ,ubicacion_ahora = ISNULL((SELECT
				k.descripcion_ubicacion_fisica
			FROM c01.PRMUbicacionFisica k
			WHERE k.codigo_ubicacion_fisica = E.ubicacion_fisica_new
			AND k.compania = T.compania)
		, '')
 
	   ,sucursal_antes = ISNULL((SELECT
				su.nombre_sucursal
			FROM c01.ADMSucursal su
			WHERE su.sucursal = E.Sucursal
			AND su.codigo_cia = T.compania)
		, '')
 
	   ,sucursal_ahora = ISNULL((SELECT
				su.nombre_sucursal
			FROM c01.ADMSucursal su
			WHERE su.sucursal = E.Sucursal_new
			AND su.codigo_cia = T.compania)
		, '')
  
 ,e.fecha_registro
,e.tipo_cambio --- cuando es 6 es cambio de tipo de trabajador 
----- revisar uspADMCambioTipoTrabajadorUpd 
 
	FROM c01.ADMTrabajador T
 	INNER JOIN c01.ADMExperienciaCorporacion E
		ON T.compania = E.codigo_cia
			AND T.codigo_unico = E.codigo_unico
	 
	 	
  