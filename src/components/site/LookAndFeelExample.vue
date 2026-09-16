<script setup lang="ts">
// The look in one card: white on the grey page, an extrabold heading over small
// body copy, one sky button, and a tinted badge. A component and not MDX
// markup, so the slate button reads the card it sits in.
import Badge from '@ui/Badge.vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
</script>

<template>
	<Card class="not-prose max-w-md">
		<div class="flex items-start justify-between gap-4">
			<h3 class="text-lg font-extrabold leading-snug text-slate-800">Spring launch</h3>
			<Badge color="teal" size="xs"><i aria-hidden="true" class="fa-solid fa-check"></i> Sent</Badge>
		</div>
		<p class="mt-2 text-sm leading-relaxed">
			Delivered to 1,408 contacts on Tuesday morning. 904 opened it and 64 wrote back, most of them within the hour.
		</p>
		<div class="mt-5 flex gap-3">
			<Button color="slate">Edit</Button>
			<Button color="sky" class="w-full">View replies</Button>
		</div>
	</Card>
</template>
