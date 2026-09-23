# Design System Test Pages

Nine pages of real production markup, pulled from the `voxie` app
(`~/Developer/Voxie/voxie/resources/js/components/`), stripped of every Tailwind
class, and filled with static test data. They render as raw semantic HTML.

The point is to have a fixture that is honest about what the product actually
has to lay out — dense tables, a two-pane inbox, a wizard, a settings column —
without any existing styling steering the result.

Browse them at `/test-pages`.

## What was changed from the source

- **All Tailwind classes removed.** No `class` attributes survive except
  FontAwesome icon classes, which are functional rather than stylistic.
- **`@voxie/frontend-components` stripped to plain HTML.** `VxButton` →
  `<button>`, `VxInput` → `<input>` with a real `<label>`, `VxTable` →
  `<table>`, `VxExpandableCard` → `<section>` with a heading and a disclosure
  button, `VxBadge` → `<span data-test="badge">`, `VxSelectable` →
  `<select>`. The existing library carries its own visual opinions, so leaving
  it in would prejudge the exercise.
- **Vue reactivity removed.** No stores, services, or API data. Each page is a
  Vue file with its data inlined in `<script setup>`, looping over that data
  with `v-for` and nothing more. A thin `.astro` page mounts it. The markup is
  Vue rather than Astro so the design-system components an agent swaps in share
  one tree: Astro renders a nested Vue component as a separate app, so a Button
  written into an `.astro` file can't read the Card or Navbar around it, and a
  Navbar can't measure or fold its actions.
- **Production `data-test` attributes kept.** They are the best available
  semantic hint for what an element is now that the classes are gone —
  `data-test="stat-card"`, `data-test="sticky-footer"`, `data-test="badge"`.
- **Interactive states rendered open.** Dropdown menus, filter forms, and
  expandable cards are shown expanded rather than collapsed, so their contents
  are visible and styleable without JavaScript. The modal on `states` renders
  inline for the same reason.
- **Test data is invented.** No real customer names, phone numbers, or message
  content. Phone numbers use the 555-01xx reserved range.

## The brief

The brief an agent gets, its rules, and the review checklist live on `index.astro`, rendered at `/test-pages`. That copy is the only one: it builds its reading list from the docs collection, so it lists every foundation, component, and pattern page that currently exists rather than a snapshot of them.

## Pages

| Page | Source | What it exercises |
| --- | --- | --- |
| `dashboard` | `home/HomeCorporate.vue` | Unequal 12-column grid, promo panel, icon list, categorical chart, stat tiles |
| `contacts-list` | `contacts/contact/ContactList.vue` | Filter bar, data table that reflows to cards, badges, row overflow menus, cursor pagination |
| `contact-detail` | `contacts/contact/form/ContactForm.vue` | Nested sidebar, info alert, stacked expandable cards, dense form, field error, tag chips, sticky footer |
| `campaigns-list` | `campaigns/list/CampaignList.vue` | Overview strip, dismissible callout, every badge color in one column |
| `message-hub` | `message-hub/MessageHub.vue` | Full-height two-pane split, uniform-height list rows, message clouds, composer action bar |
| `quick-blast` | `quick-blast/QuickBlast.vue` | Centered narrow column, step nav, complete/active/upcoming steps, option tiles, SMS preview |
| `analytics-dashboard` | `analytics/AnalyticsDashboard.vue` | Stat tiles with deltas and an empty value, chart frames, date-range controls, wide table |
| `settings-security` | `settings/security/SecuritySettings.vue` | Narrow settings column, expandable cards, alerts, password fields, destructive section |
| `states` | Composite | Banners, four alert colors, empty states, loading and skeletons, errors and 404, badges, toasts, a modal |

## Layout

`src/layouts/TestPageLayout.astro` is a bare shell — Tailwind and Inter, nothing
else. `_AppShell.astro` holds the page container and mounts `_AppNavbar.vue`,
the navigation bar. Both are shared across every page so the chrome gets styled
once, the way it works in the real app. Everything starts unstyled.

Each page is two files: `_PascalCase.vue` with the markup and data, and
`kebab-case.astro`, which mounts it inside the shell with `client:load`. An
agent styles the Vue file.

`src/styles/global.css` carries `@source "../pages/trial"`. The trial folder is
gitignored and Tailwind skips ignored files when it scans, so without that line
a styled trial page loses every class not already used somewhere else.

`index.astro` is the exception: it carries a little styling of its own so the
list stays readable.

## Running a trial

A trial never touches these files. `npm run trial -- --docs` or `npm run trial
-- --skills` copies every page and the shell into `src/pages/trial/`, rewriting
the links between pages so the copy stays self-contained, and the agent styles
that copy. It serves at `/trial/…` next to the raw page at `/test-pages/…`. The
folder is in `.gitignore`, so a trial can't be committed, and the fixtures here
stay ordinary source that can be edited and committed like anything else.

The flag picks the reference. A docs trial has the agent read the docs pages. A
skills trial symlinks the consumer skills from `skills/` into `.claude/skills/`,
so Claude Code sees them here the way it does in a consuming repo, and the brief
keeps the docs closed. Running the same page both ways shows what the skills
lose. The links are ignored by git and go away with the trial.

Start a docs trial in a fresh Claude Code session: run `npm run trial -- --docs`
first, then open the session. Claude Code picks up a newly linked skill while a
session is running, but a session that already loaded the skills during a skills
trial may hold on to them after the docs trial unlinks the files. A new session
reads `.claude/skills/` from scratch and sees only `docs-voice`.

The script refuses to overwrite an existing trial. `npm run trial -- --fresh --docs`
or `--fresh --skills` starts over, and `npm run trial -- --remove` deletes the trial and unlinks the
skills. A bare `rm -rf src/pages/trial` leaves the links behind.
