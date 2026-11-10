---
name: vui-layout
description: How a Voxie UI (vui) page is laid out. Read this when building or reviewing a full screen, page shell, dashboard, create flow, or settings page that should match the Voxie product. Covers the `VxPageLayout` component and its `layout` and `size` props, the navbar plus capped main content, the 12-column card grid, the centered single-column create page, the sidebar layout, card widths, and gap and padding rules.
---

# Voxie UI page structure

Two layout sections make a page. The navbar runs the full width of the window. The main content area has its width capped. Source of truth: `/docs/patterns/page-structure` and `/docs/components/navbar`.

## The component

In a Vue app with `@voxie/frontend-components`, the page is `VxPageLayout`. It renders the container, the padding, and the header. Pass the title and the content; never add padding or a second container around it, and never nest one layout in another. The raw HTML in the sections below is what the component renders, for prototypes without it.

```vue
<vx-page-layout layout="sidebar" size="xl" title="Campaigns" description="…">
  <template v-slot:callout>…</template>     <!-- banner above the header, full page width -->
  <template v-slot:subtitle>…</template>    <!-- grey line above the title, usually a back link -->
  <template v-slot:actions>…</template>     <!-- right side of the header -->
  <template v-slot:sidebar>…</template>     <!-- sidebar layout only -->
  …content…
</vx-page-layout>
```

| `layout` | Use it for |
|---|---|
| `base` (default) | A plain page: a list, a dashboard without a grid, a detail page with no section nav |
| `dashboard` | Cards on the 12-column grid; children carry `col-span-*` |
| `create` | A create form, centered under a centered heading. Create forms only, never a fallback for "no sidebar" |
| `sidebar` | A detail or settings page with section links or filters |

| `size` | Use it for |
|---|---|
| `xl` (default) | The normal page width, including a sidebar page whose sidebar is section navigation |
| `2xl` | A sidebar page whose sidebar is a filter panel, like the analytics pages |
| `full` | Screens that need the whole window, like Message Hub and the kiosk lists |

The header renders only when a title, description, subtitle or actions is given. The title is the page's one `h1`. A back link goes in `subtitle`, never inside the title.

## The shell

```html
<body class="bg-slate-200 text-slate-700 text-sm">
  <nav class="bg-slate-700"> ... </nav>
  <main class="container mx-auto px-4 sm:px-6 md:px-8 max-w-(--breakpoint-xl)">
    ...
  </main>
</body>
```

Message Hub and the workflow builder drop the max width, because that work needs the whole window. Everything else keeps it.

The navbar is the one dark surface (`slate-700`). Neutral controls inside it are slate-600, hover slate-500, with white text. Accent buttons keep their 300 fill.

## Headings and spacing

- The page title sits directly on the page background, `text-2xl xl:text-3xl font-extrabold text-slate-800`. Every other heading sits inside a card with its content.
- The gap between cards is `gap-4 md:gap-6 xl:gap-8` on every layout, and it never exceeds the padding between the container and the window edge.
- The grid lives on the main content, not on `body`, so padding and gaps stay separate from the navbar.

## Base layout

Dashboards, item lists, analytics. A left-aligned 12-column grid filled with cards.

```html
<div class="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
  <div class="col-span-12 md:col-span-8"> card </div>
  <div class="col-span-12 md:col-span-4"> card </div>
</div>
```

## Create pages

Creating a campaign, a segment, a contact. A centered single column, and these are the only pages that center. A flex column with cards centered, each card `w-full md:max-w-2xl`. The page description sits on the page background directly under the heading. The cards are usually glass, since they hold inputs.

## Sidebar pages

Edit screens, analytics, settings. Sidebar and content in a flex row from `md` up, stacked below that.

```html
<div class="flex flex-col md:flex-row gap-4 md:gap-6 xl:gap-8">
  <aside class="md:w-48 lg:w-56 shrink-0"> sunken card </aside>
  <div class="flex-1 min-w-0"> cards </div>
</div>
```

Small cards in the content column are `w-full md:max-w-2xl`, aligned left, the same width as create-page cards. Content that needs room (tables, overviews) uses `w-full`. A settings page mixes both in one column.

## Review checklist

- One `VxPageLayout` per page, with no padding or container added around it.
- `create` only on a create form. `2xl` only beside a filter sidebar.

- Navbar full width, main content capped with the container classes above.
- Page title on the background, all other headings inside cards.
- One consistent gap between cards, matching the container padding.
- Create flows are the only centered pages.
- Form and settings cards cap at `max-w-2xl`. Tables and overviews run full width.
