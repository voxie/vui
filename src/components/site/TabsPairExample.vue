<script setup lang="ts">
// A track of two tabs, where a click anywhere on the track picks the other
// one. A component and not MDX markup, so the parts are one Vue tree. See
// `tabs.ts`.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import TabList from '@ui/TabList.vue';
import Tab from '@ui/Tab.vue';
import TabPanel from '@ui/TabPanel.vue';
import Card from '@ui/Card.vue';

const current = ref('now');
</script>

<template>
	<Card surface="glass">
		<Tabs v-model="current" class="not-prose flex flex-col gap-4">
			<TabList aria-label="Send time">
				<Tab value="now">Send Now</Tab>
				<Tab value="later">Send Later</Tab>
			</TabList>
			<TabPanel value="now" class="text-sm text-slate-600">The campaign goes out as soon as it's confirmed.</TabPanel>
			<TabPanel value="later" class="text-sm text-slate-600">The campaign waits for the day and time you pick.</TabPanel>
		</Tabs>
	</Card>
</template>
