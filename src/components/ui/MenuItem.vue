<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		href?: string;
		disabled?: boolean;
	}>(),
	{ disabled: false },
);

const element = computed(() => (props.href ? 'a' : 'button'));
</script>

<template>
	<!-- The li is bare: the control is the row and the hit target. -->
	<li class="w-full">
		<!-- The ring is inset, since the panel clips its overflow and would cut off
		     one drawn outside the row. -->
		<component
			:is="element"
			:href="props.href"
			:type="props.href ? undefined : 'button'"
			:disabled="props.href ? undefined : props.disabled"
			:aria-disabled="props.href && props.disabled ? 'true' : undefined"
			class="flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-white px-6 py-4 text-left font-sans text-xs font-semibold whitespace-nowrap text-black no-underline outline-blue-600 transition-all hover:bg-slate-50 hover:text-black hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
			:class="{ 'pointer-events-none opacity-50': props.href && props.disabled }"
		>
			<slot />
		</component>
	</li>
</template>
