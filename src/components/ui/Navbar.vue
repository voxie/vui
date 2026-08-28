<script lang="ts">
/*
  The whole fold, as arithmetic. Exported and kept clear of the DOM so it can
  be reasoned about — and tested — on its own, which is where every bug in
  this component has lived.
*/
export function foldCount(input: {
	widths: number[];
	rowWidth: number;
	gap: number;
	moreWidth: number;
	/*
	  True when the menu holds something of its own — side actions the caller
	  has moved into it — so the More button is on the row whether or not any
	  section folds, and its width has to be held back either way.
	*/
	moreAlways?: boolean;
}): number {
	const { widths, rowWidth, gap, moreWidth, moreAlways = false } = input;

	/*
	  Everything fitting is its own case, because then there is usually no More
	  button and its width mustn't be held back. Checking it first is what lets a
	  bar with room for five sections show five, rather than four and a More.
	*/
	const total = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, widths.length - 1);
	if (total + (moreAlways ? moreWidth + gap : 0) <= rowWidth) return widths.length;

	const available = rowWidth - moreWidth - gap;
	let used = 0;
	let count = 0;

	for (const width of widths) {
		const cost = width + (count > 0 ? gap : 0);
		if (used + cost > available) break;
		used += cost;
		count += 1;
	}

	/*
	  One section left on the bar reads worse than none: it looks like the whole
	  navigation until you find the More button beside it. So the last one goes
	  into the menu too, and the trigger becomes a hamburger.
	*/
	return count === 1 ? 0 : count;
}

/*
  The one threshold JS has to know: below this the bar is a phone. It has to
  match the `@min-[40rem]` container queries in the template, and it's in `rem`
  for the same reason they are — both then track the reader's text size, and a
  zoomed page doesn't end up with the CSS and the JS disagreeing about which
  side of a breakpoint the bar is on.
*/
const NARROW_BAR_REM = 40;

function remPx(rem: number): number {
	return rem * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
}
</script>

<script setup lang="ts">
import {
	Comment,
	Fragment,
	Text,
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	onUpdated,
	provide,
	ref,
	useSlots,
	type VNode,
} from 'vue';
import Button from './Button.vue';
import NavbarAction from './NavbarAction.vue';
import { provideSurface } from './surface.ts';

/*
  The container is a wrapper around the bar, not the bar, so attributes from the
  caller — `aria-label`, most importantly — have to be aimed at the `<nav>`
  rather than at the box that only exists to be queried.
*/
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		surface?: 'glass' | 'dark';
	}>(),
	{ surface: 'dark' },
);

const slots = useSlots();

/*
  A `v-for` in the slot arrives as one fragment, so the sections have to be
  unwrapped before they can be counted against the measured widths. Comments
  are what a false `v-if` leaves behind; whitespace comes with any multi-line
  slot. Both would throw the count off against the DOM.
*/
const flatten = (nodes: VNode[]): VNode[] =>
	nodes
		.flatMap((node) => (node.type === Fragment ? flatten(node.children as VNode[]) : node))
		.filter(
			(node) =>
				node.type !== Comment && !(node.type === Text && !String(node.children ?? '').trim()),
		);

const actionNodes = () => flatten(slots.default?.() ?? []);
const isAction = (node: VNode) => node.type === NavbarAction;

const containerEl = ref<HTMLElement | null>(null);
const rowEl = ref<HTMLElement | null>(null);

/*
  Deciding what fits is split in two, because the two halves change at
  different times.

  A section's width doesn't depend on how wide the bar is — nothing on the row
  wraps or shrinks, so a section is the same 112px in a 700px bar as in a
  1400px one. It only changes when its label or its font changes. So the
  widths are held in a cache, and every resize is arithmetic over that cache:
  no re-render of the full set, and no layout read.

  What feeds the cache is the rail, at the bottom of the template: a hidden
  copy of every section that stays rendered whether or not the real one has
  folded, so there is always an element to read a width from — and, more to the
  point, an element to watch. The observer reports when any copy changes size,
  whatever the cause, and the cache is read again. Nothing here has to guess
  when that is.

  The cache is only valid while a width is independent of the bar. If a label
  were ever allowed to wrap, a section's width would depend on the space it was
  given, and this would have to go back to measuring on every pass.
*/
const widths = ref<number[]>([]);
const moreWidth = ref(0);
const rowWidth = ref(0);
const containerWidth = ref(0);

/*
  Before the first read, `measured` is false and the bar shows everything:
  that's what renders on the server and what someone without JavaScript keeps,
  which is every section as a plain link rather than a hamburger that can't
  open. The rail waits for `mounted` for the same reason — the server sends the
  navigation once, not twice.
*/
const measured = ref(false);
const mounted = ref(false);
const visibleCount = ref(0);

