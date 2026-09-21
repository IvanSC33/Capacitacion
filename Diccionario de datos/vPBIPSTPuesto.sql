 DROP VIEW [c01].[vPBIPSTPuesto]
GO

 SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE or alter VIEW [c01].[vPBIPSTPuesto]
AS
   SELECT 
   pc.compania
  ,pc.puesto
  ,pc.descripcion_puesto
  ,pc.grupo_salarial
  , desc_grupo_salarial = (select descripcion_grupo_salarial 
							from [c01].[PSTGrupoSalarial] gs
							where gs.grupo_salarial= pc.grupo_salarial
							and  gs.situacion_registro = 'A')
  ,ISNULL(pc.grupo_funcional, '') as grupo_funcional  
  ,desc_grupo_funcional = (select descripcion_grupo_funcional 
							from [c01].[PSTGrupoFuncional] gf
							where gf.grupo_funcional = pc.grupo_funcional
							and  gf.situacion_registro = 'A')
  ,ISNULL(pc.grado_salarial, '') as grado_salarial  
	,gs.descripcion_grado_salarial
	,gs.minimo_sueldo_teorico
	,gs.promedio_sueldo_teorico
	,gs.maximo_sueldo_teorico
  ,pc.situacion_registro
   FROM c01.PSTPuestoCompania  pc
  inner join [c01].[PSTGradoSalarial] gs on 
  pc.grado_salarial = gs.grado_salarial
	and   pc.compania = gs.compania
	where pc.situacion_registro = 'A'
 

  