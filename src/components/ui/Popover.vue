<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, useSlots, watch, type CSSProperties } from 'vue';
import { arrow as positionArrow, autoPlacement, autoUpdate, computePosition, flip, offset, shift, size, type Placement } from '@floating-ui/dom';
import SurfaceProvider from './SurfaceProvider.vue';

const props = withDefaults(defineProps<{
	content?: string;
	label?: string;
	placement?: Placement | 'auto' | 'auto-start' | 'auto-end';
	hover?: boolean;
	disabled?: boolean;
	openDelay?: number;
	closeDelay?: number;
	arrow?: boolean;
	arrowPadding?: number;
	locked?: boolean;
	interactive?: boolean;
	disableClickAway?: boolean;
	teleport?: boolean;
	zIndex?: number;
}>(), {
	placement: 'bottom', hover: false, disabled: false, openDelay: 0, closeDelay: 150,
	arrow: false, arrowPadding: 8, locked: false, interactive: true,
	disableClickAway: false, teleport: true, zIndex: 50,
});

const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ open: []; close: [] }>();
const slots = useSlots();
const id = useId();
const root = ref<HTMLElement>();
const panel = ref<HTMLElement>();
const arrowElement = ref<HTMLElement>();
const mounted = ref(false);
const available = computed(() => !props.disabled && Boolean(props.content?.trim() || slots.content));
const visible = computed(() => mounted.value && open.value && available.value);
const triggerProps = computed(() => ({
	id: `${id}-trigger`,
	'aria-haspopup': 'dialog' as const,
	'aria-expanded': visible.value,
	'aria-controls': visible.value ? `${id}-panel` : undefined,
	'aria-disabled': props.disabled || undefined,
}));
const position = ref<CSSProperties>({ left: '0px', top: '0px', visibility: 'hidden' });
const arrowStyle = ref<CSSProperties>({});
const side = ref('bottom');
let timer: ReturnType<typeof setTimeout> | undefined;
let openedOnHover = false;
let focusOnOpen = false;
let cleanupPosition: (() => void) | undefined;
let positionVersion = 0;

const trigger = () => root.value?.firstElementChild as HTMLElement | undefined;
const contains = (target: Node | null) => Boolean(target && (root.value?.contains(target) || panel.value?.contains(target)));
const cancelTimer = () => { clearTimeout(timer); timer = undefined; };
const tabbables = (element: HTMLElement) => Array.from(element.querySelectorAll<HTMLElement>(
	'button, a[href], input, select, textarea, [tabindex], [contenteditable="true"]',
)).filter(element => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');

function close(restoreFocus = true) {
	cancelTimer();
	focusOnOpen = false;
	openedOnHover = false;
	if (restoreFocus && panel.value?.contains(document.activeElement)) trigger()?.focus({ preventScroll: true });
	open.value = false;
}

function focusPanel() {
	const element = panel.value;
	if (element) (tabbables(element)[0] ?? element).focus({ preventScroll: true });
}

async function toggle() {
	if (!available.value) return;
	cancelTimer();
	if (visible.value && !openedOnHover) return close();
	openedOnHover = false;
	focusOnOpen = true;
	open.value = true;
	await nextTick();
	// A hovered panel is already mounted when a click takes ownership.
	if (visible.value && position.value.visibility !== 'hidden') focusPanel();
}

function enter(event: PointerEvent) {
	if (!props.hover || event.pointerType !== 'mouse') return;
	cancelTimer();
	if (!available.value || open.value) return;
	timer = setTimeout(() => {
		if (available.value) {
			openedOnHover = true;
			open.value = true;
		}
	}, Math.max(0, props.openDelay));
}

function leave(event: PointerEvent) {
	if (!props.hover || event.pointerType !== 'mouse') return;
	cancelTimer();
	if (!openedOnHover || panel.value?.contains(document.activeElement)) return;
	timer = setTimeout(() => close(false), Math.max(0, props.closeDelay));
}

async function place() {
	const anchor = trigger();
	const element = panel.value;
	if (!anchor || !element || !visible.value) return;
	const version = ++positionVersion;
	const automatic = props.placement.startsWith('auto');
	const result = await computePosition(anchor, element, {
		strategy: props.teleport ? 'fixed' : 'absolute',
		placement: automatic ? 'bottom' : props.placement as Placement,
		middleware: [
			offset(8),
			automatic ? autoPlacement({ alignment: props.placement.split('-')[1] as 'start' | 'end' | undefined, padding: 8 }) : !props.locked && flip({ padding: 8 }),
			shift({ padding: 8 }),
			size({ padding: 8, apply({ availableWidth, availableHeight, elements }) {
				Object.assign(elements.floating.style, {
					maxWidth: `${Math.max(0, Math.min(320, availableWidth))}px`,
					maxHeight: `${Math.max(0, availableHeight)}px`,
				});
			} }),
			props.arrow && arrowElement.value && positionArrow({ element: arrowElement.value, padding: props.arrowPadding }),
		],
	});
	if (version !== positionVersion || panel.value !== element || !visible.value) return;
	position.value = { left: `${result.x}px`, top: `${result.y}px`, visibility: 'visible' };
	side.value = result.placement.split('-')[0];
	const staticSide = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side.value]!;
	arrowStyle.value = {
		left: result.middlewareData.arrow?.x == null ? undefined : `${result.middlewareData.arrow.x}px`,
		top: result.middlewareData.arrow?.y == null ? undefined : `${result.middlewareData.arrow.y}px`,
		[staticSide]: '-4px',
	};
	await nextTick();
	if (focusOnOpen && visible.value && version === positionVersion) { focusOnOpen = false; focusPanel(); }
}

