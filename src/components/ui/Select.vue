<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId, watch, watchPostEffect, type CSSProperties } from 'vue';
import { autoUpdate, computePosition, flip, offset, shift, size as fit } from '@floating-ui/dom';
import Badge from './Badge.vue';
import Icon from './Icon.vue';
import { useControlBoundary, type Surface } from './surface.ts';

type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SelectOption = { value: string | number; label: string; disabled?: boolean };
// Options under a heading, the way an `<optgroup>` holds them.
type SelectGroup = { label: string; options: SelectOption[] };

// Attrs like `id` and `aria-label` belong on the control, not on the wrapper
// that stacks the label and the messages around it.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		options?: (SelectOption | SelectGroup)[];
		size?: SelectSize;
		// What the select is for. Leave it off only where a label can't fit, and
		// see the forms pattern for what counts.
		label?: string;
		// A second line under the label, for what the label can't hold.
		description?: string;
		// What the control shows while no option matches the value. Passing it
		// also stops an unset select from taking its first option.
		placeholder?: string;
		// What the select is sitting on. Left off, it's taken from the nearest
		// Card or Navbar. Pass it on the page background, which has no component
		// to announce it.
		sitsOn?: Surface;
		// The message under the control. Present means the select is in error.
		error?: string;
		hint?: string;
		// Marks the field required with a rose badge after the label. `label`
		// spells out Required on the first required field in a form; `true` is
		// the asterisk alone, for the rest.
		required?: boolean | 'label';
		disabled?: boolean;
		block?: boolean;
	}>(),
	{
		options: () => [],
		size: 'md',
		disabled: false,
		required: false,
		block: false,
	},
);

const model = defineModel<string | number | undefined>();

const boundary = useControlBoundary(() => props.sitsOn);

const errorId = useId();
const descriptionId = useId();
const generatedId = useId();
const labelId = useId();
const listId = useId();

// The caller's own `id` wins, since a `for` somewhere else may already point at
// it. `name` goes to the native select, which is the part a form submits.
const attrs = useAttrs();
const fieldId = computed(() => (attrs.id as string | undefined) ?? generatedId);
const controlAttrs = computed(() => {
	const { name, ...rest } = attrs;
	return rest;
});

const describedBy = computed(() => {
	const ids = [];
	if (props.description) ids.push(descriptionId);
	if (props.error) ids.push(errorId);
	return ids.length ? ids.join(' ') : undefined;
});

// One shape for the list to render. Loose options gather into a group with no
// label, and every option carries its place in the flat list.
const groups = computed(() => {
	const groups: { label?: string; rows: { option: SelectOption; index: number }[] }[] = [];
	let index = 0;
	for (const entry of props.options) {
		const last = groups.at(-1);
		if ('options' in entry) {
			groups.push({ label: entry.label, rows: entry.options.map((option) => ({ option, index: index++ })) });
		} else if (last && last.label === undefined) {
			last.rows.push({ option: entry, index: index++ });
		} else {
			groups.push({ rows: [{ option: entry, index: index++ }] });
		}
	}
	return groups;
});

const flat = computed(() => groups.value.flatMap((group) => group.rows.map((row) => row.option)));

// With no value and no placeholder a select rests on its first option, as a
// native one does. Once mounted the model is set to match what shows.
const resting = computed(() =>
	model.value === undefined && !props.placeholder ? flat.value.findIndex((option) => !option.disabled) : -1,
);
const selectedIndex = computed(() => {
	const index = flat.value.findIndex((option) => option.value === model.value);
	return index === -1 ? resting.value : index;
});
const selected = computed(() => flat.value[selectedIndex.value]);

watchPostEffect(() => {
	if (resting.value !== -1) model.value = flat.value[resting.value].value;
});

// The control is as wide as its longest option, so it doesn't resize with the
// choice. Longest by character count, which is near enough to hold the width.
const longest = computed(() =>
	flat.value.reduce((label, option) => (option.label.length > label.length ? option.label : label), props.placeholder ?? ''),
);

const control = ref<HTMLButtonElement | null>(null);
const native = ref<HTMLSelectElement | null>(null);
const list = ref<HTMLElement | null>(null);

