# C6-FINAL-01C — Matriz de cobertura 92/92

**SUT:** `F:\PortalCapacitacionCodex\ADRYAN_Learning_Functional_Prototype_III5_WORK.html`  
**SHA-256:** `45C457EDEA9FDEAB5975396C4914638F11F2C960361BF7142CA6CF04CBE71127`  
**Criterio:** un control solo es PASS cuando existe evidencia que demuestre su resultado exacto. Una misma evidencia puede respaldar controles equivalentes, y no se cuentan los resultados B–C5 como cobertura C6 por similitud solamente.

## Resumen de checkpoint 01C.3

| Estado | Controles |
|---|---:|
| PASS con evidencia | 92 |
| PENDING — evidencia faltante | 0 |
| FAIL | 0 |
| NOT EXECUTED | 0 |
| Total especificado | 92 |

Los controles H01–H12 están cubiertos: H11 se acredita mediante `C6_FINAL_01A_FROZEN_BOUNDARY_REPORT.md`; los restantes se ejecutan en `scratch\test_c6.js`. Los controles B–C5 aprobados en regresión son evidencia de no regresión, pero la matriz exige además un mapeo explícito al control C6.

## A — Arquitectura

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-A01 | Player usa ProgressService, no Repository | Dinámico | `test_c6.js` C6-A01 | PASS |
| C6-A02 | Solo ProgressService escribe ActivityProgress | Dinámico | `test_c6.js` C6-A02 | PASS |
| C6-A03 | complete no llama CertificationService directo | Dinámico | `test_c6.js` C6-A03 | PASS |
| C6-A04 | Eligibility no tiene efectos secundarios | Dinámico | `test_c6.js` C6-A04 | PASS |
| C6-A05 | UI de certificados usa CertificationService | Dinámico | `test_c6_remaining.js` C6-A05 | PASS |
| C6-A06 | Assignment no escribe Enrollment directamente | Dinámico | `test_c6.js` C6-A06 | PASS |
| C6-A07 | Repositories no devuelven presentación | Dinámico | `test_c6_remaining.js` C6-A07 | PASS |
| C6-A08 | Renderizadores no escriben repositorios | Dinámico | `test_c6.js` C6-H02 (evidencia equivalente) | PASS |
| C6-A09 | Servicios críticos no están duplicados | Dinámico | `test_c6.js` C6-A09 | PASS |
| C6-A10 | Cadena Player→Certificate sin bypasses | Dinámico | `test_c6_remaining.js` C6-A10 | PASS |

## B — Aislamiento tenant y employee

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-B01 | Courses aislados por tenant | Dinámico | `test_c6.js` C6-B01 | PASS |
| C6-B02 | Enrollments aislados por tenant | Dinámico | `test_c6.js` C6-B02 | PASS |
| C6-B03 | ActivityProgress aislado por tenant | Dinámico | `test_c6.js` C6-B03 | PASS |
| C6-B04 | getForEmployee no expone certs cross-tenant | Dinámico | `test_c6_remaining.js` C6-B04 | PASS |
| C6-B05 | getById cross-tenant denegado | Dinámico | `test_c6.js` C6-B05 | PASS |
| C6-B06 | renew cross-tenant denegado | Dinámico | `test_c6_remaining.js` C6-B06 | PASS |
| C6-B07 | issue ignora tenantId del comando | Dinámico | `test_c6.js` C6-B07 | PASS |
| C6-B08 | Handler ignora evento de tenant ajeno | Dinámico | `test_c6_remaining.js` C6-B08 | PASS |
| C6-B09 | Employee no actualiza progreso ajeno | Dinámico | `test_c6_remaining.js` C6-B09 | PASS |
| C6-B10 | SELF no lee certificados de otro employee | Dinámico | `test_c6.js` C6-B10 | PASS |
| C6-B11 | TEAM lee certificado de subordinado | Dinámico | `test_c6.js` C6-B11 | PASS |
| C6-B12 | Eligibility rechaza tenant mismatch | Dinámico | `test_c6_remaining.js` C6-B12 | PASS |
| C6-B13 | ID conocido no elude tenant | Dinámico | `test_c6.js` C6-B05 (mismo acceso por ID cross-tenant) | PASS |
| C6-B14 | getStatus no expone cross-tenant | Dinámico | `test_c6_remaining.js` C6-B14 | PASS |
| C6-B15 | Rechazo cross-tenant queda auditado | Dinámico | `test_c6.js` C6-B15 | PASS |