function onPointerDown(event: PointerEvent) {
	if (!props.disableClickAway && !contains(event.target as Node)) close(false);
}

function onFocusIn(event: FocusEvent) {
	if (visible.value && !contains(event.target as Node)) close(false);
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape' && (visible.value || timer) && !event.defaultPrevented) {
		event.preventDefault();
		close();
	}
}

function onTab(event: KeyboardEvent) {
	if (event.key !== 'Tab' || !panel.value) return;
	const items = tabbables(panel.value);
	const active = document.activeElement;
	if (event.shiftKey && (active === items[0] || active === panel.value)) {
		event.preventDefault();
		close();
	} else if (!event.shiftKey && (active === items.at(-1) || !items.length)) {
		// Continue after the trigger even when the panel is teleported to body.
		const outside = tabbables(document.body).filter(element => !panel.value?.contains(element));
		const next = outside[outside.indexOf(trigger()!) + 1];
		if (next) { event.preventDefault(); next.focus(); }
		close(false);
	}
}

watch(visible, value => {
	if (!value) {
		cancelTimer();
		focusOnOpen = false;
		openedOnHover = false;
		positionVersion++;
		if (panel.value?.contains(document.activeElement)) trigger()?.focus({ preventScroll: true });
	}
	if (value) emit('open');
	else emit('close');
});
watch(available, value => { if (!value) close(); });
watch(() => props.hover, cancelTimer);
watch([visible, () => props.placement, () => props.teleport, () => props.arrow, () => props.arrowPadding, () => props.locked], () => {
	cleanupPosition?.();
	cleanupPosition = undefined;
	positionVersion++;
	if (!visible.value || !panel.value || !trigger()) return;
	position.value = { left: '0px', top: '0px', visibility: 'hidden' };
	cleanupPosition = autoUpdate(trigger()!, panel.value, place);
}, { flush: 'post' });

onMounted(() => {
	mounted.value = true;
	document.addEventListener('pointerdown', onPointerDown);
	document.addEventListener('focusin', onFocusIn);
	document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
	cancelTimer();
	cleanupPosition?.();
	positionVersion++;
	document.removeEventListener('pointerdown', onPointerDown);
	document.removeEventListener('focusin', onFocusIn);
	document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
	<div class="relative inline-block">
		<div ref="root" class="inline-flex" @click="toggle" @pointerenter="enter" @pointerleave="leave"
			@keydown.tab="visible && !($event as KeyboardEvent).shiftKey && (focusPanel(), $event.preventDefault())">
			<slot :open="visible" :trigger-props="triggerProps" />
		</div>
		<Teleport v-if="visible" to="body" :disabled="!props.teleport">
			<div ref="panel" :id="`${id}-panel`" role="dialog" tabindex="-1"
				:aria-label="props.label" :aria-labelledby="props.label ? undefined : `${id}-trigger`"
				:data-side="side" class="not-prose w-max rounded-lg bg-white font-sans text-sm font-normal text-slate-800 shadow-lg outline-blue-600 focus-visible:outline-2"
				:style="{ ...position, position: props.teleport ? 'fixed' : 'absolute', zIndex: props.zIndex }"
				@pointerenter="enter" @pointerleave="leave" @keydown="onTab"
				@click="!props.interactive && close()">
				<span v-if="props.arrow" ref="arrowElement" aria-hidden="true" class="pointer-events-none absolute size-2 rotate-45 bg-white" :style="arrowStyle" />
				<SurfaceProvider surface="default" class="relative max-h-[inherit] overflow-auto rounded-lg p-4">
					<slot name="content" :close="close" :is-open="visible">{{ props.content }}</slot>
				</SurfaceProvider>
			</div>
		</Teleport>
	</div>
</template>
