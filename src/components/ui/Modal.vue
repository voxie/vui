<script lang="ts">
// Shared across every instance: what's open, and whether the page behind is
// locked. Both are page-wide facts, so they can't live on an instance.
const openModals: symbol[] = [];

let originalOverflow = '';
let originalPaddingRight = '';

function lockScroll(): void {
	if (openModals.length > 1) return;
	// Taking the scrollbar away shifts the page, so its width goes back as
	// padding.
	const scrollbarWidth = window.innerWidth - document.body.clientWidth;
	const current = parseInt(window.getComputedStyle(document.body).paddingRight || '0', 10);
	originalOverflow = document.body.style.overflow;
	originalPaddingRight = document.body.style.paddingRight;
	document.body.style.paddingRight = `${current + scrollbarWidth}px`;
	document.body.style.overflow = 'hidden';
}

function unlockScroll(): void {
	if (openModals.length) return;
	document.body.style.overflow = originalOverflow;
	document.body.style.paddingRight = originalPaddingRight;
}

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { provideSurface } from './surface.ts';
import SurfaceProvider from './SurfaceProvider.vue';
import Button from './Button.vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Classes from the caller belong on the panel, not on the layer that centers it.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		size?: ModalSize;
		backdrop?: boolean;
		// Pushed back and blurred, for a modal that has another one open on top of
		// it. A stacked modal can't be closed.
		stacked?: boolean;
		// Off, the close button goes and neither Escape nor a click outside will
		// close it. For a modal that has to be answered.
		dismissible?: boolean;
	}>(),
	{
		size: 'md',
		backdrop: true,
		stacked: false,
		dismissible: true,
	},
);

const open = defineModel<boolean>({ default: false });

const emit = defineEmits<{ close: [] }>();

const slots = defineSlots<{
	header?: () => unknown;
	subheader?: () => unknown;
	default?: () => unknown;
	footer?: () => unknown;
}>();

const headerId = useId();

const hasHead = computed(() => Boolean(slots.header || slots.subheader));

const panel = ref<HTMLElement | null>(null);
const body = ref<HTMLElement | null>(null);

// Identity in the open stack, so only the top modal answers Escape.
const key = Symbol('modal');
const isTopmost = () => openModals[openModals.length - 1] === key;

const sizeClasses: Record<ModalSize, string> = {
	sm: 'sm:max-w-md',
	md: 'sm:max-w-xl',
	lg: 'sm:max-w-3xl',
	xl: 'sm:max-w-5xl',
	full: '',
};

// Head and footer are white, so anything the caller puts in them reads the
// panel rather than whatever the modal was opened from. The body is glass, one
// step back from both.
provideSurface(() => 'default');

const close = () => {
	if (props.stacked || !props.dismissible) return;
	open.value = false;
	emit('close');
};

// A drag that starts on the panel and ends on the backdrop still fires a click
// on the backdrop, so the press has to have started there too.
const pressedOutside = ref(false);

const onOverlayMousedown = () => {
	pressedOutside.value = true;
};

const onOverlayClick = () => {
	if (pressedOutside.value) close();
	pressedOutside.value = false;
};

const focusableItems = () =>
	Array.from(panel.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
		(element) => element.offsetParent !== null,
	);

const onKeydown = (event: KeyboardEvent) => {
	if (!open.value || !isTopmost()) return;

	if (event.key === 'Escape') {
		close();
		return;
	}

	if (event.key !== 'Tab' || !panel.value) return;

	const items = focusableItems();
	if (!items.length) return;

	const first = items[0];
	const last = items[items.length - 1];
	const active = document.activeElement;
	const inside = active instanceof Node && panel.value.contains(active);

	if (event.shiftKey && (!inside || active === first)) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && (!inside || active === last)) {
		event.preventDefault();
		first.focus();
	}
};

// Vue's server render puts a Teleport's anchors where the component sits and
// its content in a buffer Astro has nowhere to put, so the Teleport only exists
// once the island is mounted.
const mounted = ref(false);

onMounted(() => {
	mounted.value = true;
	document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
	document.removeEventListener('keydown', onKeydown);
	release();
});

const scrollToElement = (element: HTMLElement) => {
	if (!body.value) return;
	const target = element.getBoundingClientRect();
	const region = body.value.getBoundingClientRect();
	// 80px of headroom, so the element isn't flush against the top edge.
	const top = target.top - region.top + body.value.scrollTop - 80;
	body.value.scrollTo({ top: Math.max(0, top) });
};

