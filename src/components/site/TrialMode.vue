<script setup lang="ts">
// Picks which brief the test-pages card shows and copies. A component and not
// Astro markup, so the radios share one model and one `name`.
import { ref } from 'vue';
import Radio from '@ui/Radio.vue';

const mode = ref('docs');

const modes = [
	{ value: 'docs', label: 'Docs only', description: 'The agent reads the documentation pages. No skills are linked.' },
	{ value: 'skills', label: 'Skills only', description: 'The vui skills are linked into this repo and the docs stay closed.' },
];
</script>

<template>
	<fieldset class="not-prose" data-prompt-mode>
		<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">Trial type</legend>
		<div class="flex flex-col gap-3">
			<Radio
				v-for="option in modes"
				:key="option.value"
				v-model="mode"
				name="trial-mode"
				sits-on="glass"
				:value="option.value"
				:label="option.label"
				:description="option.description"
			/>
		</div>
	</fieldset>
</template>