## C — Autorización y scope

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-C01 | Sin read se deniega getById | Dinámico | `test_c6.js` C6-C01 | PASS |
| C6-C02 | Sin issue se deniega issue | Dinámico | `test_c6.js` C6-C02 | PASS |
| C6-C03 | isInternal no elude tenant/employee/eligibility | Dinámico | `test_c6.js` C6-C03 | PASS |
| C6-C04 | Sin renew se deniega renew | Dinámico | `test_c6.js` C6-C04 | PASS |
| C6-C05 | isInternal no elude tenant del comando | Dinámico | `test_c6_remaining.js` C6-C05 | PASS |
| C6-C06 | Boundary de mutación de progreso | Dinámico | `test_c6_remaining.js` C6-C06 | PASS |
| C6-C07 | SELF no permite otro employee | Dinámico | `test_c6.js` C6-B10 (evidencia equivalente) | PASS |
| C6-C08 | TEAM permite subordinado | Dinámico | `test_c6.js` C6-B11 (evidencia equivalente) | PASS |
| C6-C09 | ADMIN permite employee del mismo tenant | Dinámico | `test_c6.js` C6-C09 | PASS |
| C6-C10 | Denegación de permiso queda auditada | Dinámico | `test_c6.js` C6-C10 | PASS |

## D — Reglas de dominio

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-D01 | Optional no completa Required | Dinámico | `test_c6_remaining.js` C6-D01 | PASS |
| C6-D02 | Progreso inicial 0% | Dinámico | `test_c6_remaining.js` C6-D02 | PASS |
| C6-D03 | 1/2 Required equivale a 50% | Dinámico | `test_c6_remaining.js` C6-D03 | PASS |
| C6-D04 | Todas Required completadas equivale a 100% | Dinámico | `test_c6.js` C6-D04 | PASS |
| C6-D05 | Completion solo con allRequiredCompleted | Dinámico | `test_c6_remaining.js` C6-D05 | PASS |
| C6-D06 | Activity pertenece a CourseVersion enrollment | Dinámico | `test_c6_remaining.js` C6-D06 | PASS |
| C6-D07 | Certificado conserva CourseVersion correcta | Dinámico | `test_c6_remaining.js` C6-D07 | PASS |
| C6-D08 | Sin Attempt aprobado no hay elegibilidad | Dinámico | `test_c6_remaining.js` C6-D08 | PASS |
| C6-D09 | Evidence no aprobada falla elegibilidad | Dinámico | `test_c6_remaining.js` C6-D09 | PASS |
| C6-D10 | Enrollment Active no emite certificado | Dinámico | `test_c6_remaining.js` C6-D10 | PASS |
| C6-D11 | Renewed prevalece sobre fechas | Dinámico | `test_c6_remaining.js` C6-D11 | PASS |
| C6-D12 | Expiring a 29 días | Dinámico | `test_c6_remaining.js` C6-D12 | PASS |
| C6-D13 | Expired natural | Dinámico | `test_c6_remaining.js` C6-D13 | PASS |
| C6-D14 | renew crea certificado nuevo | Dinámico | `test_c6_remaining.js` C6-D14 | PASS |
| C6-D15 | Vínculos previous/replacement correctos | Dinámico | `test_c6_remaining.js` C6-D15 | PASS |

## E — Eventos

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-E01 | ActivityProgressUpdated después de persistir | Dinámico | `test_c6_remaining.js` C6-E01 | PASS |
| C6-E02 | EnrollmentCompleted después de persistir | Dinámico | `test_c6.js` C6-E02 | PASS |
| C6-E03 | CertificateIssued con payload correcto | Dinámico | `test_c6_remaining.js` C6-E03 | PASS |
| C6-E04 | CertificateRenewed incluye ambos IDs | Dinámico | `test_c6_remaining.js` C6-E04 | PASS |
| C6-E05 | Fallos no publican eventos | Dinámico | `test_c6_remaining.js` C6-E05 | PASS |
| C6-E06 | correlationId recorre la cadena | Dinámico | `test_c6_remaining.js` C6-E06 | PASS |
| C6-E07 | tenantId del evento coincide con sesión | Dinámico | `test_c6_remaining.js` C6-E07 | PASS |
| C6-E08 | Handler idempotente ante evento duplicado | Dinámico | `test_c6_remaining.js` C6-E08 | PASS |
| C6-E09 | CertificateIssued aggregateId = Certificate.id | Dinámico | `test_c6_remaining.js` C6-E09 | PASS |
| C6-E10 | Lecturas no publican eventos | Dinámico | `test_c6_remaining.js` C6-E10 | PASS |

