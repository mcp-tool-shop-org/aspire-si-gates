---
title: Security and data
description: What aspire-si-gates reads and never touches, and how to report a problem.
sidebar:
  order: 4
---

## What it touches

- **Reads:** the data rows passed to it, and the one file given to `load`.
- **Does not touch:** the network, other files, environment variables or subprocesses.
- **Telemetry:** none.
- **Dependencies:** none. It is standard-library Python.

## Threat model

The gates parse untrusted JSON rows and run regular-expression checks over their text. The risks are a crafted row that
makes a check slow (regular-expression backtracking), or one that is accepted when it should be refused. The package
does not execute row content.

## Reporting

Report a vulnerability privately by email to rnd@mcptoolshop.com. Don't open a public issue. You will get an
acknowledgement within 7 days and a status update within 30 days.
