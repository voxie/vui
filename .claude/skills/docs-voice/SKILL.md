---
name: docs-voice
description: The house writing style for this repo's prose. Read this before writing or editing any MDX page under src/content/docs, any file in src/content/skills, or any prose-heavy comment in a component. Also use it for a cleanup, tightening, or copy-edit pass on an existing page ("clean up the button doc", "this reads long", "fix the voice"). Covers the hard rules (say only what helps someone use it, no em dashes, one idea per sentence, no reveal constructions, no "we"), the split between behavior and the author's direction, the voice, page structure, and how to run a cleanup pass.
---

# Docs voice

`src/content/docs/components/button.mdx` is the reference page. When a rule below leaves room for doubt, read how that page handles it.

## Hard rules

These are not preferences. Fix them on sight, in new prose and in prose you are editing for another reason.

**Say only what helps someone use it.** A page covers what the component does, how to use it, and what goes wrong when it is used badly. Design reasoning and implementation detail stay out unless they change what the reader would do. The author's direction is not reasoning and stays, see [Behavior and direction](#behavior-and-direction). One sentence of why is usually enough. A paragraph of why means the page is explaining itself instead of the component. Explain a thing once, on the page that owns it, and link to it from everywhere else.

**No em dashes.** Use a period, a comma, or parentheses. An em dash almost always joins two ideas that should be two sentences, so prefer the period. An en dash inside a numeric range (`10–12px`, `100–900`) is a different character and is fine.

**One idea per sentence.** Prefer short declarative sentences. If a sentence has a comma-spliced aside, a trailing clause, and a parenthetical, it is three sentences.

**No reveal constructions.** Two shapes to avoid:

- Negation that leads. "Not one of them is told anything", "it isn't A so much as B". State the thing that is true and drop the setup. A trailing ", not Y" is a different thing. It heads off a misreading the reader could actually have ("renders an `<a>`, not a `<button>`"), and it stays. Cut it when nobody would have assumed Y.
- A colon that sets up a payoff. "Transparent is the quietest option: no fill until you hover it." If the colon could be a period, make it one. A colon introducing a list, a table, a code fence, or an embedded example is fine.

**No "we".** The system is the subject and the reader is "you". "The page background is slate-200", never "we use slate-200 for the page background". Same for "our" and "us".

**No abbreviations.** No e.g., i.e., or etc. Write "such as" or "like", and either finish the list or stop it cleanly.

**Links live inside the sentence.** A link is part of the sentence that explains the thing, never a sentence of its own tacked on after it. "[Button](/docs/components/button#two-buttons) has the layout" and "See [Button](/docs/components/button)" are the shapes to cut. Put the link on the words the reader would already be reading ("When a form ends in [two buttons](/docs/components/button#two-buttons), ..."), or on a phrase that names what's at the other end ("For the full rule and an example read [two buttons](/docs/components/button#two-buttons)").

**Never hard-wrap prose.** A paragraph, a list item, or a comment is one line, however long it runs. Code fences, tables, and JSX keep whatever line structure they need.

## Before and after

Two ideas welded with an em dash, split:

> A button in a dark card is on `dark` without being passed anything — including a button in a slot, like the one in the bar's `#right`, which reads the bar it's mounted in rather than the file it was written in.

> A Card and a Navbar announce their surface to everything inside them, slots included.

Colon reveal plus a stacked list, unpacked into one rule per sentence:

> Reach for a color only when the button earns it: sky for the primary action on a screen, rose for something destructive, and teal, amber, or violet for their usual meanings — success, caution, and accent.

> Reach for a color only when the button earns it. Sky is the primary action on a screen. Rose is for something destructive. Teal, amber, and violet carry their usual meanings (success, caution, accent).

Leading negation, stated plainly:

> Not one of the buttons below is told anything.

> Every button below is passed nothing.

Direction re-voiced, with every claim kept:

> Can also be used sparingly to draw attention outside warning semantics e.g. the Quickblast feature uses this for its button color.

> Sparingly, it also draws attention outside warning semantics. The Quick Blast button uses it that way.

Writing "The Quick Blast button is the one case today" instead would turn an example into a rule. That is a change in direction, not in voice.

The team as the subject, replaced by the system:

> For the main content, we use the tailwind container class with a max width and padding.

> The main content sits in Tailwind's `container`, with a max width and padding.

A link tacked on as its own sentence, folded into the sentence it belongs to:

