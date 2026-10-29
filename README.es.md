<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/aspire-si-gates/readme.png" alt="aspire-si-gates: the Stage 1 data gates package" width="400">
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/aspire-si-gates/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/aspire-si-gates/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://pypi.org/project/aspire-si-gates/"><img src="https://img.shields.io/pypi/v/aspire-si-gates" alt="PyPI"></a>
  <a href="https://mcp-tool-shop-org.github.io/aspire-si-gates/"><img src="https://img.shields.io/badge/docs-landing_page-blue" alt="Landing page"></a>
</p>

**Las puertas de datos para los conjuntos de entrenamiento de la etapa 1: un paquete estándar de Python que decide si una fila, un lote o un conjunto fijo de elementos de entrenamiento son adecuados para el entrenamiento.** Tanto el entrenador ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) como el generador de conjuntos de datos ([role-set](https://github.com/mcp-tool-shop-org/role-set)) lo llaman, por lo que lo que acepta un generador es exactamente lo que aceptará el entrenador.

Cada puerta genera o devuelve una razón sobre la que se puede actuar. Nada se corrige en silencio.

## Instalación

```bash
pip install aspire-si-gates
```

Python 3.10 o posterior. Sin dependencias.

## Uso

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

Un generador que desea devolver las denegaciones a su escritor, un elemento a la vez, utiliza las comprobaciones incrementales:

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## Las puertas

| Llamada | Lo que comprueba |
|---|---|
| `validate(rows)` | `check_item` en cada fila, luego `check_batch` en todo el archivo. Genera `DataError` con la primera denegación. |
| `check_item(row)` | Las comprobaciones que no necesitan otra fila. Deniega un elemento de aplicación (`split: apply` o un ID `-AP-`): los elementos de aplicación nunca se entrenan. |
| `check_apply_item(row)` | Las comprobaciones de un elemento de aplicación: las mismas reglas de contenido y forma que `check_item`, más las reglas de aplicación (`split: apply` y un ID `-AP-`, tipo C o D, un turno, sin par, y el campo gemelo de la lección). Deniega cualquier fila que no sea un elemento de aplicación. |
| `check_trace_leaks_label(row)` | Deniega una fila de tipo C cuyo rastreador de comprobación nombra su propio defecto o cualquier defecto fuera de la exclusión de dos pasos. Integrado en `check_batch`. |
| `check_against(row, accepted)` | `[(code, message)]` para las reglas de exclusividad (intervalos, encuadres, material, formas de rompecabezas, aberturas, frases) en comparación con las filas ya aceptadas. Los códigos están en `REASONS`. |
| `check_batch(rows)` | Las comprobaciones que necesitan el conjunto completo: elementos compartidos, límites, pares, límites de frases y fórmulas. |
| `batch_report(rows)`, `freeze_report(rows)` | Las cifras detrás de esas comprobaciones, como diccionarios. |
| `gates_identity()` | La versión del paquete y un sha256 de su código fuente, para registrar con cada elemento generado. |

Los datos del rol de verificador (lecciones, nombres de rasgos, palabras de rol y las lecciones previas a la modificación) están en `constants.py`. Un rol diferente cambia ese módulo, no las comprobaciones. La parte de fuga del conjunto sellado no está aquí; permanece con el entrenador.

## Seguridad y datos

- **Lee:** las filas que se pasan y el archivo que se proporciona a `load`.
- **No toca:** la red, el sistema de archivos más allá de ese archivo, las variables de entorno o los subprocesos. No hay telemetría.
- **Permisos:** ninguno más allá de la lectura de ese archivo.

Informe de una vulnerabilidad de forma privada; consulte [SECURITY.md](SECURITY.md).

## Estado

Versión 1.7.6, publicada por primera vez en PyPI. El código fuente es idéntico al paquete que se encontraba en aspire-si en `6a603baa`, por lo que `gates_identity()` informa del mismo hash que antes del cambio. La cobertura de las pruebas del propio repositorio es del 68%, con un mínimo del 68 (objetivo 90); más casos de puerta se prueban con las pruebas de la etapa 1 de aspire-si.

## Puerta de calidad

Las puertas estrictas (seguridad, errores, documentación, higiene de envío) pasan; consulte [SHIP_GATE.md](SHIP_GATE.md) y [SCORECARD.md](SCORECARD.md).

## Pruebas

```bash
python -m pytest -q
```

O ejecute todo lo que ejecuta la puerta de lanzamiento: `bash scripts/verify.sh`.

## Licencia

MIT, © mcp-tool-shop.

---

Creado por [MCP Tool Shop](https://mcp-tool-shop.github.io/)
