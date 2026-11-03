<script setup lang="ts">
import Card from '@ui/Card.vue';
import FileDrop from '@ui/FileDrop.vue';

const chosen = new File(['phone,first_name'], 'spring-contacts.csv', { type: 'text/csv' });
</script>

<template>
	<Card surface="glass">
		<div class="not-prose grid max-w-2xl gap-8">
			<FileDrop
				:model-value="chosen"
				icon="fa-file-csv"
				validating
			/>
			<FileDrop
				:model-value="chosen"
				icon="fa-file-csv"
				error="Row 14 has no phone number."
			/>
			<FileDrop
				:model-value="chosen"
				icon="fa-file-csv"
			>
				<strong>Ready</strong> to upload with 1,204 rows
			</FileDrop>
		</div>
	</Card>
</template>
