<script setup lang="ts">
// A boxed pair per surface, none of the boxes told what it sits on. A
// component and not MDX markup, so the cards and the boxes are one Vue tree.
// See `surface.ts`.
import { reactive } from 'vue';
import Checkbox from '@ui/Checkbox.vue';
import Card from '@ui/Card.vue';

const surfaces = ['glass', 'sunken', 'dark'] as const;

// One array per surface, so the boxes toggle for real.
const picked = reactive<Record<string, string[]>>({ default: ['sms'], glass: ['sms'], sunken: ['sms'], dark: ['sms'], background: ['sms'] });
</script>

<template>
	<div class="not-prose space-y-4">
		<Card>
			<code class="mb-2 block text-xs">&lt;Card&gt;</code>
			<div class="flex flex-col gap-2">
				<Checkbox v-model="picked.default" boxed value="sms" label="Text message" />
				<Checkbox v-model="picked.default" boxed value="email" label="Email" />
			</div>
		</Card>

		<Card v-for="surface in surfaces" :key="surface" :surface="surface">
			<code class="mb-2 block text-xs" :class="surface === 'dark' ? 'text-slate-300' : ''">surface="{{ surface }}"</code>
			<div class="flex flex-col gap-2">
				<Checkbox v-model="picked[surface]" boxed value="sms" label="Text message" />
				<Checkbox v-model="picked[surface]" boxed value="email" label="Email" />
			</div>
		</Card>

		<!-- The page is the one surface with no component to announce it, so this
		     block is the only one that says what it's on. -->
		<div class="px-6 py-2">
			<code class="mb-2 block text-xs">sits-on="background"</code>
			<div class="flex flex-col gap-2">
				<Checkbox v-model="picked.background" boxed value="sms" label="Text message" sits-on="background" />
				<Checkbox v-model="picked.background" boxed value="email" label="Email" sits-on="background" />
			</div>
		</div>
	</div>
</template>
