<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useControlBoundary, type Surface } from './surface.ts';
import CharCounter from './CharCounter.vue';

type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type InputType =
	| 'text'
	| 'password'
	| 'number'
	| 'email'
	| 'tel'
	| 'url'
	| 'search'
	| 'time'
	| 'date'
	| 'datetime-local';

// Attrs like `id`, `name` and `placeholder` belong on the field, not on the
// wrapper that positions the slots around it.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		type?: InputType;
		size?: InputSize;
		// What the input is sitting on. Left off, it's taken from the nearest Card
		// or Navbar. Pass it on the page background, which has no component to
		// announce it.
		sitsOn?: Surface;
		// One message or several. Present means the field is in error.
		error?: string | string[];
		hint?: string;
		disabled?: boolean;
		// Passing `rows` at all makes it a textarea, and `rows` is the height it
		// starts at. A textarea grows with its content, so this is a floor.
		rows?: number;
		maxHeight?: string | number;
		togglePassword?: boolean;
		counter?: boolean;
		maxlength?: string | number;
		minlength?: string | number;
		minlengthWarning?: number;
		// Numeric bounds, for `type="number"`.
		min?: number;
		max?: number;
		step?: number;
	}>(),
	{
		type: 'text',
		size: 'md',
		disabled: false,
		togglePassword: false,
		counter: false,
		step: 1,
	},
);

const slots = defineSlots<{
	// A fixed label pinned to the start of the field, such as a currency or a
	// protocol.
	box?: () => unknown;
	left?: () => unknown;
	right?: () => unknown;
	error?: () => unknown;
	hint?: () => unknown;
}>();

const model = defineModel<string | number | null>();

const boundary = useControlBoundary(() => props.sitsOn);

const errorId = useId();

const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const box = ref<HTMLElement | null>(null);
const leftSlot = ref<HTMLElement | null>(null);
const rightSlot = ref<HTMLElement | null>(null);
const focused = ref(false);

const isTextarea = computed(() => props.rows !== undefined);
const isNumeric = computed(() => props.type === 'number');

// Safari won't vertically center the value of a date or time input unless the
// field is a flex container.
const isDateTime = computed(
	() => !isTextarea.value && ['time', 'date', 'datetime-local'].includes(props.type),
);

const errors = computed(() => {
	if (!props.error) return [];
	return Array.isArray(props.error) ? props.error : [props.error];
});

// Padding is in pixels because the slot widths are measured, and the two have
// to add up.
const sizeClasses = computed(() => {
	if (props.size === 'xs')
		return { field: 'rounded-lg text-xs', height: 'h-6', rows: 'py-[3.5px]', box: 'w-9 rounded-s-lg text-xs', boxWidth: 36, start: 'start-2', end: 'end-2', padding: 8, padY: 3.5 };
	if (props.size === 'sm')
		return { field: 'rounded-lg text-xs', height: 'h-8', rows: 'py-[7.5px]', box: 'w-10 rounded-s-lg text-xs', boxWidth: 40, start: 'start-3', end: 'end-3', padding: 12, padY: 7.5 };
	if (props.size === 'lg')
		return { field: 'rounded-xl text-sm', height: 'h-12', rows: 'py-[14.25px]', box: 'w-14 rounded-s-xl text-sm', boxWidth: 56, start: 'start-5', end: 'end-5', padding: 20, padY: 14.25 };
	if (props.size === 'xl')
		return { field: 'rounded-2xl text-base', height: 'h-16', rows: 'py-[21px]', box: 'w-16 rounded-s-2xl text-base', boxWidth: 64, start: 'start-8', end: 'end-8', padding: 32, padY: 21 };
	return { field: 'rounded-xl text-sm', height: 'h-10', rows: 'py-[10.25px]', box: 'w-12 rounded-s-xl text-sm', boxWidth: 48, start: 'start-4', end: 'end-4', padding: 16, padY: 10.25 };
});

// Whatever is in a slot decides how far the value has to start or stop, so the
// widths are measured once the slot is in the DOM. The fallbacks are the width
// of a single icon, which is what a server render has to go on.
const ICON_WIDTH = 16;

const paddingStart = computed(() => {
	const base = sizeClasses.value.padding;
	if (slots.box) return (box.value?.clientWidth || sizeClasses.value.boxWidth) + base / 2;
	if (slots.left) return base + (leftSlot.value?.clientWidth || ICON_WIDTH) + 8;
	return base;
});

const paddingEnd = computed(() => {
	const base = sizeClasses.value.padding;
	const hasRight = slots.right || isNumeric.value || (props.type === 'password' && props.togglePassword);
	if (hasRight) return base + (rightSlot.value?.clientWidth || ICON_WIDTH + 8) + 8;
	return base;
});

