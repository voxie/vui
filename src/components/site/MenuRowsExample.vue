<script setup lang="ts">
// A list with an overflow menu at the end of every row, which is where the
// menu spends most of its time in the product.
import Menu from '@ui/Menu.vue';
import MenuItem from '@ui/MenuItem.vue';
import Button from '@ui/Button.vue';
import Badge from '@ui/Badge.vue';
import Card from '@ui/Card.vue';

const rows = [
	{ name: 'Order confirmation', status: 'Live', color: 'teal' },
	{ name: 'Abandoned cart', status: 'Draft', color: 'slate' },
	{ name: 'Win-back', status: 'Paused', color: 'amber' },
] as const;
</script>

<template>
	<Card padding="none">
		<ul class="not-prose m-0 list-none divide-y divide-solid divide-slate-100 p-0">
			<li v-for="row in rows" :key="row.name" class="flex items-center gap-4 px-6 py-3">
				<span class="flex-1 text-sm font-semibold text-slate-800">{{ row.name }}</span>
				<Badge :color="row.color" size="sm">{{ row.status }}</Badge>
				<Menu placement="right">
					<template #default="{ open }">
						<Button size="sm" outline :aria-label="`Actions for ${row.name}`" aria-haspopup="true" :aria-expanded="open">
							<i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
						</Button>
					</template>

					<template #items>
						<MenuItem href="#">
							Edit
							<i class="fa-solid fa-pen" aria-hidden="true"></i>
						</MenuItem>
						<MenuItem>
							Duplicate
							<i class="fa-solid fa-copy" aria-hidden="true"></i>
						</MenuItem>
						<MenuItem :disabled="row.status === 'Live'">
							Delete
							<i class="fa-solid fa-trash" aria-hidden="true"></i>
						</MenuItem>
					</template>
				</Menu>
			</li>
		</ul>
	</Card>
</template>
