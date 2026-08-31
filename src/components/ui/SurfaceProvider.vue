<script setup lang="ts">
// A surface that isn't a Card: wrap anything that paints a background of its
// own and can't announce it. Renders one element and nothing else, so it can be
// the box carrying that background rather than a layer around it.
import { provideSurface, type Surface } from './surface.ts';

const props = withDefaults(
	defineProps<{
		/* What anything inside is sitting on, once this element is painted. */
		surface: Surface;
		// A plain string rather than a union, so a caller isn't blocked on this
		// list growing.
		as?: string;
	}>(),
	{ as: 'div' },
);

provideSurface(() => props.surface);
</script>

<template>
	<component :is="props.as">
		<slot />
	</component>
</template>
