<script setup lang="ts">
import { computed, ref } from 'vue';
import Alert from './Alert.vue';
import Button from './Button.vue';

const props = withDefaults(
	defineProps<{
		accept?: string;
		icon?: string;
		validating?: boolean;
		error?: string;
		disabled?: boolean;
	}>(),
	{
		accept: undefined,
		icon: 'fa-file',
		validating: false,
		error: undefined,
		disabled: false,
	},
);

const file = defineModel<File | null>({ default: null });

const emit = defineEmits<{
	select: [file: File];
	remove: [];
	reject: [file: File];
}>();

const input = ref<HTMLInputElement | null>(null);

const dragDepth = ref(0);

const dragging = computed(() => dragDepth.value > 0);

function acceptTokens(): string[] {
	return (props.accept ?? '')
		.split(',')
		.map((token) => token.trim().toLowerCase())
		.filter(Boolean);
}

function matchesToken(candidate: File, token: string): boolean {
	if (token.startsWith('.')) return candidate.name.toLowerCase().endsWith(token);
	if (token.endsWith('/*')) return candidate.type.toLowerCase().startsWith(token.slice(0, -1));
	return candidate.type.toLowerCase() === token;
}

function isAccepted(candidate: File): boolean {
	const tokens = acceptTokens();
	return tokens.length === 0 || tokens.some((token) => matchesToken(candidate, token));
}

function choose(candidate: File | undefined): void {
	if (!candidate) return;

	if (!isAccepted(candidate)) {
		emit('reject', candidate);
		return;
	}

	file.value = candidate;
	emit('select', candidate);
}

function onDragEnter(): void {
	if (props.disabled) return;
	dragDepth.value += 1;
}

function onDragLeave(): void {
	dragDepth.value = Math.max(0, dragDepth.value - 1);
}

function onDrop(event: DragEvent): void {
	dragDepth.value = 0;
	if (props.disabled) return;
	choose(event.dataTransfer?.files[0]);
}

function onChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	choose(target.files?.[0]);
	target.value = '';
}

function remove(): void {
	file.value = null;
	emit('remove');
}

function open(): void {
	if (!props.disabled) input.value?.click();
}

defineExpose({ open });

const zoneClasses = computed(() => {
	if (props.disabled) return 'cursor-not-allowed border-slate-300 bg-slate-100 opacity-60';
	if (dragging.value) return 'cursor-pointer border-sky-500 bg-white';
	return 'cursor-pointer border-slate-300 bg-slate-100';
});
</script>

<template>
	<label
		v-if="!file"
		class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center font-sans text-sm text-slate-700 outline-blue-600 transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
		:class="zoneClasses"
		@dragenter.prevent="onDragEnter"
		@dragover.prevent
		@dragleave.prevent="onDragLeave"
		@drop.prevent="onDrop"
	>
		<input
			ref="input"
			type="file"
			class="absolute inset-0 size-full cursor-[inherit] opacity-0"
			:accept="props.accept"
			:disabled="props.disabled"
			@change="onChange"
		/>

		<!-- Keyed, so a new icon mounts a new <i> for the kit to pick up. -->
		<span :key="props.icon" class="contents">
			<i aria-hidden="true" class="fa-solid text-5xl text-sky-400" :class="props.icon"></i>
		</span>
		<span class="mt-3 block font-semibold">
			<slot name="title">Drag a file here</slot>
		</span>
		<span class="mt-2 mb-3 block text-slate-500">or</span>
		<Button
			color="sky"
			size="sm"
			tabindex="-1"
			aria-hidden="true"
			class="pointer-events-none"
		>
			<slot name="browse">Browse computer</slot>
			<i
				aria-hidden="true"
				class="fa-solid fa-file-medical"
			></i>
		</Button>
	</label>

	<div
		v-else
		class="space-y-4 font-sans"
	>
		<div class="relative flex items-center gap-4 rounded-2xl bg-white p-4">
			<span :key="props.icon" class="contents">
				<i aria-hidden="true" class="fa-solid text-5xl text-slate-400" :class="props.icon"></i>
			</span>
			<div class="text-lg break-all text-slate-500">{{ file.name }}</div>
			<button
				type="button"
				aria-label="Remove file"
				class="absolute -end-4 -top-4 grid size-9 cursor-pointer appearance-none place-items-center rounded-full border-[5px] border-solid border-slate-50 bg-rose-400 p-0 outline-blue-600 transition hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2"
				@click="remove"
			>
				<i
					aria-hidden="true"
					class="fa-solid fa-trash text-sm text-white"
				></i>
			</button>
		</div>

		<Alert
			v-if="props.validating"
			color="sky"
			:dismissible="false"
		>
			Validating...
		</Alert>
		<Alert
			v-else-if="props.error"
			color="rose"
			:dismissible="false"
			class="wrap-anywhere"
		>
			{{ props.error }}
		</Alert>
		<Alert
			v-else-if="$slots.default"
			color="sky"
			:dismissible="false"
		>
			<slot />
		</Alert>
	</div>
</template>
