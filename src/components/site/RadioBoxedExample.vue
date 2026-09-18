<script setup lang="ts">
// A boxed group, one row per option, each filling the card's width. The
// second set carries descriptions, which deepen the row and center the
// circle on the block.
import { ref } from 'vue';
import Radio from '@ui/Radio.vue';
import Card from '@ui/Card.vue';

const when = ref('now');
const audience = ref('all');

const timing = [
	{ value: 'now', label: 'Send now' },
	{ value: 'schedule', label: 'Schedule for later' },
];

const audiences = [
	{ value: 'all', label: 'Everyone', description: 'Every contact who is opted in to this campaign.' },
	{ value: 'segment', label: 'A segment', description: 'Pick a saved segment on the next step.' },
];
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex flex-col gap-6">
			<fieldset>
				<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">When to send</legend>
				<div class="flex flex-col gap-2">
					<Radio
						v-for="option in timing"
						:key="option.value"
						v-model="when"
						boxed
						name="boxed-when"
						:value="option.value"
						:label="option.label"
					/>
				</div>
			</fieldset>

			<fieldset>
				<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">Who gets it</legend>
				<div class="flex flex-col gap-2">
					<Radio
						v-for="option in audiences"
						:key="option.value"
						v-model="audience"
						boxed
						name="boxed-audience"
						:value="option.value"
						:label="option.label"
						:description="option.description"
					/>
				</div>
			</fieldset>
		</div>
	</Card>
</template>
