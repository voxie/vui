<script setup lang="ts">
// The chart palette for the Color page, drawn as the keys a chart draws from it,
// one per hue in canonical order.
import Card from '@ui/Card.vue';
import ChartLegendPill from './ChartLegendPill.vue';
import { hues } from '@data/chartColors';
</script>

<template>
	<Card class="not-prose">
		<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
			<li v-for="hue in hues" :key="hue">
				<ChartLegendPill :hue="hue">{{ hue }}</ChartLegendPill>
			</li>
		</ul>
	</Card>
</template>