const showAll = () => !measured.value;
const barNodes = () => (showAll() ? actionNodes() : actionNodes().slice(0, visibleCount.value));
const overflowNodes = () => (showAll() ? [] : actionNodes().slice(visibleCount.value));

/*
  What the caller has put in the menu on top of the folded sections. The nodes
  are counted rather than the slots, because a slot that renders nothing —
  everything in it behind a `v-if` on `narrow`, which is the whole point of
  these two — would otherwise be enough to put a More button on a bar that has
  nothing to fold.
*/
const nestedNodes = () => [
	...flatten(slots['nested-before']?.({ narrow: narrow.value }) ?? []),
	...flatten(slots['nested-after']?.({ narrow: narrow.value }) ?? []),
];

/*
  The trigger is a hamburger only once the arithmetic has run and left nothing
  on the row. The server render shows the word, and so does the rail's copy —
  the wider of the two, and so the width the fold holds back.
*/
const hamburger = () => measured.value && visibleCount.value === 0;

const showOverflow = () => overflowNodes().length > 0 || nestedNodes().length > 0;

/*
  Anything focused inside the row can be destroyed by a fold, in two ways: the
  sections that moved into the menu are unmounted, and the More button swaps
  its label for the hamburger, which is enough to destroy it while it has
  focus. Left alone, focus falls to the body mid-interaction.

  Both cases end the same way. If what had focus has gone, focus goes to the
  More button, which is where the section itself went.
*/
const focusedOnRow = () => {
	const active = document.activeElement;
	return active instanceof HTMLElement && rowEl.value?.contains(active) ? active : null;
};

const restoreFocus = async (anchor: HTMLElement | null) => {
	if (!anchor) return;
	await nextTick();
	if (anchor.isConnected) return;
	rowEl.value?.lastElementChild?.querySelector<HTMLElement>('button, a[href]')?.focus();
};

const applyCount = async (next: number) => {
	const anchor = focusedOnRow();
	visibleCount.value = next;
	await restoreFocus(anchor);
};

const decide = () => {
	if (!measured.value) return;
	const row = rowEl.value;
	if (!row) return;

	/*
	  A phone is the one width the arithmetic doesn't get a say in. Everything
	  goes into the menu there, whether or not a section or two would fit,
	  because the side slots have already given the menu what they were holding
	  — and a bar that shows two sections while the button you actually came for
	  is behind a hamburger has its priorities backwards. Widening from there
	  brings back what was moved first, and only then the sections.
	*/
	const next = narrow.value
		? 0
		: foldCount({
				widths: widths.value,
				rowWidth: rowWidth.value,
				gap: parseFloat(getComputedStyle(row).columnGap) || 0,
				moreWidth: moreWidth.value,
				moreAlways: nestedNodes().length > 0,
			});
	if (next !== visibleCount.value) applyCount(next);
};

const railEl = ref<HTMLElement | null>(null);

/*
  The rail holds every section followed by the More button, in that order, so
  the two are told apart by position rather than by marking up the elements to
  say which is which.
*/
const readRail = () => {
	const rail = railEl.value;
	if (!rail) return;
	const children = Array.from(rail.children) as HTMLElement[];
	widths.value = children.slice(0, -1).map((child) => child.offsetWidth);
	moreWidth.value = children.at(-1)?.offsetWidth ?? 0;
	measured.value = true;
};

/*
  One `ResizeObserver` for everything the fold depends on, rather than a window
  listener, because what matters is the bar's own width and not the window's —
  the two differ any time the bar sits in a column, a split pane, or beside a
  sidebar that can collapse.

  The same observer watches the rail's items, so a section that changes width
  for any reason at all — a label that changes, a font that arrives (the icon
  font too, which a kit fetches only once something asks for a glyph), a reader
  who changes their text size — is reported the same way, and the cache is read
  again. There's no separate listener for fonts, or for anything else: a
  changed width is a changed box, and the box is what's watched.

  It can't feed back on itself. The row is `min-w-0`, so its width comes from
  the bar and the two slots, never from the sections inside it; folding changes
  what is in the row without changing the row. And the rail renders every
  section whatever the fold decides, so what the fold does can't change what
  the rail measures.
*/
let observer: ResizeObserver | undefined;

const readEntry = (entry: ResizeObserverEntry) =>
	entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;

/*
  Which rail items are observed has to follow which ones exist, so this is
  re-synced after every render — the render is where the elements come from.
  A change in the set is read straight away rather than left to the observer:
  a section that was removed has no element left to report through, and one
  that was added would otherwise fold a frame late.
*/
const observedRail = new Set<Element>();

