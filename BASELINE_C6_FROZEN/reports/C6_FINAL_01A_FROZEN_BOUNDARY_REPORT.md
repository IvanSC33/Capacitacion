# C6-FINAL-01A — Frozen Boundary Review

**Fecha de revisión:** 2026-09-19  
**Alcance:** solo lectura del producto y de las suites existentes.  
**Artefacto actual:** `F:\PortalCapacitacionCodex\ADRYAN_Learning_Functional_Prototype_III5_WORK.html`

## Resultado

**C6-H11: PASS, con limitación de procedencia documentada.**

Se identificó una línea base pre-C6 defendible y el 100 % de sus diferencias con el artefacto actual se relaciona con hallazgos de hardening C6. No se identificaron cambios visuales, rutas nuevas, entidades/colecciones nuevas, dependencias runtime nuevas ni modificaciones ajenas al alcance C6.

El proyecto no dispone de repositorio Git. Por ello, la procedencia no se acredita mediante commits, sino mediante nombre, línea temporal, referencias de las suites históricas y consistencia del diff. Esta limitación debe permanecer en el informe final de QA.

## Identidad y procedencia

| Rol | Ruta | Creación UTC | Última modificación UTC | SHA-256 |
|---|---|---|---|---|
| Baseline pre-C6 | `F:\PortalCapacitacion\ADRYAN_Learning_Functional_Prototype_III5_WORK.html` | 2026-09-18T01:55:14.2229050Z | 2026-09-18T05:51:51.3254035Z | `0DDC68C49915630BA98E45DEEECEDB8D25810CE6DEDF44EF77D4F8F3AFD7A146` |
| Estado C6 actual | `F:\PortalCapacitacionCodex\ADRYAN_Learning_Functional_Prototype_III5_WORK.html` | 2026-09-19T14:40:57.1918875Z | 2026-09-19T16:20:41.2703396Z | `45C457EDEA9FDEAB5975396C4914638F11F2C960361BF7142CA6CF04CBE71127` |

Evidencia de procedencia:

- Ambos archivos comparten el nombre del artefacto de trabajo `III5_WORK`.
- El candidato antecede temporalmente al estado C6 actual.
- Las suites históricas B–C5 de 2026-09-18 referencian directamente la ruta `F:\PortalCapacitacion\ADRYAN_Learning_Functional_Prototype_III5_WORK.html` o artefactos extraídos de ella.
- El diff completo es de un solo archivo: **59 inserciones y 24 eliminaciones**, distribuidas en ocho hunks, todos trazables a C6.

## Método

- Comparación completa con `git diff --no-index`; no se utilizó un repositorio ni se cambió el estado de archivos.
- Verificación `git diff --no-index --check`: sin errores de espacios.
- Cálculo SHA-256 de ambos archivos.
- Ejecución aislada del gate `scratch\test_c6.js` contra el HTML actual: **40 PASS, 0 FAIL, 1 MANUAL (H11)**.

## Matriz de diferencias

Categorías operativas: **C** = funcional/seguridad de dominio; **D** = arquitectura, contrato o integración de dominio.

| # | Ubicación | Cambio observado | Categoría | Controles C6 relacionados | Justificación | Estado |
|---|---|---|---|---|---|---|
| 001 | `ROLE_PERMISSIONS.HRAdmin` | Se añadió `learning.certification.read`. | C | C6-C09, C6-C01 | Permite lectura administrativa dentro del tenant sin ampliar el acceso de Employee/Supervisor. | Justificado |
| 002 | `AuthorizationService.checkScope` | SELF exige identidad exacta; TEAM exige Supervisor y subordinación; ADMIN se limita a HRAdmin/LearningManager; scopes desconocidos se deniegan. | C | C6-B10, B11, C07, C08, C09 | Cierra bypasses de scope y conserva aislamiento de colaboradores. | Justificado |
| 003 | `EnrollmentService.complete` | `Learning.EnrollmentCompleted.payload` incluye `enrollmentId` además de `id`. | D | C6-E02, G07, G08 | Corrige el contrato que consume el handler de certificación. | Justificado |
| 004 | `CertificationService.getById` | Se audita el rechazo cross-tenant y se incorpora scope ADMIN. | C | C6-B05, B13, B15, C01, C09 | Evita exposición cross-tenant y deja evidencia de seguridad. | Justificado |
| 005 | `CertificationService.getForEmployee` | Se exige permiso de lectura y se admite scope ADMIN limitado al tenant. | C | C6-B04, B10, B11, C01, C07–C09 | Refuerza RBAC y scope para lecturas de certificados. | Justificado |
| 006 | `CertificationService.issue` | Valida tenant de requisito/empleado/curso/versión, consistencia curso-versión-requisito y enrollment elegible. | C | C6-B07, B12, C03, C05, D10, F04, G08 | Impide emisión por IDs manipulados o sin elegibilidad real. | Justificado |
| 007 | `CertificationService.getStatus` | Se audita el rechazo cross-tenant y se incorpora scope ADMIN. | C | C6-B14, B15, C09 | Impide la exposición por consulta de estado. | Justificado |
| 008 | `initEventHandlers` y handler `EnrollmentCompleted` | Guard contra suscripciones duplicadas y propagación de `enrollmentId` al comando de emisión. | D | C6-E08, F09, G07, G08, H08 | Evita handlers repetidos y conserva la cadena de eventos hasta la emisión. | Justificado |

## Límites verificados

- Sin cambios en pantallas, rutas o rediseño visual.
- Sin nuevas entidades, colecciones o dependencias runtime.
- Sin cambios no trazables a hallazgos C6 en el diff frente a la baseline seleccionada.
- Las advertencias de Git sobre normalización LF/CRLF no son cambios de archivo; la comprobación de espacios no reportó errores.

## Estado posterior a 01A

| Elemento | Estado |
|---|---|
| Baseline pre-C6 | Seleccionada con confianza alta y limitación de procedencia documentada |
| C6-H11 Frozen Boundary | **PASS** |
| Gate C6 v5 actual | 40 PASS / 0 FAIL / 1 MANUAL ya resuelto por este informe |
| Regresión B–C5 | **PASS 132/132** con adaptador aislado; ver `C6_FINAL_01B_REGRESSION_REPORT.md` |
| C6 92/92 | Pendiente de matriz de cobertura |
| C6 final acceptance | Pendiente |
