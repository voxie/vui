<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, useId } from 'vue';
import { useControlBoundary, type Surface } from './surface.ts';
import { RadioBarKey, type RadioBarSize } from './radioBar.ts';

const props = withDefaults(
	defineProps<{
		size?: RadioBarSize;
		// What the bar is sitting on. Left off, it's taken from the nearest Card
		// or Navbar. Pass it on the page background, which has no component to
		// announce it.
		sitsOn?: Surface;
		disabled?: boolean;
		// One message or several. Present means the group is in error.
		error?: string | string[];
		hint?: string;
	}>(),
	{
		size: 'md',
		disabled: false,
	},
);

const slots = defineSlots<{
	default?: () => unknown;
	error?: () => unknown;
	hint?: () => unknown;
}>();

// The bar sits level with an Input, so it takes the Input's edge rather than
// the Radio's darker border.
const boundary = useControlBoundary(() => props.sitsOn);

const errorId = useId();

const errors = computed(() => {
	if (!props.error) return [];
	return Array.isArray(props.error) ? props.error : [props.error];
});

const invalid = computed(() => Boolean(slots.error || errors.value.length));

// The Input's heights at each size, with the Tab track's padding inside.
const sizeClasses = computed(() => {
	if (props.size === 'sm') return 'h-8 rounded-md p-0.5';
	if (props.size === 'lg') return 'h-12 rounded-xl p-1';
	return 'h-10 rounded-lg p-1';
});

const trackClasses = computed(() => {
	if (props.disabled) return 'border-slate-200 bg-slate-100';
	if (invalid.value) return ['border-rose-300 bg-white', boundary.value.shadow];
	return ['bg-white', boundary.value.border, boundary.value.shadow];
});

const root = ref<HTMLElement | null>(null);
const indicatorReady = ref(false);
const indicatorStyle = ref({ left: '0px', top: '0px', width: '0px', height: '0px' });

// Measured from the picked option's pill rather than laid out beside it, so
// the fill can slide between labels of different widths. Rects rather than
// offsets, since each pill's offsetParent is its own label.
const updateIndicator = () => {
	const pill = root.value?.querySelector<HTMLElement>('[data-radio-pill][data-picked="true"]');
	if (!pill || !pill.offsetWidth) {
		indicatorReady.value = false;
		return;
	}
	const track = root.value!.getBoundingClientRect();
	const rect = pill.getBoundingClientRect();
	const next = {
		left: `${rect.left - track.left - root.value!.clientLeft}px`,
		top: `${rect.top - track.top - root.value!.clientTop}px`,
		width: `${rect.width}px`,
		height: `${rect.height}px`,
	};
	const prev = indicatorStyle.value;
	if (next.left !== prev.left || next.top !== prev.top || next.width !== prev.width || next.height !== prev.height) {
		indicatorStyle.value = next;
	}
	indicatorReady.value = true;
};

// False until measured, so server-rendered HTML is the plain bar.
const pair = ref(false);

const updatePair = () => {
	const inputs = Array.from(root.value?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []);
	pair.value =
		inputs.length === 2 &&
		inputs.every((input) => !input.disabled) &&
		inputs.filter((input) => input.checked).length === 1;
};

const measure = () => {
	updatePair();
	updateIndicator();
};

let observer: ResizeObserver | undefined;

// The pills as well as the track: a label that changes length moves every
// option after it without the track changing size.
const observe = () => {
	if (!observer || !root.value) return;
	observer.observe(root.value);
	root.value.querySelectorAll<HTMLElement>('[data-radio-pill]').forEach((pill) => observer!.observe(pill));
};

onMounted(() => {
	if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(updateIndicator);
	observe();
	measure();
});

onUpdated(() => {
	observe();
	measure();
});

// The pick lives in each radio's model, not here, so the input's change event
// is what says the pill moved.
const onChange = () => nextTick(measure);

// In a pair, a click on the picked option or the bar around the options picks
// the other one. A click on an input is the browser's own, from a label or
// the keyboard, and is left alone.
const onClick = (event: MouseEvent) => {
	if (!pair.value || event.target instanceof HTMLInputElement) return;
	const other = root.value?.querySelector<HTMLInputElement>('input[type="radio"]:not(:checked)');
	if (!other || other.closest('label')?.contains(event.target as Node)) return;
	// Or the picked option's label clicks its own input and takes the pick back.
	event.preventDefault();
	other.focus();
	other.click();
};

onBeforeUnmount(() => observer?.disconnect());

provide(RadioBarKey, {
	size: computed(() => props.size),
	disabled: computed(() => props.disabled),
	invalid,
	describedBy: computed(() => (invalid.value ? errorId : undefined)),
	indicatorReady,
	pair,
});
</script>

<template>
	<div class="font-sans">
		<div
			ref="root"
			role="radiogroup"
			class="relative flex w-full items-stretch justify-evenly border border-solid transition ease-out"
			:class="[sizeClasses, trackClasses, props.disabled ? 'cursor-not-allowed' : pair ? 'cursor-pointer' : '']"
			@change="onChange"
			@click="onClick"
		>
			<!-- Hidden until it has been measured. Before that the picked option
			     paints its own fill, so server-rendered HTML shows a pick. -->
			<div
				v-show="indicatorReady"
				aria-hidden="true"
				class="absolute z-0 rounded-full bg-slate-200 transition-all duration-200 ease-out"
				:style="indicatorStyle"
			></div>
			<slot />
		</div>

		<div
			v-if="invalid"
			:id="errorId"
			class="mt-2 flex gap-1.5 px-0.5 text-xs text-rose-800"
		>
			<i aria-hidden="true" class="fa-solid fa-circle-exclamation mt-0.5"></i>
			<div>
				<slot name="error" />
				<div v-for="message in errors" :key="message">{{ message }}</div>
			</div>
		</div>

		<div v-if="slots.hint || props.hint" class="mt-2 flex gap-1.5 px-0.5 text-xs text-slate-600">
			<i aria-hidden="true" class="fa-solid fa-circle-info mt-0.5"></i>
			<div>
				<slot name="hint" />
				{{ props.hint }}
			</div>
		</div>
	</div>
</template>