const open = ref(false);
// The row the keys act on. Focus stays on the control the whole time, and
// `aria-activedescendant` points a screen reader at this one.
const active = ref(-1);
// Whether the active row was reached by key, which is when it takes the ring.
const keyed = ref(false);

// The next option that can be chosen, or the same one at either end.
const step = (from: number, by: 1 | -1) => {
	for (let index = from + by; index >= 0 && index < flat.value.length; index += by) {
		if (!flat.value[index].disabled) return index;
	}
	return from;
};

const show = () => {
	if (!flat.value.length) return;
	active.value = selectedIndex.value === -1 ? step(-1, 1) : selectedIndex.value;
	open.value = true;
};

const pick = (index: number) => {
	const option = flat.value[index];
	if (!option || option.disabled) return;
	open.value = false;
	if (option.value === model.value) return;
	model.value = option.value;
	// After the patch, so a listener reading the native select finds the new value.
	nextTick(() => native.value?.dispatchEvent(new Event('change', { bubbles: true })));
};

const toggle = () => {
	// Safari leaves a clicked button unfocused, and the keys are read from focus.
	control.value?.focus();
	keyed.value = false;
	if (open.value) open.value = false;
	else show();
};

const point = (index: number) => {
	keyed.value = false;
	if (!flat.value[index].disabled) active.value = index;
};

let search = '';
let searchTimer: ReturnType<typeof setTimeout> | undefined;

// Letters typed in quick succession spell out a label. A lone letter looks
// past the active row, so pressing it again moves to the next match.
const typeahead = (letter: string) => {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(() => (search = ''), 500);
	search += letter.toLowerCase();
	const from = Math.max(0, search.length === 1 ? active.value + 1 : active.value);
	const match = flat.value
		.map((_, index) => (index + from) % flat.value.length)
		.find((index) => !flat.value[index].disabled && flat.value[index].label.toLowerCase().startsWith(search));
	if (match !== undefined) active.value = match;
};

const onKeydown = (event: KeyboardEvent) => {
	if (event.altKey || event.ctrlKey || event.metaKey) return;
	const { key } = event;
	const wasOpen = open.value;

	if (key === 'Tab') {
		// Tab chooses on its way out, and is left alone to move focus.
		if (wasOpen) pick(active.value);
		return;
	}

	if (key === 'Escape') {
		if (!wasOpen) return;
		open.value = false;
		// Kept from a Modal around the select, which would close on the same press.
		event.stopPropagation();
	} else if (key === 'Enter' || (key === ' ' && !search)) {
		if (wasOpen) pick(active.value);
		else show();
	} else if (key === 'ArrowDown' || key === 'ArrowUp') {
		// The first press opens the list on the chosen option without moving off it.
		if (wasOpen) active.value = step(active.value, key === 'ArrowDown' ? 1 : -1);
		else show();
	} else if (key === 'Home' || key === 'End') {
		if (!wasOpen) show();
		active.value = key === 'Home' ? step(-1, 1) : step(flat.value.length, -1);
	} else if (key.length === 1) {
		if (!wasOpen) show();
		typeahead(key);
	} else {
		return;
	}

	keyed.value = true;
	event.preventDefault();
};

// 8px between the control and the list, and 16px kept clear of the window
// edge, the same as Menu.
const GAP = 8;
const MARGIN = 16;

const position = ref<CSSProperties>({ visibility: 'hidden' });
let stopPlacing: (() => void) | undefined;

const reveal = () => document.getElementById(`${listId}-${active.value}`)?.scrollIntoView({ block: 'nearest' });

const place = async () => {
	if (!control.value || !list.value) return;
	const { x, y } = await computePosition(control.value, list.value, {
		strategy: 'fixed',
		placement: 'bottom-start',
		middleware: [
			offset(GAP),
			flip({ padding: MARGIN }),
			shift({ padding: MARGIN }),
			fit({
				padding: MARGIN,
				apply({ availableWidth, availableHeight, rects, elements }) {
					Object.assign(elements.floating.style, {
						minWidth: `${rects.reference.width}px`,
						maxWidth: `${availableWidth}px`,
						maxHeight: `${availableHeight}px`,
					});
				},
			}),
		],
	});
	if (!open.value) return;
	// Once the height is capped, the chosen option may be below the fold.
	if (position.value.visibility) reveal();
	position.value = { left: `${x}px`, top: `${y}px` };
};

