<script setup lang="ts">
import { computed, useId } from 'vue';
import Badge from './Badge.vue';
import Button from './Button.vue';
import Card from './Card.vue';

// The five accents plus slate, each at its 300.
type SummaryColor = 'sky' | 'teal' | 'amber' | 'rose' | 'violet' | 'slate';
type Segment = { label: string; value: number; color: SummaryColor };

const props = withDefaults(
	defineProps<{
		// The group's name. Also what a screen reader hears for the card and its Button.
		label: string;
		count?: number;
		// One segment per kind of thing in the group, drawn as wide as its share.
		summary?: Segment[];
		// The heading level of the name.
		level?: 2 | 3 | 4 | 5 | 6;
	}>(),
	{ count: undefined, summary: () => [], level: 3 },
);

// Unbound, the card tracks its own state.
const open = defineModel<boolean>('open', { default: true });

// Fired on a press with Option or Alt held, so a list can set every card at once.
const emit = defineEmits<{ toggleAll: [open: boolean] }>();

const segmentClasses: Record<SummaryColor, string> = {
	sky: 'bg-sky-300',
	teal: 'bg-teal-300',
	amber: 'bg-amber-300',
	rose: 'bg-rose-300',
	violet: 'bg-violet-300',
	slate: 'bg-slate-300',
};

const segments = computed(() => props.summary.filter((segment) => segment.value > 0));

const summaryLabel = computed(() =>
	segments.value.map((segment) => `${segment.label} ${segment.value}`).join(', '),
);

const panelId = useId();

function toggle(event: MouseEvent): void {
	const next = !open.value;
	open.value = next;
	if (event.altKey) emit('toggleAll', next);
}

const fold = 'grid motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-200 motion-safe:ease-out';
</script>

<template>
	<!-- The bottom border is the sunken surface's, held on both so the card doesn't shift a pixel. -->
	<Card
		as="section"
		:surface="open ? 'sunken' : 'default'"
		padding="none"
		:aria-label="props.label"
		class="border-b border-b-white px-6 py-4 motion-safe:transition-[background-color,box-shadow] motion-safe:duration-200 motion-safe:ease-out"
	>
		<div class="flex items-center gap-4">
			<component
				:is="`h${props.level}`"
				class="m-0 flex min-w-0 items-center gap-3 font-sans text-base font-extrabold text-slate-800"
			>
				<slot name="mark" />
				<span class="truncate">{{ props.label }}</span>
			</component>
			<Badge v-if="props.count !== undefined" color="slate" size="sm">{{ props.count }}</Badge>
			<span class="grow"></span>
			<Button
				class="w-10 shrink-0 px-0!"
				:aria-label="props.label"
				:aria-expanded="open"
				:aria-controls="panelId"
				@click="toggle"
			>
				<!-- Keyed, so each swap mounts a new <i> for the kit to pick up. -->
				<span :key="open ? 'up' : 'down'" class="contents">
					<i class="fa-solid" :class="open ? 'fa-angle-up' : 'fa-angle-down'" aria-hidden="true"></i>
				</span>
			</Button>
		</div>

		<!-- The summary folds the opposite way to the block. -->
		<div v-if="segments.length" :class="[fold, open ? 'invisible grid-rows-[0fr]' : 'grid-rows-[1fr]']">
			<div class="min-h-0 overflow-clip">
				<div class="flex items-center pt-4" role="img" :aria-label="summaryLabel">
					<div
						v-for="(segment, index) in segments"
						:key="segment.label"
						class="h-3 min-w-3 rounded-sm border-2 border-solid border-white"
						:class="[segmentClasses[segment.color], { '-ml-1': index }]"
						:style="{ flexGrow: segment.value }"
					></div>
				</div>
			</div>
		</div>

		<!-- The row runs from 0fr to 1fr, so the block can be any height. -->
		<div
			:id="panelId"
			:inert="open ? undefined : true"
			:class="[fold, open ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]']"
		>
			<div class="min-h-0 overflow-clip">
				<div class="pt-4 pb-2">
					<slot />
				</div>
			</div>
		</div>
	</Card>
</template>
