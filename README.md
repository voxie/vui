# Voxie UI (vui)

The Voxie design system: a set of Vue components built on Tailwind, the docs that explain how to use them, and skills that teach AI agents the same rules.

Published at https://voxie.github.io/vui.

## What's in the repo

- **Components** live in `src/components/ui/`. Each is a Vue single-file component styled with plain Tailwind color classes, never semantic aliases. Every component has a docs page.
- **Docs** live in `src/content/docs/` as MDX, split into foundations, components, and patterns. The folder structure sets the URL under `/docs/...`.
- **Skills** live in `skills/`, one `SKILL.md` per skill. They restate the docs as instructions Claude Code loads on its own when a task matches. The site also renders them under `/skills/...`.
- **Test pages** live in `src/pages/test-pages/`. They are real product screens stripped of all styling, used as fixtures to check how well the docs and skills guide an agent. See the README in that folder.

## Getting started

Requires Node 24 and pnpm 11. Versions are pinned in `package.json` under `engines`.

```sh
pnpm install
pnpm dev
```

The site serves at `http://localhost:4321/vui/`. The `/vui` base path is on in dev as well as production, so a link that forgets the prefix breaks locally instead of only on GitHub Pages.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build the static site into `dist/` |
| `pnpm preview` | Serve the built site locally |
| `pnpm trial -- --docs` | Copy the test pages into a gitignored trial folder for styling against the docs |
| `pnpm trial -- --skills` | Same, but link the skills in and style against those instead |
| `pnpm trial -- --remove` | Delete the trial and unlink the skills |
| `pnpm link-skills [dir]` | Symlink the skills into a consuming repo's `.claude/skills/` |

## Using the skills in another repo

Add vui as a git submodule and run the link script on install, so the links refresh whenever the submodule moves:

```json
{
  "scripts": {
    "prepare": "git submodule update --init && node vui/scripts/link-skills.mjs"
  }
}
```

The script adds a symlink in `.claude/skills/` for each skill and removes links for skills that no longer exist. Commit the symlinks so a fresh checkout has them. To update, bump the submodule and reinstall.

Tools that read a URL rather than a local file can be pointed at the skill pages on the site instead.

## Deploying

Pushing to `main` builds the site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`.

## Contributing

`CLAUDE.md` describes the architecture, the import aliases, and the writing rules for docs. Read `.claude/skills/docs-voice/SKILL.md` before writing or editing any prose under `src/content/` or `skills/`.
