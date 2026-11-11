<script lang="ts">
// A box whose contents wrap keeps the full line width, so a wrapped chip is set to its widest row.
// Shared by every token: one observer, and each pass batches its writes and reads into a single layout.
type Token = () => HTMLElement | null;
const lines = new Map<Element, { width?: number; tokens: Set<Token> }>();
// Each wrapper's last size, since a chip's contents can grow on their own when an icon or a font arrives.
const wrappers = new Map<Element, { size?: string; token: Token }>();
const pending = new Set<Token>();
let observer: ResizeObserver | undefined;

function hug(tokens: Iterable<Token>) {
	if (!pending.size) queueMicrotask(flush);
	for (const token of tokens) pending.add(token);
}

function flush() {
	const chips = [...pending].map((token) => token()).filter((chip): chip is HTMLElement => !!chip?.isConnected);
	pending.clear();
	for (const chip of chips) chip.style.width = '';
	const sizes = chips.map(measure);
	chips.forEach((chip, i) => {
		chip.style.width = sizes[i].width;
		chip.style.setProperty('--token-height', sizes[i].height);
		chip.toggleAttribute('data-wrapped', !!sizes[i].height);
	});
}

// A wrapped chip reports its height so the raise can center it. Rows aren't counted, since a segment can wrap inside itself.
function measure(chip: HTMLElement) {
	const box = chip.getBoundingClientRect();
	const style = getComputedStyle(chip);
	// Rects are scaled by a transform, such as a canvas zoom, and CSS sizes aren't.
	const scale = box.width / parseFloat(style.width) || 1;
	const height = box.height / scale;
	// One row is about 1.45em tall and two are about 2.45em.
	if (height < 2 * parseFloat(style.fontSize)) return { width: '', height: '' };
	const rows = [...chip.children] as HTMLElement[];
	if (rows.length < 2 || rows[0].offsetTop === rows[rows.length - 1].offsetTop) return { width: '', height: `${height}px` };
	const right = Math.max(...rows.map((row) => row.getBoundingClientRect().right));
	return { width: `${Math.ceil((right - box.left) / scale + parseFloat(style.paddingRight))}px`, height: `${height}px` };
}

function watchLine(wrapper: HTMLElement, token: Token) {
	// The chip wraps against the nearest block, and an observer sees no size on an inline box.
	let line = wrapper.parentElement!;
	while (line.parentElement && ['inline', 'contents'].includes(getComputedStyle(line).display)) line = line.parentElement;
	if (!observer) {
		// Hugging in the observer's own pass changes the line's height, which logs a ResizeObserver loop error, so it waits a frame.
		observer = new ResizeObserver((entries) => {
			const tokens: Token[] = [];
			for (const entry of entries) {
				// The first report hugs too, since an icon or a font can land between mount and the first frame. It settles when a hug measures the same.
				const own = wrappers.get(entry.target);
				if (own) {
					const size = `${entry.contentRect.width} ${entry.contentRect.height}`;
					if (own.size !== size) tokens.push(own.token);
					own.size = size;
				}
				const watched = lines.get(entry.target);
				if (!watched) continue;
				// Only a width change can rewrap a chip. The first report records the width.
				if (watched.width !== undefined && watched.width !== entry.contentRect.width) tokens.push(...watched.tokens);
				watched.width = entry.contentRect.width;
			}
			if (tokens.length) requestAnimationFrame(() => hug(tokens));
		});
		// A late font changes every chip's measure.
		document.fonts?.addEventListener('loadingdone', () => hug([...lines.values()].flatMap((watched) => [...watched.tokens])));
	}
	const watched = lines.get(line) ?? { tokens: new Set<Token>() };
	if (!lines.has(line)) {
		lines.set(line, watched);
		observer.observe(line);
	}
	watched.tokens.add(token);
	wrappers.set(wrapper, { token });
	observer.observe(wrapper);
	return line;
}

