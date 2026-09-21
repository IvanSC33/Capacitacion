# C6-FINAL-01B — Inventario de regresión B–C5

**Fecha de inventario:** 2026-09-19  
**Producto que debe certificarse:** `F:\PortalCapacitacionCodex\ADRYAN_Learning_Functional_Prototype_III5_WORK.html`  
**SHA-256 del producto actual:** `45C457EDEA9FDEAB5975396C4914638F11F2C960361BF7142CA6CF04CBE71127`

## Resultado del inventario inicial

Las seis suites históricas existen, pero **ninguna está validada aún como evidencia de regresión del HTML actual**. No se ejecutaron: varias no son de solo lectura y todas cargan una baseline anterior o un entorno auxiliar generado desde ella, en lugar del producto actual.

En el momento del inventario, el contador oficial era **0/132 certificados**. Esta condición fue resuelta posteriormente mediante el adaptador aislado documentado en `C6_FINAL_01B_REGRESSION_REPORT.md`; el resultado final de 01B es **132/132 PASS**. Este inventario se conserva para mantener trazabilidad de los riesgos originales.

## Inventario

| Bloque | Meta especificada | Suite localizada | SUT cargado | Operaciones de escritura | Sustituciones relevantes | Estado |
|---|---:|---|---|---|---|---|
| B | 21 | `scratch\test_block_b_uts_v3.js` | `F:\PortalCapacitacion\scratch\temp_extracted.js` | Crea `temp_test_env_v3.js` | Sustituye auditoría y fuerza `AuthorizationService.can`, `checkScope` y tenant. Tiene 16 sitios `assert` y 5 ejecuciones de smoke dentro de un helper: 21 verificaciones esperadas. | NOT VALIDATED |
| C1 | 11 | `scratch\test_c1_h.js` | `temp_extracted.js` + HTML pre-C6 | Crea `temp_test_c1_env_h.js` | Sustituye infraestructura de auditoría; no carga HTML actual. | NOT VALIDATED |
| C2 | 19 | `scratch\test_c2.js` | HTML pre-C6 | Crea `temp_test_c2_env.js` | Sustituye infraestructura de auditoría; no carga HTML actual. | NOT VALIDATED |
| C3 | 29 | `scratch\test_c3.js` | `F:\PortalCapacitacion\scratch\temp_test_c3_env.js` | Ninguna directa | Importa un entorno auxiliar generado desde la baseline, no el HTML actual. | NOT VALIDATED |
| C4 | 20 | `scratch\test_c4.js` | HTML pre-C6 | Ninguna directa | Sustituye infraestructura de auditoría; no carga HTML actual. | NOT VALIDATED |
| C5 | 32 | `scratch\test_c5.js` | HTML pre-C6 | Crea `temp_test_c5_env.js` | Fuerza permisos, scope, auditoría y tenant; no puede acreditar controles de seguridad reales. | NOT VALIDATED |

## Evidencia de artefactos históricos

Los auxiliares que condicionan las suites están en `F:\PortalCapacitacion\scratch` y fueron creados el 2026-09-18, antes del producto actual:

- `temp_extracted.js`
- `temp_test_c3_env.js`
- `test_block_b_uts_v3.js`
- `test_c1_h.js`, `test_c2.js`, `test_c3.js`, `test_c4.js`, `test_c5.js`

Las suites de `PortalCapacitacionCodex\scratch` replican ese diseño y siguen apuntando a dichas rutas históricas.

## Criterio para rehabilitar una suite

Antes de ejecutar y contar resultados B–C5, cada suite debe:

1. Cargar el HTML actual por ruta derivada desde el directorio del test, no por una ruta histórica fija.
2. Ejecutarse en VM/memoria sin crear ni sobrescribir archivos temporales.
3. Declarar qué infraestructura se simula y por qué.
4. No sustituir Authorization, TenantContext, AuditRepository, repositorios o servicios cuando sean la lógica que el control pretende verificar.
5. Reportar conteo, PASS/FAIL y el hash del HTML sometido a prueba.

Las suites originales se conservan sin cambios como evidencia histórica. Las adaptaciones deberán ser nuevas revisiones trazables, no una sobrescritura de los archivos cerrados.

## Siguiente paso de 01B

Diseñar una capa de ejecución aislada para las suites B–C5 que satisfaga el criterio anterior. Solo después se ejecutarán contra el HTML actual y, si son confiables, podrán contribuir a la meta de 132/132.