// `field-sizing: content` sizes the field to what's in it and ignores `rows`,
// so the row count has to come back as a floor. 1.25em is `leading-tight`. The
// vertical padding is set so one row comes out at the height an input of the
// same size has, which is why it lands on half pixels.
const minHeightStyle = computed(() => {
	if (!isTextarea.value) return undefined;
	const { padY } = sizeClasses.value;
	return `calc(${props.rows} * 1.25em + ${padY * 2 + 2}px)`;
});

const maxHeightStyle = computed(() => {
	if (!props.maxHeight) return undefined;
	return typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
});

const showPassword = ref(false);

const inputType = computed(() => {
	if (props.type === 'password') return showPassword.value ? 'text' : 'password';
	// Numeric runs as a text field, so the value can be sanitized as it's typed
	// and the browser's own spinner stays out of the way.
	return isNumeric.value ? 'text' : props.type;
});

const decimalPlaces = computed(() => {
	const step = String(props.step);
	const dot = step.indexOf('.');
	return dot === -1 ? 0 : step.length - dot - 1;
});

const allowNegative = computed(() => props.min === undefined || props.min < 0);

const inputPattern = computed(() => {
	if (!isNumeric.value) return undefined;
	const negative = allowNegative.value ? '-?' : '';
	return decimalPlaces.value === 0
		? `${negative}[0-9]*`
		: `${negative}[0-9]*[.]?[0-9]{0,${decimalPlaces.value}}`;
});

const numericValue = computed(() => parseFloat(String(model.value)) || 0);
const incrementDisabled = computed(
	() => isNumeric.value && props.max !== undefined && numericValue.value >= props.max,
);
const decrementDisabled = computed(
	() => isNumeric.value && props.min !== undefined && numericValue.value <= props.min,
);

const clamp = (value: number) => {
	let result = value;
	if (props.min !== undefined) result = Math.max(props.min, result);
	if (props.max !== undefined) result = Math.min(props.max, result);
	return result;
};

const step = (direction: 1 | -1) => {
	const next = clamp(
		parseFloat((numericValue.value + direction * props.step).toFixed(decimalPlaces.value)),
	);
	model.value = next.toFixed(decimalPlaces.value);
};

const sanitizeNumeric = (value: string) => {
	let str = value.replace(/,/g, '');
	if (decimalPlaces.value === 0) {
		str = str.replace(allowNegative.value ? /[^0-9-]/g : /[^0-9]/g, '');
	} else {
		str = str.replace(allowNegative.value ? /[^0-9.-]/g : /[^0-9.]/g, '');
		const dot = str.indexOf('.');
		if (dot !== -1) {
			str = str.slice(0, dot + 1) + str.slice(dot + 1).replace(/\./g, '');
			str = str.slice(0, dot + 1 + decimalPlaces.value);
		}
	}
	// A minus sign only counts at the start.
	if (allowNegative.value && str.includes('-')) {
		const leading = str.startsWith('-');
		str = str.replace(/-/g, '');
		if (leading) str = `-${str}`;
	}
	return str;
};

const onInput = (event: Event) => {
	const target = event.target as HTMLInputElement | HTMLTextAreaElement;
	if (!isNumeric.value) {
		model.value = target.value;
		return;
	}
	const sanitized = sanitizeNumeric(target.value);
	target.value = sanitized;
	model.value = sanitized;
};

// Clamping and padding to the step's decimals happen on blur, so the value
// isn't rewritten under someone mid-keystroke.
const onBlur = () => {
	focused.value = false;
	if (!isNumeric.value) return;
	const raw = String(model.value ?? '');
	const parsed = parseFloat(raw);
	if (isNaN(parsed)) {
		if (raw !== '') model.value = '';
		return;
	}
	const formatted = clamp(parsed).toFixed(decimalPlaces.value);
	if (formatted !== raw) model.value = formatted;
};

const onKeydown = (event: KeyboardEvent) => {
	if (!isNumeric.value) return;
	if (event.key === 'ArrowUp') {
		event.preventDefault();
		step(1);
	} else if (event.key === 'ArrowDown') {
		event.preventDefault();
		step(-1);
	}
};

const toggleShowPassword = () => {
	showPassword.value = !showPassword.value;
	field.value?.focus();
};

defineExpose({
	field,
	focus: () => field.value?.focus(),
});
</script>

