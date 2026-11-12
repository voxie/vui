<script setup lang="ts">
import { computed, inject, useId } from 'vue';
import { TabListKey, TabsKey } from './tabs.ts';

const props = withDefaults(
	defineProps<{
		// What Tabs' v-model becomes when this tab is picked.
		value: string;
		// A second line under the label, for what the label can't hold.
		description?: string;
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	},
);

const slots = defineSlots<{
	default?: () => unknown;
	description?: () => unknown;
}>();

const tabs = inject(TabsKey);
if (!tabs) throw new Error('Tab has to be inside a TabList, inside Tabs.');
const list = inject(TabListKey, null);

const selected = computed(() => tabs.current.value === props.value);
const disabled = computed(() => props.disabled || tabs.disabled.value);
const dark = computed(() => tabs.surface.value === 'dark');

// The label names the tab and the description describes it, so a screen
// reader hears them apart.
const hasDescription = computed(() => Boolean(props.description || slots.description));
const labelId = useId();
const descriptionId = useId();

// Padding and text from the labeled Switch at each size. Height comes from
// the track, until a description makes the tab two lines and `described` pads
// it the same on every side. Stacked, there's no track height to fill, so
// `stacked` holds the tab at the height it had in the row.
const sizeClasses = computed(() => {
	const size = tabs.size.value;
	if (size === 'sm') return { radius: 'rounded', text: 'text-xs', pad: 'px-3', described: 'p-1.5', stacked: 'min-h-7' };
	if (size === 'lg') return { radius: 'rounded-md', text: 'text-sm', pad: 'px-5', described: 'p-3', stacked: 'min-h-10' };
	return { radius: 'rounded', text: 'text-xs', pad: 'px-4', described: 'p-2', stacked: 'min-h-8' };
});

// The selected label sits on the white pill everywhere. The rest sit on the
// track, and go light only on dark.
const textClasses = computed(() => {
	if (disabled.value) {
		if (tabs.disabled.value && selected.value) return dark.value ? 'text-slate-300' : 'text-slate-400';
		return dark.value ? 'text-slate-500' : 'text-slate-400';
	}
	if (selected.value) return 'text-slate-800';
	return dark.value ? 'text-slate-300' : 'text-slate-600';
});

// The description keeps the unpicked label's color on the white pill, so the
// picked label still leads.
const descriptionClasses = computed(() => (selected.value && !disabled.value ? 'text-slate-600' : ''));

// Only an unpicked tab does anything, so only it hovers and presses.
const inert = computed(() => selected.value || disabled.value);

const hoverClasses = computed(() => {
	if (dark.value) return 'group-hover/tab:bg-slate-700';
	if (tabs.surface.value === 'sunken') return 'group-hover/tab:bg-slate-500/30';
	return 'group-hover/tab:bg-slate-400/40';
});

// Only while the sliding indicator hasn't measured this tab yet. The same
// white and shadow, so nothing flashes when the indicator takes over.
const ownBackground = computed(() => {
	if (!selected.value || list?.indicatorReady.value) return '';
	if (disabled.value) return dark.value ? 'bg-slate-500' : 'bg-slate-50';
	return 'bg-white shadow-md shadow-slate-800/30';
});

// One tab holds the tab stop and the arrow keys reach the rest. With nothing
// selected yet every tab is reachable.
const tabindex = computed(() => (selected.value || tabs.current.value === undefined ? 0 : -1));

const onClick = () => {
	if (!disabled.value) tabs.select(props.value);
};
</script>

<template>
	<button
		type="button"
		role="tab"
		:id="tabs.tabId(props.value)"
		:aria-controls="tabs.panelId(props.value)"
		:aria-selected="selected"
		:aria-labelledby="hasDescription ? labelId : undefined"
		:aria-describedby="hasDescription ? descriptionId : undefined"
		:disabled="disabled"
		:tabindex="tabindex"
		:data-value="props.value"
		:data-described="hasDescription ? '' : undefined"
		class="group/tab relative z-10 flex h-full flex-col font-semibold transition duration-200 outline-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2"
		:class="[sizeClasses.radius, sizeClasses.text, list?.stacked.value ? sizeClasses.stacked : '', hasDescription ? ['items-start justify-start gap-0.5 text-left', sizeClasses.described] : ['items-center justify-center', sizeClasses.pad], textClasses, ownBackground, disabled ? 'cursor-not-allowed' : selected ? 'cursor-default' : 'cursor-pointer']"
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
		<span :id="labelId" data-tab-label class="relative whitespace-nowrap" :class="hasDescription ? 'leading-tight' : ''">
			<slot />
		</span>
		<span
			v-if="hasDescription"
			:id="descriptionId"
			class="relative text-2xs leading-tight font-normal text-pretty transition duration-200"
			:class="descriptionClasses"
		>
			<slot name="description">{{ props.description }}</slot>
		</span>
	</button>
</template>
