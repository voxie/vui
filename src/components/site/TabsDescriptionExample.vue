<script setup lang="ts">
// Three tabs that each carry a description. A component and not MDX markup,
// so the parts are one Vue tree. See `tabs.ts`.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import TabList from '@ui/TabList.vue';
import Tab from '@ui/Tab.vue';
import TabPanel from '@ui/TabPanel.vue';
import Card from '@ui/Card.vue';
import Input from '@ui/Input.vue';

const endpoint = ref('rest');
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex flex-col gap-6">
			<h3 id="tabs-endpoint-heading" class="text-xl font-bold text-slate-800">Endpoint</h3>
			<Tabs v-model="endpoint" size="lg" class="flex flex-col gap-6">
				<TabList aria-labelledby="tabs-endpoint-heading">
					<Tab value="rest" description="One URL per resource, called with standard HTTP verbs.">REST</Tab>
					<Tab value="graphql" description="A single URL that returns only the fields a query asks for.">GraphQL</Tab>
					<Tab value="group" description="A separate URL for each group, scoped to that group's data.">Per-Group Endpoint</Tab>
				</TabList>

				<TabPanel value="rest">
					<Input model-value="https://api.example.com/v3" label="Base URL" readonly />
				</TabPanel>
				<TabPanel value="graphql">
					<Input model-value="https://api.example.com/graphql" label="Endpoint URL" readonly />
				</TabPanel>
				<TabPanel value="group">
					<Input model-value="https://api.example.com/groups/{group}" label="Endpoint URL" readonly />
				</TabPanel>
			</Tabs>
		</div>
	</Card>
</template>
