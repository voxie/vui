<script setup lang="ts">
import { computed, inject } from 'vue';
import { TabsKey } from './tabs.ts';

const props = withDefaults(
	defineProps<{
		// What Tabs' v-model becomes when this tab is picked.
		value: string;
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	},
);

const tabs = inject(TabsKey, null);

const selected = computed(() => tabs?.current.value === props.value);
const disabled = computed(() => props.disabled || Boolean(tabs?.disabled.value));
const dark = computed(() => tabs?.surface.value === 'dark');

// Padding and text from the labeled Switch at each size. Height comes from
// the track.
const sizeClasses = computed(() => {
	const size = tabs?.size.value ?? 'md';
	if (size === 'sm') return 'rounded-md px-3 text-xs';
	if (size === 'lg') return 'rounded-lg px-5 text-sm';
	return 'rounded-lg px-4 text-xs';
});

// The selected label sits on the white pill everywhere. The rest sit on the
// track, and go light only on dark.
const textClasses = computed(() => {
	if (disabled.value) {
		if (tabs?.disabled.value && selected.value) return dark.value ? 'text-slate-300' : 'text-slate-400';
		return dark.value ? 'text-slate-500' : 'text-slate-400';
	}
	if (selected.value) return 'text-slate-800';
	return dark.value ? 'text-slate-300' : 'text-slate-600';
});

const hoverClasses = computed(() => {
	if (selected.value || disabled.value) return '';
	if (dark.value) return 'hover:bg-slate-700';
	if (tabs?.surface.value === 'sunken') return 'hover:bg-slate-500/30';
	return 'hover:bg-slate-400/40';
});

// Only while the sliding indicator hasn't measured this tab yet. The same
// white and shadow, so nothing flashes when the indicator takes over.
const ownBackground = computed(() => {
	if (!selected.value || tabs?.indicatorReady.value) return '';
	if (disabled.value) return dark.value ? 'bg-slate-500' : 'bg-slate-50';
	return 'bg-white shadow-md shadow-slate-800/30';
});

// One tab holds the tab stop and the arrow keys reach the rest. With nothing
// selected yet every tab is reachable.
const tabindex = computed(() => (selected.value || tabs?.current.value === undefined ? 0 : -1));

const onClick = () => {
	if (!disabled.value) tabs?.select(props.value);
};
</script>

<template>
	<button
		type="button"
		role="tab"
		:aria-selected="selected"
		:disabled="disabled"
		:tabindex="tabindex"
		:data-value="props.value"
		class="relative z-10 flex h-full items-center justify-center font-semibold whitespace-nowrap transition duration-200 outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
		:class="[
			sizeClasses,
			textClasses,
			hoverClasses,
			ownBackground,
			disabled ? 'cursor-not-allowed' : 'cursor-pointer motion-safe:active:scale-95 motion-safe:active:duration-100',
		]"
		@click="onClick"
	>
		<slot />
	</button>
</template>
