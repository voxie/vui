<script setup lang="ts">
// Dismissing is the part you have to click to see, and the reset brings the
// alert back so the example can be tried more than once.
import { ref } from 'vue';
import Alert from '@ui/Alert.vue';
import Button from '@ui/Button.vue';

const open = ref(true);
</script>

<template>
	<div class="space-y-3">
		<Alert v-model="open" color="teal">Your changes were saved.</Alert>
		<Button v-if="!open" size="sm" @click="open = true">Show it again</Button>
	</div>
</template>
