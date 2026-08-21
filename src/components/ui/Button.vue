<script setup lang="ts">
import { computed, ref } from 'vue';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonSurface = 'default' | 'glass' | 'sunken' | 'dark' | 'background';
type ButtonColor = 'slate' | 'white' | 'sky' | 'teal' | 'amber' | 'rose' | 'violet' | 'transparent';

type ColorStyle = {
	fill: string;
	hover: string;
	// Outline drops the fill and fades it back in at a tenth on hover.
	outlineHover: string;
	border: string;
};

const props = withDefaults(
	defineProps<{
		href?: string;
		size?: ButtonSize;
		color?: ButtonColor;
		surface?: ButtonSurface;
		outline?: boolean;
		shadow?: boolean;
		disabled?: boolean;
		block?: boolean;
		loading?: boolean;
	}>(),
	{
		size: 'md',
		color: 'slate',
		surface: 'default',
		outline: false,
		shadow: false,
		disabled: false,
		block: false,
		loading: false,
	},
);

const element = computed(() => (props.href ? 'a' : 'button'));

const sizeClasses = computed(() => {
	if (props.size === 'xs') return { element: 'rounded-lg px-2 text-xs h-6', content: 'gap-1' };
	if (props.size === 'sm') return { element: 'rounded-lg px-3 text-xs h-8', content: 'gap-1.5' };
	if (props.size === 'lg') return { element: 'rounded-xl px-5 text-sm h-12', content: 'gap-2' };
	if (props.size === 'xl') return { element: 'rounded-2xl px-8 text-sm h-16', content: 'gap-2' };
	return { element: 'rounded-xl px-4 text-xs h-10', content: 'gap-2' };
});

// Slate steps about one level away from the surface it sits on, so it needs a
// value per surface. Every other color holds the same value everywhere.
const slateBySurface: Record<ButtonSurface, ColorStyle> = {
	default: {
		fill: 'bg-slate-100',
		hover: 'hover:bg-slate-200',
		outlineHover: 'hover:bg-slate-100/10',
		border: 'border-slate-100',
	},
	glass: {
		fill: 'bg-slate-200',
		hover: 'hover:bg-slate-300',
		outlineHover: 'hover:bg-slate-200/10',
		border: 'border-slate-200',
	},
	sunken: {
		fill: 'bg-slate-300',
		hover: 'hover:bg-slate-400',
		outlineHover: 'hover:bg-slate-300/10',
		border: 'border-slate-300',
	},
	dark: {
		fill: 'bg-slate-600',
		hover: 'hover:bg-slate-500',
		outlineHover: 'hover:bg-slate-600/10',
		border: 'border-slate-600',
	},
	background: {
		fill: 'bg-slate-300',
		hover: 'hover:bg-slate-400',
		outlineHover: 'hover:bg-slate-300/10',
		border: 'border-slate-300',
	},
};

// Transparent has no resting fill, then hovers into the surface's slate value.
const transparentBySurface: Record<ButtonSurface, ColorStyle> = {
	default: {
		fill: 'bg-transparent',
		hover: 'hover:bg-slate-100',
		outlineHover: 'hover:bg-slate-100/10',
		border: 'border-transparent',
	},
	glass: {
		fill: 'bg-transparent',
		hover: 'hover:bg-slate-200',
		outlineHover: 'hover:bg-slate-200/10',
		border: 'border-transparent',
	},
	sunken: {
		fill: 'bg-transparent',
		hover: 'hover:bg-slate-300',
		outlineHover: 'hover:bg-slate-300/10',
		border: 'border-transparent',
	},
	dark: {
		fill: 'bg-transparent',
		hover: 'hover:bg-slate-600',
		outlineHover: 'hover:bg-slate-600/10',
		border: 'border-transparent',
	},
	background: {
		fill: 'bg-transparent',
		hover: 'hover:bg-slate-300',
		outlineHover: 'hover:bg-slate-300/10',
		border: 'border-transparent',
	},
};

const fixedColors: Record<string, ColorStyle> = {
	white: {
		fill: 'bg-white',
		hover: 'hover:bg-slate-50',
		outlineHover: 'hover:bg-white/10',
		border: 'border-white',
	},
	sky: {
		fill: 'bg-sky-300',
		hover: 'hover:bg-sky-400',
		outlineHover: 'hover:bg-sky-300/10',
		border: 'border-sky-300',
	},
	teal: {
		fill: 'bg-teal-300',
		hover: 'hover:bg-teal-400',
		outlineHover: 'hover:bg-teal-300/10',
		border: 'border-teal-300',
	},
	amber: {
		fill: 'bg-amber-300',
		hover: 'hover:bg-amber-400',
		outlineHover: 'hover:bg-amber-300/10',
		border: 'border-amber-300',
	},
	rose: {
		fill: 'bg-rose-300',
		hover: 'hover:bg-rose-400',
		outlineHover: 'hover:bg-rose-300/10',
		border: 'border-rose-300',
	},
	violet: {
		fill: 'bg-violet-300',
		hover: 'hover:bg-violet-400',
		outlineHover: 'hover:bg-violet-300/10',
		border: 'border-violet-300',
	},
};

const colorStyle = computed<ColorStyle>(() => {
	if (props.color === 'transparent') return transparentBySurface[props.surface];
	if (props.color === 'slate') return slateBySurface[props.surface];
	return fixedColors[props.color];
});

const colorClasses = computed(() => {
	const style = colorStyle.value;
	const fill = props.outline ? ['bg-transparent', style.outlineHover] : [style.fill, style.hover];
	return [...fill, style.border];
});

// Labels are black on every fill. The exception is a label on the dark
// surface, whether that's the slate-600 fill or an unfilled button sitting
// straight on the panel.
const textClasses = computed(() => {
	const unfilled = props.outline || props.color === 'transparent';
	const onDark = unfilled ? props.surface === 'dark' : props.color === 'slate' && props.surface === 'dark';
	return onDark ? 'text-white' : 'text-black';
});

const buttonRef = ref();

defineExpose({
	focus: () => buttonRef.value?.focus?.(),
});
</script>

<template>
	<component
		ref="buttonRef"
		:is="element"
		:href="props.href"
		:type="props.href ? undefined : 'button'"
		:disabled="props.href ? undefined : props.disabled"
		class="relative cursor-pointer items-center justify-center border border-solid text-center font-sans font-semibold whitespace-nowrap transition duration-100 will-change-transform outline-blue-600 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-95 active:outline-hidden disabled:pointer-events-none disabled:opacity-50"
		:class="[
			colorClasses,
			textClasses,
			sizeClasses.element,
			props.block ? 'flex w-full' : 'inline-flex',
			{
				'shadow hover:shadow-md': props.shadow,
				'pointer-events-none opacity-50': props.disabled && props.href,
			},
		]"
	>
		<div
			class="flex items-center justify-center transition"
			:class="[
				sizeClasses.content,
				props.loading
					? 'opacity-0 ease-in motion-safe:scale-0'
					: 'duration-700 ease-[cubic-bezier(0,1.3,.3,1)]',
			]"
		>
			<slot />
		</div>

		<div
			class="absolute left-1/2 inline-flex -translate-x-1/2 text-sm transition"
			:class="
				props.loading
					? 'delay-150 duration-500 ease-[cubic-bezier(0,2,.3,1)]'
					: 'opacity-0 motion-safe:scale-0'
			"
		>
			<i class="fa-solid fa-spinner-third fa-spin [--fa-animation-duration:0.7s]" aria-hidden="true"></i>
		</div>
	</component>
</template>
