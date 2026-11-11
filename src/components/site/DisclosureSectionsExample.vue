<script setup lang="ts">
// A list grouped into sections that fold. Open, a section is a sunken well
// around its cards. Closed, it is a white card with a summary bar. See
// /docs/patterns/disclosure#sections.
import { reactive } from 'vue';
import Badge from '@ui/Badge.vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';

type Kind = 'Campaign' | 'Automation' | 'Segment';
type Section = {
	key: string;
	label: string;
	icon: string;
	color: string;
	open: boolean;
	items: { name: string; kind: Kind }[];
};

const sections = reactive<Section[]>([
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

const KINDS: Record<Kind, string> = {
	Campaign: 'bg-sky-300',
	Automation: 'bg-amber-300',
	Segment: 'bg-violet-300',
};

// One segment per kind, as wide as its share of the section.
const mix = (section: Section) =>
	(Object.keys(KINDS) as Kind[])
		.map((kind) => ({ kind, count: section.items.filter((item) => item.kind === kind).length }))
		.filter((part) => part.count);

const mixLabel = (section: Section) =>
	mix(section)
		.map((part) => `${part.count} ${part.kind.toLowerCase()}${part.count === 1 ? '' : 's'}`)
		.join(', ');

// With Option or Alt held, every section follows the one pressed.
const toggle = (section: Section, event: MouseEvent) => {
	const next = !section.open;
	if (event.altKey) for (const each of sections) each.open = next;
	else section.open = next;
};

const fold = 'grid motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-200 motion-safe:ease-out';
</script>

<template>
	<div class="not-prose space-y-4">
		<!-- The bottom border is the sunken surface's, held on both so the card doesn't shift a pixel. -->
		<Card
			v-for="section in sections"
			:key="section.key"
			as="section"
			:surface="section.open ? 'sunken' : 'default'"
			padding="none"
			:aria-label="section.label"
			class="border-b border-b-white px-6 py-4 motion-safe:transition-[background-color,box-shadow] motion-safe:duration-200 motion-safe:ease-out"
		>
			<div class="flex items-center gap-4">
				<h3 class="m-0 flex min-w-0 items-center gap-3 text-base font-extrabold text-slate-800">
					<span :class="section.color"><i class="fa-solid" :class="section.icon" aria-hidden="true"></i></span>
					<span class="truncate">{{ section.label }}</span>
				</h3>
				<Badge color="slate" size="sm">{{ section.items.length }}</Badge>
				<span class="grow"></span>
				<Button
					class="w-10 shrink-0 px-0!"
					:aria-label="section.label"
					:aria-expanded="section.open"
					:aria-controls="`sections-${section.key}`"
					@click="toggle(section, $event)"
				>
					<!-- Keyed, so each swap mounts a new <i> for the kit to pick up. -->
					<span :key="section.open ? 'up' : 'down'" class="contents">
						<i class="fa-solid" :class="section.open ? 'fa-angle-up' : 'fa-angle-down'" aria-hidden="true"></i>
					</span>
				</Button>
			</div>

			<!-- The summary folds the opposite way to the block. -->
			<div :class="[fold, section.open ? 'invisible grid-rows-[0fr]' : 'grid-rows-[1fr]']">
				<div class="min-h-0 overflow-clip">
					<div class="flex items-center pt-4" role="img" :aria-label="mixLabel(section)">
						<div
							v-for="(part, index) in mix(section)"
							:key="part.kind"
							class="h-3 min-w-3 rounded-sm border-2 border-solid border-white"
							:class="[KINDS[part.kind], { '-ml-1': index }]"
							:style="{ flexGrow: part.count }"
						></div>
					</div>
				</div>
			</div>

			<div
				:id="`sections-${section.key}`"
				:inert="section.open ? undefined : true"
				:class="[fold, section.open ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]']"
			>
				<div class="min-h-0 overflow-clip">
					<ul class="m-0 grid list-none gap-3 p-0 pt-4 pb-2 sm:grid-cols-2">
						<li v-for="item in section.items" :key="item.name">
							<Card padding="compact" class="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
								<span class="truncate">{{ item.name }}</span>
								<Badge color="slate" size="xs">{{ item.kind }}</Badge>
							</Card>
						</li>
					</ul>
				</div>
			</div>
		</Card>
	</div>
</template>
