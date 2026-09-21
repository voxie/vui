<script setup lang="ts">
// The count-based key sets for the Color page, each hue shown as the legend
// entry a chart would draw for it.
import ChartLegendPill from './ChartLegendPill.vue';
import { keyColors, MAX_KEYS } from '@data/chartColors';

const counts = Array.from({ length: MAX_KEYS }, (_, i) => i + 1);
</script>

<template>
	<div class="not-prose">
		<table class="w-full border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-slate-300 text-slate-800">
					<th class="py-2 pe-6 font-extrabold">Keys</th>
					<th class="py-2 font-extrabold">Hues, in order</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="count in counts" :key="count" class="border-b border-slate-200 align-top">
					<td class="py-3 pe-6 font-mono text-slate-800">{{ count }}</td>
					<td class="py-3">
						<ol class="m-0 flex list-none flex-wrap gap-1.5 p-0">
							<li v-for="color in keyColors(count)" :key="color.hue" class="contents">
								<ChartLegendPill :hue="color.hue">{{ color.hue }}</ChartLegendPill>
							</li>
						</ol>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
