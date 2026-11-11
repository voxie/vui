<script setup lang="ts">
// The Send drawer's Send From: boxed radios with the context's token where the label goes.
import { ref } from 'vue';
import Card from '@ui/Card.vue';
import MessageToken from '@ui/MessageToken.vue';
import Radio from '@ui/Radio.vue';

const sendFrom = ref('entry');
const options = [
	{ value: 'entry', description: "The run's own local context: its number and its profile." },
	{ value: 'preferred', description: "The contact's preferred group when the message sends: its number and its profile." },
	{ value: 'corporate', description: "Corporate's number and its own local context, regardless of the run's context." },
] as const;
</script>

<template>
	<Card>
		<fieldset class="not-prose mx-auto max-w-sm">
			<legend class="px-1 py-2 font-sans text-sm text-slate-500">Send From</legend>
			<div class="flex flex-col gap-2">
				<Radio v-for="option in options" :key="option.value" v-model="sendFrom" boxed name="token-send-from" :value="option.value" :description="option.description">
					<MessageToken :context="option.value" />
				</Radio>
			</div>
		</fieldset>
	</Card>
</template>
