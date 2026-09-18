<script setup lang="ts">
// A small set of tabs with a line of content per tab. A component and not MDX
// markup, so the parts are one Vue tree. See `tabs.ts`.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import TabList from '@ui/TabList.vue';
import Tab from '@ui/Tab.vue';
import TabPanel from '@ui/TabPanel.vue';
import Card from '@ui/Card.vue';
import type { TabsSize } from '@ui/tabs.ts';

withDefaults(
	defineProps<{
		size?: TabsSize;
		disabled?: boolean;
		// Disables the last tab on its own.
		disabledTab?: boolean;
	}>(),
	{ size: 'md', disabled: false, disabledTab: false },
);

const current = ref('segments');
</script>

<template>
	<Card surface="glass">
		<Tabs v-model="current" :size="size" :disabled="disabled" class="not-prose flex flex-col gap-4">
			<TabList aria-label="Audience">
				<Tab value="segments">Segments</Tab>
				<Tab value="external">External List</Tab>
				<Tab value="everyone" :disabled="disabledTab">Everyone</Tab>
			</TabList>
			<TabPanel value="segments" class="text-sm text-slate-600">Pick one or more saved segments.</TabPanel>
			<TabPanel value="external" class="text-sm text-slate-600">Point at a list of numbers you host.</TabPanel>
			<TabPanel value="everyone" class="text-sm text-slate-600">Every opted-in contact.</TabPanel>
		</Tabs>
	</Card>
</template>
