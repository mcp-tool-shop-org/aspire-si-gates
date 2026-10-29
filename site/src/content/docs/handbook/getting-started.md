---
title: Getting started
description: Install aspire-si-gates and validate a file of rows.
sidebar:
  order: 1
---

## Install

```bash
pip install aspire-si-gates
```

Python 3.10 or newer. There are no dependencies.

## Validate a file

A data file is JSON Lines: one JSON object per line.

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")
try:
    validate(rows)
except DataError as err:
    print(err.code, err.message, err.hint)
```

`validate` runs `check_item` on every row in order, then `check_batch` on the whole set. It stops at the first
refusal and raises `DataError`.

## Record which gates passed an item

```python
from aspire_si_gates import gates_identity

print(gates_identity())   # {"version": "1.7.6", "sha256": "..."}
```

The sha256 is taken over the package's own `.py` files (name and bytes, in sorted order). A generator can store it
with each item to show exactly which gates the item passed.

## Run the tests

From a clone of the repository:

```bash
python -m pytest -q
```

Or run what the release gate runs: tests, a build, and a smoke import of the built wheel.

```bash
bash scripts/verify.sh
```
