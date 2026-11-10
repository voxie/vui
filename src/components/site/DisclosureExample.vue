<script setup lang="ts">
// One control and the block it opens, in a card. The chevron sits at either end
// of the control and turns to point down while the block is open. See
// /docs/patterns/disclosure.
import { computed, ref, useId } from 'vue';
import Card from '@ui/Card.vue';

const props = withDefaults(
	defineProps<{
		// Which end of the control the chevron sits at.
		chevron?: 'start' | 'end';
		label?: string;
		open?: boolean;
		surface?: 'default' | 'glass' | 'sunken';
	}>(),
	{ chevron: 'start', label: 'Delivery window', open: false, surface: 'default' },
);

const isOpen = ref(props.open);
const panelId = useId();

// A quarter turn from either closed direction lands on down, so one icon turns
// instead of two swapping.
const chevronClasses = computed(() =>
	props.chevron === 'start'
		? ['fa-angle-right', { 'rotate-90': isOpen.value }]
		: ['fa-angle-left order-last', { '-rotate-90': isOpen.value }],
);
</script>

<template>
	<Card as="section" :surface="surface">
		<h3 class="m-0 text-base leading-snug">
			<button
				type="button"
				:aria-expanded="isOpen"
				:aria-controls="panelId"
				class="group/disclosure flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent p-0 text-left font-sans text-base font-extrabold text-slate-800 outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4"
				@click="isOpen = !isOpen"
			>
				<i
					class="fa-solid fa-width-auto text-sm text-slate-500 group-hover/disclosure:text-slate-800 motion-safe:transition-[color,transform] motion-safe:duration-200 motion-safe:ease-out"
					:class="chevronClasses"
					aria-hidden="true"
				></i>
				<span class="flex-1">{{ label }}</span>
			</button>
		</h3>

		<!-- The row runs from 0fr to 1fr, so the block can be any height.
		     Visibility rides along and flips only once the row has closed. -->
		<div
			:id="panelId"
			:inert="isOpen ? undefined : true"
			class="grid motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-200 motion-safe:ease-out"
			:class="isOpen ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'"
		>
			<div class="min-h-0 overflow-clip">
				<div class="pt-4 text-sm leading-relaxed text-slate-700">
					<slot>
						<p>Messages wait until the recipient's local sending window opens. Replies that arrive after hours queue for the next one.</p>
					</slot>
				</div>
			</div>
		</div>
	</Card>
</template>
