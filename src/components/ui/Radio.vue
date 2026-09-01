<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useControlBoundary, useSurface, type Surface } from './surface.ts';

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
	}>(),
	{
		size: 'md',
		disabled: false,
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
const boundary = useControlBoundary(() => props.sitsOn);

// The whole row is the hover target, so the lift comes off the group rather
// than the marker's own hover.
const shadow = computed(() =>
	surface.value === 'background' ? 'shadow group-hover/radio:shadow-md' : 'shadow-none',
);

const errorId = useId();
const descriptionId = useId();

const input = ref<HTMLInputElement | null>(null);

const checked = computed(() => model.value === props.value);

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
		return { marker: 'h-4 w-4', dot: 'h-1.5 w-1.5', gap: 'gap-2', label: 'text-xs leading-4', description: 'text-xs leading-4' };
	if (props.size === 'lg')
		return { marker: 'h-6 w-6', dot: 'h-2.5 w-2.5', gap: 'gap-3', label: 'text-base leading-6', description: 'text-sm leading-5' };
	return { marker: 'h-5 w-5', dot: 'h-2 w-2', gap: 'gap-2.5', label: 'text-sm leading-5', description: 'text-xs leading-4' };
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
	if (props.disabled) return 'border-slate-200 bg-slate-100 shadow-none';
	const border = props.error ? 'border-rose-300' : checked.value ? 'border-sky-500' : boundary.value.border;
	return [checked.value ? 'bg-sky-300' : `bg-white ${shadow.value}`, border];
});

defineExpose({
	input,
	focus: () => input.value?.focus(),
});
</script>

<template>
	<div class="font-sans">
		<label
			class="group/radio relative flex w-fit items-start"
			:class="[sizeClasses.gap, props.disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
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

			<span
				aria-hidden="true"
				class="grid shrink-0 place-items-center rounded-full border border-solid transition ease-out outline-blue-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 motion-safe:group-active/radio:scale-90 group-active/radio:duration-75"
				:class="[sizeClasses.marker, markerClasses]"
			>
				<span
					v-if="checked"
					class="rounded-full"
					:class="[sizeClasses.dot, props.disabled ? 'bg-slate-400' : 'bg-black']"
				></span>
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
