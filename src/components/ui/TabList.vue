<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, watch } from 'vue';
import type { Surface } from './surface.ts';
import { TabListKey, TabsKey } from './tabs.ts';

const tabs = inject(TabsKey);
if (!tabs) throw new Error('TabList has to be inside Tabs.');

const dark = computed(() => tabs.surface.value === 'dark');

const root = ref<HTMLElement | null>(null);
const indicatorReady = ref(false);
const indicatorStyle = ref({ left: '0px', top: '0px', width: '0px', height: '0px' });

// Side by side until measured, which is also what server-rendered HTML shows.
const stacked = ref(false);

provide(TabListKey, { indicatorReady, stacked });

// The track is the labeled Switch track at each size, so the two sit level in
// a toolbar. A minimum, so tabs with descriptions can grow it.
const sizeClasses = computed(() => {
	if (tabs.size.value === 'sm') return { track: 'min-h-8 rounded-md px-0.5 py-0.5', thumb: 'rounded' };
	if (tabs.size.value === 'lg') return { track: 'min-h-12 rounded-xl gap-1 px-1 py-1', thumb: 'rounded-md' };
	return { track: 'min-h-10 rounded-lg gap-1 px-1 py-1', thumb: 'rounded' };
});

// The Switch off track, surface for surface: a step darker on sunken, and
// down rather than up on dark.
const trackClasses = computed(() => {
	if (tabs.disabled.value) return dark.value ? 'bg-slate-800/50' : 'bg-slate-200';
	if (dark.value) return 'bg-slate-800';
	if (tabs.surface.value === 'sunken') return 'bg-slate-400/50';
	if (tabs.surface.value === 'default') return 'bg-slate-200';
	return 'bg-slate-300';
});

// A 1px highlight under the track, one opacity per surface. An outer shadow
// rather than a border, so it sits outside the box and the padding stays symmetric.
const edgeHighlight: Record<Surface, string> = {
	default: 'shadow-[0_1px_0_0_#fff]',
	glass: 'shadow-[0_1px_0_0_#fff]',
	sunken: 'shadow-[0_1px_0_0_rgb(255_255_255/0.3)]',
	dark: 'shadow-[0_1px_0_0_rgb(255_255_255/0.1)]',
	background: 'shadow-[0_1px_0_0_rgb(255_255_255/0.4)]',
};

const trackEdge = computed(() => {
	const highlight = edgeHighlight[tabs.surface.value];
	return tabs.disabled.value ? highlight : `${highlight} inset-shadow-sm inset-shadow-black/10`;
});

const thumbClasses = computed(() => {
	if (tabs.disabled.value) return dark.value ? 'bg-slate-500 shadow-none' : 'bg-slate-50 shadow-none';
	return 'bg-white shadow-md shadow-slate-800/30';
});

// The narrowest a tab with a description gets before the track stacks, in px.
const DESCRIBED_MIN = 160;

const sum = (...values: string[]) => values.reduce((total, value) => total + (parseFloat(value) || 0), 0);

// Columns are equal, so the row needs the widest tab's width once per tab.
// Labels don't wrap, so their width is the same stacked or not.
const updateStacked = () => {
	const track = root.value;
	if (!track) return;
	const items = Array.from(track.querySelectorAll<HTMLElement>('[role="tab"]'));
	if (!items.length) return;
	let widest = 0;
	for (const tab of items) {
		const label = tab.querySelector<HTMLElement>('[data-tab-label]');
		const style = getComputedStyle(tab);
		const needs = (label?.offsetWidth ?? 0) + sum(style.paddingLeft, style.paddingRight);
		widest = Math.max(widest, 'described' in tab.dataset ? Math.max(needs, DESCRIBED_MIN) : needs);
	}
	const style = getComputedStyle(track);
	const needed = widest * items.length + sum(style.columnGap) * (items.length - 1) + sum(style.paddingLeft, style.paddingRight);
	stacked.value = track.clientWidth < needed;
};

// Measured from the selected tab rather than laid out beside it, so the pill
// can slide between tabs of different widths.
const updateIndicator = () => {
	const selected = root.value?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
	if (!selected || !selected.offsetWidth) {
		indicatorReady.value = false;
		return;
	}
	const next = {
		left: `${selected.offsetLeft}px`,
		top: `${selected.offsetTop}px`,
		width: `${selected.offsetWidth}px`,
		height: `${selected.offsetHeight}px`,
	};
	const prev = indicatorStyle.value;
	if (next.left !== prev.left || next.top !== prev.top || next.width !== prev.width || next.height !== prev.height) {
		indicatorStyle.value = next;
	}
	indicatorReady.value = true;
};

let observer: ResizeObserver | undefined;

// The tabs as well as the track: a label that changes length moves every tab
// after it without the track changing size. The labels too, since a stacked
// tab keeps its width when its label grows.
const observe = () => {
	if (!observer || !root.value) return;
	observer.observe(root.value);
	root.value.querySelectorAll<HTMLElement>('[role="tab"], [data-tab-label]').forEach((el) => observer!.observe(el));
};

// Stacking first, since it moves the tab the indicator measures.
const measure = async () => {
	updateStacked();
	await nextTick();
	updateIndicator();
};

onMounted(() => {
	if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(measure);
	observe();
	measure();
});

onUpdated(() => {
	observe();
	measure();
});

watch(tabs.current, () => nextTick(updateIndicator));

onBeforeUnmount(() => observer?.disconnect());

// Arrow keys move between the enabled tabs and select as they go. Home and End
// jump to the first and last. Up and down join in once the tabs are stacked.
const onKeydown = (event: KeyboardEvent) => {
	const next = stacked.value ? ['ArrowRight', 'ArrowDown'] : ['ArrowRight'];
	const previous = stacked.value ? ['ArrowLeft', 'ArrowUp'] : ['ArrowLeft'];
	const keys = [...next, ...previous, 'Home', 'End'];
	if (!keys.includes(event.key) || tabs.disabled.value || !root.value) return;
	const items = Array.from(root.value.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
	if (!items.length) return;
	const focused = items.indexOf(document.activeElement as HTMLElement);
	const from = focused >= 0 ? focused : items.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
	let to = from;
	if (next.includes(event.key)) to = (from + 1) % items.length;
	if (previous.includes(event.key)) to = (from - 1 + items.length) % items.length;
	if (event.key === 'Home') to = 0;
	if (event.key === 'End') to = items.length - 1;
	event.preventDefault();
	const target = items[to];
	target.focus();
	const value = target.dataset.value;
	if (value !== undefined) tabs.select(value);
};
</script>

<template>
	<div
		ref="root"
		role="tablist"
		:aria-orientation="stacked ? 'vertical' : undefined"
		class="relative grid font-sans select-none"
		:class="[stacked ? 'grid-cols-1' : 'auto-cols-fr grid-flow-col', sizeClasses.track, trackClasses, trackEdge, tabs.disabled.value ? 'cursor-not-allowed' : '']"
		@keydown="onKeydown"
	>
		<!-- Hidden until it has been measured. Before that the selected Tab paints
		     its own white, so server-rendered HTML shows a selection. -->
		<div
			v-show="indicatorReady"
			aria-hidden="true"
			class="absolute z-0 transition-all duration-200 ease-out"
			:class="[sizeClasses.thumb, thumbClasses]"
			:style="indicatorStyle"
		></div>
		<slot />
	</div>
</template>