## F — Idempotencia

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-F01 | 100% repetido no duplica ActivityProgress | Dinámico | `test_c6_remaining.js` C6-F01 | PASS |
| C6-F02 | 50→75→100 conserva un solo registro | Dinámico | `test_c6.js` C6-F02 | PASS |
| C6-F03 | EnrollmentService.complete es idempotente | Dinámico | `test_c6_remaining.js` C6-F03 | PASS |
| C6-F04 | issue bloquea certificado Active duplicado | Dinámico | `test_c6.js` C6-F04 | PASS |
| C6-F05 | issue bloquea certificado Expiring duplicado | Dinámico | `test_c6_remaining.js` C6-F05 | PASS |
| C6-F06 | issue permite tras Expired | Dinámico | `test_c6_remaining.js` C6-F06 | PASS |
| C6-F07 | issue permite tras Renewed | Dinámico | `test_c6_remaining.js` C6-F07 | PASS |
| C6-F08 | Segunda renovación del original se bloquea | Dinámico | `test_c6_remaining.js` C6-F08 | PASS |
| C6-F09 | Tres eventos duplicados emiten un solo cert | Dinámico | `test_c6_remaining.js` C6-F09 | PASS |
| C6-F10 | Eligibility repetida sigue siendo pura | Dinámico | `test_c6_remaining.js` C6-F10 | PASS |

## G — End-to-end

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-G01 | Assignment crea Enrollment Active | Dinámico | `test_c6_remaining.js` C6-G01 | PASS |
| C6-G02 | Enrollment usa currentVersionId | Dinámico | `test_c6_remaining.js` C6-G02 | PASS |
| C6-G03 | CourseVersion expone Units y Activities | Dinámico | `test_c6_remaining.js` C6-G03 | PASS |
| C6-G04 | Player recupera progreso existente | Dinámico | `test_c6_remaining.js` C6-G04 | PASS |
| C6-G05 | Player persiste solo en puntos C3 | Dinámico | `test_c6_remaining.js` C6-G05 | PASS |
| C6-G06 | Required completadas devuelve true | Dinámico | `test_c6.js` C6-G06 | PASS |
| C6-G07 | EnrollmentCompleted invoca Eligibility | Dinámico | `test_c6_remaining.js` C6-G07 | PASS |
| C6-G08 | Eligibility PASS emite Active | Dinámico | `test_c6.js` C6-G08 | PASS |
| C6-G09 | Certificaciones muestra certificado real | Dinámico | `test_c6.js` C6-G09 | PASS |
| C6-G10 | Modal muestra Ver Certificado | Dinámico | `test_c6.js` C6-G10 | PASS |

## H — Auditoría estática y frontera

| Control | Descripción resumida | Tipo | Evidencia actual | Estado |
|---|---|---|---|---|
| C6-H01 | No console.log en rutas críticas | Estático | `test_c6.js` C6-H01 | PASS |
| C6-H02 | Renderizadores sin write a Repository | Estático | `test_c6.js` C6-H02 | PASS |
| C6-H03 | Sin alert en servicios/handlers | Estático | `test_c6.js` C6-H03 | PASS |
| C6-H04 | Sin TODO/FIXME crítico | Estático | `test_c6.js` C6-H04 | PASS |
| C6-H05 | Sin tenant hardcodeado en servicios | Estático | `test_c6.js` C6-H05 | PASS |
| C6-H06 | CertificationService no duplicado | Estático | `test_c6.js` C6-H06 | PASS |
| C6-H07 | ProgressService no duplicado | Estático | `test_c6.js` C6-H07 | PASS |
| C6-H08 | Sin listener crítico duplicado | Estático | `test_c6.js` C6-H08 | PASS |
| C6-H09 | Sin OpenBadges ficticio | Estático | `test_c6.js` C6-H09 | PASS |
| C6-H10 | Timers Player con cleanup | Estático | `test_c6.js` C6-H10 | PASS |
| C6-H11 | Frozen Boundary Protection | Manual | `C6_FINAL_01A_FROZEN_BOUNDARY_REPORT.md` | PASS |
| C6-H12 | Sin nuevas dependencias runtime | Estático | `test_c6.js` C6-H12 | PASS |

## Estado tras revalidación

La cobertura C6 está completa en evidencia: **A 10/10, B 15/15, C 10/10, D 15/15, E 10/10, F 10/10, G 10/10 y H 12/12**. La revalidación final de 01C pasó contra el SHA indicado: `test_c6.js` registró **40 PASS, 0 FAIL y H11 manual acreditado por el informe 01A**; `test_c6_remaining.js` registró **48 PASS, 0 FAIL**; y la regresión B–C5 registró **132/132 PASS**.

C6 queda **listo para aceptación final 01D**, que no se ha ejecutado. No se creó baseline, no se fijó/cerró el producto y no se modificó el HTML durante esta etapa.
