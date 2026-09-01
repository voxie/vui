<script setup lang="ts">
// One value behind several radios, and one `name` across them so the arrow
// keys move through the set.
import { ref } from 'vue';
import Radio from '@ui/Radio.vue';
import Card from '@ui/Card.vue';

const when = ref('now');

const options = [
	{ value: 'now', label: 'Send now', description: 'Goes out as soon as the campaign is approved.' },
	{ value: 'schedule', label: 'Schedule for later', description: 'Pick a date and time in the recipient’s zone.' },
	{ value: 'draft', label: 'Save as a draft', description: 'Nothing sends until someone picks it up.' },
];
</script>

<template>
	<Card surface="glass">
		<fieldset class="not-prose">
			<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">When to send</legend>

			<div class="flex flex-col gap-3">
				<Radio
					v-for="option in options"
					:key="option.value"
					v-model="when"
					name="when-to-send"
					:value="option.value"
					:label="option.label"
					:description="option.description"
				/>
			</div>
		</fieldset>

		<div class="mt-4 font-mono text-xs text-slate-500">{{ when }}</div>
	</Card>
</template>
