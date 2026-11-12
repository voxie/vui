<script setup lang="ts">
// One control and the block it opens, in a card. The whole header is the
// control, or with a count the control is a square Button at the far end.
// See /docs/patterns/disclosure#control.
import { ref, useId } from 'vue';
import Badge from '@ui/Badge.vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';

const props = withDefaults(
	defineProps<{
		// Which end of the control the chevron sits at.
		chevron?: 'start' | 'end';
		// A header holding more than a label gets a square Button at the far end.
		count?: number;
		label?: string;
		open?: boolean;
		surface?: 'default' | 'glass' | 'sunken';
	}>(),
	{ chevron: 'end', count: undefined, label: 'Delivery window', open: false, surface: 'default' },
);

const isOpen = ref(props.open);
const panelId = useId();
</script>

<template>
	<!-- Compact, with px-4 on the block, so its text lines up with the label inside the Button. -->
	<Card as="section" :surface="surface" padding="compact">
		<div v-if="props.count !== undefined" class="flex h-10 items-center gap-4 pl-4">
			<h3 class="m-0 truncate text-base font-extrabold text-slate-800">{{ label }}</h3>
			<Badge color="slate" size="sm">{{ props.count }}</Badge>
			<span class="grow"></span>
			<Button
				class="w-10 shrink-0 px-0!"
				:aria-label="label"
				:aria-expanded="isOpen"
				:aria-controls="panelId"
				@click="isOpen = !isOpen"
			>
				<!-- Keyed, so each swap mounts a new <i> for the kit to pick up. -->
				<span :key="isOpen ? 'up' : 'down'" class="contents">
					<i class="fa-solid" :class="isOpen ? 'fa-angle-up' : 'fa-angle-down'" aria-hidden="true"></i>
				</span>
			</Button>
		</div>

		<h3 v-else class="m-0">
			<Button block color="transparent" :aria-expanded="isOpen" :aria-controls="panelId" @click="isOpen = !isOpen">
				<!-- The kit swaps each <i> for an <svg>, so the turn sits on a span. -->
				<span
					v-if="props.chevron === 'start'"
					class="inline-flex motion-safe:transition-[rotate] motion-safe:duration-200 motion-safe:ease-out"
					:class="{ 'rotate-90': isOpen }"
				>
					<i class="fa-solid fa-angle-right fa-width-auto" aria-hidden="true"></i>
				</span>

				<span class="flex-1 text-left text-base font-extrabold text-slate-800">{{ label }}</span>

				<span v-if="props.chevron === 'end'" :key="isOpen ? 'up' : 'down'" class="contents">
					<i class="fa-solid fa-width-auto" :class="isOpen ? 'fa-angle-up' : 'fa-angle-down'" aria-hidden="true"></i>
				</span>
			</Button>
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
				<div class="px-4 pt-2 pb-2 text-sm leading-relaxed text-slate-700">
					<slot>
						<p>Messages wait until the recipient's local sending window opens. Replies that arrive after hours queue for the next one.</p>
					</slot>
				</div>
			</div>
		</div>
	</Card>
</template>
