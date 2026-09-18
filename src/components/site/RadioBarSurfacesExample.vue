<script setup lang="ts">
// One bar per surface, none of them told what it sits on. A component and not
// MDX markup, so the cards and the bars are one Vue tree. See `surface.ts`.
import { reactive } from 'vue';
import Radio from '@ui/Radio.vue';
import RadioBar from '@ui/RadioBar.vue';
import Card from '@ui/Card.vue';

const surfaces = ['glass', 'sunken', 'dark'] as const;

// One model per surface, so each bar is a real group.
const picked = reactive<Record<string, string>>({ default: 'hr', glass: 'hr', sunken: 'hr', dark: 'hr', background: 'hr' });

const units = [
	{ value: 'min', label: 'Min' },
	{ value: 'hr', label: 'Hr' },
	{ value: 'day', label: 'D' },
	{ value: 'week', label: 'Wk' },
];
</script>

<template>
	<div class="not-prose space-y-4">
		<Card>
			<code class="mb-2 block text-xs">&lt;Card&gt;</code>
			<RadioBar>
				<Radio v-for="option in units" :key="option.value" v-model="picked.default" name="bar-surface-default" :value="option.value" :label="option.label" />
			</RadioBar>
		</Card>

		<Card v-for="surface in surfaces" :key="surface" :surface="surface">
			<code class="mb-2 block text-xs" :class="surface === 'dark' ? 'text-slate-300' : ''">surface="{{ surface }}"</code>
			<RadioBar>
				<Radio v-for="option in units" :key="option.value" v-model="picked[surface]" :name="`bar-surface-${surface}`" :value="option.value" :label="option.label" />
			</RadioBar>
		</Card>

		<!-- The page is the one surface with no component to announce it, so this
		     block is the only one that says what it's on. -->
		<div class="px-6 py-2">
			<code class="mb-2 block text-xs">sits-on="background"</code>
			<RadioBar sits-on="background">
				<Radio v-for="option in units" :key="option.value" v-model="picked.background" name="bar-surface-background" :value="option.value" :label="option.label" />
			</RadioBar>
		</div>
	</div>
</template>
