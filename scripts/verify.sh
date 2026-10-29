#!/usr/bin/env bash
# One command: tests, build, and a smoke import of the built wheel.
set -euo pipefail
cd "$(dirname "$0")/.."
python -m pytest -q
rm -rf dist
python -m pip install --quiet build
python -m build
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
python -m venv "$tmp/venv"
if [ -x "$tmp/venv/bin/python" ]; then py="$tmp/venv/bin/python"; else py="$tmp/venv/Scripts/python.exe"; fi
"$py" -m pip install --quiet dist/*.whl
"$py" -c "import aspire_si_gates as g; print(g.gates_identity())"
echo "verify: OK"
