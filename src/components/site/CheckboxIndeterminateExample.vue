<script setup lang="ts">
// The parent reads the children: all on is checked, some on is indeterminate.
import { computed, ref } from 'vue';
import Checkbox from '@ui/Checkbox.vue';
import Card from '@ui/Card.vue';

const options = [
	{ value: 'sms', label: 'Text message' },
	{ value: 'email', label: 'Email' },
	{ value: 'push', label: 'Push notification' },
];

const channels = ref(['sms']);

const all = computed(() => channels.value.length === options.length);
const some = computed(() => channels.value.length > 0 && !all.value);

const toggleAll = (on: boolean) => {
	channels.value = on ? options.map((option) => option.value) : [];
};
</script>

<template>
	<Card surface="glass">
		<div class="not-prose">
			<Checkbox
				:model-value="all"
				:indeterminate="some"
				label="Every channel"
				@update:model-value="toggleAll($event as boolean)"
			/>

			<!-- Indented past the parent's marker and gap, so the children line up
			     with its label. -->
			<div class="mt-2 ms-[30px] flex flex-col gap-2">
				<Checkbox
					v-for="option in options"
					:key="option.value"
					v-model="channels"
					:value="option.value"
					:label="option.label"
				/>
			</div>
		</div>
	</Card>
</template>
