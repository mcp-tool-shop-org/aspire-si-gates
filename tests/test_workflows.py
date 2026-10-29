"""The release and CI workflows keep the rules this repository ships by: only a published release can publish, and every
action is pinned by commit sha. tests/ is not part of the package, so this does not touch gates_identity()."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOWS = ROOT / ".github" / "workflows"
# The SLSA generator is a reusable workflow that must be referenced by tag for its builder identity check.
TAG_PINNED_EXCEPTIONS = {"slsa-framework/slsa-github-generator/.github/workflows/generator_generic_slsa3.yml@v2.1.0"}


def test_release_workflow_runs_only_on_a_published_release():
    text = (WORKFLOWS / "release.yml").read_text(encoding="utf-8")
    on_block = text.split("\non:", 1)[1].split("\nconcurrency:", 1)[0]
    assert [line.strip() for line in on_block.strip().splitlines()] == ["release:", "types: [published]"]


def test_every_action_is_pinned_by_commit_sha_with_a_version_comment():
    for name in ("ci.yml", "release.yml", "pages.yml"):
        text = (WORKFLOWS / name).read_text(encoding="utf-8")
        uses = re.findall(r"uses: (\S+)(.*)", text)
        assert uses, name
        for ref, rest in uses:
            if ref in TAG_PINNED_EXCEPTIONS:
                continue
            assert re.fullmatch(r"[\w./-]+@[0-9a-f]{40}", ref), f"{name}: {ref} is not pinned by commit sha"
            assert re.search(r"# v\d", rest), f"{name}: {ref} has no version comment"


def test_pages_write_and_id_token_are_on_the_deploy_job_only():
    text = (WORKFLOWS / "pages.yml").read_text(encoding="utf-8")
    top = text.split("\njobs:", 1)[0]
    assert "pages: write" not in top and "id-token: write" not in top
    deploy = text.split("\n  deploy:", 1)[1]
    assert "pages: write" in deploy and "id-token: write" in deploy


def test_release_checks_the_tag_and_gates_version_against_pyproject():
    text = (WORKFLOWS / "release.yml").read_text(encoding="utf-8")
    assert "GATES_VERSION" in text and "does not match pyproject version" in text
    init = (ROOT / "src" / "aspire_si_gates" / "__init__.py").read_text(encoding="utf-8")
    gates_version = re.search(r'^GATES_VERSION = "([^"]+)"', init, re.M).group(1)
    pyproject_version = re.search(r'^version = "([^"]+)"', (ROOT / "pyproject.toml").read_text(encoding="utf-8"), re.M).group(1)
    assert gates_version == pyproject_version