<template>
	<div>
		<div class="relative">
			<div
				v-if="slots.box"
				ref="box"
				class="absolute flex h-full items-center justify-center border border-solid bg-slate-100 font-sans text-slate-600"
				:class="[sizeClasses.box, props.error ? 'border-rose-300' : boundary.border]"
			>
				<slot name="box" />
			</div>

			<component
				:is="isTextarea ? 'textarea' : 'input'"
				ref="field"
				v-bind="$attrs"
				:value="model"
				:type="isTextarea ? undefined : inputType"
				:rows="isTextarea ? props.rows : undefined"
				:inputmode="isNumeric ? (decimalPlaces === 0 ? 'numeric' : 'decimal') : undefined"
				:pattern="inputPattern"
				:disabled="props.disabled"
				:maxlength="props.counter ? undefined : props.maxlength"
				:minlength="props.counter ? undefined : props.minlength"
				:aria-invalid="errors.length ? true : undefined"
				:aria-describedby="errors.length ? errorId : undefined"
				class="w-full appearance-none border border-solid bg-white font-sans leading-tight outline-blue-600 transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-none disabled:hover:shadow-none"
				:class="[
					sizeClasses.field,
					boundary.shadow,
					isTextarea ? sizeClasses.rows : sizeClasses.height,
					isDateTime ? 'flex' : 'block',
					isTextarea && !props.maxHeight ? 'max-h-[50vh]' : '',
					// The drag handle is the fallback for a browser that can't size the
					// field itself.
					isTextarea
						? 'overflow-auto resize-y supports-[field-sizing:content]:field-sizing-content supports-[field-sizing:content]:resize-none'
						: '',
					props.error ? 'border-rose-300 text-rose-600' : `${boundary.border} text-slate-900`,
				]"
				:style="{
					paddingInlineStart: `${paddingStart}px`,
					paddingInlineEnd: `${paddingEnd}px`,
					minHeight: minHeightStyle,
					maxHeight: maxHeightStyle,
				}"
				@input="onInput"
				@keydown="onKeydown"
				@focus="focused = true"
				@blur="onBlur"
			/>

			<div
				v-if="slots.left && !slots.box"
				ref="leftSlot"
				class="pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center text-slate-500"
				:class="sizeClasses.start"
			>
				<slot name="left" />
			</div>

			<div
				v-if="slots.right || isNumeric || (props.type === 'password' && props.togglePassword)"
				ref="rightSlot"
				class="absolute top-1/2 flex -translate-y-1/2 items-center gap-1 text-slate-500"
				:class="sizeClasses.end"
			>
				<slot name="right" />

				<button
					v-if="props.type === 'password' && props.togglePassword"
					type="button"
					:aria-label="showPassword ? 'Hide password' : 'Show password'"
					class="grid h-6 w-6 cursor-pointer place-items-center rounded-md bg-transparent text-xs text-slate-500 outline-blue-600 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2"
					@mousedown.prevent
					@click="toggleShowPassword"
				>
					<i aria-hidden="true" class="fa-solid" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
				</button>

				<!-- Held in the layout while it's hidden, so the field's padding
				     doesn't jump when it appears. The arrow keys do the same job. -->
				<div
					v-if="isNumeric && !slots.right"
					class="flex flex-col transition"
					:class="focused ? '' : 'pointer-events-none opacity-0'"
				>
					<button
						v-for="direction in [1, -1] as const"
						:key="direction"
						type="button"
						tabindex="-1"
						:aria-label="direction === 1 ? 'Increase value' : 'Decrease value'"
						:disabled="direction === 1 ? incrementDisabled : decrementDisabled"
						class="grid h-3.5 w-5 cursor-pointer place-items-center rounded bg-white text-2xs text-slate-800"
						:class="
							(direction === 1 ? incrementDisabled : decrementDisabled)
								? 'pointer-events-none opacity-40'
								: 'hover:bg-slate-100'
						"
						@mousedown.prevent
						@click="step(direction)"
					>
						<i
							aria-hidden="true"
							class="fa-solid"
							:class="direction === 1 ? 'fa-chevron-up' : 'fa-chevron-down'"
						></i>
					</button>
				</div>
			</div>
		</div>

		<div v-if="props.counter && props.maxlength" class="mt-2 px-0.5">
			<CharCounter
				:content="String(model ?? '')"
				:max="Number(props.maxlength)"
				:min="props.minlength === undefined ? undefined : Number(props.minlength)"
				:min-warning="props.minlengthWarning"
				:muted="!focused"
			/>
		</div>

		<div v-if="slots.error || errors.length" :id="errorId" class="mt-2 px-0.5 text-xs text-rose-800">
			<slot name="error" />
			<div v-for="message in errors" :key="message">{{ message }}</div>
		</div>

		<div v-if="slots.hint || props.hint" class="mt-2 px-0.5 text-xs text-slate-600">
			<slot name="hint" />
			{{ props.hint }}
		</div>
	</div>
</template>
