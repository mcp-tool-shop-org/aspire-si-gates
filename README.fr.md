<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

**Les contrôles de données pour les ensembles d’entraînement de la phase 1 : un seul paquet Python de bibliothèque standard qui détermine si une ligne, un lot ou un ensemble fixe d’éléments d’entraînement est approprié pour l’entraînement.** L’entraîneur ([aspire-si](https://github.com/mcp-tool-shop-org/aspire-si)) et le générateur d’ensembles de données ([role-set](https://github.com/mcp-tool-shop-org/role-set)) l’utilisent tous les deux, de sorte que ce qu’un générateur accepte est exactement ce que l’entraîneur acceptera.

Chaque contrôle génère ou renvoie une raison sur laquelle vous pouvez agir. Rien n’est corrigé silencieusement.

## Installation

```bash
pip install aspire-si-gates
```

Python 3.10 ou version ultérieure. Aucune dépendance.

## Utilisation

```python
from aspire_si_gates import DataError, load, validate

rows = load("batch3-t05.jsonl")      # one JSON object per line
try:
    validate(rows)                    # every row check, then every whole-set check
except DataError as err:
    print(err.code, err.message, err.hint)
```

Un générateur qui souhaite renvoyer les refus à son créateur, un élément à la fois, utilise plutôt les contrôles incrémentaux :

```python
from aspire_si_gates import check_against, check_item

check_item(row)                       # raises DataError on the first refusal
problems = check_against(row, accepted_rows)   # [(code, message), ...] against rows already accepted
```

## Les contrôles

| Appel | Ce qu’il vérifie |
|---|---|
| `validate(rows)` | `check_item` sur chaque ligne, puis `check_batch` sur l’ensemble du fichier. Génère `DataError` au premier refus. |
| `check_item(row)` | Les contrôles qui n’ont pas besoin d’une autre ligne. Il refuse un élément d’application (`split: apply` ou un ID `-AP-`) : les éléments d’application ne sont jamais entraînés. |
| `check_apply_item(row)` | Les contrôles d’un élément d’application : les mêmes règles de contenu et de forme que `check_item`, plus les règles d’application (`split: apply` et un ID `-AP-`, type C ou D, un tour, pas de paire et le champ jumeau de la leçon). Refuse toute ligne qui n’est pas un élément d’application. |
| `check_trace_leaks_label(row)` | Refuse une ligne de type C dont la trace du vérificateur indique sa propre faille ou toute faille provenant d’une source autre que les deux étapes de vérification. Intégré à `check_batch`. |
| `check_against(row, accepted)` | `[(code, message)]` pour les règles d’exclusivité (étendues, structures, matériaux, formes de puzzle, ouvertures, phrases) par rapport aux lignes déjà acceptées. Les codes se trouvent dans `REASONS`. |
| `check_batch(rows)` | Les contrôles qui nécessitent l’ensemble final : partages, seuils, paires, limites de phrases et de formules. |
| `batch_report(rows)`, `freeze_report(rows)` | Les données sous-jacentes à ces contrôles, sous forme de dictionnaires. |
| `gates_identity()` | La version du paquet et un sha256 de sa source, à enregistrer avec chaque élément généré. |

Les données du rôle de vérificateur (leçons, noms de caractéristiques, mots de rôle et les leçons antérieures à la modification) se trouvent dans `constants.py`. Un rôle différent modifie ce module, et non les contrôles. La partie de fuite de l’ensemble scellé n’est pas présente ici ; elle reste avec l’entraîneur.

## Sécurité et données

- **Lit :** les lignes que vous transmettez et le fichier que vous donnez à `load`.
- **Ne touche pas :** le réseau, le système de fichiers au-delà de ce fichier, les variables d’environnement ou les sous-processus. Pas de télémétrie.
- **Autorisations :** aucune autorisation au-delà de la lecture de ce fichier.

Signalez une vulnérabilité en privé ; voir [SECURITY.md](SECURITY.md).

## État

Version 1.7.6, publiée pour la première fois sur PyPI. La source est identique, octet par octet, au paquet qui se trouvait dans aspire-si à l’adresse `6a603baa`, de sorte que `gates_identity()` signale le même hachage qu’avant le déplacement. La couverture des tests de ce dépôt est de 68 %, avec un seuil de 68 (objectif : 90) ; davantage de cas de contrôle sont testés par les tests de la phase 1 d’aspire-si.

## Contrôle de qualité

Les contrôles stricts (sécurité, erreurs, documentation, conformité de la publication) sont réussis ; voir [SHIP_GATE.md](SHIP_GATE.md) et [SCORECARD.md](SCORECARD.md).

## Tests

```bash
python -m pytest -q
```

Ou exécutez tous les tests que le contrôle de publication exécute : `bash scripts/verify.sh`.

## Licence

MIT, © mcp-tool-shop.

---

Créé par [MCP Tool Shop](https://mcp-tool-shop.github.io/)
