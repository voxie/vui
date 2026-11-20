<script setup lang="ts">
// A bar of two options, where a click anywhere on the bar picks the other
// one. A component and not MDX markup, so the bar and its radios are one Vue
// tree. See `radioBar.ts`.
import { ref } from 'vue';
import Radio from '@ui/Radio.vue';
import RadioBar from '@ui/RadioBar.vue';
import Input from '@ui/Input.vue';
import Card from '@ui/Card.vue';

const hour = ref('9');
const period = ref('pm');
</script>

<template>
	<Card surface="glass">
		<fieldset class="not-prose">
			<legend class="mb-2 font-sans text-sm font-extrabold text-slate-800">Quiet hours start at</legend>
			<div class="flex items-start gap-3">
				<div class="w-28 shrink-0">
					<Input v-model="hour" type="number" :min="1" :max="12" aria-label="Hour" />
				</div>
				<RadioBar class="flex-1">
					<Radio v-model="period" name="quiet-hours-period" value="am" label="AM" />
					<Radio v-model="period" name="quiet-hours-period" value="pm" label="PM" />
				</RadioBar>
			</div>
		</fieldset>
	</Card>
</template>
