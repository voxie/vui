<script setup lang="ts">
import {
	Comment,
	Fragment,
	Text,
	computed,
	inject,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
	useSlots,
	type ComputedRef,
	type VNode,
} from 'vue';
import Button from './Button.vue';
import SurfaceProvider from './SurfaceProvider.vue';
import { provideSurface, useSurface, type Surface } from './surface.ts';

defineOptions({
	// Named so an action can spot another action among its items. Comparing
	// against the component itself would mean importing this file into itself.
	name: 'NavbarAction',
	// Attributes belong on the control, not on the wrapper that positions it.
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		href?: string;
		/* Font Awesome classes, e.g. `fa-solid fa-address-book`. */
		icon?: string;
		/* Which edge the dropdown lines up with, once the bar is wide enough. */
		placement?: 'left' | 'right';
		// What the action sits on. Taken from the bar above it, so this is only for
		// an action standing on its own.
		sitsOn?: Surface;
		active?: boolean;
		open?: boolean;
		/* Set by Navbar or by a parent action; not something to pass by hand. */
		nested?: boolean;
		marker?: boolean;
		hideArrow?: boolean;
		// `li` on the bar and in a menu, where actions normally live. `div` for
		// somewhere that isn't a list, such as the bar's right slot.
		as?: 'li' | 'div';
	}>(),
	{
		placement: 'left',
		active: false,
		open: false,
		nested: false,
		marker: true,
		hideArrow: false,
		as: 'li',
	},
);

const emit = defineEmits<{ 'update:open': [open: boolean] }>();

const surface = useSurface(() => props.sitsOn);
// Handed on to the Button the action renders, so `sitsOn` holds where no bar
// above can answer, such as an action rendered on its own.
provideSurface(() => surface.value);

const slots = useSlots();

// A `v-for` or `<template>` arrives as one fragment, so items are unwrapped
// before being counted or handed props. Comment nodes (what a false `v-if`
// leaves) and slot whitespace would throw the count off.
const flatten = (nodes: VNode[]): VNode[] =>
	nodes
		.flatMap((node) => (node.type === Fragment ? flatten(node.children as VNode[]) : node))
		.filter(
			(node) =>
				node.type !== Comment && !(node.type === Text && !String(node.children ?? '').trim()),
		);

const root = ref<HTMLElement | null>(null);
const dropdownOpen = ref(props.open);

watch(
	() => props.open,
	(open) => {
		dropdownOpen.value = open;
	},
);

// The open state goes to the label slot so a caller's own control can set the
// chevron and the aria attributes itself. Every call has to pass it:
// `#default="{ open }"` destructures its argument and throws when called with none.
const labelNodes = () => flatten(slots.default?.({ open: dropdownOpen.value }) ?? []);

const items = () => flatten(slots.items?.() ?? []);
const isAction = (node: VNode) =>
	typeof node.type === 'object' && (node.type as { name?: string }).name === 'NavbarAction';

// Walks rather than checks, since a page can be two levels down. `active`
// written bare arrives as an empty string, so both spellings count.
const holdsActive = (nodes: VNode[]): boolean =>
	nodes.some((node) => {
		if (node.props?.active === true || node.props?.active === '') return true;
		const nested = (node.children as { items?: () => VNode[] } | null)?.items;
		return typeof nested === 'function' && holdsActive(flatten(nested()));
	});

// Marked when it is the page or holds it, so folding the current section into
// More doesn't blank the marker. The marker only: `aria-current` stays on the
// page itself, or a bar would read aloud as having two current items.
const marked = () => props.active || holdsActive(items());

const hasDropdown = () => Boolean(slots.items || slots.dropdown);

// True when the label slot brings a control of its own rather than a bare word.
const holdsControl = () =>
	labelNodes().some(
		(node) => node.type === 'button' || node.type === 'a' || node.type === Button,
	);

// A section on the bar is a transparent Button, so it hovers, presses and rings
// like the buttons beside it. Not in a menu, where a row is a full-width row,
// and not when the label brings its own control.
const usesButton = () => !props.nested && !holdsControl();

// A button can't hold a button, so a label with its own control drops to a div.
// Plain functions rather than computeds, here and above: slot content isn't
// reactive state, so a computed would cache the first answer and keep it.
const element = () => {
	if (holdsControl() || usesButton()) return 'div';
	return props.href ? 'a' : 'button';
};

const setOpen = (open: boolean) => {
	dropdownOpen.value = open;
	emit('update:open', open);
};

