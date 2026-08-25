<script setup lang="ts">
import { computed } from 'vue';

type BadgeSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BadgeColor =
	// The five accents, which carry the meanings Color documents, plus slate.
	| 'sky'
	| 'teal'
	| 'amber'
	| 'rose'
	| 'violet'
	| 'slate'
	// The extended set, for telling badges apart rather than reading them.
	// Listed in the order the docs recommend reaching for them.
	| 'lime'
	| 'orange'
	| 'green'
	| 'blue'
	| 'fuchsia'
	| 'pink'
	| 'emerald';

const props = withDefaults(
	defineProps<{
		color?: BadgeColor;
		size?: BadgeSize;
	}>(),
	{
		color: 'sky',
		size: 'md',
	},
);

/*
  Badges run on a tint of their color rather than the 300 rung the accents use
  elsewhere: a 100 fill, a 900 label, a 300 border, and a 500 icon. Every color
  in the set follows it, with no exceptions. Badges repeat, a column of them
  down a table or a row of tags on a contact, so they have to sit quieter than
  a button, and the tint carries far better label contrast at the 10–12px
  they're usually set at.

  The cost is that a 100 fill barely separates from the page background, which
  is what the border is for. See the docs page for the numbers.
*/
const colorClasses: Record<BadgeColor, string> = {
	sky: 'bg-sky-100 text-sky-900 border-sky-300 [&_i]:text-sky-500 [&_svg]:text-sky-500',
	teal: 'bg-teal-100 text-teal-900 border-teal-300 [&_i]:text-teal-500 [&_svg]:text-teal-500',
	amber: 'bg-amber-100 text-amber-900 border-amber-300 [&_i]:text-amber-500 [&_svg]:text-amber-500',
	rose: 'bg-rose-100 text-rose-900 border-rose-300 [&_i]:text-rose-500 [&_svg]:text-rose-500',
	violet:
		'bg-violet-100 text-violet-900 border-violet-300 [&_i]:text-violet-500 [&_svg]:text-violet-500',
	slate: 'bg-slate-100 text-slate-900 border-slate-300 [&_i]:text-slate-500 [&_svg]:text-slate-500',
	lime: 'bg-lime-100 text-lime-900 border-lime-300 [&_i]:text-lime-500 [&_svg]:text-lime-500',
	orange:
		'bg-orange-100 text-orange-900 border-orange-300 [&_i]:text-orange-500 [&_svg]:text-orange-500',
	green: 'bg-green-100 text-green-900 border-green-300 [&_i]:text-green-500 [&_svg]:text-green-500',
	blue: 'bg-blue-100 text-blue-900 border-blue-300 [&_i]:text-blue-500 [&_svg]:text-blue-500',
	fuchsia:
		'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300 [&_i]:text-fuchsia-500 [&_svg]:text-fuchsia-500',
	pink: 'bg-pink-100 text-pink-900 border-pink-300 [&_i]:text-pink-500 [&_svg]:text-pink-500',
	emerald:
		'bg-emerald-100 text-emerald-900 border-emerald-300 [&_i]:text-emerald-500 [&_svg]:text-emerald-500',
};

// Icons hold their own size rather than inheriting the label, so they stay
// legible as the badge shrinks — level with the label at the two small sizes,
// then one step up the type scale from sm on.
const sizeClasses = computed(() => {
	if (props.size === '2xs') return 'h-4 gap-0.5 px-1.5 py-0.5 text-2xs [&_i]:text-2xs [&_svg]:text-2xs';
	if (props.size === 'xs') return 'h-5 gap-1.5 px-2 text-xs [&_i]:text-xs [&_svg]:text-xs';
	if (props.size === 'sm') return 'h-6 gap-1.5 px-3 text-xs [&_i]:text-sm [&_svg]:text-sm';
	if (props.size === 'lg') return 'h-8 gap-1.5 px-4 text-sm [&_i]:text-lg [&_svg]:text-lg';
	if (props.size === 'xl') return 'h-9 gap-1.5 px-5 text-base [&_i]:text-xl [&_svg]:text-xl';
	return 'h-7 gap-1.5 px-3 text-xs [&_i]:text-base [&_svg]:text-base';
});
</script>

<template>
	<!-- A span, so a badge is valid inside a paragraph or a table cell. -->
	<span
		class="inline-flex items-center rounded-full border border-solid font-sans font-medium whitespace-nowrap"
		:class="[colorClasses[props.color], sizeClasses]"
	>
		<slot />
	</span>
</template>
