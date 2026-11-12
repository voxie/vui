<script setup lang="ts">
import { useSlots } from 'vue';

const props = withDefaults(
	defineProps<{
		layout?: 'base' | 'grid' | 'create' | 'sidebar';
		// The cap on the content width. `full` drops it.
		size?: 'xl' | '2xl' | 'full';
		title?: string;
		description?: string;
	}>(),
	{ layout: 'base', size: 'xl', title: undefined, description: undefined },
);

const slots = useSlots();

// Functions, not computed: `slots` isn't reactive, so a computed would miss a
// slot the caller gates with `v-if`.
const hasTitle = () => !!props.title || !!slots.title;
const hasDescription = () => !!props.description || !!slots.description;
const hasHeader = () => hasTitle() || hasDescription() || !!slots.subtitle || !!slots.actions;
</script>

<template>
	<div
		class="mx-auto flex flex-col px-4 pb-6 text-slate-700 sm:px-6 md:pb-32"
		:class="{
			'container max-w-(--breakpoint-xl) 2xl:px-0': size === 'xl',
			'container max-w-(--breakpoint-2xl)': size === '2xl',
			'w-full': size === 'full',
		}"
	>
		<div v-if="slots.callout" class="mb-4 md:mb-6">
			<slot name="callout" />
		</div>

		<div
			v-if="hasHeader()"
			class="mb-4 flex flex-wrap items-center gap-4 sm:flex-nowrap md:mb-6 md:min-h-12"
			:class="layout === 'create' ? 'justify-center text-center' : 'justify-between'"
		>
			<div class="flex min-w-0 flex-col justify-center gap-2">
				<span v-if="slots.subtitle" class="text-slate-400">
					<slot name="subtitle" />
				</span>
				<h1
					v-if="hasTitle()"
					class="text-2xl leading-tight font-extrabold text-slate-800 xl:text-3xl"
				>
					<slot name="title">{{ title }}</slot>
				</h1>
				<p v-if="hasDescription()" class="leading-tight text-slate-700">
					<slot name="description">{{ description }}</slot>
				</p>
			</div>
			<div v-if="slots.actions" class="flex grow items-center justify-end gap-2">
				<slot name="actions" />
			</div>
		</div>

		<div v-if="layout === 'base'">
			<slot />
		</div>

		<div v-else-if="layout === 'grid'" class="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
			<slot />
		</div>

		<div
			v-else-if="layout === 'create'"
			class="flex flex-col items-center gap-4 md:gap-6 xl:gap-8"
		>
			<slot />
		</div>

		<div v-else-if="layout === 'sidebar'" class="flex flex-col gap-4 md:flex-row md:gap-6 2xl:gap-8">
			<aside class="flex flex-col pb-3 md:w-48 md:shrink-0 lg:w-64">
				<slot name="sidebar" />
			</aside>
			<div class="flex min-w-0 flex-1 flex-col gap-4 md:gap-6 xl:gap-8">
				<slot />
			</div>
		</div>
	</div>
</template>
