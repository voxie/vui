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
- **Vue reactivity removed.** No `v-if`, no `v-for` over API data, no stores or
  services. Each page is a static Astro page with its data inlined at the top of
  the frontmatter.
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

> Style this page using the Voxie design system. Read `/docs/foundations/color`
> and `/docs/foundations/typography` first, and the component docs under
> `/docs/components/` for anything that maps to an existing component. Add
> Tailwind classes to the existing markup. Do not restructure the HTML, rename
> `data-test` attributes, or change the copy.

Points worth checking in the result:

- Does it use real Tailwind color names, or did it reach for `bg-primary`?
- Do neutrals sit one rung from their background, and does the button carry the
  right `surface` for the card it's in?
- Do all five accents stay at 300?
- Is the default body size `text-sm`?
- Does the dense inbox get a dense treatment, and the wizard a roomy one?
- Do the empty, loading, and error states on `states` get the same care as the
  happy path?

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
else. `_AppShell.astro` holds the navigation bar and page container, shared
across every page so the chrome gets styled once, the way it works in the real
app. Both start unstyled.

`index.astro` is the exception: it carries a little styling of its own so the
list stays readable.

## Resetting

These are fixtures, so they need to survive being styled. Before handing a page
to an agent, note the commit; `git checkout -- src/pages/test-pages/` puts every
page back to raw markup.
