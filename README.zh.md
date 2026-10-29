<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.md">English</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

**阶段 1 角色训练数据集的数据筛选器：一个标准的 Python 库，用于确定一行、一批或一组冻结的训练项目是否适合用于训练。** 训练器 ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) 和数据集生成器 ([role-set](https://github.com/mcp-tool-shop-org/role-set)) 都调用它，因此生成器接受的内容与训练器接受的内容完全相同。

每个筛选器都会引发或返回一个您可以采取行动的原因。不会有任何静默的修复。

## 安装

```bash
pip install aspire-si-gates
```

Python 3.10 或更高版本。没有依赖项。

## 使用方法

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

如果生成器希望逐个将拒绝返回给其编写者，则使用增量检查：

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## 筛选器

| 调用 | 它检查的内容 |
|---|---|
| `validate(rows)` | 对每一行调用 `check_item`，然后对整个文件调用 `check_batch`。如果出现第一个拒绝，则引发 `DataError`。 |
| `check_item(row)` | 不需要其他行的检查。它拒绝一个应用项目（`split: apply` 或一个 `-AP-` ID）：应用项目绝不会被用于训练。 |
| `check_apply_item(row)` | 应用项目的检查：与 `check_item` 相同的相同内容和形状规则，以及应用规则（`split: apply` 和一个 `-AP-` ID，类型为 C 或 D，一次，无配对，以及课程的双重字段）。拒绝任何不是应用项目的行。 |
| `check_trace_leaks_label(row)` | 拒绝一个类型为 C 的行，其检查器跟踪名称与其自身植入的缺陷或超出两步切分范围的任何缺陷根源。与 `check_batch` 关联。 |
| `check_against(row, accepted)` | `[(code, message)]` 用于独占性规则（跨度、框架、材料、拼图形状、开口、短语），以防止与已接受的行冲突。代码位于 `REASONS` 中。 |
| `check_batch(rows)` | 需要完成数据集的检查：共享、楼层、配对、短语和公式限制。 |
| `batch_report(rows)`, `freeze_report(rows)` | 这些检查背后的数据，以字典的形式呈现。 |
| `gates_identity()` | 软件包版本及其源代码的 sha256，用于记录每个生成项目。 |

验证器角色的数据（课程、特征名称、角色词汇以及修改前的课程）位于 `constants.py` 中。不同的角色会更改该模块，而不是检查。密封数据集的泄漏部分不在其中；它与训练器一起。

## 安全性和数据

- **读取：** 您传递的行以及您提供给 `load` 的文件。
- **不触及：** 网络、超出该文件的文件系统、环境变量或子进程。没有遥测数据。
- **权限：** 除了读取该文件之外，没有其他权限。

私下报告漏洞；请参阅 [SECURITY.md](SECURITY.md)。

## 状态

版本 1.7.6，首次发布到 PyPI。源代码与位于 aspire-si 中的软件包完全相同（`6a603baa`），因此 `gates_identity()` 报告与移动之前相同的哈希值。此仓库自身测试的覆盖率为 68%，最低值为 68（目标为 90）；更多的筛选器案例由 aspire-si 的阶段 1 测试进行测试。

## 质量控制

严格的筛选器（安全性、错误、文档、发布卫生）通过；请参阅 [SHIP_GATE.md](SHIP_GATE.md) 和 [SCORECARD.md](SCORECARD.md)。

## 测试

```bash
python -m pytest -q
```

或者，运行发布筛选器运行的所有内容：`bash scripts/verify.sh`。

## 许可证

MIT，© mcp-tool-shop。

---

由 [MCP Tool Shop](https://mcp-tool-shop.github.io/) 构建。
