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
	if (size === 'sm') return { radius: 'rounded-md', label: 'px-3 text-xs' };
	if (size === 'lg') return { radius: 'rounded-lg', label: 'px-5 text-sm' };
	return { radius: 'rounded-lg', label: 'px-4 text-xs' };
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

// Only an unpicked tab does anything, so only it hovers and presses.
const inert = computed(() => selected.value || disabled.value);

const hoverClasses = computed(() => {
	if (dark.value) return 'group-hover/tab:bg-slate-700';
	if (tabs?.surface.value === 'sunken') return 'group-hover/tab:bg-slate-500/30';
	return 'group-hover/tab:bg-slate-400/40';
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
		class="group/tab relative z-10 flex h-full items-center justify-center font-semibold whitespace-nowrap transition duration-200 outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
		:class="[sizeClasses.radius, sizeClasses.label, textClasses, ownBackground, disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
		@click="onClick"
	>
		<!-- The hover fill is a box of its own so the press can be a fixed 2px
		     inset like Button's rather than a scale, which a wide tab would
		     exaggerate. -->
		<span
			v-if="!inert"
			aria-hidden="true"
			class="absolute inset-0 -z-10 transition-all ease-out group-active/tab:duration-75 motion-safe:group-active/tab:inset-0.5 motion-reduce:group-active/tab:opacity-70"
			:class="[sizeClasses.radius, hoverClasses]"
		></span>
		<!-- The label and not the tab, which is as wide as the track allows. -->
		<span
			class="relative transition ease-out"
			:class="inert ? '' : 'group-active/tab:duration-75 motion-safe:group-active/tab:scale-[0.96]'"
		>
			<slot />
		</span>
	</button>
</template>
