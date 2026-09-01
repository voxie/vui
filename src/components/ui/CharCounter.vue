<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		content: string | string[];
		max: number;
		min?: number;
		// Where the bar turns amber. Defaults to a tenth short of `max`.
		maxWarning?: number;
		minWarning?: number;
		// Held at slate until the field is worth watching, usually while it's
		// unfocused.
		muted?: boolean;
		label?: string;
	}>(),
	{ muted: false, label: 'characters' },
);

const length = computed(() => props.content.length);

const percentage = computed(() => Math.ceil((length.value / props.max) * 100));

const warning = computed(() => {
	if (length.value === 0) return false;
	if (length.value > (props.maxWarning ?? props.max * 0.9)) return true;
	return props.minWarning !== undefined && length.value < props.minWarning;
});

const danger = computed(() => {
	if (length.value === 0) return false;
	if (length.value > props.max) return true;
	return props.min !== undefined && length.value < props.min;
});

const barColor = computed(() => {
	if (props.muted) return 'bg-slate-500';
	if (danger.value) return 'bg-rose-500';
	if (warning.value) return 'bg-amber-500';
	return 'bg-slate-500';
});

const format = (value: number) => Intl.NumberFormat('en').format(value);
</script>

<template>
	<div>
		<div class="flex h-1 w-full gap-0.5 overflow-hidden rounded-xs">
			<!-- A minimum width, so one character still shows as a mark. -->
			<div
				class="h-1 min-w-[4px] shrink-0"
				:class="barColor"
				:style="{ width: `${percentage}%` }"
			></div>
			<div class="grow bg-slate-500/20"></div>
		</div>

		<div class="mt-1 text-xs text-slate-500">
			<span :class="{ 'text-rose-800': danger && !props.muted }">{{ format(length) }}</span>
			of {{ format(props.max) }} {{ props.label }}
		</div>
	</div>
</template>
