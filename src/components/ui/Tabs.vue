<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import { useSurface, type Surface } from './surface.ts';
import { TabsKey, type TabsSize } from './tabs.ts';

const props = withDefaults(
	defineProps<{
		size?: TabsSize;
		// What the tabs are sitting on. Left off, it's taken from the nearest Card
		// or Navbar. Pass it on the page background, which has no component to
		// announce it.
		sitsOn?: Surface;
		disabled?: boolean;
	}>(),
	{
		size: 'md',
		disabled: false,
	},
);

// The `value` of the selected Tab.
const model = defineModel<string>();

const surface = useSurface(() => props.sitsOn);

const select = (value: string) => {
	if (props.disabled) return;
	model.value = value;
};

// One id per Tabs, from Vue so it matches between server and client. A value
// can be any string, so it's made safe for an id.
const id = useId();
const slug = (value: string) => value.replace(/[^\w-]+/g, '-');

provide(TabsKey, {
	current: model,
	size: computed(() => props.size),
	disabled: computed(() => props.disabled),
	surface,
	select,
	tabId: (value) => `${id}-tab-${slug(value)}`,
	panelId: (value) => `${id}-panel-${slug(value)}`,
});
</script>

<template>
	<div>
		<slot />
	</div>
</template>