// Post flush, so the list is in the DOM and has a size to measure.
watch(
	open,
	(isOpen) => {
		stopPlacing?.();
		stopPlacing = undefined;
		if (!isOpen || !control.value || !list.value) return;
		position.value = { visibility: 'hidden' };
		stopPlacing = autoUpdate(control.value, list.value, place);
	},
	{ flush: 'post' },
);

watch(active, reveal, { flush: 'post' });

onBeforeUnmount(() => {
	stopPlacing?.();
	clearTimeout(searchTimer);
});

// End padding clears the chevron, so it runs ahead of the start padding at
// every size. The radius is its own entry, since the list takes it too.
const sizeClasses = computed(() => {
	if (props.size === 'xs')
		return { element: 'h-6 ps-2 pe-6 text-xs', radius: 'rounded', icon: 'end-2 text-2xs', label: 'text-xs' };
	if (props.size === 'sm')
		return { element: 'h-8 ps-3 pe-8 text-xs', radius: 'rounded-md', icon: 'end-3 text-2xs', label: 'text-xs' };
	if (props.size === 'lg')
		return { element: 'h-12 ps-5 pe-11 text-sm', radius: 'rounded-xl', icon: 'end-4 text-xs', label: 'text-sm' };
	if (props.size === 'xl')
		return { element: 'h-16 ps-8 pe-14 text-base', radius: 'rounded-2xl', icon: 'end-6 text-sm', label: 'text-base' };
	return { element: 'h-10 ps-4 pe-10 text-sm', radius: 'rounded-lg', icon: 'end-3.5 text-xs', label: 'text-sm' };
});
</script>

