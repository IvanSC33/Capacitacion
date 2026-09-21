 
 
 /****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
DROP VIEW [c01].[vPBIPlaneamientoPuesto]
GO

/****** Object:  View [c01].[vADMFamilia]    Script Date: 21/02/2026 06:17:46 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

 
CREATE or alter VIEW [c01].[vPBIPlaneamientoPuesto]
AS
 

 select puesto, unidad_funcional,  personal_teorico , personal_real , compania
 from c01.ORGPlaneamientoPuesto
 where situacion_registro = 'A'


 
