<script setup lang="ts">
import { provideSurface } from './surface.ts';

// The panel is Card's `glassRaised`, which hands down `glass`.
provideSurface(() => 'glass');
</script>

<template>
	<!-- Card's `glassRaised` classes, repeated here since Card pins `relative`
	     and this has to be `sticky`. -->
	<div
		class="sticky bottom-8 z-10 flex w-full items-stretch gap-2 rounded-2xl border border-white bg-white/80 p-4 shadow-2xl backdrop-blur-lg sm:p-6"
	>
		<slot />
	</div>
</template>
