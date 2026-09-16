<script setup lang="ts">
// One file, so the named slots are real Vue slots. MDX drops `slot` on an
// element that has children of its own.
import Alert from '@ui/Alert.vue';
import Button from '@ui/Button.vue';
</script>

<template>
	<div class="space-y-3">
		<Alert color="rose" :dismissible="false">
			<template #icon><i aria-hidden="true" class="fa-solid fa-triangle-exclamation"></i></template>
			Message Content Error
			<template #description>
				<ul>
					<li>Emojis not allowed</li>
					<li>Special characters not allowed</li>
					<li>Incorrect company name format pizzaPlace to Pizzaplace</li>
				</ul>
			</template>
		</Alert>
		<Alert color="teal">
			<strong>New Group</strong> imported
			<template #description>1,204 contacts were added. Duplicates were skipped.</template>
		</Alert>
		<Alert color="amber">
			Your trial ends in <span class="font-extrabold">three days</span>
			<template #description>After that, campaigns pause and contacts stay read-only until a plan is chosen.</template>
			<template #actions>
				<Button size="sm" color="amber">Choose a plan</Button>
			</template>
		</Alert>
	</div>
</template>
