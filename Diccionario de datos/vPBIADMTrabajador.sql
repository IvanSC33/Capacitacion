/****** Object:  View [c01].[vADMTrabajador]    Script Date: 21/02/2026 10:39:22 a. m. ******/
DROP VIEW [c01].[vPBIADMTrabajador]
GO

/****** Object:  View [c01].[vADMTrabajador]    Script Date: 21/02/2026 10:39:22 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE or alter  VIEW [c01].[vPBIADMTrabajador]
AS
SELECT
	codigo_unico
   ,matricula
   ,sexo /* 1 Masculino, 2 Fememino */
   ,estado_civil = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.estado_civil, 'R008')
   ,nacionalidad = (SELECT
			descripcion_pais
		FROM c01.PRMNacionalidad
		WHERE codigo_pais = tr.nacionalidad)
   ,tipo_documento = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.tipo_documento, 'R005')
   , apellido_paterno , apellido_materno, nombre
   , numero_documento
      ,fecha_nacimiento
   ,pais_nacimiento = (SELECT
			descripcion_pais
		FROM c01.PRMNacionalidad
		WHERE codigo_pais = tr.pais_nacimiento)
   ,fecha_ingreso_coorporacion
   ,fecha_ingreso_compania
   ,tipo_contrato = (SELECT
			descripcion_contrato
		FROM c01.ADMTipoContrato
		WHERE compania = tr.compania
		AND tipo_contrato = tr.tipo_contrato)
   ,TIPO_CONTRATO_CODIGO = tr.tipo_contrato
   ,tipo_trabajador = (SELECT
			descripcion_corta_tipo_trab
		FROM c01.ADMTipoTrabajador
		WHERE tipo_trabajador = tr.tipo_trabajador
		AND compania = tr.compania)
   ,indicador_planilla /* 0 No, 1 Si */
   ,categoria_jerarquica = (SELECT
			descripcion
		FROM c01.ADMCategoriaJerarquica
		WHERE compania = tr.compania
		AND codigo = tr.categoria_jerarquica)
   ,unidad_funcional_organica = (SELECT
			NOMBRE_UNIDAD_FUNCIONAL
		FROM c01.ORGUnidadFuncional
		WHERE unidad_funcional = tr.unidad_funcional_organica
		AND compania = tr.COMPANIA)
   ,ubicacion_fisica = (SELECT
			descripcion_ubicacion_fisica
		FROM c01.PRMUbicacionFisica
		WHERE COMPANIA = tr.COMPANIA
		AND codigo_ubicacion_fisica = tr.ubicacion_fisica)
   ,puesto_organica = (SELECT
			descripcion_puesto
		FROM c01.PSTPuestoCompania
		WHERE COMPANIA = tr.COMPANIA
		AND PUESTO = tr.puesto_organica)

   ,grado_salarial_organica = (SELECT
			descripcion_grado_salarial
		FROM c01.PSTGradoSalarial
		WHERE grado_salarial = tr.grado_salarial_organica
		AND compania = '01')
   ,sucursal = (SELECT
			nombre_sucursal
		FROM c01.ADMSucursal
		WHERE sucursal = tr.sucursal
		AND codigo_cia = '01')
   ,indicador_personal_direccion = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.indicador_personal_direccion, '0116')

   ,codigo_banco_abono =
	ISNULL((SELECT TOP 1
			RTRIM(f1.descripcion_larga)
		FROM c01.ADMCuentaAbono a
		INNER JOIN c01.PRMEntidadFinanciera f1
			ON f1.codigo_entidad = a.banco_propietario
		WHERE a.codigo_unico = tr.codigo_unico
		AND a.tipo_abono = '2'
		AND a.situacion = 'A')
	, '')


   ,tipo_cuenta_abono =
	ISNULL((SELECT TOP 1
			RTRIM([c01].[ADRWSS_OBT_DES_DETALLE_TAB](a.tipo_cuenta_abono, '0031'))
		FROM c01.ADMCuentaAbono a
		WHERE a.codigo_unico = tr.codigo_unico
		AND a.tipo_abono = '2'
		AND a.situacion = 'A')
	, '')


	----,moneda_cuenta_abono /* S de Soles, D de Dolares*/
   ,moneda_cuenta_abono =
	ISNULL((SELECT TOP 1
			RTRIM(a.moneda)
		FROM c01.ADMCuentaAbono a
		WHERE a.codigo_unico = tr.codigo_unico
		AND a.tipo_abono = '2'
		AND a.situacion = 'A')
	, '')


   ,tipo_remuneracion = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.tipo_remuneracion, '0107')
   ,sueldo_basico
   ,tipo_moneda /* S de Soles, D de Dolares*/
   ,regimen_salarial  /* 14por  14 sueldos, 12 por 12 sueldos*/
   ,asignacion_conyuge /* 0 No, 1 Si*/
   ,indicador_inscrito_AFP  /* 0 No, 1 Si*/
   ,codigo_afp
   ,fecha_ingreso_afp
   ,tipo_cuenta_cts =
	ISNULL((SELECT TOP 1
			RTRIM([c01].[ADRWSS_OBT_DES_DETALLE_TAB](a.tipo_cuenta_abono, '0031'))
		FROM c01.ADMCuentaAbono a
		WHERE a.codigo_unico = tr.codigo_unico
		AND a.tipo_abono = '2'
		AND a.situacion = 'A')
	, '')

   ,indicador_inscrito_IPSS  /* 0 No, 1 Si*/
   ,inscrito_seguro_vida /* 0 No, 1 Si*/
   ,inscrito_ley_4916 /* 0 No, 1 Si*/
   ,indicador_sctr /* 0 No, 1 Si*/

   ,departamento_domicilio = (SELECT
			descripcion_departamento
		FROM c01.PRMDepartamento
		WHERE departamento = tr.departamento_domicilio)
   ,provincia_domicilio = (SELECT
			descripcion_provincia
		FROM c01.PRMProvincia
		WHERE departamento = tr.departamento_domicilio
		AND provincia = tr.provincia_domicilio)
   ,distrito_domicilio = (SELECT
			descripcion_distrito
		FROM c01.PRMDistrito
		WHERE departamento = tr.departamento_domicilio
		AND provincia = tr.provincia_domicilio
		AND distrito = tr.distrito_domicilio)
   ,tipo_trabajador_sunat = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.tipo_trabajador_sunat, 'R011')

   ,nivel_educativo = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.nivel_educativo, 'R009')  /* segun tabla detalle R009*/
   ,periodicidad_remuneracion = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.periodicidad_remuneracion, 'R014') /* segun tabla detalle R014*/
   ,modalidad_de_pago = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.modalidad_de_pago, 'R026') /* segun tabla detalle R026*/
   ,sindicalizado /* 0 No, 1 Si*/
   ,control_inmediato /* 0 No, 1 Si*/
   ,discapacidad  /* 0 No, 1 Si*/
   ,regimen_laboral = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.regimen_laboral, 'R029')  /* segun tabla detalle R029*/
   ,ruc_eps = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.ruc_eps, 'R016') /* segun tabla detalle R016*/
   ,tipo_sctr_salud = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.tipo_sctr_salud, 'R037') /* segun tabla detalle R037*/
   ,tipo_sctr_pension = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.tipo_sctr_pension, 'R038') /* segun tabla detalle R038*/
   ,categoria_trabajador = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.categoria_trabajador, 'R028') /* segun tabla detalle R028*/
   ,situacion_trabajador
  , FECHA_RETIRO
   ,indicador_comision_mixta /* 0 No, 1 Si*/
   ,indicador_personal_confianza = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.indicador_personal_confianza, '0110') /* segun tabla detalle 0110*/
   ,esquema_vacacional = [c01].[ADRWSS_OBT_DES_DETALLE_TAB](tr.esquema_vacacional, '0531') /* segun tabla detalle 0531*/

   ,indicador_jubilado = ISNULL(indicador_jubilado, 0)
   ,circulo_funcionario /* 0 No, 1 Si*/


	--,CONVERT(char(10),fecha_inicio_sistema_afp, 103 ) 
   ,fecha_inicio_sistema_afp
	/*,fecha_inicio_sistema_afp = (
								CASE 
								WHEN isnull(fecha_inicio_sistema_afp, 0) = 0 then '01/01/2000'
								else
								CONVERT(char(10),fecha_inicio_sistema_afp, 103 ) 
								end 
								) */
   ,compania

   ,centro_costo =
	CASE
		WHEN ISNULL(c01.usfADMCentroCostoObtener(tr.compania, tr.codigo_unico, tr.unidad_funcional_organica, 'C', 'S'), '0') = '0' THEN c01.usfADMCentroCostoObtener(tr.compania, tr.codigo_unico, tr.unidad_funcional_organica, 'C', 'N')
		ELSE c01.usfADMCentroCostoObtener(tr.compania, tr.codigo_unico, tr.unidad_funcional_organica, 'C', 'S')
	END

   ,nombre_Centro_costo =
	CASE
		WHEN ISNULL(c01.usfADMCentroCostoObtener(tr.compania, tr.codigo_unico, tr.unidad_funcional_organica, 'D', 'S'), '0') = '0' THEN c01.usfADMCentroCostoObtener(tr.compania, tr.codigo_unico, tr.unidad_funcional_organica, 'D', 'N')
		ELSE c01.usfADMCentroCostoObtener(tr.compania, tr.codigo_unico, tr.unidad_funcional_organica, 'D', 'S')
	END
   ,departamento = c01.UsfTraeDptoUsil(tr.unidad_funcional_organica, tr.compania)
   ,area = c01.UsfTraeAreaUsil(tr.unidad_funcional_organica, tr.compania)
   ,seccion = c01.UsfTraeSeccionUsil(tr.unidad_funcional_organica, tr.compania)
   ,tr.ProcesarAsistencia AS procesar_asistencia
   ,banco_envio_abono_CTS =
		ISNULL((SELECT TOP 1
			RTRIM(f1.descripcion_larga)
		FROM c01.ADMCuentaAbono a
		INNER JOIN c01.PRMEntidadFinanciera f1
			ON f1.codigo_entidad = a.banco_abono
		WHERE a.codigo_unico = tr.codigo_unico
		AND a.tipo_abono = '1'
		AND a.situacion = 'A')
	, '')
  ,banco_abono_CTS =
		ISNULL((SELECT TOP 1
			RTRIM(f1.descripcion_larga)
		FROM c01.ADMCuentaAbono a
		INNER JOIN c01.PRMEntidadFinanciera f1
			ON f1.codigo_entidad = a.banco_propietario
		WHERE a.codigo_unico = tr.codigo_unico
		AND a.tipo_abono = '1'
		AND a.situacion = 'A')
	, '')

   ,tr.puesto_organica AS cod_puesto
   ,tr.unidad_funcional_organica AS cod_organizacion
   ,tr.sucursal AS cod_sucursal
   ,tr.ubicacion_fisica AS cod_ubicacion
   ,tr.tipo_trabajador AS cod_tipo_trabajador
   ,tr.grado_salarial_organica AS cod_grado_salarial
   ,tr.categoria_jerarquica AS cod_categoria_jerarquica
   ,tr.codigo_institucion
   ,tr.modalidad_trabajo
   ,tr.indicador_domicilio_propio
 
FROM c01.ADMTrabajador tr
WHERE (tr.indicador_planilla = '1' OR tr.situacion_trabajador = 'P') --and tr.compania = '03'
GO
