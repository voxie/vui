<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from 'vue';

// Classes land on the <i>, since the kit copies them to its <svg> and a
// Font Awesome class like `fa-fw` only works there.
defineOptions({ inheritAttrs: false });

const props = defineProps<{
	// The variant and the name, like `fa-solid fa-xmark`.
	name: string;
	// Read out in place of the icon. Left off, the icon is hidden from screen readers.
	label?: string;
}>();

const attrs = useAttrs();

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const html = computed(() => {
	const classes = escape(normalizeClass([props.name, attrs.class]));
	const a11y = props.label ? `role="img" aria-label="${escape(props.label)}"` : 'aria-hidden="true"';
	return `<i class="${classes}" ${a11y}></i>`;
});
</script>

<template>
	<!-- The kit swaps the <i> for an <svg>, maybe before hydration. Through v-html
	     Vue never walks in to find it, and a new name replaces the whole icon. -->
	<span class="contents" v-html="html"></span>
</template>
