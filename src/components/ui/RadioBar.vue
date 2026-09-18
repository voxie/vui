<script setup lang="ts">
import { computed, provide, useId } from 'vue';
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
	if (props.size === 'sm') return 'h-8 rounded-lg p-0.5';
	if (props.size === 'lg') return 'h-12 rounded-xl p-1';
	return 'h-10 rounded-xl p-1';
});

const trackClasses = computed(() => {
	if (props.disabled) return 'border-slate-200 bg-slate-100';
	if (invalid.value) return ['border-rose-300 bg-white', boundary.value.shadow];
	return ['bg-white', boundary.value.border, boundary.value.shadow];
});

provide(RadioBarKey, {
	size: computed(() => props.size),
	disabled: computed(() => props.disabled),
	invalid,
	describedBy: computed(() => (invalid.value ? errorId : undefined)),
});
</script>

<template>
	<div class="font-sans">
		<div
			role="radiogroup"
			class="flex w-full items-stretch border border-solid transition ease-out"
			:class="[sizeClasses, trackClasses, props.disabled ? 'cursor-not-allowed' : '']"
		>
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
