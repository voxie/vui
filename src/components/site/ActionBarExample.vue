<script setup lang="ts">
// A form in a box that scrolls, standing in for the window. One component so
// the buttons read the bar's surface. See `surface.ts`.
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
import Input from '@ui/Input.vue';
import ActionBar from '@ui/ActionBar.vue';
</script>

<template>
	<!-- Focusable so the box scrolls from the keyboard. -->
	<div
		class="not-prose h-112 overflow-y-auto rounded-2xl border border-slate-300"
		tabindex="0"
		role="region"
		aria-label="A form that ends in an action bar"
	>
		<!-- The bottom padding stands in for PageLayout's, so the bar has
		     somewhere to come to rest. -->
		<div class="px-4 pt-4 pb-16 sm:px-6 sm:pt-6">
			<div class="flex flex-col gap-4">
				<Card surface="glass" as="section" class="flex flex-col gap-4">
					<h4 class="text-xl font-extrabold text-slate-700">Details</h4>
					<Input label="First name" />
					<Input label="Last name" />
				</Card>
				<Card surface="glass" as="section" class="flex flex-col gap-4">
					<h4 class="text-xl font-extrabold text-slate-700">Contact</h4>
					<Input label="Phone" type="tel" />
					<Input label="Email" type="email" />
				</Card>
				<Card surface="glass" as="section" class="flex flex-col gap-4">
					<h4 class="text-xl font-extrabold text-slate-700">Notes</h4>
					<Input label="Note" :rows="3" />
				</Card>

				<ActionBar>
					<Button size="lg">Cancel</Button>
					<Button size="lg" color="sky" block>Save Contact</Button>
				</ActionBar>
			</div>
		</div>
	</div>
</template>