// Nothing to open, nothing to toggle: an action with no menu would otherwise
// carry an open state that paints a marker in a narrow bar.
const onClick = () => {
	if (hasDropdown()) setOpen(!dropdownOpen.value);
};

// A nested action is part of a menu that is already open, so it closes with
// that menu rather than dismissing itself.
const dismissable = () => !props.nested && dropdownOpen.value;

const onPointerDown = (event: PointerEvent) => {
	if (dismissable() && !root.value?.contains(event.target as Node)) setOpen(false);
};

// Escape hands focus back to the control that opened the panel, or it would be
// left on a node about to be removed and fall to the body.
const onKeydown = (event: KeyboardEvent) => {
	if (event.key !== 'Escape' || !dismissable()) return;
	const inside = root.value?.contains(document.activeElement);
	setOpen(false);
	if (inside) root.value?.querySelector<HTMLElement>('button, a[href]')?.focus();
};

// From Navbar's observer, so it's the bar being measured and not the viewport,
// and this component adds no listener of its own. Standalone it reads as roomy.
const narrow = inject<ComputedRef<boolean>>(
	'navbarNarrow',
	computed(() => false),
);

onMounted(() => {
	document.addEventListener('pointerdown', onPointerDown);
	document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', onPointerDown);
	document.removeEventListener('keydown', onKeydown);
});

// A link goes somewhere, a menu opens: the arrow says which, and turns at every
// level once the menu is open.
const arrowIcon = computed(() => {
	if (props.href) return 'fa-solid fa-angle-right';
	return dropdownOpen.value ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down';
});

// A top-level label has no fill of its own, so it takes white on the dark bar
// and slate-800 on the glass one. Nested labels are on white either way.
const labelColor = computed(() => {
	if (props.nested) return '';
	return surface.value === 'dark' ? 'text-white' : 'text-slate-800';
});

// A pseudo-element rather than a box of its own, so a section is one element.
// The open marker is two steps off the bar, except on glass: slate-200 lands at
// Lc 8 where the dark pairing is Lc 19, so slate-300 is the match at Lc 20.
const markerClasses = () => {
	if (props.nested || !props.marker) return '';
	const shape = 'relative after:absolute after:inset-x-0 after:bottom-0 after:h-1.5 after:rounded-t-lg';
	if (marked()) return `${shape} after:block after:bg-sky-500`;

	// In a narrow bar the panel covers the full width, so the marker is what ties
	// it back to the hamburger. With room it sits under its own section.
	return [
		shape,
		surface.value === 'dark' ? 'after:bg-slate-500' : 'after:bg-slate-300',
		dropdownOpen.value ? 'after:block' : 'after:hidden',
		'@min-[40rem]/navbar:after:hidden',
	].join(' ');
};
</script>

