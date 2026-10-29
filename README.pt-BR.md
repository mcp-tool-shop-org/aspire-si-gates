<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
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

**Os mecanismos de validação para os conjuntos de treinamento da Fase 1: um pacote Python de biblioteca padrão que decide se uma linha, um lote ou um conjunto fixo de itens de treinamento é adequado para o treinamento.** O treinador ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) e o gerador de conjuntos de dados ([role-set](https://github.com/mcp-tool-shop-org/role-set)) o utilizam, portanto, o que um gerador aceita é exatamente o que o treinador aceitará.

Cada mecanismo de validação gera ou retorna um motivo que pode ser usado para tomar uma ação. Nada é corrigido silenciosamente.

## Instalação

```bash
pip install aspire-si-gates
```

Python 3.10 ou versão mais recente. Sem dependências.

## Uso

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

Um gerador que deseja retornar as rejeições ao seu criador, um item de cada vez, usa as verificações incrementais:

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## Os mecanismos de validação

| Chamada | O que é verificado |
|---|---|
| `validate(rows)` | `check_item` em cada linha, depois `check_batch` no arquivo inteiro. Gera `DataError` com a primeira rejeição. |
| `check_item(row)` | As verificações que não precisam de outra linha. Rejeita um item de aplicação (`split: apply` ou um ID `-AP-`): os itens de aplicação nunca são usados no treinamento. |
| `check_apply_item(row)` | As verificações de um item de aplicação: as mesmas regras de conteúdo e formato de `check_item`, mais as regras de aplicação (`split: apply` e um ID `-AP-`, tipo C ou D, uma iteração, sem par e o campo correspondente da lição). Rejeita qualquer linha que não seja um item de aplicação. |
| `check_trace_leaks_label(row)` | Rejeita uma linha do tipo C cujo rastreamento do verificador indica seu próprio defeito ou qualquer defeito fora do processo de duas etapas. Integrado em `check_batch`. |
| `check_against(row, accepted)` | `[(code, message)]` para as regras de exclusividade (intervalos, estruturas, material, formatos de quebra-cabeça, aberturas, frases) em relação às linhas já aceitas. Os códigos estão em `REASONS`. |
| `check_batch(rows)` | As verificações que precisam do conjunto finalizado: elementos compartilhados, limites, pares, limites de frases e fórmulas. |
| `batch_report(rows)`, `freeze_report(rows)` | Os valores por trás dessas verificações, como dicionários. |
| `gates_identity()` | A versão do pacote e um sha256 de seu código-fonte, para registrar com cada item gerado. |

Os dados do papel do verificador (lições, nomes de características, palavras-chave e as lições anteriores à alteração) estão em `constants.py`. Um papel diferente altera esse módulo, não as verificações. O mecanismo de prevenção de vazamento de dados do conjunto selado não está aqui; ele permanece com o treinador.

## Segurança e dados

- **Lê:** as linhas que você fornece e o arquivo que você fornece para `load`.
- **Não acessa:** a rede, o sistema de arquivos além desse arquivo, variáveis de ambiente ou subprocessos. Sem telemetria.
- **Permissões:** nenhuma além da leitura desse arquivo.

Relate uma vulnerabilidade em particular; consulte [SECURITY.md](SECURITY.md).

## Status

Versão 1.7.6, publicada pela primeira vez em PyPI. O código-fonte é idêntico ao pacote que estava em aspire-si em `6a603baa`, portanto, `gates_identity()` relata o mesmo hash de antes da mudança. A cobertura dos próprios testes deste repositório é de 68%, com o limite em 68 (meta de 90); mais casos de validação são testados pelos testes da Fase 1 do aspire-si.

## Validação de qualidade

As validações rigorosas (segurança, erros, documentação, higiene de envio) são aprovadas; consulte [SHIP_GATE.md](SHIP_GATE.md) e [SCORECARD.md](SCORECARD.md).

## Testes

```bash
python -m pytest -q
```

Ou execute tudo o que a validação de lançamento executa: `bash scripts/verify.sh`.

## Licença

MIT, © mcp-tool-shop.

---

Criado por [MCP Tool Shop](https://mcp-tool-shop.github.io/)
