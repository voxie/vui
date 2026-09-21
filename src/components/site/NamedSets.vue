<script setup lang="ts">
// The named sets for the Color page, one card per set, laid out like the surface
// swatches under Slate: the mark a chart draws, the name it draws, the token.
import Card from '@ui/Card.vue';
import { namedSets, memberLabel, markStep, shade } from '@data/chartColors';
</script>

<template>
	<div class="not-prose space-y-6">
		<section v-for="set in namedSets" :key="set.key">
			<h4 class="text-sm font-extrabold text-slate-800">{{ set.label }}</h4>

			<Card class="mt-3 grid grid-cols-[max-content_max-content_1fr] items-center gap-x-6 gap-y-3">
				<template v-for="member in set.members" :key="member.key">
					<div
						class="h-10 w-16 rounded-lg border border-slate-900/10"
						:style="{ background: shade(member.hue, markStep(member.hue)) }"
					></div>

					<span class="text-sm whitespace-nowrap text-slate-800">
						{{ memberLabel(member) }}
						<span v-if="set.catchAll === member.key" class="text-2xs text-slate-500">sink</span>
					</span>

					<code class="text-xs">{{ member.hue }}-{{ markStep(member.hue) }}</code>
				</template>
			</Card>
		</section>
	</div>
</template>
