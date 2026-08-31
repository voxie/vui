<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSurface, type Surface } from './surface.ts';
import Spinner from './Spinner.vue';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
		// What the button sits on. Left off, it's taken from the nearest Card or
		// Navbar. Pass it where nothing can answer: the page background, or a plain
		// element with a background class.
		sitsOn?: Surface;
		outline?: boolean;
		shadow?: boolean;
		disabled?: boolean;
		block?: boolean;
		loading?: boolean;
	}>(),
	{
		size: 'md',
		color: 'slate',
		outline: false,
		shadow: false,
		disabled: false,
		block: false,
		loading: false,
	},
);

const element = computed(() => (props.href ? 'a' : 'button'));

const surface = useSurface(() => props.sitsOn);

const sizeClasses = computed(() => {
	if (props.size === 'xs') return { radius: 'rounded-lg', element: 'px-2 text-xs h-6', content: 'gap-1' };
	if (props.size === 'sm') return { radius: 'rounded-lg', element: 'px-3 text-xs h-8', content: 'gap-1.5' };
	if (props.size === 'lg') return { radius: 'rounded-xl', element: 'px-5 text-sm h-12', content: 'gap-2' };
	if (props.size === 'xl') return { radius: 'rounded-2xl', element: 'px-8 text-sm h-16', content: 'gap-2' };
	return { radius: 'rounded-xl', element: 'px-4 text-xs h-10', content: 'gap-2' };
});

// Hover lives on the fill layer, which is pointer-transparent, so every hover
// class is driven off the button's own hover state through the named group.

// Slate steps about one level away from the surface it sits on, so it needs a
// value per surface. Every other color holds the same value everywhere.
const slateBySurface: Record<Surface, ColorStyle> = {
	default: {
		fill: 'bg-slate-100',
		hover: 'group-hover/button:bg-slate-200',
		outlineHover: 'group-hover/button:bg-slate-100/10',
		border: 'border-slate-100',
	},
	glass: {
		fill: 'bg-slate-200',
		hover: 'group-hover/button:bg-slate-300',
		outlineHover: 'group-hover/button:bg-slate-200/10',
		border: 'border-slate-200',
	},
	sunken: {
		fill: 'bg-slate-300',
		hover: 'group-hover/button:bg-slate-400',
		outlineHover: 'group-hover/button:bg-slate-300/10',
		border: 'border-slate-300',
	},
	dark: {
		fill: 'bg-slate-600',
		hover: 'group-hover/button:bg-slate-500',
		outlineHover: 'group-hover/button:bg-slate-600/10',
		border: 'border-slate-600',
	},
	background: {
		fill: 'bg-slate-300',
		hover: 'group-hover/button:bg-slate-400',
		outlineHover: 'group-hover/button:bg-slate-300/10',
		border: 'border-slate-300',
	},
};

// Transparent has no resting fill, then hovers into the surface's slate value.
const transparentBySurface: Record<Surface, ColorStyle> = {
	default: {
		fill: 'bg-transparent',
		hover: 'group-hover/button:bg-slate-100',
		outlineHover: 'group-hover/button:bg-slate-100/10',
		border: 'border-transparent',
	},
	glass: {
		fill: 'bg-transparent',
		hover: 'group-hover/button:bg-slate-200',
		outlineHover: 'group-hover/button:bg-slate-200/10',
		border: 'border-transparent',
	},
	sunken: {
		fill: 'bg-transparent',
		hover: 'group-hover/button:bg-slate-300',
		outlineHover: 'group-hover/button:bg-slate-300/10',
		border: 'border-transparent',
	},
	dark: {
		fill: 'bg-transparent',
		hover: 'group-hover/button:bg-slate-600',
		outlineHover: 'group-hover/button:bg-slate-600/10',
		border: 'border-transparent',
	},
	background: {
		fill: 'bg-transparent',
		hover: 'group-hover/button:bg-slate-300',
		outlineHover: 'group-hover/button:bg-slate-300/10',
		border: 'border-transparent',
	},
};

const fixedColors: Record<string, ColorStyle> = {
	white: {
		fill: 'bg-white',
		hover: 'group-hover/button:bg-slate-50',
		outlineHover: 'group-hover/button:bg-white/10',
		border: 'border-white',
	},
	sky: {
		fill: 'bg-sky-300',
		hover: 'group-hover/button:bg-sky-400',
		outlineHover: 'group-hover/button:bg-sky-300/10',
		border: 'border-sky-300',
	},
	teal: {
		fill: 'bg-teal-300',
		hover: 'group-hover/button:bg-teal-400',
		outlineHover: 'group-hover/button:bg-teal-300/10',
		border: 'border-teal-300',
	},
	amber: {
		fill: 'bg-amber-300',
		hover: 'group-hover/button:bg-amber-400',
		outlineHover: 'group-hover/button:bg-amber-300/10',
		border: 'border-amber-300',
	},
	rose: {
		fill: 'bg-rose-300',
		hover: 'group-hover/button:bg-rose-400',
		outlineHover: 'group-hover/button:bg-rose-300/10',
		border: 'border-rose-300',
	},
	violet: {
		fill: 'bg-violet-300',
		hover: 'group-hover/button:bg-violet-400',
		outlineHover: 'group-hover/button:bg-violet-300/10',
		border: 'border-violet-300',
	},
};

const colorStyle = computed<ColorStyle>(() => {
	if (props.color === 'transparent') return transparentBySurface[surface.value];
	if (props.color === 'slate') return slateBySurface[surface.value];
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
	const onDark = unfilled ? surface.value === 'dark' : props.color === 'slate' && surface.value === 'dark';
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
		:aria-busy="props.loading || undefined"
		class="group/button relative cursor-pointer items-center justify-center bg-transparent text-center font-sans font-semibold whitespace-nowrap outline-blue-600 select-none hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 active:outline-hidden disabled:pointer-events-none disabled:opacity-50"
		:class="[
			textClasses,
			sizeClasses.radius,
			sizeClasses.element,
			props.block ? 'flex w-full' : 'inline-flex',
			{ 'pointer-events-none opacity-50': props.disabled && props.href },
		]"
	>
		<!-- Fill, border and shadow live here so the press can be a fixed 2px
		     inset rather than a scale, which every size shrinks by equally. -->
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 border border-solid transition-all ease-out group-active/button:duration-75 motion-safe:group-active/button:inset-0.5  motion-reduce:group-active/button:opacity-70  "
			:class="[
				colorClasses,
				sizeClasses.radius,
				{ 'shadow group-hover/button:shadow-md': props.shadow },
			]"
		></span>

		<div
			class="relative flex items-center justify-center transition"
			:class="[
				sizeClasses.content,
				props.loading
					? 'opacity-0 motion-safe:scale-90'
					: 'motion-safe:group-active/button:scale-[0.96] group-active/button:duration-75 will-change-transform ease-out',
			]"
		>
			<slot />
		</div>

		<div
			class="absolute left-1/2 flex -translate-x-1/2 transition"
			:class="
				props.loading
					? ''
					: 'opacity-0 motion-safe:scale-0'
			"
		>
			<Spinner />
		</div>
	</component>
</template>
