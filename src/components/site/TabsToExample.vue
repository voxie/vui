<script setup lang="ts">
// The To step of the campaign composer: a heading, the track, and a block of
// content per tab. A component and not MDX markup, so the four parts are one
// Vue tree. See `tabs.ts`.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import TabList from '@ui/TabList.vue';
import Tab from '@ui/Tab.vue';
import TabPanel from '@ui/TabPanel.vue';
import Card from '@ui/Card.vue';
import Select from '@ui/Select.vue';
import Input from '@ui/Input.vue';

const to = ref('segments');
const segment = ref<string | number | undefined>();
const url = ref('');

const segments = [
	{ value: 'vip', label: 'VIP customers' },
	{ value: 'lapsed', label: 'Lapsed 90 days' },
	{ value: 'new', label: 'Joined this month' },
];
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex flex-col gap-6">
			<h3 id="tabs-to-heading" class="text-xl font-bold text-slate-800">To</h3>
			<Tabs v-model="to" size="lg" class="flex flex-col gap-6">
				<TabList aria-labelledby="tabs-to-heading">
					<Tab value="segments">Segments</Tab>
					<Tab value="external">External List</Tab>
					<Tab value="everyone">Everyone</Tab>
				</TabList>

				<TabPanel value="segments">
					<Select
						v-model="segment"
						label="Segments to receive this message"
						description="Segments filtered to match the audience type you chose on the previous step."
						placeholder="Select a segment"
						:options="segments"
					/>
				</TabPanel>
				<TabPanel value="external">
					<Input v-model="url" type="url" label="List URL" description="A CSV of phone numbers, one per line." placeholder="https://" />
				</TabPanel>
				<TabPanel value="everyone">
					<p class="text-sm text-slate-600">Every contact who has opted in to marketing messages will receive this campaign.</p>
				</TabPanel>
			</Tabs>
		</div>
	</Card>
</template>
