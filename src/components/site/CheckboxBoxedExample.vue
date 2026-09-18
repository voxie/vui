<script setup lang="ts">
// A boxed set, one row per option, each filling the card's width. The rows
// carry descriptions, which deepen the row and center the box on the block.
import { ref } from 'vue';
import Checkbox from '@ui/Checkbox.vue';
import Card from '@ui/Card.vue';

const channels = ref(['sms']);

const options = [
	{ value: 'sms', label: 'Text message', description: 'Goes to the number on the contact record.' },
	{ value: 'email', label: 'Email', description: 'Goes to the address on the contact record.' },
	{ value: 'push', label: 'Push notification', description: 'Only contacts with the app installed.' },
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
					boxed
					:value="option.value"
					:label="option.label"
					:description="option.description"
				/>
			</div>
		</fieldset>
	</Card>
</template>
