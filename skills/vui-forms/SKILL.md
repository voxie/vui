---
name: vui-forms
description: How a Voxie UI (vui) form field is built. Read this when adding an input, select, textarea, or any form to a Voxie screen, mockup, or prototype, or when reviewing one. Covers the five parts of a field, always-present labels, descriptions above the control, no placeholders, the compact inline exception, error and detail messages with marks, and the two-button action row.
---

# Voxie UI forms

A form is a column of fields, each carrying its own label, description, and messages. Source of truth: `/docs/patterns/forms`, `/docs/components/input`, `/docs/components/select`.

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

## Actions

When a form ends in two buttons, the primary goes on the right and fills the width, written last. The secondary sits on the left at its own width. The primary is sky only if it is the screen's primary action. Otherwise it stays slate.

## Review checklist

- Every field has a visible label, extrabold, slate-800.
- No placeholder text outside a compact inline row.
- Descriptions above the control, messages below with a mark.
- The form card is glass and capped at `max-w-2xl`.
- Two-button row: primary right and full width, secondary left.
