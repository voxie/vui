<script setup lang="ts">
// Inline rather than an image file, so it scales without a second asset and the
// sheen stays editable. `fill-current`, so the color comes from the wrapper.
defineOptions({
	// The caller's class belongs on the svg, not on the box holding the default.
	inheritAttrs: false,
});

withDefaults(
	defineProps<{
		width?: number | string;
		height?: number | string;
    radius?: number | string;
	}>(),
	{
		width: 35,
		height: 32,
    radius: 8,
	},
);

// Shared rather than per-instance: Astro hydrates islands in a different order
// than it renders them, so a counter drifts. The defs are identical, so `url(#…)`
// resolving to the first one is the same gradient either way.
const gradientId = 'voxie-mark-sheen';
</script>

<template>
	<!-- The default color one element up, so a caller's `text-*` lands closer and
	     wins outright rather than by stylesheet order. `contents`, so the box
	     generates none of its own and the layout is unchanged. -->
	<span class="contents text-sky-400">
		<svg v-bind="$attrs" aria-hidden="true" :width="width" :height="height" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-auto overflow-visible">
    <rect :width="width" :height="height" :rx="radius" class="fill-current"/>
    <path d="M9.39335 8.41967C10.9137 7.54191 12.8578 8.06284 13.7355 9.58319L20.0993 20.6055C20.9771 22.1258 20.4561 24.0699 18.9358 24.9477C17.4154 25.8255 15.4714 25.3046 14.5936 23.7842L8.22987 12.7619C7.35209 11.2415 7.87299 9.29745 9.39335 8.41967Z" fill="white"/>
    <path d="M23.7102 7.68628C25.6357 7.68628 27.1966 9.24717 27.1966 11.1726C27.1966 13.0981 25.6357 14.6589 23.7102 14.6589H23.7101C21.7847 14.6589 20.2238 13.098 20.2238 11.1726C20.2238 9.24717 21.7847 7.68629 23.7101 7.68628H23.7102Z" fill="white"/>
    <path d="M7.55682 36.5908V31.5417H14.1524L7.55682 36.5908Z" class="fill-current"/>
    </svg>
	</span>
</template>
