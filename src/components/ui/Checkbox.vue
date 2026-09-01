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
	}>(),
	{
		size: 'md',
		disabled: false,
		indeterminate: false,
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
// than the marker's own hover.
const shadow = computed(() =>
	surface.value === 'background' ? 'shadow group-hover/checkbox:shadow-md' : 'shadow-none',
);

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
// first line however far the text wraps.
const sizeClasses = computed(() => {
	if (props.size === 'sm')
		return { marker: 'h-4 w-4 rounded', mark: 'text-2xs', gap: 'gap-2', label: 'text-xs leading-4', description: 'text-xs leading-4' };
	if (props.size === 'lg')
		return { marker: 'h-6 w-6 rounded-lg', mark: 'text-sm', gap: 'gap-3', label: 'text-base leading-6', description: 'text-sm leading-5' };
	return { marker: 'h-5 w-5 rounded-md', mark: 'text-xs', gap: 'gap-2.5', label: 'text-sm leading-5', description: 'text-xs leading-4' };
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
	const border = props.error ? 'border-rose-300' : on ? 'border-sky-500' : boundary.value.border;
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
			class="group/checkbox relative flex w-fit items-start"
			:class="[sizeClasses.gap, props.disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
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

			<span
				aria-hidden="true"
				class="grid shrink-0 place-items-center border border-solid transition ease-out outline-blue-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 motion-safe:group-active/checkbox:scale-90 group-active/checkbox:duration-75"
				:class="[sizeClasses.marker, markerClasses]"
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
