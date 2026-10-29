# Ship Gate

> No repo is "done" until every applicable line is checked.
> Copy this into your repo root. Check items off per-release.

**Tags:** `[all]` every repo · `[npm]` `[pypi]` `[vsix]` `[desktop]` `[container]` published artifacts · `[mcp]` MCP servers · `[cli]` CLI tools

---

## A. Security Baseline

- [x] `[all]` SECURITY.md exists (report email, supported versions, response timeline) — executed by `npx @mcptoolshop/shipcheck security-docs` (A1: present + reporting contact, not an empty stub) (2026-10-29; SECURITY.md has supported versions, contact and timeline)
- [x] `[all]` README includes threat model paragraph (data touched, data NOT touched, permissions required) — executed by `npx @mcptoolshop/shipcheck security-docs` (A2: trust/threat-model section present + non-empty; *quality* is not machine-checkable) (2026-10-29; README "Security and data" and SECURITY.md threat model)
- [x] `[all]` No secrets, tokens, or credentials in source or diagnostics output — executed by `npx @mcptoolshop/shipcheck secrets` (scans every publishable tarball; matches redacted; not a manual attestation) (2026-10-29; `shipcheck secrets` finds no publishable npm package; the sdist and wheel were identity-scanned before the tag)
- [x] `[all]` No telemetry by default — state it explicitly even if obvious (2026-10-29; no telemetry; no network access at all)

### Default safety posture

- [ ] SKIP: a library with no CLI, server or app. `[cli|mcp|desktop]` Dangerous actions (kill, delete, restart) require explicit `--allow-*` flag
- [ ] SKIP: a library with no CLI, server or app. `[cli|mcp|desktop]` File operations constrained to known directories
- [ ] SKIP: not an MCP server. `[mcp]` Network egress off by default
- [ ] SKIP: not an MCP server. `[mcp]` Stack traces never exposed — structured error results only

## B. Error Handling

- [x] `[all]` Errors follow the Structured Error Shape: `code`, `message`, `hint`, `cause?`, `retryable?` (2026-10-29; `DataError` carries `code`, `message`, `hint`)
- [ ] SKIP: not a CLI (a library with no command line). `[cli]` Exit codes: 0 ok · 1 user error · 2 runtime error · 3 partial success
- [ ] SKIP: not a CLI (a library with no command line). `[cli]` No raw stack traces without `--debug`
- [ ] SKIP: not an MCP server. `[mcp]` Tool errors return structured results — server never crashes on bad input
- [ ] SKIP: not an MCP server. `[mcp]` State/config corruption degrades gracefully (stale data over crash)
- [ ] SKIP: not a desktop app. `[desktop]` Errors shown as user-friendly messages — no raw exceptions in UI
- [ ] SKIP: not a VS Code extension. `[vscode]` Errors surface via VS Code notification API — no silent failures

## C. Operator Docs

- [x] `[all]` README is current: what it does, install, usage, supported platforms + runtime versions (2026-10-29; README rewritten for 1.7.6)
- [x] `[all]` CHANGELOG.md (Keep a Changelog format) (2026-10-29; CHANGELOG.md, Keep a Changelog)
- [x] `[all]` LICENSE file present and repo states support status (2026-10-29; MIT; support status in SECURITY.md)
- [ ] SKIP: not a CLI (a library with no command line). `[cli]` `--help` output accurate for all commands and flags
- [ ] SKIP: a library with no CLI, server or app. `[cli|mcp|desktop]` Logging levels defined: silent / normal / verbose / debug — secrets redacted at all levels
- [ ] SKIP: not an MCP server. `[mcp]` All tools documented with description + parameters
- [ ] SKIP: a single-purpose library, covered by the handbook. `[complex]` HANDBOOK.md: daily ops, warn/critical response, recovery procedures

## D. Shipping Hygiene

