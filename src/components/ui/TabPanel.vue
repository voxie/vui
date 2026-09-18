<script setup lang="ts">
import { computed, inject } from 'vue';
import { TabsKey } from './tabs.ts';

const props = withDefaults(
	defineProps<{
		// The `value` of the Tab that reveals this panel.
		value: string;
		// Keep the panel in the DOM while another tab is picked, hidden, so what's
		// inside holds its state. Left off, the panel is rendered only while it's
		// the one showing.
		keepMounted?: boolean;
	}>(),
	{
		keepMounted: false,
	},
);

const tabs = inject(TabsKey);
if (!tabs) throw new Error('TabPanel has to be inside Tabs.');

const selected = computed(() => tabs.current.value === props.value);
</script>

<template>
	<!-- tabindex="0" so Tab from the track lands on the panel, whatever is in
	     it, as the tabs pattern asks. -->
	<div
		v-if="selected || props.keepMounted"
		role="tabpanel"
		tabindex="0"
		:id="tabs.panelId(props.value)"
		:aria-labelledby="tabs.tabId(props.value)"
		:hidden="!selected"
		class="outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4"
	>
		<slot />
	</div>
</template>