const syncRail = () => {
	if (!observer) return;
	const current = new Set<Element>(railEl.value?.children ?? []);
	let changed = false;
	for (const el of observedRail) {
		if (current.has(el)) continue;
		observer.unobserve(el);
		observedRail.delete(el);
		changed = true;
	}
	for (const el of current) {
		if (observedRail.has(el)) continue;
		observer.observe(el);
		observedRail.add(el);
		changed = true;
	}
	if (!changed) return;
	readRail();
	decide();
};

onMounted(async () => {
	mounted.value = true;
	await nextTick();

	observer = new ResizeObserver((entries) => {
		let railChanged = false;
		for (const entry of entries) {
			if (entry.target === rowEl.value) rowWidth.value = readEntry(entry);
			else if (entry.target === containerEl.value) containerWidth.value = readEntry(entry);
			else railChanged = true;
		}
		/*
		  Layout is clean inside this callback — it runs after layout and before
		  paint — so reading the rail here forces nothing. The threshold is read
		  again too, so a changed text size can't leave the JS and the CSS on
		  different sides of it. On a plain resize neither happens and this is
		  arithmetic over ten numbers. No debounce: the observer is already
		  throttled to a frame, and waiting longer only makes the bar lag behind
		  the drag.
		*/
		if (railChanged) readRail();
		navSm.value = remPx(NARROW_BAR_REM);
		decide();
	});
	if (containerEl.value) observer.observe(containerEl.value);
	if (rowEl.value) observer.observe(rowEl.value);

	/*
	  Read once now rather than waiting for the observer's first report, which
	  arrives a frame later: the bar's first paint should already be folded,
	  not a frame of everything. Everything on the rail is new to the observer
	  at this point, so syncing it is what reads it.
	*/
	navSm.value = remPx(NARROW_BAR_REM);
	rowWidth.value = rowEl.value?.clientWidth ?? 0;
	containerWidth.value = containerEl.value?.clientWidth ?? 0;
	syncRail();
});

onUpdated(syncRail);

onBeforeUnmount(() => {
	observer?.disconnect();
});

/*
  Two things need to know when the bar is down to phone width. Descendants, so
  a submenu inside a menu collapses rather than sitting open — provided from
  here so there is one observer and one threshold, and so it's the same width
  the container queries are reading: the nav's content box, which is what
  `@container` resolves against. And the four slots that can put something on
  the bar, so a bar with no room left is answered in one place: what can't stay
  on it goes into the menu.

  It's the container's width and not the fold's verdict on purpose. Moving
  something out of a side slot makes the row wider, which could make the
  sections fit, which would put it back — a bar that flickers between two
  layouts at one window size. The container's width doesn't move when the slots
  do, so this can't feed back on itself.

  Before the first measurement it's false, which is the roomy layout: that's
  what renders on the server and what someone without JavaScript keeps.
*/
const navSm = ref(0);
const narrow = computed(
	() => navSm.value > 0 && containerWidth.value > 0 && containerWidth.value < navSm.value,
);
provide('navbarNarrow', narrow);

// The bar's two surfaces are Card's two, under the same names: `glass` is
// slate-50 and `dark` is slate-700.
const surfaceClasses = computed(() => (props.surface === 'glass' ? 'bg-slate-50' : 'bg-slate-700'));

/*
  Everything in the bar sits on the bar, so the bar says so once rather than
  handing the value to each of them. That covers the sections, the More button
  it draws itself, and whatever the caller puts in a side slot — slot content is
  mounted inside the bar, so it inherits from the bar and not from wherever it
  was written.
*/
provideSurface(() => props.surface);

// One height: 64px, and 80px once the bar has the room for it.
const heightClasses = 'h-16 @min-[40rem]/navbar:h-20';
</script>

