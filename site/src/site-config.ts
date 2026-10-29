import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'aspire-si-gates',
  description:
    'The Stage 1 data gates for role-training sets: one standard-library Python package that decides whether a row, a batch or a frozen set is fit to train on.',
  logoBadge: 'AG',
  brandName: 'aspire-si-gates',
  repoUrl: 'https://github.com/mcp-tool-shop-org/aspire-si-gates',
  footerText:
    'MIT Licensed — built by <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  hero: {
    badge: 'Python 3.10+ · no dependencies · MIT',
    headline: 'One set of gates,',
    headlineAccent: 'for the generator and the trainer.',
    description:
      'The dataset generator and the trainer both call aspire-si-gates, so what a generator accepts is exactly what the trainer will accept. Every gate raises or returns a reason you can act on. Nothing is fixed silently.',
    primaryCta: { href: 'https://pypi.org/project/aspire-si-gates/', label: 'Install from PyPI' },
    secondaryCta: { href: 'handbook/', label: 'Read the Handbook' },
    previews: [
      {
        label: 'Install',
        code: 'pip install aspire-si-gates\n\n# Python 3.10 or newer.\n# standard library only. no dependencies.',
      },
      {
        label: 'Validate a file',
        code: 'from aspire_si_gates import DataError, load, validate\n\nrows = load("batch3-t05.jsonl")\ntry:\n    validate(rows)\nexcept DataError as err:\n    print(err.code, err.message, err.hint)',
      },
      {
        label: 'Gate one item',
        code: 'from aspire_si_gates import check_against, check_item\n\ncheck_item(row)  # raises DataError\nproblems = check_against(row, accepted)\n# [(code, message), ...] to hand back to the writer',
      },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'gates',
      title: 'What the gates check',
      subtitle: 'Each gate is a check in code, with a stable reason code.',
      features: [
        {
          title: 'Row checks',
          desc: 'check_item needs no other row. It refuses an apply item, because apply items are never trained. check_apply_item runs the apply rules on the apply items and refuses everything else.',
        },
        {
          title: 'Whole-set checks',
          desc: 'check_batch looks at the finished set: shares, floors, pairs, and the phrase and formula limits. validate runs every row check, then these.',
        },
        {
          title: 'Incremental refusals',
          desc: 'check_against tells a generator, one item at a time, which exclusivity rule a new row breaks against the rows already accepted: spans, framings, material, puzzle shapes, openings and phrases. The codes never change.',
        },
        {
          title: 'Trace leaks',
          desc: 'check_trace_leaks_label refuses a kind C row whose checker trace names its own planted flaw. It runs inside check_batch.',
        },
        {
          title: 'A recorded identity',
          desc: 'gates_identity returns the package version and a sha256 of its source, so each generated item can record exactly which gates passed it.',
        },
        {
          title: 'Closed to the outside',
          desc: 'It reads the rows you pass and the one file you give to load. No network, no other files, no subprocesses, no telemetry.',
        },
      ],
    },
    {
      kind: 'code-cards',
      id: 'usage',
      title: 'Use it',
      cards: [
        { title: 'Install', code: 'pip install aspire-si-gates' },
        {
          title: 'Report the figures',
          code: 'from aspire_si_gates import batch_report, freeze_report, gates_identity\n\nprint(batch_report(rows))\nprint(gates_identity())  # {"version": ..., "sha256": ...}',
        },
      ],
    },
  ],
};
