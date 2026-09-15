<script setup lang="ts">
// A layout in the docs column is narrower than a window, so full screen shows
// it at the width it would have in the product. A native `<dialog>` for the
// focus trap, the top layer and Escape. Which layout is open lives in the URL,
// so a preview survives a reload and can be linked to.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import PageStructureExample from './PageStructureExample.vue';
import Button from '@ui/Button.vue';
import type { Layout } from './pageStructure';

const props = defineProps<{
	layout: Layout;
	// Names this layout in the URL. Without one the preview still opens, it
	// just isn't addressable.
	previewId?: string;
}>();

const PARAM = 'preview';

const dialogEl = ref<HTMLDialogElement | null>(null);
const previewOpen = ref(false);

// A real link and not a button, so "copy link address" and open-in-new-tab
// work; the click is intercepted so the common case doesn't navigate.
const previewHref = computed(() =>
	props.previewId ? `?${PARAM}=${encodeURIComponent(props.previewId)}` : undefined,
);

const writeUrl = (open: boolean) => {
	if (!props.previewId) return;
	const url = new URL(window.location.href);
	if (open) url.searchParams.set(PARAM, props.previewId);
	else if (url.searchParams.get(PARAM) === props.previewId) url.searchParams.delete(PARAM);
	else return;
	// Replace rather than push: opening a preview isn't a place you navigated to.
	history.replaceState(history.state, '', url);
};

const open = () => {
	if (previewOpen.value) return;
	dialogEl.value?.showModal();
	previewOpen.value = true;
	writeUrl(true);
};

// Closing goes through the dialog, so every route out of the preview ends up
// in the same handler.
const close = () => dialogEl.value?.close();

const onDialogClose = () => {
	previewOpen.value = false;
	writeUrl(false);
};

// The layout marks the buttons that end its flow, like Cancel and Save, so
// pressing one in the preview closes it the way it would leave the real page.
const onClick = (event: MouseEvent) => {
	if ((event.target as HTMLElement).closest('[data-preview-close]')) close();
};

// Let the browser have modified and non-primary clicks, so the link still opens
// in a new tab or window.
const onTriggerClick = (event: MouseEvent) => {
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
	event.preventDefault();
	open();
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
		<div class="border border-slate-300 rounded-2xl">
			<PageStructureExample :layout="layout" class="py-12" />
			<div class="p-4 border-t border-t-slate-300">
			<Button
				:href="previewHref"
				class="w-full"
				@click="onTriggerClick"
				sits-on="background"
			>
			View Full Screen
			</Button>
		</div>
		</div>

		<p class="mt-2 text-xs text-slate-500">
			<!-- No line break inside the anchor: the newline collapses to a space
			     and lands inside the underline. -->
		</p>

		<!-- `w-full` and `h-full` against the UA stylesheet's `fit-content`, and
		     `outline-none` since `showModal()` focuses the dialog itself. The
		     page background is the layout's own, so no backdrop shows through. -->
		<dialog
			ref="dialogEl"
			aria-label="Page layout, full screen"
			class="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-slate-200 p-0 outline-none"
			@click="onClick"
			@close="onDialogClose"
		>
			<template v-if="previewOpen">
				<button
					type="button"
					class="fixed top-4 right-4 z-30 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md hover:bg-white"
					@click="close"
				>
					Close
				</button>
				<div class="py-12">
					<PageStructureExample :layout="layout" />
				</div>
				<!-- One span per breakpoint, each shown only in its own range, so
				     the label tracks the window without measuring. -->
				<div
					class="fixed bottom-4 left-4 z-30 rounded-full bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-100 shadow-sm"
					aria-live="polite"
				>
					<span class="sm:hidden">base</span>
					<span class="hidden sm:inline md:hidden">sm</span>
					<span class="hidden md:inline lg:hidden">md</span>
					<span class="hidden lg:inline xl:hidden">lg</span>
					<span class="hidden xl:inline 2xl:hidden">xl</span>
					<span class="hidden 2xl:inline">2xl</span>
				</div>
			</template>
		</dialog>
	</div>
</template>
