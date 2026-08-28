<script setup lang="ts">
/*
  Outline buttons on a light card and a dark one. An outline button has no fill
  to read a label against, so the dark surface is the one case where the label
  flips to white — which makes this an example that only tells the truth if the
  buttons can see the card they're in. Same reason as `ButtonSurfacesExample`:
  written in MDX, the card and the buttons would be separate Astro islands.
*/
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
</script>

<template>
	<div class="not-prose space-y-4">
		<Card>
			<div class="flex flex-wrap gap-3">
				<Button outline color="sky">sky</Button>
				<Button outline color="rose">rose</Button>
				<Button outline color="slate">slate</Button>
			</div>
		</Card>
		<Card surface="dark">
			<div class="flex flex-wrap gap-3">
				<Button outline color="sky">sky</Button>
				<Button outline color="rose">rose</Button>
				<Button outline color="slate">slate</Button>
			</div>
		</Card>
	</div>
</template>
