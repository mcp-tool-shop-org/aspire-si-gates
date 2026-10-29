# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 1.7.x | Yes |
| Earlier | No |

## Reporting a vulnerability

Report a vulnerability privately by email to rnd@mcptoolshop.com. Don't open a public issue.

You'll get an acknowledgement within 7 days and a status update within 30 days. A confirmed vulnerability gets a fix
and a release before it is described in public.

## What this package touches

- **Reads:** the data rows passed to it, and the one file given to `load`.
- **Does not touch:** the network, other files, environment variables or subprocesses. No telemetry.
- **Dependencies:** none; it is standard-library Python.

## Threat model

The gates parse untrusted JSON rows and run regular-expression checks over their text. The risks are a crafted row that
makes a check slow (regular-expression backtracking) or that is accepted when it should be refused. Report either one.
The package does not execute row content.
