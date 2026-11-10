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

// A 100 fill, a 900 label, a 300 ring, and the icon and arrows at 400. The fill
// steps one rung on hover and one more when pressed.
const TONES: Record<Tone, { chip: string; press: string; open: string; mark: string }> = {
	shared: { chip: 'bg-slate-100 text-slate-900 ring-slate-300', press: 'hover:bg-slate-200 active:bg-slate-300', open: 'bg-slate-200', mark: 'text-slate-400' },
	local: { chip: 'bg-amber-100 text-amber-900 ring-amber-300', press: 'hover:bg-amber-200 active:bg-amber-300', open: 'bg-amber-200', mark: 'text-amber-400' },
	preferred: { chip: 'bg-violet-100 text-violet-900 ring-violet-300', press: 'hover:bg-violet-200 active:bg-violet-300', open: 'bg-violet-200', mark: 'text-violet-400' },
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
const mark = computed(() => (props.fallback === 'exit' ? 'fa-arrow-right-from-bracket' : props.fallback === 'next' ? 'fa-arrow-turn-down-right' : null));
const markLabel = computed(() => (props.fallback === 'exit' ? 'exits the flow when empty' : 'has a fallback'));
const pressable = computed(() => props.press || Boolean(props.description));

// An inline block, so a token wider than its line wraps inside one box.
const CHIP = 'inline-block max-w-full rounded-sm px-2 text-left font-token font-[350] [font-variation-settings:"MONO"_var(--token-mono,0.51)] text-[.875em] leading-snug break-words shadow-sm ring-1 shadow-slate-500/10';
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
					<template v-if="i > 0"><wbr /><span class="mx-1.5" :class="tone.mark">→</span><wbr /></template>
					<!-- nowrap binds the icon and the mark to their segment. The segment itself can still break. -->
					<span class="whitespace-nowrap">
						<!-- The kit swaps each <i> for an <svg>, so the icon is keyed to be replaced whole when it changes. -->
						<span v-if="i === 0" :key="`${kind.icon} ${tone.mark}`" class="mr-[5px]"><i class="fa-solid fa-width-auto text-[.875em]" :class="[kind.icon, tone.mark]" aria-hidden="true"></i></span>
						<span class="whitespace-normal">{{ segment }}</span>
						<span v-if="mark && i === segments.length - 1" :key="mark" class="ml-[7px]"><i class="fa-solid fa-width-auto text-[.75em]" :class="[mark, tone.mark]" role="img" :aria-label="markLabel"></i></span>
					</span>
				</template>
			</component>
		</template>
	</Popover>{{ after }}</span>
</template>
