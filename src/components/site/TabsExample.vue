<script setup lang="ts">
// A live set of tabs. A component and not MDX markup, so Tabs and its Tab
// children are one Vue tree. See `tabs.ts`.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import Tab from '@ui/Tab.vue';
import Card from '@ui/Card.vue';
import type { TabsSize } from '@ui/tabs.ts';

withDefaults(
	defineProps<{
		size?: TabsSize;
		disabled?: boolean;
		// Disables the last tab on its own.
		disabledTab?: boolean;
		readout?: boolean;
	}>(),
	{ size: 'md', disabled: false, disabledTab: false, readout: false },
);

const current = ref('all');
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex flex-col gap-4">
			<Tabs v-model="current" :size="size" :disabled="disabled" aria-label="Conversations">
				<Tab value="all">All</Tab>
				<Tab value="open">Open</Tab>
				<Tab value="closed" :disabled="disabledTab">Closed</Tab>
			</Tabs>
			<p v-if="readout" class="text-xs text-slate-500">
				<code>v-model</code> is <code class="text-slate-800">{{ current }}</code>
			</p>
		</div>
	</Card>
</template>
