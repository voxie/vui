<script setup lang="ts">
// The switch holds its old state and pulses until the pretend request lands.
import { ref } from 'vue';
import Switch from '@ui/Switch.vue';
import Card from '@ui/Card.vue';

const on = ref(false);
const loading = ref(false);

const save = (next: boolean) => {
	loading.value = true;
	setTimeout(() => {
		on.value = next;
		loading.value = false;
	}, 1200);
};
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex items-center gap-8">
			<Switch :model-value="on" :loading="loading" aria-label="Auto-reply" @update:model-value="save" />
			<Switch :model-value="on" :loading="loading" off="Paused" on="Sending" aria-label="Campaign state" @update:model-value="save" />
		</div>
	</Card>
</template>
