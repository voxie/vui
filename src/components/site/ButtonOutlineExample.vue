<script setup lang="ts">
// A component and not MDX markup: the label flips to white on the dark card, so
// the buttons have to be able to see the card. See `surface.ts`.
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
