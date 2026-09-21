<script setup lang="ts">
import { computed, ref } from 'vue';
import Popover from '@ui/Popover.vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';

const props = withDefaults(defineProps<{
	hover?: boolean;
	arrow?: boolean;
	placement?: 'bottom' | 'top' | 'left' | 'right';
	disabled?: boolean;
	controlled?: boolean;
	clipped?: boolean;
}>(), { placement: 'bottom' });
const open = ref(false);
const triggerLabel = computed(() => {
	if (props.disabled) return 'Popover disabled';
	if (props.hover) return 'Hover or click to open';
	if (props.clipped) return 'Open beyond the container';
	if (props.placement !== 'bottom') return `Open to the ${props.placement}`;
	return 'Open popover';
});
</script>

<template>
	<Card surface="glass">
		<div class="not-prose flex flex-wrap items-center gap-3" :class="clipped ? 'h-24 overflow-hidden rounded-lg border border-slate-200 p-4' : ''">
			<Popover v-model:open="open" :hover="hover" :open-delay="hover ? 300 : 0" :arrow="arrow" :placement="placement" :disabled="disabled" label="Delivery details">
				<template #default="{ triggerProps }">
					<Button v-if="controlled" v-bind="triggerProps" outline @click.stop="open = !open">Open from outside</Button>
					<Button v-else v-bind="triggerProps" :disabled="disabled">{{ triggerLabel }}</Button>
				</template>
				<template #content="{ close }">
					<div class="flex max-w-64 flex-col items-start gap-3">
						<p class="m-0">Messages wait until the recipient's local sending window opens.</p>
						<Button size="sm" @click="close()">Got it</Button>
					</div>
				</template>
			</Popover>
		</div>
	</Card>
</template>
