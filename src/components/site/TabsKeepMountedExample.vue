<script setup lang="ts">
// Two panels that each hold a field. Type in one, switch, switch back, and the
// text is still there, since `keepMounted` keeps the hidden panel in the DOM.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import TabList from '@ui/TabList.vue';
import Tab from '@ui/Tab.vue';
import TabPanel from '@ui/TabPanel.vue';
import Card from '@ui/Card.vue';
import Input from '@ui/Input.vue';

const current = ref('sms');
const sms = ref('');
const mms = ref('');
</script>

<template>
	<Card surface="glass">
		<Tabs v-model="current" class="not-prose flex flex-col gap-4">
			<TabList aria-label="Message type">
				<Tab value="sms">SMS</Tab>
				<Tab value="mms">MMS</Tab>
			</TabList>
			<TabPanel value="sms" keep-mounted>
				<Input v-model="sms" label="SMS body" placeholder="Type something, then switch tabs" />
			</TabPanel>
			<TabPanel value="mms" keep-mounted>
				<Input v-model="mms" label="MMS caption" placeholder="Type something, then switch tabs" />
			</TabPanel>
		</Tabs>
	</Card>
</template>
