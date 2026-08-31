<script lang="ts">
// The fold, as arithmetic. Exported and kept clear of the DOM so it can be
// tested on its own. See /docs/components/navbar#folding.
export function foldCount(input: {
	widths: number[];
	rowWidth: number;
	gap: number;
	moreWidth: number;
	// The menu already holds something of its own, so the More button is on the
	// row whatever the fold decides and its width is held back either way.
	moreAlways?: boolean;
}): number {
	const { widths, rowWidth, gap, moreWidth, moreAlways = false } = input;

	// Everything fitting is its own case: no More button, so its width mustn't be
	// held back, or a bar with room for five shows four and a More.
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

	// One section left reads as the whole navigation, so the last one folds too.
	return count === 1 ? 0 : count;
}

// Must match the `@min-[40rem]` container queries in the template, and in rem
// for the same reason they are: text size can't then put the CSS and the JS on
// different sides of the threshold.
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

// `aria-label` and the rest belong on the `<nav>`, not on the wrapper that only
// exists to be container-queried.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		surface?: 'glass' | 'dark';
	}>(),
	{ surface: 'dark' },
);

const slots = useSlots();

// A `v-for` arrives as one fragment, so sections are unwrapped before being
// counted. Comment nodes (what a false `v-if` leaves) and slot whitespace would
// throw the count off against the DOM.
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

// Cached, so a resize is arithmetic rather than a layout read. Filled from the
// rail at the foot of the template. Only valid while a section's width is
// independent of the bar's, which means no label may ever wrap.
const widths = ref<number[]>([]);
const moreWidth = ref(0);
const rowWidth = ref(0);
const containerWidth = ref(0);

// Unmeasured, the bar shows everything: that's the server render, and what
// someone without JavaScript keeps. The rail waits for `mounted` so the server
// sends the navigation once, not twice.
const measured = ref(false);
const mounted = ref(false);
const visibleCount = ref(0);

const showAll = () => !measured.value;
const barNodes = () => (showAll() ? actionNodes() : actionNodes().slice(0, visibleCount.value));
const overflowNodes = () => (showAll() ? [] : actionNodes().slice(visibleCount.value));

// Nodes rather than slots: these two are usually all behind a `v-if` on
// `narrow`, and an empty slot would put a More button on a bar with nothing to
// fold.
const nestedNodes = () => [
	...flatten(slots['nested-before']?.({ narrow: narrow.value }) ?? []),
	...flatten(slots['nested-after']?.({ narrow: narrow.value }) ?? []),
];

// The server render and the rail's copy both show the word, which is the wider
// of the two and so the width the fold holds back.
const hamburger = () => measured.value && visibleCount.value === 0;

const showOverflow = () => overflowNodes().length > 0 || nestedNodes().length > 0;

// A fold unmounts what it moves into the menu, and swapping More for the
// hamburger destroys that too. Left alone, focus falls to the body, so it goes
// to the More button instead — where the section itself went.
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

	// A phone is the one width the arithmetic doesn't get a say in: everything
	// folds, because the side slots have already emptied into the menu.
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

// Sections then the More button, in that order, so the two are told apart by
// position rather than by a marker on the elements.
const readRail = () => {
	const rail = railEl.value;
	if (!rail) return;
	const children = Array.from(rail.children) as HTMLElement[];
	widths.value = children.slice(0, -1).map((child) => child.offsetWidth);
	moreWidth.value = children.at(-1)?.offsetWidth ?? 0;
	measured.value = true;
};

// One observer for the bar's own width and for every rail item, so any width
// change — a label, a font arriving, a reader's text size — refolds with no
// listener of its own. It can't feed back on itself: the row is `min-w-0`, and
// the rail renders every section whatever the fold decides.
let observer: ResizeObserver | undefined;

const readEntry = (entry: ResizeObserverEntry) =>
	entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;

// Re-synced after every render, and a change in the set is read straight away:
// a removed section has no element left to report through, and a new one would
// otherwise fold a frame late.
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
		// Layout is clean in here, so reading the rail forces nothing. No debounce:
		// the observer is already throttled to a frame.
		if (railChanged) readRail();
		navSm.value = remPx(NARROW_BAR_REM);
		decide();
	});
	if (containerEl.value) observer.observe(containerEl.value);
	if (rowEl.value) observer.observe(rowEl.value);

	// Read now rather than waiting a frame for the observer's first report, so the
	// first paint is already folded.
	navSm.value = remPx(NARROW_BAR_REM);
	rowWidth.value = rowEl.value?.clientWidth ?? 0;
	containerWidth.value = containerEl.value?.clientWidth ?? 0;
	syncRail();
});

onUpdated(syncRail);

onBeforeUnmount(() => {
	observer?.disconnect();
});

// The container's width and not the fold's verdict, on purpose: emptying a side
// slot widens the row, which could make the sections fit, which would refill the
// slot — a bar flickering between two layouts at one width.
const navSm = ref(0);
const narrow = computed(
	() => navSm.value > 0 && containerWidth.value > 0 && containerWidth.value < navSm.value,
);
provide('navbarNarrow', narrow);

// The bar's two surfaces are Card's two, under the same names: `glass` is
// slate-50 and `dark` is slate-700.
const surfaceClasses = computed(() => (props.surface === 'glass' ? 'bg-slate-50' : 'bg-slate-700'));

// Said once for everything in the bar, slot content included: it's mounted
// inside the bar, so it inherits from the bar and not from where it was written.
provideSurface(() => props.surface);

// One height: 64px, and 80px once the bar has the room for it.
const heightClasses = 'h-16 @min-[40rem]/navbar:h-20';
</script>

<template>
	<!-- A container can't answer its own queries, so the bar needs a box outside
	     it. Naming a container makes this a stacking context, so `z-30` belongs
	     here or an open menu falls behind whatever follows the bar. -->
	<div ref="containerEl" class="@container/navbar relative z-30">
		<!-- The gap is a constant and has to be: the row is what the fold is decided
		     against, so a gap that changed with the fold would feed back into it.
		     The hamburger's tightening is a margin on the button instead. -->
		<nav
				v-bind="$attrs"
				class="relative flex max-w-full items-center gap-4 px-4 shadow-sm @min-[40rem]/navbar:px-6 @min-[48rem]/navbar:px-8"
				:class="[surfaceClasses, heightClasses]"
			>
			<!-- A logo is not a list item, so the side slots stay plain boxes. The
			     tighter of the bar's two rhythms: filled controls sit 16px apart. -->
			<div v-if="$slots.left" class="flex h-full shrink-0 items-center gap-2 @min-[64rem]/navbar:gap-4">
				<slot name="left" :narrow="narrow" />
			</div>

			<!-- A list, and the box that gets measured. `min-w-0` is what makes the
			     measurement mean anything: without it the row refuses to shrink below
			     its content and every section looks like it fits. The lone hamburger
			     is pulled in with a margin, not the bar's gap, which the fold reads. -->
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
					<!-- The width the fold holds back is the word's, read from the
					     rail's copy, which always shows it. -->
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

		<!-- Every section once more, then a More button, so there is always an
		     element to measure and to watch. `invisible` keeps it out of the
		     accessibility tree, `inert` out of focus, and the clip stops a rail
		     wider than the bar handing the page a scrollbar. -->
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
