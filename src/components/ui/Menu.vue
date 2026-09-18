<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

const props = withDefaults(
	defineProps<{
		/* Which edge of the trigger the panel lines up with. */
		placement?: 'left' | 'right';
		// Renders the panel at the end of `<body>`, for a trigger inside something
		// that clips its overflow, like a scrolling table.
		teleport?: boolean;
		disabled?: boolean;
	}>(),
	{ placement: 'left', teleport: false, disabled: false },
);

const open = defineModel<boolean>('open', { default: false });

const root = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);

// Inline styles rather than classes, since a flip is measured, not chosen.
const position = reactive({
	top: 'auto',
	bottom: 'auto',
	left: 'auto',
	right: 'auto',
	maxHeight: 'none',
});

const toggle = () => {
	if (!props.disabled) open.value = !open.value;
};

// 8px between the trigger and the panel, and 16px kept clear of the window
// edge the panel grows toward.
const GAP = 8;
const MARGIN = 16;

const place = () => {
	if (!open.value || !root.value || !panel.value) return;

	// Measured from the control, not the wrapper: a flex parent can stretch the
	// wrapper past the control, and the panel has to hang off the control.
	const rootRect = root.value.getBoundingClientRect();
	const rect = (root.value.firstElementChild ?? root.value).getBoundingClientRect();
	const { offsetWidth: width, offsetHeight: height } = panel.value;

	const overflowsRight = rect.left + width > window.innerWidth;
	const overflowsLeft = rect.right - width < 0;
	const alignRight = (props.placement === 'right' || overflowsRight) && !overflowsLeft;

	// Flips up only when there is more room above than below, so a panel that
	// fits nowhere at least gets the larger space.
	const spaceBelow = window.innerHeight - rect.bottom;
	const flipsUp = rect.bottom + height > window.innerHeight && rect.top > spaceBelow;

	if (props.teleport) {
		position.left = `${alignRight ? rect.right - width : rect.left}px`;
		position.right = 'auto';
		position.bottom = 'auto';
		if (flipsUp) {
			position.top = `${rect.top + window.scrollY - height - GAP}px`;
			position.maxHeight = `${rect.top - MARGIN}px`;
		} else {
			position.top = `${rect.bottom + window.scrollY + GAP}px`;
			position.maxHeight = `${spaceBelow - MARGIN}px`;
		}
		return;
	}

	// Offsets from the wrapper's edges to the control's, which are zero unless
	// the wrapper has been stretched.
	position.left = alignRight ? 'auto' : `${rect.left - rootRect.left}px`;
	position.right = alignRight ? `${rootRect.right - rect.right}px` : 'auto';
	if (flipsUp) {
		position.top = 'auto';
		position.bottom = `${rootRect.bottom - rect.top + GAP}px`;
		position.maxHeight = `${rect.top - MARGIN}px`;
	} else {
		position.top = `${rect.bottom - rootRect.top + GAP}px`;
		position.bottom = 'auto';
		position.maxHeight = `${spaceBelow - MARGIN}px`;
	}
};

const onPointerDown = (event: PointerEvent) => {
	if (!open.value) return;
	const target = event.target as Node;
	if (root.value?.contains(target) || panel.value?.contains(target)) return;
	open.value = false;
};

// Escape hands focus back to the trigger, or it would be left on a row about
// to be removed and fall to the body.
const onKeydown = (event: KeyboardEvent) => {
	if (event.key !== 'Escape' || !open.value) return;
	const inside =
		root.value?.contains(document.activeElement) || panel.value?.contains(document.activeElement);
	open.value = false;
	if (inside) root.value?.querySelector<HTMLElement>('button, a[href]')?.focus();
};

// Vue's server render has nowhere to put a Teleport's content, so the panel
// only exists once the island is mounted.
const mounted = ref(false);

onMounted(() => {
	mounted.value = true;
	document.addEventListener('pointerdown', onPointerDown);
	document.addEventListener('keydown', onKeydown);
	window.addEventListener('resize', place);
	window.addEventListener('scroll', place, { capture: true, passive: true });
});

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', onPointerDown);
	document.removeEventListener('keydown', onKeydown);
	window.removeEventListener('resize', place);
	window.removeEventListener('scroll', place, { capture: true });
});

// Post flush, so the panel is in the DOM and has a size to measure.
watch([open, () => props.placement, () => props.teleport], place, { flush: 'post' });
</script>

<template>
	<div ref="root" class="relative w-fit" :class="{ 'opacity-50': props.disabled }" @click="toggle">
		<slot :open="open" />

		<Teleport v-if="mounted && open" to="body" :disabled="!props.teleport">
			<!-- A list, so a screen reader can say how long it is. Anything in the
			     slot that isn't a MenuItem needs its own `li`. Clicks stop here or
			     the trigger's wrapper would take them as a second press. -->
			<ul
				ref="panel"
				class="absolute z-50 m-0 list-none divide-y divide-solid divide-slate-200 overflow-y-auto rounded-lg border border-solid border-slate-200 bg-white p-0 shadow-xl"
				:style="position"
				@click.stop="open = false"
			>
				<slot name="items" />
			</ul>
		</Teleport>
	</div>
</template>
