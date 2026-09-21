<script setup lang="ts">
// A chart key as the dashboard draws it: the hue's label background at 300 for
// the pill, its mark color for the dot. Sizes match KeyDrawer.vue in the
// franchise hub prototype, down to the 10px square dot and the 0.67 label.
import { computed } from 'vue';
import { hueColor, type Hue } from '@data/chartColors';

const props = withDefaults(defineProps<{ hue: Hue; dot?: boolean }>(), { dot: true });

const color = computed(() => hueColor(props.hue));
</script>

<template>
	<span
		class="inline-flex items-center gap-1 rounded-full py-0.5 ps-2 pe-3 text-sm whitespace-nowrap text-black/67"
		:style="{ background: color.labelBg }"
	>
		<span v-if="dot" class="size-2.5 rounded" :style="{ background: color.mark }"></span>
		<slot />
	</span>
</template>
