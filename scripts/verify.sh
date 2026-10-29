#!/usr/bin/env bash
# One command: tests, build, and a smoke import of the built wheel.
set -euo pipefail
cd "$(dirname "$0")/.."
python -m pytest -q
rm -rf dist
python -m pip install --quiet build
python -m build
tmp="$(mktemp -d)"
python -m venv "$tmp/venv"
"$tmp/venv/bin/pip" install --quiet dist/*.whl 2>/dev/null || "$tmp/venv/Scripts/pip" install --quiet dist/*.whl
"$tmp/venv/bin/python" -c "import aspire_si_gates as g; print(g.gates_identity())" 2>/dev/null \
  || "$tmp/venv/Scripts/python" -c "import aspire_si_gates as g; print(g.gates_identity())"
echo "verify: OK"
