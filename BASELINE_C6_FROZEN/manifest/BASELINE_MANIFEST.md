# BASELINE_C6_FROZEN — Manifest

## Propósito

Esta baseline conserva el estado certificado de C6 para reproducción técnica. Es una copia no destructiva: no sustituye, mueve ni renombra los artefactos fuente certificados.

## SUT certificado

| Elemento | Valor |
|---|---|
| Entrada ejecutable | `ADRYAN_Learning_Functional_Prototype_III5_WORK.html` en la raíz de esta baseline |
| SHA-256 certificado | `45C457EDEA9FDEAB5975396C4914638F11F2C960361BF7142CA6CF04CBE71127` |
| Fuente copiada | `F:\PortalCapacitacionCodex\ADRYAN_Learning_Functional_Prototype_III5_WORK.html` |

## Referencias Git

| Referencia | Commit completo |
|---|---|
| SUT post-C6 certificado | `4fb994e54ee1d2e4e5eeee9ac1057549a121d7d1` |
| Evidencia de aceptación 01D | `b6f13024189b6a05a4455e17733141ef20570df0` |

El commit propio de esta baseline se identifica mediante un tag Git posterior. No se registra aquí para evitar una dependencia circular entre el contenido congelado y el commit que lo contiene.

## Topología ejecutable preservada

La disposición se conserva porque los tests calculan sus rutas desde `scratch/`:

```text
BASELINE_C6_FROZEN/
├── ADRYAN_Learning_Functional_Prototype_III5_WORK.html
├── scratch/
│   ├── test_c6.js
│   ├── test_block_b_uts_v3.js
│   ├── test_c1_h.js … test_c5.js
│   └── c6_final_validation/
│       ├── test_c6_remaining.js
│       └── run_legacy_regression_current.js
├── reports/
├── manifest/
└── C6_CLOSURE.md
```

Las seis suites históricas copiadas son exactamente las utilizadas por el adaptador B–C5: Block B, C1, C2, C3, C4 y C5.

## Evidencia documental copiada

- `reports/C6_FINAL_01A_FROZEN_BOUNDARY_REPORT.md`
- `reports/C6_FINAL_01B_REGRESSION_INVENTORY.md`
- `reports/C6_FINAL_01B_REGRESSION_REPORT.md`
- `reports/C6_COVERAGE_MATRIX.md`
- `reports/C6_FINAL_01D_ACCEPTANCE_REPORT.md`

## Integridad criptográfica

`manifest/SHA256SUMS.txt` contiene un hash SHA-256 por cada artefacto de esta baseline, excepto el propio archivo `SHA256SUMS.txt`. No se debe modificar ningún archivo incluido después de generar ese manifiesto; si fuera indispensable, el manifiesto completo debe regenerarse y verificarse de nuevo.

## Reproducción técnica

Desde la raíz de esta baseline:

```powershell
node .\scratch\test_c6.js
node .\scratch\c6_final_validation\test_c6_remaining.js
$runner = '.\scratch\c6_final_validation\run_legacy_regression_current.js'
'B','C1','C2','C3','C4','C5' | ForEach-Object { node $runner $_ }
```

Resultados esperados: C6 base **40 PASS / 0 FAIL** con H11 manual acreditado por 01A; C6 suplementario **48 PASS / 0 FAIL**; regresión B–C5 **132/132 PASS**. Esta ejecución es un **REPRODUCIBILITY CHECK**, no una nueva aceptación C6.

## Preservación Git

La regla de la raíz del repositorio `.gitattributes` aplica `BASELINE_C6_FROZEN/** -text`, con el objetivo de conservar los bytes del baseline en `git add` y `git checkout`. La protección de tag en GitHub es una medida de gobierno recomendada; su ausencia no sustituye ni invalida los hashes criptográficos de esta baseline.
