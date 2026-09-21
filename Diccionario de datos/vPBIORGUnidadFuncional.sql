 DROP VIEW [c01].[vPBIORGUnidadFuncional]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


 CREATE or alter VIEW [c01].[vPBIORGUnidadFuncional]
AS
 
 select
		 uf.unidad_funcional
		,uf.nombre_unidad_funcional
		,uf.tipo_unidad_funcional
		,desc_tipo_unidad_funcional = (select descripcion_registro 
										from PRMTablaDetalle
										where codigo_tabla = '0120'
										and codigo_registro = uf.tipo_unidad_funcional ) 
		, matricula_responsable
		, uf.unidad_funcional_superior
		, uf.codigo_ubicacion_fisica
		, f.descripcion_ubicacion_fisica
		, uf.nivel_jerarquico
		, uf.codigo_sucursal
		, s.nombre_sucursal
		, uf.centro_costo
		, cc.descripcion_centro_costo
		, uf.compania
 
from c01.ORGUnidadFuncional uf
inner join [c01].[PRMUbicacionFisica] f on  
uf.codigo_ubicacion_fisica = f.codigo_ubicacion_fisica
and uf.compania = f.compania
inner join [c01].[ADMSucursal] s on uf.codigo_sucursal = s.sucursal
and uf.compania = s.codigo_cia
 inner join c01.ADMCentroCosto cc on cc.centro_costo = uf.centro_costo
 and cc.compania =uf.compania
  where uf.situacion_unidad_funcional = 'A'