- [x] `[all]` `verify` script exists (test + build + smoke in one command) (2026-10-29; `scripts/verify.sh`: tests, build, smoke import of the wheel)
- [x] `[all]` Version in manifest matches git tag — executed by `npx @mcptoolshop/shipcheck manifest` (D2: manifest version not behind the newest released tag; `--expect <ver>` for a strict release-time match) (2026-10-29; 1.7.6; the tag is created after the treatment record)
- [x] `[all]` Dependency scanning runs in CI (ecosystem-appropriate) — executed by `npx @mcptoolshop/shipcheck ci` (D3: a recognized scanner is *configured* in CI, or dependabot is present) (2026-10-29; `npm audit` on the site tree in ci.yml (the package has no dependencies))
- [x] `[all]` No known high/critical vulnerabilities in any dependency tree, and Dependabot alerts are enabled — executed by `npx @mcptoolshop/shipcheck deps` (the OUTCOME: audits **every** tree incl. subtrees, not just the root; `ci` only proves a scanner is configured) (2026-10-29; `shipcheck deps`: no vulnerabilities at or above high)
- [ ] SKIP: the org restricts the auto-PR bot; the package has no dependencies and the site tree is audited in CI. `[all]` Automated dependency **update** mechanism exists <!-- soft/optional: the org rule restricts the auto-PR bot (CI minutes), NOT alerts. The security outcome is enforced by `shipcheck deps`; the update bot is optional. -->
- [ ] SKIP: not an npm package. `[npm]` Published via OIDC trusted publishing with `--provenance` — executed by `npx @mcptoolshop/shipcheck ci` (config/intent; `--registry <pkg>` also confirms the attestation on npm)
- [ ] SKIP: not an npm package. `[npm]` **Every publishable package** passes `npx @mcptoolshop/shipcheck pack` — `npm pack --dry-run` on each workspace package includes README.md + LICENSE and all `files[]` entries resolve (executed check, not a manual attestation; in a monorepo it verifies all packages, not just the root)
- [x] `[npm]` `engines.node` set · `[pypi]` `python_requires` set — executed by `npx @mcptoolshop/shipcheck manifest` (D6, checked per publishable package) (2026-10-29; requires-python >=3.10)
- [x] `[npm]` Lockfile committed · `[pypi]` Clean wheel + sdist build — lockfile executed by `npx @mcptoolshop/shipcheck manifest` (D7); the pypi wheel/sdist build is not yet executed (2026-10-29; `uv build` produces both; verify.sh smoke-imports the wheel)
- [ ] SKIP: not a VS Code extension. `[vsix]` `vsce package` produces clean .vsix with correct metadata
- [ ] SKIP: not a desktop app. `[desktop]` Installer/package builds and runs on stated platforms

## E. Identity (soft gate — does not block ship)

- [x] `[all]` Logo in README header (2026-10-29; brand logo, brand repo logos/aspire-si-gates)
- [x] `[all]` Translations (polyglot-mcp, 8 languages) (2026-10-29; 7 READMEs by TranslateGemma 27B, ja pinned after a hand fix)
- [x] `[org]` Landing page (@mcptoolshop/site-theme) (2026-10-29; https://mcp-tool-shop-org.github.io/aspire-si-gates/ and /handbook/ return 200)
- [x] `[all]` GitHub repo metadata: description, homepage, topics (2026-10-29)

---

## Gate Rules

**Hard gate (A–D):** Must pass before any version is tagged or published.
If a section doesn't apply, mark `SKIP:` with justification — don't leave it unchecked.

**Soft gate (E):** Should be done. Product ships without it, but isn't "whole."

**Executed vs attested.** `shipcheck audit` only *counts these checkboxes* — it does not read your repo, so a box can be green while the fact is false. The lines that say **"executed by `npx @mcptoolshop/shipcheck <gate>`"** are backed by a command that reads the real artifact and exits 1 on the real defect. Run those gates (they are wired into shipcheck's own `verify`); don't just tick their boxes. Executed today: **A1/A2** (`security-docs`), **A3** (`secrets`), **D2/D6/D7** (`manifest`), **D3-config + OIDC/provenance** (`ci`), **real vulnerabilities + alerting** (`deps`), **D5** (`pack`), plus front-door (`front-door`) and dogfood freshness (`dogfood`). Every other line is still an attestation you are vouching for. Note the two dependency layers: `ci` proves a scanner is *configured*; `deps` proves there are *no known vulnerabilities* — a repo can pass the first while failing the second.

**Checking off:**
```
- [x] `[all]` SECURITY.md exists (2026-02-27)
```

**Skipping:**
```
- [ ] `[pypi]` SKIP: not a Python project
```
