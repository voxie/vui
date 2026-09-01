<script setup lang="ts">
import { computed, useId } from 'vue';
import { useControlBoundary, type Surface } from './surface.ts';

type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SelectOption = { value: string | number; label: string; disabled?: boolean };

// Attrs like `id`, `name` and `required` belong on the select, not on the label
// that wraps it.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		options?: SelectOption[];
		size?: SelectSize;
		// What the select is sitting on. Left off, it's taken from the nearest
		// Card or Navbar. Pass it on the page background, which has no component
		// to announce it.
		sitsOn?: Surface;
		// The message under the control. Present means the select is in error.
		error?: string;
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

// End padding clears the chevron, so it runs ahead of the start padding at
// every size.
const sizeClasses = computed(() => {
	if (props.size === 'xs')
		return { element: 'h-6 rounded-lg ps-2 pe-6 text-xs', icon: 'end-2 text-2xs' };
	if (props.size === 'sm')
		return { element: 'h-8 rounded-lg ps-3 pe-8 text-xs', icon: 'end-3 text-2xs' };
	if (props.size === 'lg')
		return { element: 'h-12 rounded-xl ps-5 pe-11 text-sm', icon: 'end-4 text-xs' };
	if (props.size === 'xl')
		return { element: 'h-16 rounded-2xl ps-8 pe-14 text-base', icon: 'end-6 text-sm' };
	return { element: 'h-10 rounded-xl ps-4 pe-10 text-sm', icon: 'end-3.5 text-xs' };
});
</script>

<template>
	<label class="font-sans" :class="props.block ? 'block w-full' : 'inline-block'">
		<div class="relative">
			<select
				v-bind="$attrs"
				v-model="model"
				:disabled="props.disabled"
				:aria-invalid="props.error ? true : undefined"
				:aria-describedby="props.error ? errorId : undefined"
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

		<div v-if="props.error" :id="errorId" class="mt-1 ps-0.5 text-xs text-rose-800">
			{{ props.error }}
		</div>
	</label>
</template>
