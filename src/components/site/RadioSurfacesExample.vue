<script setup lang="ts">
// A row per surface, none of the radios told what it sits on. A component and
// not MDX markup, so the cards and the radios are one Vue tree. See
// `surface.ts`.
import Radio from '@ui/Radio.vue';
import Card from '@ui/Card.vue';

const surfaces = ['glass', 'sunken', 'dark'] as const;
</script>

<template>
	<div class="not-prose grid grid-cols-[max-content_1fr] gap-x-6 gap-y-4">
		<Card class="col-span-2 grid grid-cols-subgrid items-center justify-items-start">
			<code class="text-xs">&lt;Card&gt;</code>
			<div class="flex gap-8">
				<Radio name="surface-default" value="now" label="Send now" />
				<Radio name="surface-default-on" value="now" :model-value="'now'" label="Send now" />
			</div>
		</Card>

		<Card
			v-for="surface in surfaces"
			:key="surface"
			:surface="surface"
			class="col-span-2 grid grid-cols-subgrid items-center justify-items-start"
		>
			<code class="text-xs">surface="{{ surface }}"</code>
			<div class="flex gap-8">
				<Radio :name="`surface-${surface}`" value="now" label="Send now" />
				<Radio :name="`surface-${surface}-on`" value="now" :model-value="'now'" label="Send now" />
			</div>
		</Card>

		<!-- The page is the one surface with no component to announce it, so this
		     row is the only one that says what it's on. -->
		<div class="col-span-2 grid grid-cols-subgrid items-center justify-items-start px-6 py-2">
			<code class="text-xs">sits-on="background"</code>
			<div class="flex gap-8">
				<Radio name="surface-background" value="now" label="Send now" sits-on="background" />
				<Radio name="surface-background-on" value="now" :model-value="'now'" label="Send now" sits-on="background" />
			</div>
		</div>
	</div>
</template>
