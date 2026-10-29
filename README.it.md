<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

**I controlli sui dati per i set di addestramento del primo livello: un singolo pacchetto Python della libreria standard che determina se una riga, un batch o un set congelato di elementi di addestramento è adatto per l'addestramento.** Il trainer ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) e il generatore di dataset ([role-set](https://github.com/mcp-tool-shop-org/role-set)) lo utilizzano entrambi, quindi ciò che un generatore accetta è esattamente ciò che il trainer accetterà.

Ogni controllo solleva o restituisce una motivazione su cui è possibile intervenire. Nulla viene corretto in silenzio.

## Installazione

```bash
pip install aspire-si-gates
```

Python 3.10 o versione successiva. Nessuna dipendenza.

## Utilizzo

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

Un generatore che desidera restituire i rifiuti al suo autore, un elemento alla volta, utilizza invece i controlli incrementali:

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## I controlli

| Chiama | Cosa controlla |
|---|---|
| `validate(rows)` | `check_item` su ogni riga, quindi `check_batch` sull'intero file. Solleva `DataError` con il primo rifiuto. |
| `check_item(row)` | I controlli che non necessitano di altre righe. Rifiuta un elemento di applicazione (`split: apply` o un ID `-AP-`): gli elementi di applicazione non vengono mai utilizzati per l'addestramento. |
| `check_apply_item(row)` | I controlli di un elemento di applicazione: le stesse regole di contenuto e forma di `check_item`, più le regole di applicazione (`split: apply` e un ID `-AP-`, tipo C o D, un turno, nessuna coppia e il campo gemello della lezione). Rifiuta qualsiasi riga che non sia un elemento di applicazione. |
| `check_trace_leaks_label(row)` | Rifiuta una riga di tipo C il cui tracciato di controllo indica il proprio difetto o qualsiasi difetto al di fuori del processo di eliminazione in due fasi. Integrato in `check_batch`. |
| `check_against(row, accepted)` | `[(code, message)]` per le regole di esclusività (intervalli, inquadrature, materiale, forme di puzzle, aperture, frasi) rispetto alle righe già accettate. I codici sono in `REASONS`. |
| `check_batch(rows)` | I controlli che necessitano del set completo: condivisioni, livelli, coppie, limiti di frasi e formule. |
| `batch_report(rows)`, `freeze_report(rows)` | Le figure alla base di tali controlli, sotto forma di dizionari. |
| `gates_identity()` | La versione del pacchetto e un sha256 del suo codice sorgente, da registrare con ogni elemento generato. |

I dati del ruolo di verifica (lezioni, nomi dei tratti, parole del ruolo e le lezioni precedenti alla modifica) sono in `constants.py`. Un ruolo diverso modifica tale modulo, non i controlli. La parte relativa alla perdita di dati del set sigillato non è presente qui; rimane con il trainer.

## Sicurezza e dati

- **Letture:** le righe che si passano e il file che si fornisce a `load`.
- **Non modifica:** la rete, il file system oltre a tale file, le variabili d'ambiente o i sottoprocessi. Nessuna telemetria.
- **Autorizzazioni:** nessuna oltre alla lettura di tale file.

Segnalare privatamente una vulnerabilità; vedere [SECURITY.md](SECURITY.md).

## Stato

Versione 1.7.6, pubblicata per la prima volta su PyPI. Il codice sorgente è identico al pacchetto che era presente in aspire-si all'indirizzo `6a603baa`, quindi `gates_identity()` segnala lo stesso hash di prima della modifica. La copertura dei test del repository è del 68%, con un limite del 68% (obiettivo 90%); più casi di controllo vengono eseguiti dai test di livello 1 di aspire-si.

## Controllo di qualità

I controlli più rigorosi (sicurezza, errori, documentazione, integrità della distribuzione) sono superati; vedere [SHIP_GATE.md](SHIP_GATE.md) e [SCORECARD.md](SCORECARD.md).

## Test

```bash
python -m pytest -q
```

Oppure, eseguire tutti i test che esegue il controllo di rilascio: `bash scripts/verify.sh`.

## Licenza

MIT, © mcp-tool-shop.

---

Creato da [MCP Tool Shop](https://mcp-tool-shop.github.io/)