<template>
	<!--
		A container can't answer its own queries, so the bar's height and padding
		need a box outside them to measure. It carries the stacking too: naming a
		container makes this a stacking context, so `z-30` has to sit here or an
		open menu would fall behind whatever follows the bar.
	-->
	<div ref="containerEl" class="@container/navbar relative z-30">
		<!--
			The bar's own gap is a constant, and has to be. The row between the two
			slots is what the fold is decided against, so anything that moves the
			row's width is read back into the count that produced it: tighten the
			gap when the bar folds to a hamburger and the row gains those pixels,
			which is enough for a section to fit again, which puts the sections
			back, which widens the gap. The bar flickers between two layouts at one
			window size. The hamburger's own tightening is a margin on the button
			instead, down on the row.
		-->
		<nav
				v-bind="$attrs"
				class="relative flex max-w-full items-center gap-4 px-4 shadow-sm @min-[40rem]/navbar:px-6 @min-[48rem]/navbar:px-8"
				:class="[surfaceClasses, heightClasses]"
			>
			<!-- A logo is not a list item, so the two side slots stay plain boxes.
			     Both space their children the same way, since either can hold more
			     than one thing — the logo beside a couple of actions, say.

			     Two rhythms on the bar, and this is the tighter one. Filled
			     controls sit 16px from each other inside a slot; a section, being
			     a bare label, takes the 24px the bar itself is spaced at. -->
			<div v-if="$slots.left" class="flex h-full shrink-0 items-center gap-2 @min-[64rem]/navbar:gap-4">
				<slot name="left" :narrow="narrow" />
			</div>

			<!--
				The row is a list, which is what a row of navigation links is — and it
				is also the element that gets measured, so the semantics and the
				measurement are one element rather than a wrapper each.

				`min-w-0` is what makes the measurement mean anything: without it a
				flex item refuses to shrink below its content, so the row would push
				itself wider than the bar and every section would look like it fits.
				Nothing on the row shrinks either, for the same reason — the fold moves
				sections, it doesn't squeeze them.

				One rhythm, the side slots' own: a section is a transparent button, so
				it spaces like the buttons it sits between rather than like the bare
				labels it used to be. The fills each one lights on hover would run
				together any closer, and 24px apart they would read as a row of
				strangers.

				The last thing in the row — the More button, and by the time it's a
				hamburger the only thing in it — is pulled into the tighter rhythm: one
				button next to the buttons in the left slot, where the bar's 16px reads
				as a gap in a row of them. A margin on the child and not the bar's gap,
				for the reason given up there: the row's width is what the fold is
				decided against, and this leaves it alone. Set from out here so it
				lands on the list item, which is the box the marker and the open panel
				are both measured from.
			-->
			<ul
				ref="rowEl"
				class="flex h-full min-w-0 grow items-center [&>*]:shrink-0"
				:class="{ '[&>*:last-child]:-ms-2': hamburger() }"
			>
				<component
					v-for="(node, index) in barNodes()"
					:is="node"
					:key="node.key ?? `action-${index}`"
					v-bind="isAction(node) ? { nested: false } : {}"
				/>

				<NavbarAction v-if="showOverflow()">
					<!-- The hamburger only appears when nothing fits, where its width
					     no longer matters. The width the fold holds back is the word's,
					     read from the rail's copy, which always shows it.

					     It's slate on whichever surface the bar is, one step off it,
					     the same way any other slate button behaves, and it reads that
					     surface from the bar like everything else in here. -->
					<Button v-if="hamburger()" size="sm" color="slate">
						<i class="fa-solid fa-bars fa-width-auto text-sm" aria-hidden="true"></i>
						<span class="sr-only">Menu</span>
					</Button>
					<span v-else>More</span>

					<template #items>
						<slot name="nested-before" :narrow="narrow" />
						<component
							v-for="(node, index) in overflowNodes()"
							:is="node"
							:key="node.key ?? `overflow-${index}`"
							v-bind="isAction(node) ? { nested: true } : {}"
						/>
						<slot name="nested-after" :narrow="narrow" />
					</template>
				</NavbarAction>
			</ul>

				<div class="flex h-full shrink-0 items-center gap-2 @min-[64rem]/navbar:gap-4">
					<slot name="right" :narrow="narrow" />
				</div>
		</nav>

		<!--
			The rail: every section once more, then a More button, so there is
			always an element to read a width from and an element to watch. The same
			vnodes with the same props inside the same container, at the
			container's height, so a copy is laid out the way its original is and
			what it measures is what the row would render. Kept out of everything —
			`invisible` takes it out of the accessibility tree and hit-testing,
			`inert` out of focus and find-in-page — and clipped to the container, so
			a rail wider than the bar can't hand the page a scrollbar. Copies are
			held closed: a panel has no width to contribute, and this is not where
			one should open.
		-->
		<ul
			v-if="mounted"
			ref="railEl"
			aria-hidden="true"
			inert
			class="invisible absolute inset-0 flex items-center overflow-hidden [&>*]:shrink-0"
		>
			<component
				v-for="(node, index) in actionNodes()"
				:is="node"
				:key="node.key ?? `rail-${index}`"
				v-bind="isAction(node) ? { nested: false, open: false } : {}"
			/>
			<NavbarAction><span>More</span></NavbarAction>
		</ul>
	</div>
</template>
