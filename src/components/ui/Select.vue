<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';
import { useControlBoundary, type Surface } from './surface.ts';

type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SelectOption = { value: string | number; label: string; disabled?: boolean };

// Attrs like `name` and `required` belong on the select, not on the wrapper
// that stacks the label and the messages around it.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		options?: SelectOption[];
		size?: SelectSize;
		// What the select is for. Leave it off only where a label can't fit, and
		// see the forms pattern for what counts.
		label?: string;
		// A second line under the label, for what the label can't hold.
		description?: string;
		// What the select is sitting on. Left off, it's taken from the nearest
		// Card or Navbar. Pass it on the page background, which has no component
		// to announce it.
		sitsOn?: Surface;
		// The message under the control. Present means the select is in error.
		error?: string;
		hint?: string;
		disabled?: boolean;
		block?: boolean;
	}>(),
	{
		options: () => [],
		size: 'md',
		disabled: false,
		block: false,
	},
);

const model = defineModel<string | number | undefined>();

const boundary = useControlBoundary(() => props.sitsOn);

const errorId = useId();
const descriptionId = useId();
const generatedId = useId();

// The caller's own `id` wins, since a `for` somewhere else may already point at
// it.
const attrs = useAttrs();
const fieldId = computed(() => (attrs.id as string | undefined) ?? generatedId);

const describedBy = computed(() => {
	const ids = [];
	if (props.description) ids.push(descriptionId);
	if (props.error) ids.push(errorId);
	return ids.length ? ids.join(' ') : undefined;
});

// End padding clears the chevron, so it runs ahead of the start padding at
// every size.
const sizeClasses = computed(() => {
	if (props.size === 'xs')
		return { element: 'h-6 rounded-lg ps-2 pe-6 text-xs', icon: 'end-2 text-2xs', label: 'text-xs' };
	if (props.size === 'sm')
		return { element: 'h-8 rounded-lg ps-3 pe-8 text-xs', icon: 'end-3 text-2xs', label: 'text-xs' };
	if (props.size === 'lg')
		return { element: 'h-12 rounded-xl ps-5 pe-11 text-sm', icon: 'end-4 text-xs', label: 'text-sm' };
	if (props.size === 'xl')
		return { element: 'h-16 rounded-2xl ps-8 pe-14 text-base', icon: 'end-6 text-sm', label: 'text-base' };
	return { element: 'h-10 rounded-xl ps-4 pe-10 text-sm', icon: 'end-3.5 text-xs', label: 'text-sm' };
});
</script>

<template>
	<div class="font-sans" :class="props.block ? 'block w-full' : 'inline-block'">
		<label
			v-if="props.label"
			:for="fieldId"
			class="block font-extrabold text-slate-800"
			:class="[sizeClasses.label, props.description ? '' : 'mb-1']"
		>
			{{ props.label }}
		</label>

		<div
			v-if="props.description"
			:id="descriptionId"
			class="mb-2 font-normal text-slate-500"
			:class="sizeClasses.label"
		>
			{{ props.description }}
		</div>

		<!-- Shrunk to the select, so the chevron lands on its edge and not on the
		     container's when the wrapper is stretched by a grid or a flex row. -->
		<div class="relative" :class="props.block ? 'w-full' : 'w-fit'">
			<select
				v-bind="$attrs"
				:id="fieldId"
				v-model="model"
				:disabled="props.disabled"
				:aria-invalid="props.error ? true : undefined"
				:aria-describedby="describedBy"
				class="relative block cursor-pointer appearance-none border border-solid bg-white font-sans leading-tight outline-blue-600 transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none disabled:hover:shadow-none"
				:class="[
					sizeClasses.element,
					boundary.shadow,
					props.block ? 'w-full' : 'w-auto',
					props.error ? 'border-rose-300' : boundary.border,
					props.error ? 'text-rose-600' : 'text-slate-900',
				]"
			>
				<slot>
					<option
						v-for="option in props.options"
						:key="option.value"
						:value="option.value"
						:disabled="option.disabled"
					>
						{{ option.label }}
					</option>
				</slot>
			</select>

			<i
				aria-hidden="true"
				class="fa-solid fa-chevron-down pointer-events-none absolute top-1/2 -translate-y-1/2"
				:class="[sizeClasses.icon, props.error ? 'text-rose-600' : 'text-slate-500']"
			></i>
		</div>

		<div
			v-if="props.error"
			:id="errorId"
			class="mt-2 flex gap-1.5 px-0.5 text-xs text-rose-800"
		>
			<i aria-hidden="true" class="fa-solid fa-circle-exclamation mt-0.5"></i>
			<div>{{ props.error }}</div>
		</div>

		<div v-if="props.hint" class="mt-2 flex gap-1.5 px-0.5 text-xs text-slate-600">
			<i aria-hidden="true" class="fa-solid fa-circle-info mt-0.5"></i>
			<div>{{ props.hint }}</div>
		</div>
	</div>
</template>
