<script setup lang="ts">
// A row per surface, none of the buttons told what it sits on. A component and
// not MDX markup, so the cards and the buttons are one Vue tree. See `surface.ts`.
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';

// `glassRaised` and `layered` aren't here: a card resolves both to what a button
// in one can actually see, which is `glass` and the default.
const surfaces = ['glass', 'sunken', 'dark'] as const;
</script>

<template>
	<!-- A subgrid per row, so the buttons line up down the page even though the
	     labels and the card padding differ. -->
	<div class="not-prose grid grid-cols-[max-content_max-content_1fr] gap-x-6 gap-y-4">
		<Card class="col-span-3 grid grid-cols-subgrid items-center justify-items-start">
			<code class="text-xs">&lt;Card&gt;</code>
			<Button color="slate">slate</Button>
			<Button color="transparent">transparent</Button>
		</Card>

		<Card
			v-for="surface in surfaces"
			:key="surface"
			:surface="surface"
			class="col-span-3 grid grid-cols-subgrid items-center justify-items-start"
		>
			<code class="text-xs">surface="{{ surface }}"</code>
			<Button color="slate">slate</Button>
			<Button color="transparent">transparent</Button>
		</Card>

		<!-- The page is the one surface with no component to announce it, so this
		     row is the only one that says what it's on. -->
		<div class="col-span-3 grid grid-cols-subgrid items-center justify-items-start px-6 py-2">
			<code class="text-xs">sits-on="background"</code>
			<Button color="slate" sits-on="background">slate</Button>
			<Button color="transparent" sits-on="background">transparent</Button>
		</div>
	</div>
</template>
