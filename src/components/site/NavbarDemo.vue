<script setup lang="ts">
/*
  A navigation bar in the documentation, with a way to see it at full width.

  The bar sizes itself to its container, so in the docs column it is always a
  folded bar — honest, but not the thing being documented. "Open full screen"
  puts the same bar across the top of the viewport, at the width it would have
  in the product, where resizing the window actually exercises the fold.

  A native `<dialog>` rather than a hand-rolled overlay: `showModal()` brings
  the focus trap, the inert background, the top layer and Escape with it.

  Which bar is open lives in the URL, so a preview survives a reload — the
  thing you're most likely to do while testing how it responds — and so a
  particular one can be linked to.
*/
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import NavbarExample from './NavbarExample.vue';

const props = withDefaults(
	defineProps<{
		surface?: 'glass' | 'dark';
		openCurrent?: boolean;
		hideRight?: boolean;
		hideActions?: boolean;
		/*
		  Names this bar in the URL. Without one the preview still opens, it just
		  isn't addressable — so every bar on a page that has more than one wants
		  its own, or a link couldn't say which it meant.
		*/
		previewId?: string;
	}>(),
	{
		surface: 'dark',
		openCurrent: false,
		hideRight: false,
		hideActions: false,
	},
);

const PARAM = 'preview';

const dialogEl = ref<HTMLDialogElement | null>(null);
const previewOpen = ref(false);

/*
  A real link, not a button: the point of putting this in the URL is that it can
  be shared, and an anchor is what makes "copy link address" and opening in a
  new tab work. The click is intercepted so the common case doesn't navigate.
  Relative, so it resolves against whatever page the bar is documented on, and
  so it's the same string on the server as in the browser.
*/
const previewHref = computed(() =>
	props.previewId ? `?${PARAM}=${encodeURIComponent(props.previewId)}` : undefined,
);

const writeUrl = (open: boolean) => {
	if (!props.previewId) return;
	const url = new URL(window.location.href);
	if (open) url.searchParams.set(PARAM, props.previewId);
	else if (url.searchParams.get(PARAM) === props.previewId) url.searchParams.delete(PARAM);
	else return;
	// Replace rather than push: opening a preview isn't a place you navigated
	// to, and leaving entries behind would make Back walk through them.
	history.replaceState(history.state, '', url);
};

/*
  `showModal()` first, then the flag. A bar mounted inside a closed dialog has
  no width to fold against. It would catch up the moment the dialog opened, but
  it's better arriving already folded than refolding in view.
*/
const open = () => {
	if (previewOpen.value) return;
	dialogEl.value?.showModal();
	previewOpen.value = true;
	writeUrl(true);
};

// Closing goes through the dialog, so every route out of the preview — this,
// Escape, the backdrop — ends up in the same handler.
const close = () => dialogEl.value?.close();

const onDialogClose = () => {
	previewOpen.value = false;
	writeUrl(false);
};

// Let the browser have modified and non-primary clicks, so the link still opens
// in a new tab or window. Those land on a URL that opens the preview on load.
const onTriggerClick = (event: MouseEvent) => {
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
	event.preventDefault();
	open();
};

const panelIsOpen = () => Boolean(dialogEl.value?.querySelector('[data-navbar-panel]'));

/*
  Dismissing goes innermost-first: with a menu open, Escape and a click on the
  backdrop close the menu, and it takes a second one to close the preview.

  Both have to be caught before the bar's own handlers on `document` see them.
  By the time the dialog's `cancel` or `click` fires, Vue has flushed the close
  and there's nothing left in the DOM to say a menu was ever open — so whether
  one was is recorded on the way down. The events aren't stopped, only recorded
  and (for Escape) defaulted away, so the bar still closes its own menu.
*/
let swallowCancel = false;
let hadPanelOnPointerDown = false;

const onKeydownCapture = (event: KeyboardEvent) => {
	if (event.key !== 'Escape') return;
	// Set on every Escape, not just the swallowed ones: leaving it latched would
	// eat the next press, which is the one meant to close the preview.
	swallowCancel = panelIsOpen();
	if (swallowCancel) event.preventDefault();
};

// Belt and braces for engines that route Escape through `cancel` rather than a
// close watcher, where preventing the keydown isn't enough on its own. When it
// isn't swallowed, `close` follows and does the rest.
const onCancel = (event: Event) => {
	if (!swallowCancel) return;
	swallowCancel = false;
	event.preventDefault();
};

const onPointerDownCapture = () => {
	hadPanelOnPointerDown = panelIsOpen();
};

/*
  A click on the backdrop is dispatched to the dialog itself, so the target is
  what separates "outside the bar" from "on it".
*/
const onClick = (event: MouseEvent) => {
	if (event.target !== dialogEl.value) return;
	if (hadPanelOnPointerDown) return;
	close();
};

// Follow the URL rather than own it, so Back and Forward move through previews
// the same way a link into one does.
const syncFromUrl = () => {
	if (!props.previewId) return;
	const wanted = new URLSearchParams(window.location.search).get(PARAM) === props.previewId;
	if (wanted) open();
	else if (previewOpen.value) close();
};

onMounted(() => {
	syncFromUrl();
	window.addEventListener('popstate', syncFromUrl);
});

onBeforeUnmount(() => {
	window.removeEventListener('popstate', syncFromUrl);
});
</script>

<template>
	<div>
		<NavbarExample v-bind="props" />

		<p class="mt-2 text-xs text-slate-500">
			<!-- No line break inside the anchor: the newline collapses to a space
			     and lands inside the underline. -->
			<a
				:href="previewHref"
				class="font-sans text-xs text-sky-700 underline"
				@click="onTriggerClick"
			>Open full screen</a>
			<span class="ms-2">to resize the window and watch it fold.</span>
		</p>

		<!--
			Transparent, so the backdrop is what sits behind the bar. Two of these
			classes are load-bearing against the UA stylesheet, which gives a
			dialog `width: fit-content` and `overflow: auto`: `w-full`, or
			`inset-x-0` is over-constrained and the bar sits at its content width
			rather than the window's, and `overflow-visible`, or the dialog's box
			ends at the bar and clips any menu hanging below it.

			`outline-none` is the third. `showModal()` has to put focus somewhere,
			and with nothing inside asking for it the dialog takes it itself — so
			the browser draws its focus ring on this box, which is the width of
			the window and sits right on top of the bar. It reads as the bar being
			focused, and nothing here is: the frame is transparent and holds no
			control. The trap, Escape and the first Tab into the bar are unchanged.
		-->
		<dialog
			ref="dialogEl"
			aria-label="Navigation bar, full screen"
			class="fixed inset-x-0 top-0 m-0 w-full max-w-none overflow-visible bg-transparent p-0 outline-none backdrop:bg-slate-200/80 backdrop:backdrop-blur-md"
			@keydown.capture="onKeydownCapture"
			@pointerdown.capture="onPointerDownCapture"
			@click="onClick"
			@cancel="onCancel"
			@close="onDialogClose"
		>
			<NavbarExample v-if="previewOpen" v-bind="props" />
		</dialog>
	</div>
</template>
