<script setup lang="ts">
// One array behind several boxes, each one contributing its `value`.
import { ref } from 'vue';
import Checkbox from '@ui/Checkbox.vue';
import Card from '@ui/Card.vue';

const channels = ref(['sms']);

const options = [
	{ value: 'sms', label: 'Text message' },
	{ value: 'email', label: 'Email' },
	{ value: 'push', label: 'Push notification' },
];
</script>

<template>
	<Card surface="glass">
		<fieldset class="not-prose">
			<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">Notify me by</legend>

			<div class="flex flex-col gap-2">
				<Checkbox
					v-for="option in options"
					:key="option.value"
					v-model="channels"
					:value="option.value"
					:label="option.label"
				/>
			</div>
		</fieldset>

		<div class="mt-4 font-mono text-xs text-slate-500">{{ JSON.stringify(channels) }}</div>
	</Card>
</template>
