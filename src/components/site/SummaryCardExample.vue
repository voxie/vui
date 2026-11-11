<script setup lang="ts">
// A list grouped into summary cards. See /docs/components/summary-card.
import { reactive } from 'vue';
import Badge from '@ui/Badge.vue';
import Card from '@ui/Card.vue';
import SummaryCard from '@ui/SummaryCard.vue';

type Kind = 'Campaign' | 'Automation' | 'Segment';
type Group = {
	key: string;
	label: string;
	icon: string;
	color: string;
	open: boolean;
	items: { name: string; kind: Kind }[];
};

const groups = reactive<Group[]>([
	{
		key: 'failing',
		label: 'Failing',
		icon: 'fa-circle-xmark',
		color: 'text-rose-500',
		open: false,
		items: [
			{ name: 'Abandoned cart', kind: 'Automation' },
			{ name: 'Win-back offer', kind: 'Campaign' },
			{ name: 'Lapsed 90 days', kind: 'Segment' },
			{ name: 'Birthday reward', kind: 'Campaign' },
		],
	},
	{
		key: 'attention',
		label: 'Needs attention',
		icon: 'fa-triangle-exclamation',
		color: 'text-amber-500',
		open: true,
		items: [
			{ name: 'Welcome series', kind: 'Campaign' },
			{ name: 'Review request', kind: 'Automation' },
			{ name: 'New subscribers', kind: 'Segment' },
		],
	},
	{
		key: 'healthy',
		label: 'Healthy',
		icon: 'fa-circle-check',
		color: 'text-sky-500',
		open: true,
		items: [
			{ name: 'Order updates', kind: 'Automation' },
			{ name: 'Weekly specials', kind: 'Campaign' },
		],
	},
]);

const KINDS = { Campaign: 'sky', Automation: 'amber', Segment: 'violet' } as const;

// One segment per kind, valued by how many of the group's items are that kind.
const summary = (group: Group) =>
	(Object.keys(KINDS) as Kind[]).map((kind) => ({
		label: kind,
		value: group.items.filter((item) => item.kind === kind).length,
		color: KINDS[kind],
	}));

const setAll = (open: boolean) => {
	for (const group of groups) group.open = open;
};
</script>

<template>
	<div class="not-prose space-y-4">
		<SummaryCard
			v-for="group in groups"
			:key="group.key"
			v-model:open="group.open"
			:label="group.label"
			:count="group.items.length"
			:summary="summary(group)"
			@toggle-all="setAll"
		>
			<template #mark>
				<span :class="group.color"><i class="fa-solid" :class="group.icon" aria-hidden="true"></i></span>
			</template>

			<ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
				<li v-for="item in group.items" :key="item.name">
					<Card padding="compact" class="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
						<span class="truncate">{{ item.name }}</span>
						<Badge color="slate" size="xs">{{ item.kind }}</Badge>
					</Card>
				</li>
			</ul>
		</SummaryCard>
	</div>
</template>
