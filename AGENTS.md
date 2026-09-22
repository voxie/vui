| `@lib/*`    | `src/lib/*`            | `import { withBase } from '@lib/base'`     |
## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Architecture

- `src/components/ui/` — design-system components. Always Vue SFCs (`.vue`). Each should have a docs page under `src/content/docs/components/`.
- `src/components/site/` — components used only to build this docs site (navigation, chrome). Not part of the design system; never document them in the docs collection. May be `.astro`.
- `src/content/docs/` — human-facing design documentation (MDX): foundations, patterns, components, guidance. Directory structure determines URLs under `/docs/...`.
- `src/content/skills/` — AI-oriented skills/instructions (Markdown), served under `/skills/...`.
- Content collections are defined in `src/content.config.ts`. Use collections for repeatable content; regular Astro pages only for unique pages like the homepage.

## Imports

Import across directories through the aliases in `tsconfig.json`, never with `../` traversal. Astro passes them to Vite, so they work the same in `.astro`, `.vue` and `.mdx`.

| Alias       | Resolves to            | Example                                     |
| ----------- | ---------------------- | ------------------------------------------- |
| `@ui/*`     | `src/components/ui/*`  | `import Button from '@ui/Button.vue'`       |
| `@site/*`   | `src/components/site/*`| `import Sidebar from '@site/Sidebar.astro'` |
| `@layouts/*`| `src/layouts/*`        | `import Layout from '@layouts/Layout.astro'`|
| `@data/*`   | `src/data/*`           | `import { testPages } from '@data/testPages'`|
| `@lib/*`    | `src/lib/*`            | `import { withBase } from '@lib/base'`      |

`@ui` and `@site` are deliberately separate so the design-system / site-chrome split above reads at the import line. Same-directory siblings still use `./`.

## Writing

Never hard-wrap prose in Markdown or MDX. A paragraph, a list item, or a comment is one line, however long it runs. Editors do their own wrapping. Code fences, tables, and JSX keep whatever line structure they need.

Read `.claude/skills/docs-voice/SKILL.md` before writing or revising prose in `src/content/`. It is the single source for the house style, and it covers the hard rules, the voice, the page structure, and how to run a cleanup pass.

## Comments

Keep code comments short. One or two lines, saying what a reader can't get from the code itself: a non-obvious constraint, a workaround and what forces it, a unit or an order that matters. Rationale, background, and anything that runs to a paragraph belongs in `src/content/docs/`, not in a comment. If an explanation feels too long for a comment, that's a sign it should be documented and linked, or left out.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
