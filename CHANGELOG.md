# Changelog

All notable changes to this project are recorded here, in the Keep a Changelog format.

## 1.7.6 - first PyPI release (2026-10-29)

- Published to PyPI as `aspire-si-gates` 1.7.6 (trusted publishing, with provenance). Role-set and
  reasoning-dataset-lab depend on it by name instead of by git URL, which PyPI does not allow.
- The package source is unchanged, so `gates_identity()` reports the same hash as before.
- Added: PyPI metadata, `scripts/verify.sh`, a release workflow, a landing page and handbook, translations of the
  README, and a security policy with supported versions and a response timeline.

## 1.7.6 - moved out of aspire-si (2026-10-24)

- Moved out of aspire-si into its own repository. The package source is byte-identical to aspire-si at `6a603baa`
  (`packages/aspire-si-gates`), so `gates_identity()` reports the same hash as before the move.
- Coverage of this repository's own tests: 68%, floor 68 (target 90). Further gate cases are exercised by aspire-si's
  Stage 1 tests.