<template>
	<component
		:is="props.as"
		ref="root"
		class="flex h-full @min-[40rem]/navbar:relative"
		:class="props.nested ? 'w-full flex-col items-start @min-[64rem]/navbar:min-w-[224px]' : 'items-center'"
	>
		<component
			:is="element()"
			v-bind="usesButton() ? {} : $attrs"
			:href="element() === 'a' ? props.href : undefined"
			:type="element() === 'button' ? 'button' : undefined"
			:aria-haspopup="hasDropdown() && element() !== 'div' ? 'true' : undefined"
			:aria-expanded="hasDropdown() && element() !== 'div' ? dropdownOpen : undefined"
			:aria-current="element() !== 'div' && props.active ? (props.href ? 'page' : 'true') : undefined"
			class="group/item-pointer flex items-center bg-transparent p-0 font-sans text-xs font-medium whitespace-nowrap no-underline! focus-visible:outline-none"
			:class="[
				labelColor,
				markerClasses(),
				/*
					On the bar this is the 80px box around a 32px pill. It keeps the
					height for the marker but gives up the pointer, or a click 24px clear
					of the button would open a menu. Bubbled presses still arrive here.
				*/
				element() === 'div' ? 'pointer-events-none' : 'cursor-pointer',
				props.nested ? 'relative w-full justify-between' : 'h-full gap-2',
			]"
			@click="onClick"
		>
			<!-- The row that would draw this bar folded away with the panel, so the
			     heading over it stands in. Only while it's folded: open, the row
			     draws its own, and two bars in a column read as two pages. -->
			<div
				v-if="props.nested && !dropdownOpen && marked()"
				class="absolute -start-3 h-full w-1.5 rounded-r-lg bg-sky-500"
			></div>
			<!-- `transparent` is the button with no resting fill, so the label still
			     sits straight on the bar. The icon and arrow go inside it so the fill
			     and the ring take in the whole section, and `pointer-events-auto` puts
			     back the hit target the wrapper above gave up. -->
			<Button
				v-if="usesButton()"
				v-bind="$attrs"
				size="sm"
				color="transparent"
				:href="props.href"
				:aria-haspopup="hasDropdown() ? 'true' : undefined"
				:aria-expanded="hasDropdown() ? dropdownOpen : undefined"
				:aria-current="props.active ? (props.href ? 'page' : 'true') : undefined"
				class="pointer-events-auto"
			>
				<i
					v-if="props.icon"
					class="fa-width-auto text-xs text-slate-400"
					:class="props.icon"
					aria-hidden="true"
				></i>
				<slot :open="dropdownOpen" />
				<!-- A step under the label. The arrow is punctuation and not a word: at
				     the label's own size it competes with it for the reading. -->
				<i
					v-if="!props.hideArrow"
					class="fa-width-auto text-2xs"
					:class="arrowIcon"
					aria-hidden="true"
				></i>
			</Button>

			<!-- Drawn here and not on the element that took the focus: a row runs the
			     full width of the panel, so a ring on that would box its empty half.
			     A box of its own rather than the label's, since in a menu the arrow
			     sits at the far end of the row, clear of the label's hover fill. -->
			<span
				v-else
				class="flex items-center group-focus-visible/item-pointer:outline-2 group-focus-visible/item-pointer:outline-offset-4 group-focus-visible/item-pointer:outline-blue-600"
				:class="props.nested ? 'w-full justify-between rounded-lg' : 'gap-2 rounded-md'"
			>
				<span
					class="flex items-center gap-2"
					:class="{
						'rounded-lg px-2.5 py-1.5 text-slate-900! group-hover/item-pointer:bg-sky-100': props.nested,
						'pointer-events-auto w-full': element() === 'div',
					}"
				>
					<!-- Fixed width in a menu, where the icons are a column holding the
					     labels in line. On the bar each section is on its own. -->
					<i
						v-if="props.icon"
						class="text-xs text-slate-400"
						:class="[props.icon, props.nested ? 'fa-fw' : 'fa-width-auto']"
						aria-hidden="true"
					></i>
					<slot :open="dropdownOpen" />
				</span>
				<!-- Font Awesome fixes every icon at 1.25em so a column lines up; the
				     arrow isn't in one, so `fa-width-auto` leaves the gap alone. A step
				     under the label at every depth — a button in a side slot has to set
				     the same size on the arrow it carries. -->
				<i
					v-if="!props.hideArrow && element() !== 'div'"
					class="fa-width-auto text-2xs"
					:class="[arrowIcon, { 'text-slate-900': props.nested }]"
					aria-hidden="true"
				></i>
			</span>
		</component>

		<Transition
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<!-- The panel is white whatever the bar is, so a Button among the rows is
			     on `default`. A boundary of its own and not a `provide` up in this
			     component: the label and the panel are both mounted here, and they sit
			     on different things. -->
			<SurfaceProvider
				v-if="hasDropdown() && dropdownOpen"
				surface="default"
				data-navbar-panel
				class="rounded-lg bg-white motion-safe:transition-opacity motion-safe:duration-100 motion-safe:ease-linear"
				:class="
					props.nested
						? 'w-full '
						: [
								'-translate-y-1.5 absolute top-full start-4 w-[calc(100%-32px)] shadow-lg @min-[40rem]/navbar:start-0 @min-[40rem]/navbar:w-auto',
								props.placement === 'right' ? '@min-[40rem]/navbar:start-auto @min-[40rem]/navbar:end-0' : '',
							]
				"
			>
				<div v-if="$slots.dropdown">
					<slot name="dropdown" />
				</div>

				<!-- A menu is a list too, so a screen reader can say how long it is.
				     Anything in this slot that isn't an item needs its own `li`. -->
				<ul
					v-if="$slots.items"
					class="flex flex-col items-start "
					:class="props.nested ? 'pt-1 pb-2 px-4' : 'py-3 px-3'"
				>
					<!-- An action among the items is a submenu: it opens inline rather
					     than dropping a second panel, so it arrives already open. -->
					<component
						v-for="(item, index) in items()"
						:is="item"
						:key="item.key ?? `item-${index}`"
						v-bind="isAction(item) ? { nested: true, open: !narrow } : { nested: props.nested }"
					/>
				</ul>
			</SurfaceProvider>
		</Transition>
	</component>
</template>
