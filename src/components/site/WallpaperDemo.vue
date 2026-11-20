<script setup lang="ts">
// The wallpaper's fade follows its width, so full screen shows the grid the
// docs column hides. The dialog and URL handling match PageStructureDemo.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
import Wallpaper from '@ui/Wallpaper.vue';

const props = withDefaults(
	defineProps<{
		icon: string;
		animate?: boolean;
		// Names this example in the URL. Without one the preview still opens, it
		// just isn't addressable.
		previewId?: string;
	}>(),
	{ animate: false },
);

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

const close = () => dialogEl.value?.close();

const onDialogClose = () => {
	previewOpen.value = false;
	writeUrl(false);
};

// Let the browser have modified and non-primary clicks, so the link still opens
// in a new tab or window.
const onTriggerClick = (event: MouseEvent) => {
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
	event.preventDefault();
	open();
};

// Follow the URL rather than own it, so Back and Forward move through previews.
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
		<div class="rounded-2xl border border-slate-300">
			<div class="p-4">
				<Card surface="layered">
					<Wallpaper :icon="icon" :animate="animate" />
					<div class="relative max-w-xs">
						<h4 class="font-extrabold">Flows</h4>
						<p class="mt-1 leading-snug">A flow is a series of steps a contact moves through.</p>
					</div>
				</Card>
			</div>
			<div class="border-t border-t-slate-300 p-4">
				<Button :href="previewHref" class="w-full" sits-on="background" @click="onTriggerClick">
					View Full Screen
				</Button>
			</div>
		</div>

		<!-- `w-full` and `h-full` against the UA stylesheet's `fit-content`, and
		     `outline-none` since `showModal()` focuses the dialog itself. -->
		<dialog
			ref="dialogEl"
			aria-label="Wallpaper, full screen"
			class="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-slate-200 p-0 outline-none"
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
				<div class="p-6 pt-16">
					<!-- Tall enough to show most of the grid's 432px. -->
					<Card surface="layered" padding="spacious" class="flex min-h-72 flex-col justify-start">
						<Wallpaper :icon="icon" :animate="animate" />
						<div class="relative max-w-md">
							<h4 class="text-2xl font-extrabold">Flows</h4>
							<p class="mt-2 leading-snug">A flow is a series of steps a contact moves through.</p>
						</div>
					</Card>
				</div>
			</template>
		</dialog>
	</div>
</template>
