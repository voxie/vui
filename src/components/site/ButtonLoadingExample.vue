<script setup lang="ts">
// The swap between label and spinner is the part you have to click to see.
import { ref } from 'vue';
import Button from '@ui/Button.vue';

const loading = ref(false);
</script>

<template>
	<Button :loading="loading" @click="loading = !loading">Toggle loading</Button>
</template>
