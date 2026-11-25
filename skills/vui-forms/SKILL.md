---
name: vui-forms
description: How a Voxie UI (vui) form field is built. Read this when adding an input, select, textarea, or any form to a Voxie screen, mockup, or prototype, or when reviewing one. Covers the five parts of a field, always-present labels, descriptions above the control, no placeholders, the compact inline exception, error and detail messages with marks, the two-button action row and the sticky footer that floats it, required markers, and file uploads.
---

# Voxie UI forms

A form is a column of fields, each carrying its own label, description, and messages. Source of truth: `/docs/patterns/forms`, `/docs/components/input`, `/docs/components/select`, `/docs/components/file-drop`, `/docs/components/action-bar`.

## Anatomy

Top to bottom, a field is up to five parts:

1. **Label.** Always present, apart from the compact case below. `font-extrabold text-slate-800`, sized with the control (`text-xs` on a small field). A form column should scan as a list of questions.
2. **Description.** Only when the label cannot hold what the reader needs before typing. Sits above the control, never below.
3. **The control.** Inputs stand out subtly from a glass card, which is why form cards are usually glass.
4. **Counter.** A bar and a count, only for a field with a length limit.
5. **Message.** One line under the control with a mark at the start. Error: rose-800 with a warning mark. Details: slate-600 with an info mark. Both can show, error first.

## Rules

- **No placeholders.** Grey text in a field reads as an answer, so people skip it, and it vanishes on typing. Put the words in the label or description.
- **Compact fields are the one exception.** A row that reads as a sentence, like automation filters ("When [field] is [value]"), drops the label and lets a placeholder name the field. A field in a form column always takes a label.
- **Color alone never carries an error.** The mark is required. Set `aria-invalid` and `aria-describedby` when a field is in error.
- **Feedback goes below, guidance goes above.** Anything that matters before typing is a description. Anything that matters after is a message.

## Steps

- A long form splits into steps, one glass card each. A step opens with its title (`text-xl font-extrabold text-slate-700`, at whatever heading level fits where it sits in the page), then one `text-sm text-slate-700` line saying what the step is for, then the fields.
- **Required.** Mark every required field and leave optional fields unmarked. There is no Optional badge. `Input` and `Select` render the mark from their `required` prop: a rose `2xs` Badge to the right of the label with an `fa-asterisk` icon. The first required field in a form takes `required="label"`, which spells out **Required**. Every required field after it takes `required`, which shows the asterisk alone with a tooltip saying Required.
- **File uploads.** Use `FileDrop` for a step that takes a file. It accepts a dragged file or a click to browse, and checks `accept` on drop too. Put an amber Alert under it stating the type and size, shown only while no file is chosen. Validation belongs to the caller, passed back through `validating`, `error`, and the default slot.

## Actions

When a form ends in two buttons, the primary goes on the right and fills the width, written last. The secondary sits on the left at its own width. The primary is sky only if it is the screen's primary action. Otherwise it stays slate.

An action bar holds those buttons above the bottom of the window while the form scrolls. In a Vue app with `@voxie/frontend-components` it is `VxStickyFooter`. It renders the glass raised panel, sticky 32px above the bottom, with its content in a row. Write it last, as a direct child of the column that holds the form cards, and cap it at the small card width with `md:max-w-2xl`, even when the cards above it run full width. Wrapped in an element of its own, or inside an ancestor with `overflow-hidden`, it stops floating. It goes on the page background only. The raw HTML below is what the component renders, for prototypes without it.

```html
<div class="sticky bottom-8 z-10 flex w-full items-stretch gap-2 rounded-2xl border border-white bg-white/80 p-4 shadow-2xl backdrop-blur-lg sm:p-6 md:max-w-2xl">
  secondary button, then the primary filling the width
</div>
```

## Review checklist

- Every field has a visible label, extrabold, slate-800.
- No placeholder text outside a compact inline row.
- Descriptions above the control, messages below with a mark.
- The form card is glass and capped at `max-w-2xl`.
- Two-button row: primary right and full width, secondary left.
- An action bar is the last child of the form's column, capped at `max-w-2xl`, on the page background.
- Every required field is marked with the `required` prop, `required="label"` on the first and `required` on the rest. Nothing is marked Optional.
