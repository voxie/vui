<script setup lang="ts">
// A boxed pair per surface, none of the radios told what it sits on. A
// component and not MDX markup, so the cards and the radios are one Vue tree.
// See `surface.ts`.
import { reactive } from 'vue';
import Radio from '@ui/Radio.vue';
import Card from '@ui/Card.vue';

const surfaces = ['glass', 'sunken', 'dark'] as const;

// One model per surface, so each pair is a real group.
const picked = reactive<Record<string, string>>({ default: 'now', glass: 'now', sunken: 'now', dark: 'now', background: 'now' });
</script>

<template>
	<div class="not-prose space-y-4">
		<Card>
			<code class="mb-2 block text-xs">&lt;Card&gt;</code>
			<div class="flex flex-col gap-2">
				<Radio v-model="picked.default" boxed name="boxed-surface-default" value="now" label="Send now" />
				<Radio v-model="picked.default" boxed name="boxed-surface-default" value="later" label="Schedule for later" />
			</div>
		</Card>

		<Card v-for="surface in surfaces" :key="surface" :surface="surface">
			<code class="mb-2 block text-xs" :class="surface === 'dark' ? 'text-slate-300' : ''">surface="{{ surface }}"</code>
			<div class="flex flex-col gap-2">
				<Radio v-model="picked[surface]" boxed :name="`boxed-surface-${surface}`" value="now" label="Send now" />
				<Radio v-model="picked[surface]" boxed :name="`boxed-surface-${surface}`" value="later" label="Schedule for later" />
			</div>
		</Card>

		<!-- The page is the one surface with no component to announce it, so this
		     block is the only one that says what it's on. -->
		<div class="px-6 py-2">
			<code class="mb-2 block text-xs">sits-on="background"</code>
			<div class="flex flex-col gap-2">
				<Radio v-model="picked.background" boxed name="boxed-surface-background" value="now" label="Send now" sits-on="background" />
				<Radio v-model="picked.background" boxed name="boxed-surface-background" value="later" label="Schedule for later" sits-on="background" />
			</div>
		</div>
	</div>
</template>
