<script setup lang="ts">
import { computed } from 'vue';
import { useSurface, type Surface } from './surface.ts';

type SwitchSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
	defineProps<{
		size?: SwitchSize;
		// Text inside the track for each state. Either one turns the pill into
		// the labeled form. The `on` and `off` slots take the same place.
		on?: string;
		off?: string;
		// What the switch is sitting on. Left off, it's taken from the nearest
		// Card or Navbar. Pass it on the page background, which has no component
		// to announce it.
		sitsOn?: Surface;
		loading?: boolean;
		disabled?: boolean;
	}>(),
	{
		size: 'md',
		loading: false,
		disabled: false,
	},
);

const slots = defineSlots<{
	on?: () => unknown;
	off?: () => unknown;
}>();

const model = defineModel<boolean>({ default: false });

const surface = useSurface(() => props.sitsOn);

const labeled = computed(() => Boolean(props.on || props.off || slots.on || slots.off));

const toggle = () => {
	if (props.disabled || props.loading) return;
	model.value = !model.value;
};

// The pill is the height of a Checkbox marker at each size. The labeled form
// is the height of a Button, so the two sit level in a toolbar. The bottom
// border takes 1px out of the box, so bottom padding gives it up to keep the
// thumb centered.
const sizeClasses = computed(() => {
	if (labeled.value) {
		if (props.size === 'sm') return { track: 'h-8 rounded-lg px-0.5 pt-0.5 pb-px', thumb: 'rounded-md', label: 'px-3 text-xs' };
		if (props.size === 'lg') return { track: 'h-12 rounded-xl px-1 pt-1 pb-0.75', thumb: 'rounded-lg', label: 'px-5 text-sm' };
		return { track: 'h-10 rounded-xl px-1 pt-1 pb-0.75', thumb: 'rounded-lg', label: 'px-4 text-xs' };
	}
	if (props.size === 'sm') return { track: 'h-4 w-7 rounded-full px-0.5 pt-0.5 pb-px', thumb: 'rounded-full', label: '' };
	if (props.size === 'lg') return { track: 'h-6 w-11 rounded-full px-0.5 pt-0.5 pb-px', thumb: 'rounded-full', label: '' };
	return { track: 'h-5 w-9 rounded-full px-0.5 pt-0.5 pb-px', thumb: 'rounded-full', label: '' };
});

const dark = computed(() => surface.value === 'dark');

// The track is the whole boundary, so off steps away from the surface: a step
// darker on sunken, and down rather than up on dark. On is sky-400 everywhere.
const trackClasses = computed(() => {
	if (props.disabled) return dark.value ? 'bg-slate-800/50' : 'bg-slate-200';
	if (model.value) return 'bg-sky-400 hover:bg-sky-500/80';
	if (dark.value) return 'bg-slate-800 hover:bg-slate-900';
	if (surface.value === 'sunken') return 'bg-slate-400/80 hover:bg-slate-400';
	if (surface.value === 'default') return 'bg-slate-200 hover:bg-slate-300';
	return 'bg-slate-300 hover:bg-slate-400/60';
});

// A light bottom border, one opacity per surface. bg-clip-padding keeps the
// fill out from under it, so it blends with the surface rather than the track.
const edgeBorder: Record<Surface, string> = {
	default: 'border-white',
	glass: 'border-white',
	sunken: 'border-white/30',
	dark: 'border-white/10',
	background: 'border-white/40',
};

// The border plus an inset shadow, so the track reads as pressed into the
// surface. Disabled keeps only the border.
const trackEdge = computed(() => {
	const border = `border-b bg-clip-padding ${edgeBorder[surface.value]}`;
	return props.disabled ? border : `${border} inset-shadow-sm inset-shadow-black/10`;
});

const thumbClasses = computed(() => {
	if (props.disabled) return dark.value ? 'bg-slate-500 shadow-none' : 'bg-slate-50 shadow-none';
	return model.value ? 'bg-white shadow-md shadow-sky-600/40' : 'bg-white shadow-md shadow-slate-800/30';
});

// The active label sits on the white thumb everywhere. The inactive one sits
// on the track, and goes white only when that track is the slate-800 off
// track on dark. On, the track is sky-400 on every surface.
const labelClasses = (active: boolean) => {
	if (props.disabled) return dark.value ? 'text-slate-300' : 'text-slate-400';
	if (active) return 'text-slate-800';
	return dark.value && !model.value ? 'text-white opacity-40' : 'text-slate-800 opacity-40';
};
</script>

<template>
	<button
		type="button"
		role="switch"
		:aria-checked="model"
		:aria-busy="props.loading || undefined"
		:disabled="props.disabled"
		class="group/switch relative inline-block shrink-0 font-sans transition outline-blue-600 select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
		:class="[
			sizeClasses.track,
			trackClasses,
			trackEdge,
			props.loading ? 'animate-pulse cursor-progress' : props.disabled ? '' : 'cursor-pointer',
		]"
		@click="toggle"
	>
		<div class="relative grid h-full grid-cols-2 place-items-stretch" :class="labeled ? '' : 'w-full'">
			<!-- The thumb is half the track, so the label columns have to be equal.
			     grid-cols-2 gives them the width of the longer label. -->
			<div
				aria-hidden="true"
				class="absolute top-0 left-0 z-0 h-full w-1/2 transition duration-200 ease-out"
				:class="{ 'translate-x-full': model }"
			>
				<div
					class="h-full w-full transition duration-300"
					:class="[
						sizeClasses.thumb,
						thumbClasses,
						model ? 'origin-right' : 'origin-left',
						props.disabled || props.loading ? '' : 'motion-safe:group-hover/switch:scale-x-105 motion-safe:group-active/switch:scale-x-110',
					]"
				/>
			</div>

			<template v-if="labeled">
				<span
					v-for="side in ['off', 'on'] as const"
					:key="side"
					aria-hidden="true"
					class="relative z-10 flex items-center justify-center font-semibold whitespace-nowrap transition duration-300"
					:class="[sizeClasses.label, labelClasses((side === 'on') === model)]"
				>
					<slot :name="side">{{ props[side] }}</slot>
				</span>
			</template>
		</div>
	</button>
</template>
