---
title: aspire-si-gates Handbook
description: The Stage 1 data gates for role-training sets, as one standard-library Python package.
sidebar:
  order: 0
---

**aspire-si-gates** is the set of gates a Stage 1 role-training item has to pass. It is one standard-library Python
package shared by the trainer ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) and the dataset generator
([role-set](https://github.com/mcp-tool-shop-org/role-set)). Because both call the same code, what a generator accepts
is what the trainer will accept.

Every gate either raises `DataError` with a code, a message and a hint, or returns a reason you can act on. None of
them repairs a row for you.

## Where to go

- [Getting started](./getting-started/): install it and run a file through `validate`.
- [Usage](./usage/): the three ways to gate data: a whole file, one item, and one item against the rows already accepted.
- [Reference](./reference/): every public call, the row fields, and the reason codes.
- [Security and data](./security/): what the package reads, what it never touches, and how to report a problem.

## What it is not

It is not a trainer and not a generator. The sealed-set leakage leg stays with the trainer. The verifier role's data
(lessons, trait names, role words) is in `constants.py`; a different role changes that module, not the checks.
