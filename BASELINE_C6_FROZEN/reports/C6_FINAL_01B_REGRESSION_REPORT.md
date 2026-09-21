# C6-FINAL-01B — Regression Validation B–C5

**Fecha de ejecución consolidada:** 2026-09-19  
**SUT certificado:** `F:\PortalCapacitacionCodex\ADRYAN_Learning_Functional_Prototype_III5_WORK.html`  
**SHA-256 SUT:** `45C457EDEA9FDEAB5975396C4914638F11F2C960361BF7142CA6CF04CBE71127`

## Resultado

**Regression Gate B–C5: PASS — 132/132 controles.**

| Bloque | Controles | Resultado |
|---|---:|---|
| Block B | 21 | PASS |
| C1 | 11 | PASS |
| C2 | 19 | PASS |
| C3 | 29 | PASS |
| C4 | 20 | PASS |
| C5 | 32 | PASS |
| **Total** | **132** | **PASS** |

## Ejecutor validado

`F:\PortalCapacitacionCodex\scratch\c6_final_validation\run_legacy_regression_current.js`

El adaptador carga el HTML actual mediante una ruta relativa a su ubicación, extrae el script de dominio y lo ejecuta en una VM aislada. Cada bloque recibe una instancia nueva de MockDB en memoria. El adaptador no usa `writeFileSync`, no crea entornos temporales y no modifica el HTML ni los archivos históricos de prueba.

Las suites originales permanecen sin cambios en `F:\PortalCapacitacionCodex\scratch`. El adaptador reutiliza en memoria sus cuerpos verificables, de modo que se conserva la semántica y el conteo de controles históricos, pero se elimina la dependencia de los archivos auxiliares pre-C6 identificados durante el inventario.

## Integridad de las pruebas

- El HTML sometido a prueba es el estado C6 actual indicado arriba; no la copia de `F:\PortalCapacitacion` ni `temp_extracted.js`.
- AuthorizationService, TenantContext, AuditRepository, repositorios y servicios de dominio provienen del script actual.
- Block B elimina los overrides históricos de autorización/tenant; sus controles se ejecutan con la sesión real del prototipo.
- C5 sustituye los overrides históricos por roles reales: `LearningManager` para emisión/renovación autorizada y `Employee` para la renovación denegada. El rechazo cross-tenant usa un cambio real de sesión, no un mock de TenantContext.
- C5-17 conserva el objetivo de verificar `HASH_UNAVAILABLE`, pero usa un segundo empleado con enrollment elegible real. La versión histórica usaba una CourseVersion inválida; tras C6, esa entrada debe ser rechazada por la validación de integridad curso-versión y ya no sería un caso válido de emisión.
- C3 recibe únicamente un doble de timer y un stub de `renderApp`, ambos de infraestructura/UI. No sustituyen servicios ni reglas de dominio.
- Los dobles temporales de repositorio que existen dentro de Block B y C5 siguen limitados a pruebas unitarias de cálculo/elegibilidad y se restauran dentro de la misma VM; no sustituyen el servicio sometido a prueba ni persisten fuera de ella.

## Comando de reproducción

```powershell
$runner = 'F:\PortalCapacitacionCodex\scratch\c6_final_validation\run_legacy_regression_current.js'
'B','C1','C2','C3','C4','C5' | ForEach-Object { node $runner $_ }
```

Una ejecución consolidada del 2026-09-19 devolvió código de salida `0` para los seis bloques.

## Estado posterior a 01B

| Elemento | Estado |
|---|---|
| C6-H11 Frozen Boundary | PASS |
| Block B–C5 Regression Gate | **PASS 132/132** |
| C6 v5 parcial | PASS 40/40; H11 evidenciado por 01A |
| Matriz C6 92/92 | Pendiente (C6-FINAL-01C) |
| Acceptance Gate | Pendiente |
| Baseline | No creada |