const focusField = (index = 0, scroll = true) => {
	const fields = body.value?.querySelectorAll<HTMLElement>('input, select, textarea');
	const field = fields?.[index];
	if (!field) return false;
	if (scroll) scrollToElement(field);
	field.focus();
	return true;
};

const focusInvalidField = (index = 0, scroll = true) => {
	const fields = body.value?.querySelectorAll<HTMLElement>('[aria-invalid="true"]');
	const field = fields?.[index];
	if (!field) return false;
	if (scroll) scrollToElement(field);
	field.focus();
	return true;
};

const scrollTo = (options: ScrollToOptions = { top: 0, behavior: 'smooth' }) => {
	body.value?.scrollTo(options);
};

defineExpose({ panel, body, scrollTo, scrollToElement, focusField, focusInvalidField });

// Where focus goes back to once the modal closes.
let opener: HTMLElement | null = null;

const release = () => {
	const index = openModals.indexOf(key);
	if (index === -1) return;
	openModals.splice(index, 1);
	unlockScroll();
};

watch(open, async (isOpen) => {
	if (isOpen) {
		opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		openModals.push(key);
		lockScroll();
		await nextTick();
		if (!focusField(0, false)) panel.value?.focus();
	} else {
		release();
		opener?.focus();
		opener = null;
	}
});
</script>

<template>
	<Teleport v-if="mounted" to="body">
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0"
			leave-active-class="transition duration-200 ease-in"
			leave-to-class="opacity-0"
		>
			<div v-if="open && props.backdrop" class="fixed inset-0 z-50 bg-slate-300/80"></div>
		</Transition>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="opacity-0 translate-y-full sm:translate-y-16 motion-reduce:translate-y-0"
			leave-active-class="transition duration-200 ease-in"
			leave-to-class="opacity-0 translate-y-full sm:translate-y-16 motion-reduce:translate-y-0"
		>
			<div
				v-if="open"
				class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
				@mousedown.self="onOverlayMousedown"
				@click.self="onOverlayClick"
			>
				<div
					ref="panel"
					role="dialog"
					aria-modal="true"
					:aria-labelledby="slots.header ? headerId : undefined"
					tabindex="-1"
					v-bind="$attrs"
					class="relative flex max-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden rounded-t-2xl bg-white font-sans text-base font-normal text-slate-500 shadow-xl shadow-slate-400 outline-none transition duration-300 sm:max-h-full sm:rounded-2xl"
					:class="[
						sizeClasses[props.size],
						props.stacked ? 'scale-95 opacity-80 blur-xs motion-safe:-translate-y-6' : '',
					]"
				>
					<!-- Floats over the panel rather than sitting in a region, so a
					     modal with no head has no empty bar. Whatever is under it
					     holds its top end corner clear. -->
					<div v-if="props.dismissible" class="absolute end-4 top-4 z-10">
						<Button size="sm" aria-label="Close" @click="close">
							<i aria-hidden="true" class="fa-solid fa-xmark"></i>
						</Button>
					</div>

					<div
						v-if="hasHead"
						class="border-b border-solid border-slate-100 p-6"
						:class="props.dismissible ? 'pe-16' : ''"
					>
						<h2 v-if="slots.header" :id="headerId" class="text-xl font-extrabold text-slate-700">
							<slot name="header" />
						</h2>

						<div v-if="slots.subheader" class="text-sm" :class="slots.header ? 'mt-2' : ''">
							<slot name="subheader" />
						</div>
					</div>

					<!-- `contents` so the surface layer doesn't sit between the panel's
					     flex column and the region that scrolls in it. -->
					<SurfaceProvider surface="glass" class="contents">
						<div
							ref="body"
							class="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-6"
							:class="!hasHead && props.dismissible ? 'pt-14' : ''"
						>
							<slot />
						</div>
					</SurfaceProvider>

					<!-- Always here, even with nothing in it. A modal ends in its
					     actions, so the bar is part of the shape rather than a slot
					     that comes and goes. Stacked on mobile with the primary on
					     top, since it's written last. -->
					<div
						class="flex flex-col-reverse gap-3 border-t border-solid border-slate-100 bg-white p-6 sm:flex-row sm:items-center"
					>
						<slot name="footer" />
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
