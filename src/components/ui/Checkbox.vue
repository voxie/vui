<script setup lang="ts">
import { computed, ref, useId, watchEffect } from 'vue';
import { useControlBoundary, useSurface, type Surface } from './surface.ts';

type CheckboxSize = 'sm' | 'md' | 'lg';

// Attrs like `name`, `required` and `id` belong on the input, not on the
// wrapper that stacks the row and its messages.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		size?: CheckboxSize;
		// The option text, beside the box. The default slot takes the same place
		// when the text needs markup.
		label?: string;
		// A second line under the label, for what the label can't hold.
		description?: string;
		// What this box contributes to an array model. Left off, the model is a
		// boolean.
		value?: string | number;
		// What the checkbox is sitting on. Left off, it's taken from the nearest
		// Card or Navbar. Pass it on the page background, which has no component
		// to announce it.
		sitsOn?: Surface;
		// One message or several. Present means the checkbox is in error.
		error?: string | string[];
		hint?: string;
		disabled?: boolean;
		// Neither checked nor unchecked, for a box that stands for a set of boxes
		// where only some are on. It's a display state, so the model is untouched
		// until someone presses it.
		indeterminate?: boolean;
		// Draws the whole row as a bordered box that fills its container, the
		// usual form for a set of options. The box centers on the block.
		boxed?: boolean;
	}>(),
	{
		size: 'md',
		disabled: false,
		indeterminate: false,
		boxed: false,
	},
);

const slots = defineSlots<{
	default?: () => unknown;
	description?: () => unknown;
	error?: () => unknown;
	hint?: () => unknown;
}>();

const model = defineModel<boolean | (string | number)[]>();

const surface = useSurface(() => props.sitsOn);
const boundary = useControlBoundary(() => props.sitsOn);

// The whole row is the hover target, so the lift comes off the group rather
// than the marker's own hover. A boxed row's border is the boundary, so the
// marker inside it carries no shadow.
const shadow = computed(() =>
	surface.value === 'background' && !props.boxed ? 'shadow group-hover/checkbox:shadow-md' : 'shadow-none',
);

// The resting border, a step darker than the shared boundary to hold against
// the surface, and darker again where the surface is. The page background
// keeps the boundary's shadow and transparent border.
const restingBorder = computed(() => {
	if (surface.value === 'dark') return 'border-slate-900';
	if (surface.value === 'sunken') return 'border-slate-400';
	if (surface.value === 'background') return boundary.value.border;
	return 'border-slate-300';
});

const hasDescription = computed(() => Boolean(props.description || slots.description));

const errorId = useId();
const descriptionId = useId();

const input = ref<HTMLInputElement | null>(null);

// `indeterminate` is a property rather than an attribute, so it has to be set
// on the element. Reading the model registers it here too, since a press
// clears the property and the prop may still be set.
watchEffect(() => {
	void model.value;
	if (input.value) input.value.indeterminate = props.indeterminate;
});

const checked = computed(() =>
	Array.isArray(model.value) ? model.value.includes(props.value as string | number) : Boolean(model.value),
);

const errors = computed(() => {
	if (!props.error) return [];
	return Array.isArray(props.error) ? props.error : [props.error];
});

const describedBy = computed(() => {
	const ids = [];
	if (props.description || slots.description) ids.push(descriptionId);
	if (errors.value.length) ids.push(errorId);
	return ids.length ? ids.join(' ') : undefined;
});

// The marker is the line-height of its own label, so the two line up on the
// first line however far the text wraps. `box` is the boxed row's padding,
// deeper when a description makes the row two lines.
const sizeClasses = computed(() => {
	if (props.size === 'sm')
		return { marker: 'h-4 w-4 rounded', mark: 'text-2xs', gap: 'gap-2', boxGap: 'gap-3', box: hasDescription.value ? 'px-3 py-3' : 'px-3 py-1.5', label: 'text-xs leading-4', description: 'text-xs leading-4' };
	if (props.size === 'lg')
		return { marker: 'h-6 w-6 rounded-lg', mark: 'text-sm', gap: 'gap-3', boxGap: 'gap-4', box: hasDescription.value ? 'px-5 py-5' : 'px-5 py-2.5', label: 'text-base leading-6', description: 'text-sm leading-5' };
	return { marker: 'h-5 w-5 rounded-md', mark: 'text-xs', gap: 'gap-2.5', boxGap: 'gap-4', box: hasDescription.value ? 'px-4 py-4' : 'px-4 py-2', label: 'text-sm leading-5', description: 'text-xs leading-4' };
});

// The box rests transparent so the surface shows through, and goes white when
// checked. On the dark surface white would swallow the white label, so it
// takes the step below the panel instead.
// The box takes the marker's border, one shade darker on hover. It carries no
// shadow, so on the page background it draws slate-300 rather than nothing.
const boxBorder = computed(() => {
	if (surface.value === 'dark') return 'border-slate-900';
	if (surface.value === 'sunken') return 'border-slate-400 hover:border-slate-500';
	return 'border-slate-300 hover:border-slate-400';
});

const boxClasses = computed(() => {
	if (!props.boxed) return ['w-fit items-start', sizeClasses.value.gap];
	const base = ['w-full items-center rounded-xl border border-solid transition ease-out', sizeClasses.value.box, sizeClasses.value.boxGap];
	const on = checked.value || props.indeterminate;
	if (props.disabled) return [...base, 'border-slate-200'];
	if (props.error) return [...base, 'border-rose-300', on ? 'bg-white' : ''];
	if (on) return [...base, 'border-sky-500', surface.value === 'dark' ? 'bg-slate-800' : 'bg-white'];
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

const markerClasses = computed(() => {
	if (props.disabled) return 'border-slate-200 bg-slate-100 text-slate-400 shadow-none';
	const on = checked.value || props.indeterminate;
	const border = props.error ? 'border-rose-300' : on ? 'border-sky-500' : restingBorder.value;
	return [on ? 'bg-sky-300 text-black' : `bg-white ${shadow.value}`, border];
});

defineExpose({
	input,
	focus: () => input.value?.focus(),
});
</script>

<template>
	<div class="font-sans">
		<label
			class="group/checkbox relative flex outline-blue-600"
			:class="[boxClasses, props.disabled ? 'cursor-not-allowed' : 'cursor-pointer', props.boxed ? 'has-focus-visible:outline-2 has-focus-visible:outline-offset-2' : '']"
		>
			<input
				ref="input"
				v-bind="$attrs"
				v-model="model"
				type="checkbox"
				:value="props.value"
				:disabled="props.disabled"
				:aria-invalid="errors.length ? true : undefined"
				:aria-describedby="describedBy"
				class="peer sr-only"
			/>

			<!-- A boxed row moves the focus outline to the box. -->
			<span
				aria-hidden="true"
				class="grid shrink-0 place-items-center border border-solid transition ease-out outline-blue-600 motion-safe:group-active/checkbox:scale-90 group-active/checkbox:duration-75"
				:class="[
					sizeClasses.marker,
					markerClasses,
					props.boxed ? '' : 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
				]"
			>
				<i
					v-if="props.indeterminate || checked"
					class="fa-solid"
					:class="[sizeClasses.mark, props.indeterminate ? 'fa-minus' : 'fa-check']"
				></i>
			</span>

			<span v-if="props.label || slots.default || props.description || slots.description" class="min-w-0">
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
