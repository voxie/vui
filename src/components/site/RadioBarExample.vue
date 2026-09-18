<script setup lang="ts">
// A bar of units beside the number it qualifies, the pair sitting level. A
// component and not MDX markup, so the bar and its radios are one Vue tree.
// See `radioBar.ts`.
import { ref } from 'vue';
import Radio from '@ui/Radio.vue';
import RadioBar from '@ui/RadioBar.vue';
import Input from '@ui/Input.vue';
import Card from '@ui/Card.vue';
import type { RadioBarSize } from '@ui/radioBar.ts';

withDefaults(
	defineProps<{
		size?: RadioBarSize;
		disabled?: boolean;
		error?: string;
		hint?: string;
	}>(),
	{ size: 'md', disabled: false },
);

const amount = ref('24');
const unit = ref('hr');

const units = [
	{ value: 'min', label: 'Min' },
	{ value: 'hr', label: 'Hr' },
	{ value: 'day', label: 'D' },
	{ value: 'week', label: 'Wk' },
];
</script>

<template>
	<Card surface="glass">
		<fieldset class="not-prose">
			<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">Contacts can re-enter this flow after</legend>
			<div class="flex items-start gap-3">
				<div class="w-28 shrink-0">
					<Input v-model="amount" type="number" :min="1" :size="size" :disabled="disabled" aria-label="Amount" />
				</div>
				<RadioBar :size="size" :disabled="disabled" :error="error" :hint="hint" class="flex-1">
					<Radio
						v-for="option in units"
						:key="option.value"
						v-model="unit"
						:name="`re-enter-unit-${size}`"
						:value="option.value"
						:label="option.label"
					/>
				</RadioBar>
			</div>
		</fieldset>
	</Card>
</template>
