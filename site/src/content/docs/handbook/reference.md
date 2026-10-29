---
title: Reference
description: Public calls, row fields and reason codes.
sidebar:
  order: 3
---

## Calls

| Call | What it does |
|---|---|
| `validate(rows)` | `check_item` on every row, then `check_batch`. Raises `DataError`. |
| `check_item(row)` | Row checks that need no other row; refuses an apply item. |
| `check_apply_item(row)` | An apply item's checks; refuses any row that is not an apply item. |
| `check_trace_leaks_label(row)` | Refuses a kind C row whose trace names its own planted flaw. |
| `check_against(row, accepted)` | `[(code, message)]` for the exclusivity rules against accepted rows. |
| `check_batch(rows)` | Whole-set checks: shares, floors, pairs, phrase and formula limits. |
| `batch_report(rows)`, `freeze_report(rows)` | The figures, as dicts. |
| `load(path)` | One JSON object per line, as a list of dicts. |
| `gates_identity()` | `{"version", "sha256"}` of the package source. |

## `DataError`

A `ValueError` with three attributes: `code`, `message` and `hint`. `code` and `hint` can be `None`.

## Row fields

Every row carries these fields, with these types:

| Field | Type |
|---|---|
| `id` | string |
| `lesson` | string |
| `trait` | string |
| `kind` | string, one of A, B, C, D, E |
| `side` | string |
| `content_kind` | string |
| `tier` | integer |
| `turns` | list |
| `sources` | list |
| `invented` | boolean |
| `key_basis` | string |

A verdict is one of `supported`, `unsupported` or `cannot_tell`.

## Reason codes from `check_against`

| Code | Meaning |
|---|---|
| `DUPLICATE_ID` | The id is already used. |
| `SPAN_REUSED` | The wording is already in 2 items of this trait. |
| `FRAMING_REUSED` | The framing is already used. |
| `MATERIAL_REUSED` | The material is already used. |
| `PUZZLE_SHAPE_REUSED` | This trait already has a puzzle of this shape. |
| `PUZZLE_SHAPE_BATCH` | Two puzzles in this batch share a shape. |
| `OPENING_REUSED` | The opening already opens 2 items of this trait. |
| `B_PHRASE_REUSED` | The phrase is already in 2 kind B items of this trait. |
| `TRACE_REUSED` | The wording comes from a stored model trace; item text is never drawn from traces. |

## Lessons

The verifier role has the lessons `L1`, `L2`, `L3` and `T01` to `T18`. `T04`, `T01`, `T14` and `T16` were written before
the quoting amendment and are exempt by name from the whole-row, version-heading and multi-line-share checks.