> When a form ends in two buttons, the primary goes on the right and fills the width. [Button](/docs/components/button#two-buttons) has the layout.

> When a form ends in [two buttons](/docs/components/button#two-buttons), the primary goes on the right and fills the width.

## Behavior and direction

Every page has two kinds of sentences, and they are handled differently.

**Behavior** is what the component does. Props, values, what renders, what happens on hover, the numbers. It comes from the source. Check it against the code and fix it when the code disagrees.

**Direction** is where and when to use the thing. "Slate should stay the answer for most badges." "Only the app navigation bar is dark." "Use glass for panels that hold inputs." It cannot be read from the code. It comes from the author and belongs to the author.

- Never invent direction. If a new page needs it, ask for it, or leave it out and say the page has none yet. A page with no usage guidance beats a page with guessed usage guidance.
- Never add to, remove, or shift direction while editing. A voice pass changes how a sentence is written and nothing about what it says. "Sparingly" does not become "rarely", an example does not become the only case, "typically" does not disappear, and a rule about a situation does not gain or lose a situation.
- Direction is exempt from the brevity rule. It always changes what the reader would do.
- When direction seems to contradict the source or another page, leave it and flag it. Deciding is the author's job.
- In a cleanup report, list every direction sentence you reworded so the author can check the meaning survived.

Telling them apart: behavior describes ("The `color` prop sets the fill"). Direction instructs, or states a product fact ("Reach for a color only when the button earns it", "Message Hub and Quick Blast outrank the sections").

## Voice

Write like a colleague explaining the component at a desk. Plain, concrete, a little dry. Contractions are fine. The reader is a designer or engineer who wants to use the thing correctly.

- Present tense, active voice. "A slate button steps one level away from its surface", not "the surface will be stepped away from".
- Say what to do and why, in that order. The reason is usually one clause, not a paragraph.
- Name the failure mode when there is one. "A bare button on the page comes out slate-100 on slate-200, which is hard to see and easy to miss" earns its place. Vague caution ("be careful with surfaces") does not.
- Every number, and every claim about what a component does, is measured or read from the source. Open the component or the example file. A guessed number is worse than no number. Direction is the exception, since it has no source but the author.
- Contrast is written `10.4:1` for WCAG 2.x and `Lc 98` for APCA. Lengths are `64px` and `40rem`, with no space. Ranges take an en dash: `10–12px`.
- Props, values, slot names, and surface names go in backticks. Colors in running prose do not, so "sky" and "slate-300" are bare when you are talking about them as colors.
- Bold is for a label as it appears on screen, like the **More** button, and for a term at the point the sentence defines it. It is not for emphasis. Keys go in `<kbd>`.
- Link another page at its first mention, and again later where the reader would want to jump. The link text is the page title, or the words in the sentence that name what's at the other end, and the link sits inside the sentence that explains the thing. The path is absolute: `[Card](/docs/components/card)`, `[Color](/docs/foundations/color)`. A section on another page takes its anchor: `[SurfaceProvider](/docs/components/card#a-surface-that-isnt-a-card)`.
- No marketing adjectives. Nothing is powerful, seamless, or robust.
- Second person is fine and normal. "Leave `sitsOn` off and you get..." reads better than a passive equivalent.

## Page structure

The frontmatter `title` is Title Case. An H2 is one word where one word covers it (Examples, Interaction, Contrast). An H3 is sentence case and plain English, and names the prop's job rather than the prop. Card's `as` prop is documented under "Element".

A component page under `src/content/docs/components/` runs:

1. Frontmatter with `title` and `order`.
2. Imports.
3. An opening that says what the component is and the single thing a reader most needs to know about it. For a simple component that is one short paragraph. A composite component (Navbar) also gets its anatomy, one paragraph naming each sub-component and its job, and a usage code fence.
4. `## Examples`, then an `### H3` per prop or behavior.
5. Under each H3: one or two sentences, then the live example. Prose after the example only when the example raises a question it cannot answer itself.
6. After Examples, whichever of these the component needs:
   - `## Interaction`. What happens on hover, press, and keyboard, and what deliberately does not.
   - `## Contrast`. A table, then prose on what clears, what does not, and what carries the meaning where color alone cannot. The columns are `Fill | Label | WCAG 2.x | APCA` for text on a fill, and `Element | On | WCAG 2.x | APCA` for markers and icons.
   - Anything else the component genuinely needs, like Navbar's `## Folding`.

Value lists get their own sentence. "The `color` prop sets the fill. The choices are `slate` (the default), `white`, ..." The colon form ("The `color` prop sets the fill: `slate`, `white`, ...") is the shape to convert away from. A map of inputs to outputs gets a table instead of a paragraph.

A row of variants is a `<Card>` around a `not-prose` flex row with `gap-3`. A comparison across surfaces is a `not-prose` stack (`space-y-4`) holding one card per surface. `client:load` goes only on a demo that has to be interactive, like `NavbarDemo`.

Live examples are real components, never screenshots or code fences pretending to render. A `<Card>` written in MDX renders its children to HTML before Vue sees them, so a `<Button>` written inside it is a separate Vue app and inherits nothing, its surface included. An example that depends on that inheritance is composed in a single `.vue` file under `src/components/site/`. See `ButtonSurfacesExample.vue`.

A foundations or patterns page has no `## Examples`. It runs an H2 per topic, with swatches, tables, and live examples inline under each. Everything else above applies.

## Running a cleanup pass

1. Grep for the hard rules and fix every hit:

   ```
   grep -nE '—|\b([Ww]e|[Oo]ur|[Uu]s)\b|e\.g\.|i\.e\.|etc\.| so much as |(^|[.!?] )Not [a-z]' <file>
   ```

2. Confirm the page has an opening paragraph and that every H3 has a sentence before its example.
3. Read each paragraph and ask what it is for. Three paragraphs saying "this happens automatically" is one paragraph. A paragraph that changes nothing about what the reader would do is zero paragraphs.
4. Split the long sentences. Cut the clauses that only restate the sentence before.
5. Check the prose against the source. Open the component or the example file and confirm the described behavior is what the code does. Stale or slightly-wrong claims are common in prose that has been edited a few times.
6. Leave the markup, examples, and tables alone unless the copy edit changes what they should say.
