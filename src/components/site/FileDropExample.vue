<script setup lang="ts">
import { ref } from 'vue';
import Alert from '@ui/Alert.vue';
import Card from '@ui/Card.vue';
import FileDrop from '@ui/FileDrop.vue';

const MAX_BYTES = 1024 ** 3;

const file = ref<File | null>(null);
const validating = ref(false);
const error = ref<string>();
const rows = ref(0);
const rejected = ref<string>();
let timer: number | undefined;

function cancel(): void {
	window.clearTimeout(timer);
	validating.value = false;
}

function validate(chosen: File): void {
	rejected.value = undefined;
	error.value = undefined;
	cancel();
	validating.value = true;

	timer = window.setTimeout(() => {
		validating.value = false;
		if (chosen.size > MAX_BYTES) {
			error.value = 'Max file size is 1GiB.';
			return;
		}
		rows.value = Math.max(1, Math.round(chosen.size / 64));
	}, 800);
}

function reject(chosen: File): void {
	rejected.value = `${chosen.name} isn't a CSV file.`;
}
</script>

<template>
	<Card surface="glass">
		<div class="not-prose max-w-2xl space-y-4">
			<FileDrop
				v-model="file"
				accept=".csv,text/csv"
				icon="fa-file-csv"
				:validating="validating"
				:error="error"
				@select="validate"
				@reject="reject"
				@remove="cancel"
			>
				<strong>Ready</strong> to upload with {{ rows.toLocaleString() }} rows
			</FileDrop>
			<Alert
				v-if="rejected && !file"
				color="rose"
				:dismissible="false"
			>
				{{ rejected }}
			</Alert>
			<Alert
				v-if="!file"
				color="amber"
				:dismissible="false"
			>
				<span>Files must be <strong>CSV</strong> and less than <strong>1GiB</strong>.</span>
			</Alert>
		</div>
	</Card>
</template>
