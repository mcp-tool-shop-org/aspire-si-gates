---
title: Usage
description: Gating a whole file, a single item, and an item against rows already accepted.
sidebar:
  order: 2
---

## A whole file: `validate`

`validate(rows)` is the check to run before training. It is `check_item` on every row, then `check_batch` on the
finished set, so it covers both the checks that need no other row and the ones that need the whole set (shares,
floors, pairs, phrase and formula limits).

## One item: `check_item`

`check_item(row)` runs the checks that need no other row and raises `DataError` on the first refusal. It also refuses an
apply item (`split: apply`, or an id with `-AP-`), because apply items are never trained.

An apply item has its own check, `check_apply_item(row)`. It applies the same content and shape checks without the
never-trained refusal, plus the apply rules, and it refuses any row that is not an apply item.

## One item against the accepted rows: `check_against`

A generator that wants to hand a refusal back to its writer uses `check_against(row, accepted)`. It returns a list of
`(code, message)` pairs, one example per code, in a fixed order. An empty list means the row may be accepted. Run
`check_item` on the row as well.

```python
from aspire_si_gates import check_against, check_item

check_item(row)
for code, message in check_against(row, accepted_rows):
    print(code, message)   # hand the message back to the writer as it is
```

The codes never change. A message changes only on purpose, and a test pins the table.

## The figures behind the checks

`batch_report(rows)` and `freeze_report(rows)` return the figures as dicts, so a generator or a reviewer can read the
shares and counts a gate used.

## Trace leaks

`check_trace_leaks_label(row)` refuses a kind C row whose checker trace names its own planted flaw, or any flaw stem
outside the two-step carve-out. It is wired into `check_batch`.
