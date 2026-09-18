<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, watch } from 'vue';
import { useSurface, type Surface } from './surface.ts';
import { TabsKey, type TabsSize } from './tabs.ts';

const props = withDefaults(
	defineProps<{
		size?: TabsSize;
		// What the tabs are sitting on. Left off, it's taken from the nearest Card
		// or Navbar. Pass it on the page background, which has no component to
		// announce it.
		sitsOn?: Surface;
		disabled?: boolean;
	}>(),
	{
		size: 'md',
		disabled: false,
	},
);

// The `value` of the selected Tab.
const model = defineModel<string>();

const surface = useSurface(() => props.sitsOn);
const dark = computed(() => surface.value === 'dark');

const select = (value: string) => {
	if (props.disabled) return;
	model.value = value;
};

const root = ref<HTMLElement | null>(null);
const indicatorReady = ref(false);
const indicatorStyle = ref({ left: '0px', top: '0px', width: '0px', height: '0px' });

provide(TabsKey, {
	current: model,
	size: computed(() => props.size),
	disabled: computed(() => props.disabled),
	surface,
	indicatorReady,
	select,
});

// The track is the labeled Switch track at each size, so the two sit level in
// a toolbar. The bottom border takes 1px out of the box, so bottom padding
// gives it up to keep the tabs centered.
const sizeClasses = computed(() => {
	if (props.size === 'sm') return { track: 'h-8 rounded-lg px-0.5 pt-0.5 pb-px', thumb: 'rounded-md' };
	if (props.size === 'lg') return { track: 'h-12 rounded-xl gap-2 px-1 pt-1 pb-0.75', thumb: 'rounded-lg' };
	return { track: 'h-10 rounded-xl gap-2 px-1 pt-1 pb-0.75', thumb: 'rounded-lg' };
});

// The Switch off track, surface for surface: a step darker on sunken, and
// down rather than up on dark.
const trackClasses = computed(() => {
	if (props.disabled) return dark.value ? 'bg-slate-800/50' : 'bg-slate-200';
	if (dark.value) return 'bg-slate-800';
	if (surface.value === 'sunken') return 'bg-slate-400/50';
	if (surface.value === 'default') return 'bg-slate-200';
	return 'bg-slate-300';
});

// A light bottom border, one opacity per surface. bg-clip-padding keeps the
// fill out from under it, so it blends with the surface rather than the track.
const edgeBorder: Record<Surface, string> = {
	default: 'border-white',
	glass: 'border-white',
	sunken: 'border-white/30',
	dark: 'border-white/10',
	background: 'border-white/40',
};

const trackEdge = computed(() => {
	const border = `border-b bg-clip-padding ${edgeBorder[surface.value]}`;
	return props.disabled ? border : `${border} inset-shadow-sm inset-shadow-black/10`;
});

const thumbClasses = computed(() => {
	if (props.disabled) return dark.value ? 'bg-slate-500 shadow-none' : 'bg-slate-50 shadow-none';
	return 'bg-white shadow-md shadow-slate-800/30';
});

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
// after it without the track changing size.
const observe = () => {
	if (!observer || !root.value) return;
	observer.observe(root.value);
	root.value.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => observer!.observe(tab));
};

onMounted(() => {
	if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(updateIndicator);
	observe();
	updateIndicator();
});

onUpdated(() => {
	observe();
	updateIndicator();
});

watch(model, () => nextTick(updateIndicator));

onBeforeUnmount(() => observer?.disconnect());

// Arrow keys move between the enabled tabs and select as they go. Home and End
// jump to the first and last.
const onKeydown = (event: KeyboardEvent) => {
	const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
	if (!keys.includes(event.key) || props.disabled || !root.value) return;
	const tabs = Array.from(root.value.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
	if (!tabs.length) return;
	const focused = tabs.indexOf(document.activeElement as HTMLElement);
	const from = focused >= 0 ? focused : tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
	let to = from;
	if (event.key === 'ArrowRight') to = (from + 1) % tabs.length;
	if (event.key === 'ArrowLeft') to = (from - 1 + tabs.length) % tabs.length;
	if (event.key === 'Home') to = 0;
	if (event.key === 'End') to = tabs.length - 1;
	event.preventDefault();
	const target = tabs[to];
	target.focus();
	const value = target.dataset.value;
	if (value !== undefined) select(value);
};
</script>

<template>
	<div
		ref="root"
		role="tablist"
		class="relative grid auto-cols-fr grid-flow-col font-sans select-none"
		:class="[sizeClasses.track, trackClasses, trackEdge, props.disabled ? 'cursor-not-allowed' : '']"
		@keydown="onKeydown"
	>
		<!-- Hidden until it has been measured. Before that the selected Tab paints
		     its own white, so server-rendered HTML shows a selection. The fill is a
		     box inside the measured one, so the press can be a fixed 2px inset like
		     Button's rather than a scale, which a wide tab would exaggerate. -->
		<div
			v-show="indicatorReady"
			aria-hidden="true"
			class="group/pill absolute z-0 transition-all duration-200 ease-out"
			:style="indicatorStyle"
		>
			<div
				class="absolute inset-0 transition-all ease-out"
				:class="[
					sizeClasses.thumb,
					thumbClasses,
					props.disabled
						? ''
						: 'group-has-[~[aria-selected=true]:active]/pill:duration-75 motion-safe:group-has-[~[aria-selected=true]:active]/pill:inset-0.5 motion-reduce:group-has-[~[aria-selected=true]:active]/pill:opacity-70',
				]"
			></div>
		</div>
		<slot />
	</div>
</template>
