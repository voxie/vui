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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
