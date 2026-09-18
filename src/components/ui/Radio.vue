<script setup lang="ts">
import { computed, inject, ref, useId } from 'vue';
import { useSurface, type Surface } from './surface.ts';
import { RadioBarKey } from './radioBar.ts';

type RadioSize = 'sm' | 'md' | 'lg';
type RadioValue = string | number | boolean;

// Attrs like `name`, `required` and `id` belong on the input, not on the
// wrapper that stacks the row and its messages.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		// What the model holds when this one is picked. Every radio in a group has
		// its own.
		value?: RadioValue;
		// Inside a RadioBar the bar's size wins.
		size?: RadioSize;
		// The option text, beside the dot. The default slot takes the same place
		// when the text needs markup.
		label?: string;
		// A second line under the label, for what the label can't hold.
		description?: string;
		// What the radio is sitting on. Left off, it's taken from the nearest Card
		// or Navbar. Pass it on the page background, which has no component to
		// announce it.
		sitsOn?: Surface;
		// One message or several. Present means the radio is in error.
		error?: string | string[];
		hint?: string;
		disabled?: boolean;
		// Draws the whole row as a bordered box that fills its container, the
		// usual form for a set of options. The circle centers on the block.
		boxed?: boolean;
	}>(),
	{
		size: 'md',
		disabled: false,
		boxed: false,
	},
);

const slots = defineSlots<{
	default?: () => unknown;
	description?: () => unknown;
	error?: () => unknown;
	hint?: () => unknown;
}>();

const model = defineModel<RadioValue | undefined>();

const surface = useSurface(() => props.sitsOn);

// Inside a RadioBar the radio is a pill in the bar's track, sized and
// disabled by the bar, with no circle and no messages of its own.
const bar = inject(RadioBarKey, null);
const inBar = computed(() => bar !== null);
const size = computed(() => bar?.size.value ?? props.size);
const disabled = computed(() => props.disabled || Boolean(bar?.disabled.value));

// A radio carries no shadow, so its border runs a step darker than the other
// controls' to hold against the surface, and darker again where the surface is.
const restingBorder = computed(() => {
	if (surface.value === 'dark') return 'border-slate-500';
	if (surface.value === 'sunken' || surface.value === 'background') return 'border-slate-400';
	return 'border-slate-300';
});

const errorId = useId();
const descriptionId = useId();

const input = ref<HTMLInputElement | null>(null);

const checked = computed(() => model.value === props.value);

const hasDescription = computed(() => Boolean(props.description || slots.description));

const hasText = computed(
	() => Boolean(props.label || slots.default || props.description || slots.description),
);

const errors = computed(() => {
	if (!props.error) return [];
	return Array.isArray(props.error) ? props.error : [props.error];
});

const describedBy = computed(() => {
	if (bar) return bar.describedBy.value;
	const ids = [];
	if (props.description || slots.description) ids.push(descriptionId);
	if (errors.value.length) ids.push(errorId);
	return ids.length ? ids.join(' ') : undefined;
});

// `ring` is the picked border, which is 1px at sm. A 2px ring on a 12px
// circle would leave the dot with no gap around it. `box` is the boxed row's
// padding, deeper when a description makes the row two lines.
const sizeClasses = computed(() => {
	if (size.value === 'sm')
		return { marker: 'h-3 w-3', dot: 'h-1.5 w-1.5', ring: 'border', gap: 'gap-2', boxGap: 'gap-3', box: hasDescription.value ? 'px-3 py-3' : 'px-3 py-1.5', label: 'text-xs leading-4', description: 'text-xs leading-4' };
	if (size.value === 'lg')
		return { marker: 'h-5 w-5', dot: 'h-3 w-3', ring: 'border-2', gap: 'gap-2.5', boxGap: 'gap-4', box: hasDescription.value ? 'px-5 py-5' : 'px-5 py-2.5', label: 'text-base leading-6', description: 'text-sm leading-5' };
	return { marker: 'h-4 w-4', dot: 'h-2 w-2', ring: 'border-2', gap: 'gap-2.5', boxGap: 'gap-4', box: hasDescription.value ? 'px-4 py-4' : 'px-4 py-2', label: 'text-sm leading-5', description: 'text-xs leading-4' };
});

// The box rests transparent so the surface shows through, and goes white when
// picked. On the dark surface white would swallow the white label, so it takes
// the step below the panel instead.
// The box takes the circle's border, one shade darker on hover, except on
// dark, where it drops to slate-900 so it sinks into the panel.
const boxBorder = computed(() => {
	if (surface.value === 'dark') return 'border-slate-900';
	if (surface.value === 'sunken' || surface.value === 'background') return [restingBorder.value, 'hover:border-slate-500'];
	return [restingBorder.value, 'hover:border-slate-400'];
});

const boxClasses = computed(() => {
	if (!props.boxed) return ['w-fit items-start', sizeClasses.value.gap];
	const base = ['w-full items-center rounded-xl border border-solid transition ease-out', sizeClasses.value.box, sizeClasses.value.boxGap];
	if (props.disabled) return [...base, 'border-slate-200'];
	if (props.error) return [...base, 'border-rose-300', checked.value ? 'bg-white' : ''];
	if (checked.value) return [...base, 'border-sky-500', surface.value === 'dark' ? 'bg-slate-800' : 'bg-white'];
	return [...base, boxBorder.value];
});

