<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		content: string;
		surface?: 'white' | 'muted' | 'dark';
	}>(),
	{ surface: 'white' }
);

const surfaceClasses: Record<string, string> = {
	white: 'bg-white border border-gray-200 text-gray-900',
	muted: 'bg-gray-100 text-gray-900',
	dark: 'bg-gray-900 text-white',
};

const cardClass = computed(
	() => `rounded-lg p-6 shadow-sm ${surfaceClasses[props.surface]}`
);
</script>

<template>
	<div :class="cardClass">
		{{ content }}
	</div>
</template>
