<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

**The data gates for Stage 1 role-training sets: one standard-library Python package that decides whether a row, a
batch or a frozen set of training items is fit to train on.** The trainer ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si))
and the dataset generator ([role-set](https://github.com/mcp-tool-shop-org/role-set)) both call it, so what a generator
accepts is exactly what the trainer will accept.

Every gate raises or returns a reason you can act on. Nothing is fixed silently.

## Install

```bash
pip install aspire-si-gates
```

Python 3.10 or newer. No dependencies.

## Use

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

A generator that wants to hand refusals back to its writer one item at a time uses the incremental checks instead:

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## The gates

| Call | What it checks |
|---|---|
| `validate(rows)` | `check_item` on every row, then `check_batch` on the whole file. Raises `DataError` with the first refusal. |
| `check_item(row)` | The checks that need no other row. It refuses an apply item (`split: apply` or an `-AP-` id): apply items are never trained. |
| `check_apply_item(row)` | An apply item's checks: the same content and shape rules as `check_item`, plus the apply rules (`split: apply` and an `-AP-` id, kind C or D, one turn, no pair, and the lesson's twin field). Refuses any row that is not an apply item. |
| `check_trace_leaks_label(row)` | Refuses a kind C row whose checker trace names its own planted flaw, or any flaw stem outside the two-step carve-out. Wired into `check_batch`. |
| `check_against(row, accepted)` | `[(code, message)]` for the exclusivity rules (spans, framings, material, puzzle shapes, openings, phrases) against rows already accepted. The codes are in `REASONS`. |
| `check_batch(rows)` | The checks that need the finished set: shares, floors, pairs, phrase and formula limits. |
| `batch_report(rows)`, `freeze_report(rows)` | The figures behind those checks, as dicts. |
| `gates_identity()` | The package version and a sha256 of its source, to record with each generated item. |

The verifier role's data (lessons, trait names, role words and the pre-amendment lessons) is in `constants.py`. A
different role changes that module, not the checks. The sealed-set leakage leg is not here; it stays with the trainer.

## Security and data

- **Reads:** the rows you pass in, and the file you give to `load`.
- **Does not touch:** the network, the file system beyond that one file, environment variables, or subprocesses. No
  telemetry.
- **Permissions:** none beyond reading that file.

Report a vulnerability privately; see [SECURITY.md](SECURITY.md).

## Status

Version 1.7.6, first published to PyPI. The source is byte-identical to the package that lived in aspire-si at
`6a603baa`, so `gates_identity()` reports the same hash as before the move. Coverage of this repository's own tests is
68% with the floor at 68 (target 90); more gate cases are exercised by aspire-si's Stage 1 tests.

## Quality gate

The hard gates (security, errors, docs, shipping hygiene) pass; see [SHIP_GATE.md](SHIP_GATE.md) and [SCORECARD.md](SCORECARD.md).

## Tests

```bash
python -m pytest -q
```

Or run everything the release gate runs: `bash scripts/verify.sh`.

## License

MIT, © mcp-tool-shop.

---

Built by [MCP Tool Shop](https://mcp-tool-shop.github.io/)
