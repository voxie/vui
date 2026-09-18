<script setup lang="ts">
// A row per surface, none of the tabs told what they sit on. A component and
// not MDX markup, so the cards and the tabs are one Vue tree. See `surface.ts`.
import { ref } from 'vue';
import Tabs from '@ui/Tabs.vue';
import TabList from '@ui/TabList.vue';
import Tab from '@ui/Tab.vue';
import Card from '@ui/Card.vue';

const surfaces = ['glass', 'sunken', 'dark'] as const;

const current = ref<Record<string, string>>({
	default: 'segments',
	glass: 'segments',
	sunken: 'segments',
	dark: 'segments',
	background: 'segments',
});
</script>

<template>
	<div class="not-prose grid grid-cols-[max-content_1fr] gap-x-6 gap-y-4">
		<Card class="col-span-2 grid grid-cols-subgrid items-center">
			<code class="text-xs">&lt;Card&gt;</code>
			<Tabs v-model="current.default">
				<TabList aria-label="Audience">
					<Tab value="segments">Segments</Tab>
					<Tab value="external">External List</Tab>
					<Tab value="everyone">Everyone</Tab>
				</TabList>
			</Tabs>
		</Card>

		<Card
			v-for="surface in surfaces"
			:key="surface"
			:surface="surface"
			class="col-span-2 grid grid-cols-subgrid items-center"
		>
			<code class="text-xs">surface="{{ surface }}"</code>
			<Tabs v-model="current[surface]">
				<TabList aria-label="Audience">
					<Tab value="segments">Segments</Tab>
					<Tab value="external">External List</Tab>
					<Tab value="everyone">Everyone</Tab>
				</TabList>
			</Tabs>
		</Card>

		<!-- The page is the one surface with no component to announce it, so this
		     row is the only one that says what it's on. -->
		<div class="col-span-2 grid grid-cols-subgrid items-center px-6 py-2">
			<code class="text-xs">sits-on="background"</code>
			<Tabs v-model="current.background" sits-on="background">
				<TabList aria-label="Audience">
					<Tab value="segments">Segments</Tab>
					<Tab value="external">External List</Tab>
					<Tab value="everyone">Everyone</Tab>
				</TabList>
			</Tabs>
		</div>
	</div>
</template>
