---
name: vui-foundations
description: The Voxie UI (vui) visual rules for building or reviewing any screen, mockup, or HTML prototype that should look like the Voxie product. Read this before choosing colors, surfaces, text styles, button styles, or icons. Covers the slate surface ladder, when an accent color is allowed and at which weight, text colors, the Inter type scale and weights, card and button shapes, and Font Awesome icon usage. Also use it to check a finished page against the system.
---

# Voxie UI foundations

Voxie is a dense product that should feel light and approachable. Soft shapes, quiet slate surfaces, a small set of accents used deliberately, and content that lifts off a grey page. Tailwind classes are the vocabulary. Use real color names (`bg-slate-200`, `text-sky-700`), never semantic aliases like `primary` or `danger`.

The full reasoning and every measured value lives in the docs. This file is the working summary. When something here leaves room for doubt, the docs win: `/docs/foundations/color`, `/docs/foundations/typography`, `/docs/foundations/icons`, `/docs/components/button`, `/docs/components/card`.

## Surfaces

Almost everything is slate. The page is `bg-slate-200`. Panels rise above it or sink below it.

| Surface | Classes | Use |
| --- | --- | --- |
| default | `bg-white shadow-sm rounded-2xl` | The workhorse card: callouts, stats, dashboard panels, list rows |
| glass | `bg-slate-50 border border-white shadow-sm rounded-2xl` | Panels holding inputs: settings, forms, sidebars |
| glass raised | `bg-white/80 border border-white shadow-2xl backdrop-blur-lg rounded-2xl` | Floating sticky bars and in-page nav, only on the page background |
| sunken | `bg-slate-300/30 shadow-inner border-b border-b-white rounded-2xl` | Sidebars and collapsible containers |
| dark | `bg-slate-700` | Only the app navigation bar |

Card padding is `p-6` by default, `p-4` for dense rows and sidebars, `p-8` for focused flows and modals, none when the card wraps a table or image. Cards never have hover styles. If a card leads somewhere, put a button in it.

## Neutrals step one rung

A neutral element (a slate button, a chip, a row highlight) sits one rung away from what is behind it. Hover moves one more rung in the same direction.

| Behind it | Neutral | Hover |
| --- | --- | --- |
| white | slate-100 | slate-200 |
| slate-50 | slate-200 | slate-300 |
| slate-200 (page) | slate-300 | slate-400 |
| slate-300/30 | slate-300 | slate-400 |
| slate-700 | slate-600 | slate-500 |

That one-rung step is 1.1:1 to 1.4:1 contrast, which is deliberate and calm. It also means the fill alone never tells someone a control is there. The label carries it. Never signal state with a one-rung neutral shift.

## Accent colors

The palette is sky, teal, amber, rose, violet. Each has a meaning:

- **sky**: the primary action. One per screen, ideally. Also a positive trend on a chart. Voxie uses sky, never green, for "good".
- **teal**: success or completion.
- **amber**: caution, nothing broken. Sparingly, attention outside warning semantics (the Quick Blast button).
- **rose**: destructive or failing. Delete, disconnect, error.
- **violet**: accent with no status. Sparingly. Current uses: AI, segments, badge callouts.

An accent appears at exactly one of two weights:

- **Controls** (anything pressable) rest at 300 with a black label. Hover is 400. `bg-sky-300 hover:bg-sky-400 text-black`. Accents hold this value on every surface, including the dark bar.
- **Labels** (read only: badges, alerts) use the tint. 100 fill, 900 text, 300 border, 500 icon. `bg-sky-100 text-sky-900 border border-sky-300`.

Be reserved. If everything has a color, nothing is important. A word is the default, and color, bold, an icon, or a chart is justified only when the word alone does not carry the meaning.

## Text

Four text colors on a surface, and only four:

| Color | Use |
| --- | --- |
| slate-700 | Body copy. The default. Never black or slate-950 for body. |
| slate-800 | Headings, strong, code, anything cutting through a paragraph |
| slate-500 | Supporting copy that steps back, never a disabled state. Only at large sizes on the page background or sunken surface. |
| sky-700 | Links. sky-600 fails AA on white, so links stay at 700. |

Labels on a fill are black on any accent 300 and on white through slate-300, white on slate-600 and slate-700, and the 900 of the hue on a 100 tint. White on a light fill is never right.

## Typography

Inter, self-hosted variable. The default size is `text-sm`, since this is working UI, not reading material.

| Size | Use |
| --- | --- |
| `text-5xl leading-none` | Stat callouts |
| `text-2xl xl:text-3xl` | Page headings on the page background |
| `text-xl` | Card headings at the top of the range, `h2`, `h1` inside a card |
| `text-lg` / `text-base` | Card headings and sub content |
| `text-sm` | Body copy, sidebar headings |
| `text-xs` | Dense UI |
| `text-2xs` (10px, custom) | Small badges, calendar day labels. Never a heading. |

Headings are `font-extrabold`, and `font-semibold` when nested or sitting back. Body is normal weight. Weight does the work of size, so headings stay close in size. Never all caps. Leading is `leading-relaxed` for multi-line body, `leading-snug` for most headings, `leading-tight` for compact controls, `leading-none` for the largest. Numbers are tabular (`tabular-nums` on `body`). In dense lists, headings truncate to one line and body clamps to two. Elsewhere let text wrap, with `text-balance` on headings.

## Buttons

`font-semibold`, `whitespace-nowrap`, label black on any light fill. Sizes:

| Size | Classes |
| --- | --- |
| xs | `h-6 px-2 text-xs rounded-lg` |
| sm | `h-8 px-3 text-xs rounded-lg` |
| md (default) | `h-10 px-4 text-xs rounded-xl` |
| lg | `h-12 px-5 text-sm rounded-xl` |
| xl | `h-16 px-8 text-sm rounded-2xl` |

Slate is the default fill and follows the one-rung table above. Reach for a color only when the button earns it. Outline drops the fill and keeps the border. White has no border and needs a colored or dark surface, or a shadow. Transparent has no fill until hover. Disabled is `opacity-50` with pointer events off. When a card, bar, or modal ends in two buttons, the primary goes on the right and fills the width, the secondary sits left at its own width.

## Icons

Font Awesome Pro, classic solid by default, classic regular for a few outlines like the clipboard and the star. An icon is `<i class="fa-solid fa-users"></i>`. Size and color come from Tailwind text utilities, never `fa-lg` or `fa-2x`. Light, duotone, sharp, and brands are not installed and fall back silently or render nothing. The font files are licensed and stay out of public repos, so a prototype vendors them locally rather than linking a kit.

## Review checklist

- Page is slate-200 with white or glass cards. Nothing white sits directly on white.
- Body text is slate-700, headings slate-800 extrabold, links sky-700.
- Every neutral control is one rung from its background, and its label carries the contrast.
- Each accent appears at 300 (control) or the 100 tint (label), never elsewhere.
- One sky primary action per screen. Good is sky, not green.
- Default text is `text-sm`. No all caps. Corners are `rounded-2xl` on cards, `rounded-xl` on default buttons.
- Icons are `fa-solid` or `fa-regular` only, sized with text utilities.