function unwatchLine(wrapper: Element, line: Element, token: Token) {
	wrappers.delete(wrapper);
	observer?.unobserve(wrapper);
	const watched = lines.get(line);
	watched?.tokens.delete(token);
	if (watched && !watched.tokens.size) {
		lines.delete(line);
		observer?.unobserve(line);
	}
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
import Popover from './Popover.vue';

type Tone = 'shared' | 'local' | 'preferred';
type Context = 'entry' | 'preferred' | 'corporate';

const props = defineProps<{
	// The builder's variable without its braces: 'contact=>first_name', 'contact=>local=>email'.
	// The icon replaces the level, which is the first segment or 'contact=>local'.
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
};
const LOCAL = { icon: 'fa-location-dot', tone: 'local' as const };
const CONTEXTS: Record<Context, { icon: string; tone: Tone; label: string }> = {
	entry: { icon: 'fa-location-dot', tone: 'local', label: 'Entry Context' },
	preferred: { icon: 'fa-star', tone: 'preferred', label: 'Preferred' },
	corporate: { icon: 'fa-crown', tone: 'local', label: 'Corporate' },
};

const parts = computed(() => (props.path ?? '').split('=>').map((part) => part.trim()));
const local = computed(() => parts.value[0] === 'contact' && parts.value[1] === 'local');
const kind = computed(() => {
	if (props.context) return CONTEXTS[props.context];
	if (local.value) return props.preferred ? { icon: 'fa-star', tone: 'preferred' as const } : LOCAL;
	return LEVELS[parts.value[0]] ?? LEVELS.contact;
});
const tone = computed(() => TONES[kind.value.tone]);
const segments = computed(() => (props.context ? [CONTEXTS[props.context].label] : parts.value.slice(local.value ? 2 : 1)));
const mark = computed(() => (props.fallback === 'exit' ? 'fa-right-from-bracket' : props.fallback === 'next' ? 'fa-square-arrow-right' : null));
const markLabel = computed(() => (props.fallback === 'exit' ? 'exits the flow when empty' : 'has a fallback'));
const pressable = computed(() => props.press || Boolean(props.description));

// A wrapping flex row, so a token wider than its line wraps inside one box. gap-x is the quarter gap after a colon.
// The row gap spaces trimmed rows, which take no leading. Uneven padding is the fallback for no text-box.
const CHIP = 'inline-flex flex-wrap items-baseline gap-x-[1.5px] [baseline-source:last]! max-w-full rounded-[2px] px-1.25 pt-[0.14em] pb-0 supports-[text-box:trim-both_cap_alphabetic]:pt-[0.35em] supports-[text-box:trim-both_cap_alphabetic]:pb-[0.38em] supports-[text-box:trim-both_cap_alphabetic]:gap-y-[0.3em] supports-[text-box:trim-both_cap_alphabetic]:align-[calc((var(--token-cap)_-_var(--token-height,calc(1cap_+_.73em)))_/_2_+_.38em)] supports-[text-box:trim-both_cap_alphabetic]:data-wrapped:my-[max(0px,(var(--token-line)_-_1cap_-_.73em)_/_2_-_1px)] text-left font-token font-[350] tracking-[0.015em] [font-variation-settings:"MONO"_var(--token-mono,0)] text-[.85em] break-words ring-1';
// The raise centers the chip on the surrounding capitals. .38em is pb, the last baseline's height above the bottom, and 1cap + .73em is one row.
// baseline-source is important because vertical-align is a shorthand that resets it.
// A wrapped chip outgrows the line, so its margins keep a one-row chip's air (.73em is pt + pb). Less 1px for rounding.
// A flex container takes no text-box, so each piece trims its own line to cap height and baseline and the padding centers it. The bottom is heavier because mostly lowercase text reads low when its capitals are centered.
const PIECE = 'supports-[text-box:trim-both_cap_alphabetic]:[text-box:trim-both_cap_alphabetic]';
// Important because the kit's unlayered CSS sets height and vertical-align.
const ICON = 'fa-width-auto [--size:.85em] h-[var(--size)]! align-[calc((1cap_-_var(--size))/2)]!';
// Binds the icon and the mark to their segment, one gap from its label.
const SEGMENT = 'flex min-w-0 items-baseline gap-x-1';
const PRESS = 'cursor-pointer transition-colors outline-blue-600 outline-offset-2 focus-visible:outline-2';

const wrapper = useTemplateRef<HTMLElement>('wrapper');
const chip = useTemplateRef<HTMLElement>('chip');
const token = () => chip.value;
let line: Element | undefined;
onMounted(() => {
	line = watchLine(wrapper.value!, token);
	hug([token]);
});
onBeforeUnmount(() => line && unwatchLine(wrapper.value!, line, token));
watch([chip, segments, mark], () => nextTick(() => hug([token])));
</script>

<template>
	<!-- Popover wraps its trigger in two divs. Both go to display: contents so the chip stays in the line. -->
	<span ref="wrapper" class="inline-block max-w-full [--token-line:1lh] [--token-cap:1cap]">{{ before }}<Popover :content="description" :disabled="press || !description" class="contents! [&>div]:contents!">
		<template #default="{ triggerProps, open }">
			<component
				ref="chip"
				:is="pressable ? 'button' : 'span'"
				:type="pressable ? 'button' : undefined"
				v-bind="press ? {} : pressable ? triggerProps : {}"
				:class="[CHIP, before ? 'ml-0.5' : '', after ? 'mr-0.5' : '', tone.chip, pressable ? [PRESS, tone.press] : '', press ? 'focus:outline-2' : '', selected ? 'outline-2' : '', open ? tone.open : '']"
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

<style>
/* Registered so 1lh and 1cap resolve to px on the wrapper, in the parent's font, before the smaller chip inherits them. */
@property --token-line {
	syntax: '<length>';
	inherits: true;
	initial-value: 0px;
}

@property --token-cap {
	syntax: '<length>';
	inherits: true;
	initial-value: 0px;
}
</style>
