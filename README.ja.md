<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/aspire-si-gates/readme.png" alt="aspire-si-gates: the Stage 1 data gates package" width="400">
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/aspire-si-gates/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/aspire-si-gates/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://pypi.org/project/aspire-si-gates/"><img src="https://img.shields.io/pypi/v/aspire-si-gates" alt="PyPI"></a>
  <a href="https://mcp-tool-shop-org.github.io/aspire-si-gates/"><img src="https://img.shields.io/badge/docs-landing_page-blue" alt="Landing page"></a>
</p>

**ステージ1のロール学習セットのデータゲート：行、バッチ、または学習項目の固定セットが学習に適しているかどうかを決定する、標準ライブラリのPythonパッケージ。** トレーナー（[aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)）とデータセットジェネレーター（[role-set](https://github.com/mcp-tool-shop-org/role-set)）の両方がこれを使用するため、ジェネレーターが受け入れるものは、トレーナーが受け入れるものとまったく同じです。

すべてのゲートは、対処できる理由を提示または返します。何も無言で固定されることはありません。

## インストール

```bash
pip install aspire-si-gates
```

Python 3.10以降。依存関係はありません。

## 使用方法

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

ジェネレーターが、拒否を1つずつ書き込み元に返す場合、代わりにインクリメンタルチェックを使用します。

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## ゲート

| 呼び出し | チェックする内容 |
|---|---|
| `validate(rows)` | 各行に対して`check_item`、次にファイル全体に対して`check_batch`を実行します。最初の拒否時に`DataError`を発生させます。 |
| `check_item(row)` | 他の行を必要としないチェック。適用項目（`split: apply`または`-AP-`のID）を拒否します。適用項目は決して学習されません。 |
| `check_apply_item(row)` | 適用項目のチェック：`check_item`と同じコンテンツと形状のルールに加えて、適用ルール（`split: apply`と`-AP-`のID、種類CまたはD、一ターン、ペアなし、およびレッスンに関連するフィールド）。適用項目でない行をすべて拒否します。 |
| `check_trace_leaks_label(row)` | チェッカーのトレースが自身の埋め込まれた欠陥、または二段階の切り出し範囲外の欠陥を指す種類Cの行を拒否します。`check_batch`に組み込まれています。 |
| `check_against(row, accepted)` | すでに採用されている行に対して、排他的なルール（範囲、枠組み、素材、パズルの形状、開口部、フレーズ）を適用するためのコードは、`[(code, message)]`です。コードは`REASONS`にあります。 |
| `check_batch(rows)` | 完了したセットを必要とするチェック：共有、フロア、ペア、フレーズと数式の制限。 |
| `batch_report(rows)`, `freeze_report(rows)` | これらのチェックの背後にある数値（辞書形式）。 |
| `gates_identity()` | パッケージのバージョンとソースのsha256。生成された各項目とともに記録されます。 |

検証ロールのデータ（レッスン、特性名、ロールの単語、および修正前のレッスン）は`constants.py`にあります。別のロールがそのモジュールを変更し、チェックは変更されません。密閉されたセットからの漏洩はここでは扱いません。トレーナーに留まります。

## セキュリティとデータ

- **読み取り：** 渡される行と、`load`に渡されるファイル。
- **変更なし：** ネットワーク、そのファイル以外のファイルシステム、環境変数、またはサブプロセス。テレメトリはありません。
- **権限：** そのファイルを読み取る以上の権限は必要ありません。

脆弱性を非公開で報告してください。[SECURITY.md](SECURITY.md)を参照してください。

## ステータス

バージョン1.7.6。最初にPyPIに公開されました。ソースは、`6a603baa`にあるaspire-si内のパッケージとバイト単位で同一であるため、`gates_identity()`は移動前と同じハッシュを報告します。このリポジトリ自体のテストのカバー率は68％で、下限は68（目標は90）です。より多くのゲートケースは、aspire-siのステージ1テストによってテストされます。

## 品質ゲート

厳格なゲート（セキュリティ、エラー、ドキュメント、リリース衛生）は合格です。[SHIP_GATE.md](SHIP_GATE.md)と[SCORECARD.md](SCORECARD.md)を参照してください。

## テスト

```bash
python -m pytest -q
```

または、リリースゲートが実行するすべてのテストを実行します：`bash scripts/verify.sh`。

## ライセンス

MIT、© mcp-tool-shop。

---

[MCP Tool Shop](https://mcp-tool-shop.github.io/)によって作成されました。
