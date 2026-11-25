<script setup lang="ts">
import { provideSurface } from './surface.ts';

// The panel is Card's `glassRaised`, which hands down `glass`.
provideSurface(() => 'glass');
</script>

<template>
	<!-- Card's `glassRaised` classes and default padding, repeated here since
	     Card pins `relative` and this has to be `sticky`. The cap is the small
	     card width. -->
	<div
		class="sticky bottom-8 z-10 flex w-full items-stretch gap-2 rounded-2xl border border-white bg-white/80 p-4 shadow-2xl backdrop-blur-lg sm:p-6 md:max-w-2xl"
	>
		<slot />
	</div>
</template>