<template>
	<div class="font-sans" :class="props.block ? 'block w-full' : 'inline-block'">
		<!-- A press on the label focuses the control. Left to the browser it would
		     click the button and open the list. -->
		<label
			v-if="props.label"
			:id="labelId"
			:for="fieldId"
			class="flex items-center gap-1.5 font-extrabold text-slate-800"
			:class="[sizeClasses.label, props.description ? '' : 'mb-1']"
			@click.prevent="control?.focus()"
		>
			{{ props.label }}
			<Badge v-if="props.required" color="rose" size="2xs" :title="props.required === 'label' ? undefined : 'Required'">
				<template v-if="props.required === 'label'">Required</template>
				<span v-else class="sr-only">Required</span>
				<Icon name="fa-solid fa-asterisk" />
			</Badge>
		</label>

		<div
			v-if="props.description"
			:id="descriptionId"
			class="mb-2 font-normal text-slate-500"
			:class="sizeClasses.label"
		>
			{{ props.description }}
		</div>

		<!-- Shrunk to the control, so the chevron lands on its edge and not on the
		     container's when the wrapper is stretched by a grid or a flex row. -->
		<div class="relative" :class="props.block ? 'w-full' : 'w-fit'">
			<button
				v-bind="controlAttrs"
				:id="fieldId"
				ref="control"
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				:aria-expanded="open"
				:aria-controls="open ? listId : undefined"
				:aria-activedescendant="open && active !== -1 ? `${listId}-${active}` : undefined"
				:aria-required="props.required ? true : undefined"
				:aria-invalid="props.error ? true : undefined"
				:aria-describedby="describedBy"
				:disabled="props.disabled"
				class="relative block cursor-pointer appearance-none border border-solid bg-white text-left font-sans leading-tight outline-blue-600 transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none disabled:hover:shadow-none"
				:class="[
					sizeClasses.element,
					sizeClasses.radius,
					boundary.shadow,
					props.block ? 'w-full' : 'w-auto',
					props.error ? 'border-rose-300' : boundary.border,
					props.error ? 'text-rose-600' : 'text-slate-900',
				]"
				@click="toggle"
				@keydown="onKeydown"
				@keyup.space.prevent
				@blur="open = false"
			>
				<!-- Two spans in one cell: the value, and the longest label unseen
				     beneath it to hold the width. -->
				<span class="grid">
					<span class="col-start-1 row-start-1 truncate" :class="{ 'opacity-50': !selected }">
						{{ selected ? selected.label : props.placeholder }}
					</span>
					<span aria-hidden="true" class="invisible col-start-1 row-start-1 h-0 overflow-hidden whitespace-nowrap">{{ longest }}</span>
				</span>
			</button>

			<!-- The form's half: it submits under `name`, validates `required`, and
			     fires `change`. Laid over the control so a validation message points at it. -->
			<select
				ref="native"
				v-model="model"
				:name="attrs.name as string | undefined"
				:required="props.required ? true : undefined"
				:disabled="props.disabled"
				tabindex="-1"
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 size-full opacity-0"
				@focus="control?.focus()"
			>
				<option v-for="(option, index) in flat" :key="index" :value="option.value" :disabled="option.disabled">
					{{ option.label }}
				</option>
			</select>

			<Icon
				name="fa-solid fa-chevron-down"
				class="pointer-events-none absolute top-1/2 -translate-y-1/2"
				:class="[sizeClasses.icon, props.error ? 'text-rose-600' : 'text-slate-500']"
			/>
		</div>

		<!-- Drawn like a Menu panel, at the end of `<body>` so nothing clips it. The
		     mousedown is stopped so a press on a row leaves focus on the control. -->
		<Teleport v-if="open" to="body">
			<ul
				:id="listId"
				ref="list"
				role="listbox"
				:aria-labelledby="props.label ? labelId : undefined"
				:aria-label="props.label ? undefined : (attrs['aria-label'] as string | undefined)"
				class="fixed z-50 m-0 list-none divide-y divide-solid divide-slate-200 overflow-x-hidden overflow-y-auto border border-solid border-slate-200 bg-white p-0 font-sans shadow-xl"
				:class="sizeClasses.radius"
				:style="position"
				@mousedown.prevent
			>
				<li
					v-for="(group, at) in groups"
					:key="at"
					:role="group.label === undefined ? 'none' : 'group'"
					:aria-label="group.label"
				>
					<div v-if="group.label !== undefined" aria-hidden="true" class="px-6 pt-4 pb-1 text-2xs font-extrabold text-slate-500">
						{{ group.label }}
					</div>
					<ul role="none" class="m-0 list-none divide-y divide-solid divide-slate-200 p-0">
						<!-- The ring is inset, since the list clips its overflow and would
						     cut off one drawn outside the row. -->
						<li
							v-for="{ option, index } in group.rows"
							:id="`${listId}-${index}`"
							:key="index"
							role="option"
							:aria-selected="index === selectedIndex"
							:aria-disabled="option.disabled ? true : undefined"
							class="flex cursor-pointer items-center justify-between gap-2 px-6 py-4 text-xs font-semibold whitespace-nowrap text-black outline-blue-600 transition-colors active:bg-slate-100"
							:class="[
								index === active ? 'bg-slate-50' : 'bg-white',
								{
									'outline-2 -outline-offset-2': keyed && index === active,
									'pointer-events-none opacity-50': option.disabled,
								},
							]"
							@click="pick(index)"
							@pointermove="point(index)"
						>
							<span class="truncate">{{ option.label }}</span>
							<Icon v-if="index === selectedIndex" name="fa-solid fa-check" />
						</li>
					</ul>
				</li>
			</ul>
		</Teleport>

		<div
			v-if="props.error"
			:id="errorId"
			class="mt-2 flex gap-1.5 px-0.5 text-xs text-rose-800"
		>
			<Icon name="fa-solid fa-circle-exclamation" class="mt-0.5" />
			<div>{{ props.error }}</div>
		</div>

		<div v-if="props.hint" class="mt-2 flex gap-1.5 px-0.5 text-xs text-slate-600">
			<Icon name="fa-solid fa-circle-info" class="mt-0.5" />
			<div>{{ props.hint }}</div>
		</div>
	</div>
</template>
