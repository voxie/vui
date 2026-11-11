<script setup lang="ts">
// One control and the block it opens, in a card. The whole heading is the
// control, with the chevron at either end of it. See /docs/patterns/disclosure.
import { ref, useId } from 'vue';
import Card from '@ui/Card.vue';

const props = withDefaults(
	defineProps<{
		// Which end of the control the chevron sits at.
		chevron?: 'start' | 'end';
		label?: string;
		open?: boolean;
		surface?: 'default' | 'glass' | 'sunken';
	}>(),
	{ chevron: 'end', label: 'Delivery window', open: false, surface: 'default' },
);

const isOpen = ref(props.open);
const panelId = useId();

const chevronClasses = 'inline-flex text-sm text-slate-500 group-hover/disclosure:text-slate-800 motion-safe:transition-[color,rotate] motion-safe:duration-200 motion-safe:ease-out';
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
				<!-- The kit swaps each <i> for an <svg>, so the turn sits on a span. -->
				<span
					v-if="props.chevron === 'start'"
					:class="[chevronClasses, { 'rotate-90': isOpen }]"
				>
					<i class="fa-solid fa-angle-right fa-width-auto" aria-hidden="true"></i>
				</span>

				<span class="flex-1">{{ label }}</span>

				<!-- Keyed, so each swap mounts a new <i> for the kit to pick up. -->
				<span v-if="props.chevron === 'end'" :key="isOpen ? 'up' : 'down'" :class="chevronClasses">
					<i class="fa-solid fa-width-auto" :class="isOpen ? 'fa-angle-up' : 'fa-angle-down'" aria-hidden="true"></i>
				</span>
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
