<script setup lang="ts">
import { computed } from 'vue';
import Popover from './Popover.vue';

type Tone = 'shared' | 'local' | 'preferred';
type Context = 'entry' | 'preferred' | 'corporate';

const props = defineProps<{
	// 'contact→first_name', 'group→custom_attributes→booking_link'. The first
	// segment is the level, which the icon replaces.
	path?: string;
	// Draws a context's mark and name in place of a path.
	context?: Context;
	// A local attribute read from the contact's preferred group.
	preferred?: boolean;
	// Punctuation touching the token, kept in its block so a line never starts or ends on it.
	before?: string;
	after?: string;
	// The mark after the path: `next` when another value follows, `exit` when the flow exits.
	fallback?: 'next' | 'exit';
	// What a click shows in a Popover. Ignored when `press` is set.
	description?: string;
	// A button that emits `press` and opens nothing.
	press?: boolean;
	// Inside an editor's selection.
	selected?: boolean;
}>();
defineEmits<{ press: [] }>();

const TONES: Record<Tone, { chip: string; press: string; open: string; icon: string }> = {
	shared: { chip: 'bg-slate-100 text-slate-900 ring-slate-300', press: 'hover:bg-slate-200 active:bg-slate-300', open: 'bg-slate-200', icon: 'text-slate-500' },
	local: { chip: 'bg-amber-100 text-amber-900 ring-amber-300', press: 'hover:bg-amber-200 active:bg-amber-300', open: 'bg-amber-200', icon: 'text-amber-500' },
	preferred: { chip: 'bg-violet-100 text-violet-900 ring-violet-300', press: 'hover:bg-violet-200 active:bg-violet-300', open: 'bg-violet-200', icon: 'text-violet-500' },
};
const LEVELS: Record<string, { icon: string; tone: Tone }> = {
	contact: { icon: 'fa-globe', tone: 'shared' },
	team: { icon: 'fa-screen-users', tone: 'shared' },
	group: { icon: 'fa-grid-2-plus', tone: 'shared' },
	local: { icon: 'fa-location-dot', tone: 'local' },
};
const CONTEXTS: Record<Context, { icon: string; tone: Tone; label: string }> = {
	entry: { icon: 'fa-location-dot', tone: 'local', label: 'Entry Context' },
	preferred: { icon: 'fa-star', tone: 'preferred', label: 'Preferred' },
	corporate: { icon: 'fa-crown', tone: 'local', label: 'Corporate' },
};

const parts = computed(() => (props.path ?? '').split('→'));
const kind = computed(() => {
	if (props.context) return CONTEXTS[props.context];
	const level = LEVELS[parts.value[0]] ?? LEVELS.contact;
	return level.tone === 'local' && props.preferred ? { icon: 'fa-star', tone: 'preferred' as const } : level;
});
const tone = computed(() => TONES[kind.value.tone]);
const segments = computed(() => (props.context ? [CONTEXTS[props.context].label] : parts.value.slice(1)));
const mark = computed(() => (props.fallback === 'exit' ? 'fa-arrow-right-from-bracket' : props.fallback === 'next' ? 'fa-arrow-down-from-line' : null));
const markLabel = computed(() => (props.fallback === 'exit' ? 'exits the flow when empty' : 'has a fallback'));
const pressable = computed(() => props.press || Boolean(props.description));

// A wrapping flex row, so a token wider than its line wraps inside one box. gap-x is the quarter gap after a colon.
// The row gap is leading-tight less the cap height, so trimmed rows sit a normal line apart. Uneven padding is the fallback for no text-box.
const CHIP = 'inline-flex flex-wrap items-baseline gap-x-[1.5px] [baseline-source:last] max-w-full rounded-[4px] px-1.5 pt-[0.14em] pb-0 supports-[text-box:trim-both_cap_alphabetic]:py-[0.4em] supports-[text-box:trim-both_cap_alphabetic]:gap-y-[0.55em] text-left font-token font-[400] tracking-[-0.2px] [font-variation-settings:"MONO"_var(--token-mono,0.51)] text-[.85em] leading-tight break-words shadow-sm ring-1 shadow-slate-500/10';
// A flex container takes no text-box, so each piece trims its own line to cap height and baseline and the padding centers the capitals.
const PIECE = 'supports-[text-box:trim-both_cap_alphabetic]:[text-box:trim-both_cap_alphabetic]';
// Important because the kit's unlayered CSS sets height and vertical-align.
const ICON = 'fa-width-auto [--size:.85em] h-[var(--size)]! align-[calc((1cap_-_var(--size))/2)]!';
// Binds the icon and the mark to their segment, one gap from its label.
const SEGMENT = 'flex min-w-0 items-baseline gap-x-1';
const PRESS = 'cursor-pointer transition-colors outline-blue-600 outline-offset-2 focus-visible:outline-2';
</script>

<template>
	<!-- Popover wraps its trigger in two divs. Both go to display: contents so the chip stays in the line. -->
	<span class="inline-block max-w-full">{{ before }}<Popover :content="description" :disabled="press || !description" class="contents! [&>div]:contents!">
		<template #default="{ triggerProps, open }">
			<component
				:is="pressable ? 'button' : 'span'"
				:type="pressable ? 'button' : undefined"
				v-bind="press ? {} : pressable ? triggerProps : {}"
				:class="[CHIP, after ? 'mr-0.5' : '', tone.chip, pressable ? [PRESS, tone.press] : '', press ? 'focus:outline-2' : '', selected ? 'outline-2' : '', open ? tone.open : '']"
				@click="press && $emit('press')"
			>
				<template v-for="(segment, i) in segments" :key="i">
					<span :class="SEGMENT">
						<!-- The kit swaps each <i> for an <svg>, so the icon is keyed to be replaced whole when it changes. -->
						<span v-if="i === 0" :key="`${kind.icon} ${tone.icon}`" :class="PIECE"><i class="fa-solid" :class="[ICON, kind.icon, tone.icon]" aria-hidden="true"></i></span>
						<span class="min-w-0" :class="PIECE">{{ segment }}<template v-if="i < segments.length - 1">:</template></span>
						<span v-if="mark && i === segments.length - 1" :key="mark" :class="PIECE"><i class="fa-solid" :class="[ICON, mark, tone.icon]" role="img" :aria-label="markLabel"></i></span>
					</span>
				</template>
			</component>
		</template>
	</Popover>{{ after }}</span>
</template>
