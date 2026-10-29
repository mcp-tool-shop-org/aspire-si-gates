# Scorecard

**Repo:** aspire-si-gates
**Date:** 2026-10-29
**Type tags:** `[pypi]` library, no CLI, no server, no dependencies

## Pre-Remediation Assessment

| Category | Score | Notes |
|----------|-------|-------|
| A. Security | 6/10 | SECURITY.md existed with a contact only; no supported versions, no timeline, no threat model in the README |
| B. Error Handling | 8/10 | `DataError` already carries `code`, `message`, `hint` |
| C. Operator Docs | 4/10 | A 42-line README, an 8-line CHANGELOG, no handbook, no PyPI install line |
| D. Shipping Hygiene | 3/10 | No verify script, no release workflow, no dependency scan in CI, no PyPI metadata |
| E. Identity (soft) | 0/10 | No logo, translations, landing page or repo topics |
| **Overall** | **21/50** | |

## Key Gaps

1. Not on PyPI, so the packages that depend on it could not be published (PyPI refuses git-URL dependencies).
2. No release workflow, and no verify script.
3. No public surface beyond a short README.

## Post-Remediation

Hard gates A to D pass (`shipcheck security-docs`, `manifest`, `ci`, `deps`; items that do not apply to a library are
marked `SKIP:` with the reason in SHIP_GATE.md). Section E is done: brand logo, README translations, landing page and
handbook, repository metadata.

| Category | Score |
|----------|-------|
| A. Security | 10/10 |
| B. Error Handling | 10/10 |
| C. Operator Docs | 10/10 |
| D. Shipping Hygiene | 10/10 |
| E. Identity (soft) | 10/10 |
| **Overall** | **50/50** |

Coverage of the repository's own tests is 68% with the floor at 68 (target 90). The score covers the shipcheck items;
the coverage target is separate.
