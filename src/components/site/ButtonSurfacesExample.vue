<script setup lang="ts">
/*
  The surface table, live: a row per surface, each one a real card with real
  buttons in it, and not one of them told what it is sitting on.

  It's a component rather than markup in the page because an Astro island
  renders its children to static HTML. A `<Card>` written in MDX and a
  `<Button>` written inside it are two separate Vue apps, so nothing can be
  provided from one to the other and every button would fall back to the
  default. Composing the rows inside a single `.vue` file makes them one tree,
  which is the same reason `NavbarExample` exists.
*/
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';

/*
  The card surfaces a button can be inside. `glassRaised` and `layered` aren't
  here because they aren't answers to this question: a card resolves both to
  what a button in one can actually see, which is `glass` and the default.
*/
const surfaces = ['glass', 'sunken', 'dark'] as const;
</script>

<template>
	<!-- Each row is a subgrid of the three shared columns, so the buttons line up
	     down the page even though the labels and the card padding differ. -->
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

		<!-- The page itself, which is the one surface with no component to
		     announce it. This row is the only one that has to say what it's on. -->
		<div class="col-span-3 grid grid-cols-subgrid items-center justify-items-start px-6 py-2">
			<code class="text-xs">sits-on="background"</code>
			<Button color="slate" sits-on="background">slate</Button>
			<Button color="transparent" sits-on="background">transparent</Button>
		</div>
	</div>
</template>
