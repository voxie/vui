<script setup lang="ts">
// One trigger and one menu, parameterized so the docs page can show a prop by
// opening the real thing. `clipped` puts the trigger in a short scrolling box,
// which is what `teleport` exists for.
import Menu from '@ui/Menu.vue';
import MenuItem from '@ui/MenuItem.vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';

const props = withDefaults(
	defineProps<{
		placement?: 'left' | 'right';
		teleport?: boolean;
		disabled?: boolean;
		clipped?: boolean;
		// How many rows the menu holds, past the two it always has.
		extra?: number;
	}>(),
	{ placement: 'left', teleport: false, disabled: false, clipped: false, extra: 0 },
);
</script>

<template>
	<Card surface="glass">
		<div
			class="not-prose flex"
			:class="[
				props.placement === 'right' ? 'justify-end' : 'justify-start',
				props.clipped ? 'h-24 overflow-auto rounded-lg border border-solid border-slate-200 bg-white p-4' : '',
			]"
		>
			<Menu :placement="props.placement" :teleport="props.teleport" :disabled="props.disabled">
				<template #default="{ open }">
					<Button outline aria-label="Actions" aria-haspopup="true" :aria-expanded="open" :disabled="props.disabled">
						<i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
					</Button>
				</template>

				<template #items>
					<MenuItem>
						Duplicate
						<i class="fa-solid fa-copy" aria-hidden="true"></i>
					</MenuItem>
					<MenuItem v-for="index in props.extra" :key="index">
						Item {{ index }}
						<i class="fa-solid fa-copy" aria-hidden="true"></i>
					</MenuItem>
					<MenuItem disabled>
						Delete
						<i class="fa-solid fa-trash" aria-hidden="true"></i>
					</MenuItem>
				</template>
			</Menu>
			<!-- Something to scroll past, so the box has the overflow it's there to show. -->
			<div v-if="props.clipped" class="h-40 shrink-0"></div>
		</div>
	</Card>
</template>