// The label is slate-800 everywhere but the dark surface, where it would sit
// on slate-700 and disappear.
const textClasses = computed(() => {
	const dark = surface.value === 'dark';
	if (props.disabled)
		return { label: dark ? 'text-slate-400' : 'text-slate-500', description: dark ? 'text-slate-500' : 'text-slate-400' };
	return { label: dark ? 'text-white' : 'text-slate-800', description: dark ? 'text-slate-300' : 'text-slate-500' };
});

// The circle has no fill, so the surface shows through it. Picked is a ring
// rather than a fill: the border takes the size's ring width and a dot lands
// inside it.
const markerClasses = computed(() => {
	const ring = checked.value ? sizeClasses.value.ring : 'border';
	if (props.disabled) return [ring, 'border-slate-200 bg-slate-100'];
	if (props.error) return [ring, 'border-rose-300'];
	return checked.value ? [ring, 'border-sky-500'] : [ring, restingBorder.value];
});

// The pill hugs its label inside a cell that takes an even share of the bar,
// so the labels space out evenly and the fill stays the label's size.
const pillSizeClasses = computed(() => {
	if (size.value === 'sm') return 'h-6 px-2 text-xs';
	if (size.value === 'lg') return 'h-8 px-3 text-base';
	return 'h-7 px-2.5 text-sm';
});

// The bar is white on every surface, so the pill's colors don't move with it.
// The picked fill is the bar's sliding pill once it has measured this one.
const pillClasses = computed(() => {
	const ownFill = checked.value && !bar?.indicatorReady.value ? 'bg-slate-200' : '';
	if (disabled.value) return checked.value ? [ownFill, 'text-slate-500'] : 'text-slate-400';
	if (checked.value) return [ownFill, 'text-slate-800'];
	return 'text-slate-500 group-hover/radio:text-slate-700';
});

// Only an unpicked option does anything, so only it hovers and presses.
const pillInert = computed(() => checked.value || disabled.value);

defineExpose({
	input,
	focus: () => input.value?.focus(),
});
</script>

<template>
	<label
		v-if="inBar"
		class="group/radio relative flex min-w-0 flex-1 items-center justify-center rounded-full font-sans outline-blue-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
		:class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
	>
		<input
			ref="input"
			v-bind="$attrs"
			v-model="model"
			type="radio"
			:value="props.value"
			:disabled="disabled"
			:aria-invalid="bar?.invalid.value ? true : undefined"
			:aria-describedby="describedBy"
			class="sr-only"
		/>
		<span
			data-radio-pill
			:data-picked="checked"
			class="relative z-10 flex items-center rounded-full font-medium transition ease-out"
			:class="[pillSizeClasses, pillClasses]"
		>
			<!-- The hover fill is a box of its own so the press can be a fixed 2px
			     inset like Button's rather than a scale, the same as Tab. -->
			<span
				v-if="!pillInert"
				aria-hidden="true"
				class="absolute inset-0 -z-10 rounded-full transition-all ease-out group-hover/radio:bg-slate-100 group-active/radio:duration-75 motion-safe:group-active/radio:inset-0.5 motion-reduce:group-active/radio:opacity-70"
			></span>
			<span
				class="relative truncate transition ease-out"
				:class="pillInert ? '' : 'group-active/radio:duration-75 motion-safe:group-active/radio:scale-[0.96]'"
			>
				<slot>{{ props.label }}</slot>
			</span>
		</span>
	</label>

	<div v-else class="font-sans">
		<label
			class="group/radio relative flex outline-blue-600"
			:class="[boxClasses, props.disabled ? 'cursor-not-allowed' : 'cursor-pointer', props.boxed ? 'has-focus-visible:outline-2 has-focus-visible:outline-offset-2' : '']"
		>
			<input
				ref="input"
				v-bind="$attrs"
				v-model="model"
				type="radio"
				:value="props.value"
				:disabled="props.disabled"
				:aria-invalid="errors.length ? true : undefined"
				:aria-describedby="describedBy"
				class="peer sr-only"
			/>

			<!-- The circle is 4px shorter than its label's line box at every size, so
			     2px of top margin centers it on the first line and leaves it there
			     when the text wraps. A boxed row centers it on the block instead,
			     and the focus outline moves to the box. -->
			<span
				aria-hidden="true"
				class="grid shrink-0 place-items-center rounded-full border-solid transition ease-out outline-blue-600 motion-safe:group-active/radio:scale-90 group-active/radio:duration-75"
				:class="[
					sizeClasses.marker,
					markerClasses,
					hasText && !props.boxed ? 'mt-0.5' : '',
					props.boxed ? '' : 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
				]"
			>
				<span
					v-if="checked"
					class="rounded-full"
					:class="[sizeClasses.dot, props.disabled ? 'bg-slate-400' : 'bg-sky-500']"
				></span>
			</span>

			<span v-if="hasText" class="min-w-0">
				<span
					class="block font-medium"
					:class="[sizeClasses.label, textClasses.label]"
				>
					<slot>{{ props.label }}</slot>
				</span>

				<span
					v-if="props.description || slots.description"
					:id="descriptionId"
					class="mt-1 block font-normal"
					:class="[sizeClasses.description, textClasses.description]"
				>
					<slot name="description">{{ props.description }}</slot>
				</span>
			</span>
		</label>

		<div
			v-if="slots.error || errors.length"
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
