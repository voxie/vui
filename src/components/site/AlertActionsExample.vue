<script setup lang="ts">
// One file, so the Button lands in the alert's `actions` slot. Written in MDX
// it would be a separate island and fall into the default slot.
import Alert from '@ui/Alert.vue';
import Button from '@ui/Button.vue';

const colors = ['sky', 'teal', 'amber', 'rose', 'violet', 'slate'] as const;

defineProps<{ calm?: boolean }>();
</script>

<template>
	<div class="space-y-3">
		<Alert v-for="color in colors" :key="color" :color="color" :calm="calm">
			<strong>New Group</strong> imported successfully
			<template #actions>
				<Button size="sm" :color="color">
					Back to Groups
					<i aria-hidden="true" class="fa-solid fa-arrow-up-left"></i>
				</Button>
			</template>
		</Alert>
	</div>
</template>
