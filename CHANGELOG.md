# Changelog

## 1.7.6 (2026-10-24)

- Moved out of aspire-si into its own repository. The package source is byte-identical to aspire-si at `6a603baa`
  (`packages/aspire-si-gates`), so `gates_identity()` reports the same hash as before the move.
- Coverage of this repository's own tests: 68%, floor 68 (target 90). Further gate cases are exercised by aspire-si's
  Stage 1 tests.
