<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		href?: string;
		active?: boolean;
		/*
		  Set by the action holding the item rather than by hand: it's true when
		  the item sits inside a submenu instead of straight in the dropdown.
		*/
		nested?: boolean;
	}>(),
	{ active: false, nested: false },
);

const element = computed(() => (props.href ? 'a' : 'button'));
</script>

<template>
	<!-- A row in a menu, which Navbar's dropdowns mark up as a list. The li is
	     bare: the control keeps the padding and the positioning, so nothing
	     about the row's own box changes. -->
	<li class="w-full">
		<!-- The cursor is on the row and not on the label, because the row is the
		     hit target: it runs the full width of the panel and a click anywhere
		     along it follows the link. A cursor that only appeared over the words
		     would be saying the row ends where they do. -->
		<component
			:is="element"
			:href="props.href"
			:type="props.href ? undefined : 'button'"
			:aria-current="props.active ? (props.href ? 'page' : 'true') : undefined"
			class="group/subitem relative flex w-full cursor-pointer appearance-none items-start bg-transparent p-0 font-sans whitespace-nowrap hover:no-underline focus-visible:outline-none"
			:class="{ 'border-y-0 border-s border-e-0 border-solid border-slate-200 ps-2': props.nested }"
		>
			<!-- The active bar is pulled back out past the dropdown's padding so
			     it meets the panel edge, which is why the offset changes with
			     depth. It's paired with the heavier label below, so the state
			     never rests on colour alone. -->
			<div
				v-if="props.active"
				class="absolute h-full w-1.5 rounded-r-lg bg-sky-500"
				:class="props.nested ? '-start-[33px]' : '-start-3'"
			></div>
			<!-- The ring is on the label rather than the row, which runs the full
			     width of the panel: the same ring an action's label and a Button
			     draw, on the box the hover fill is already on. -->
			<div
				class="flex gap-2 rounded-lg px-3 py-1.5 text-left text-xs text-slate-900 group-hover/subitem:bg-sky-100 group-focus-visible/subitem:outline-2 group-focus-visible/subitem:outline-offset-4 group-focus-visible/subitem:outline-blue-600"
				:class="{ 'font-semibold': props.active }"
			>
				<slot />
			</div>
		</component>
	</li>
</template>
