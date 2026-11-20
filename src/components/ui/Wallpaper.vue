<script setup lang="ts">
import Icon from './Icon.vue';

const props = withDefaults(
	defineProps<{
		// The variant and the name, like `fa-solid fa-cube`.
		icon: string;
		// Fade by the nearest ancestor container instead of the wallpaper's own box.
		containerless?: boolean;
		// Pixels between rows, and between icons in a row.
		spaceY?: number;
		spaceX?: number;
		// Pixels every second row shifts toward the end edge.
		offset?: number;
	}>(),
	{ containerless: false, spaceY: 4, spaceX: 8, offset: -20 },
);

const ROWS = 12;
const COLUMNS = 30;

// One icon in ten takes a tint. Hashed from its place, not random, so the server and the client draw the same pattern.
const tints = ['text-amber-200', 'text-violet-200', 'text-emerald-200'];
const tint = (row: number, column: number) =>
	tints[((Math.imul(row * COLUMNS + column, 2654435761) >>> 16) % COLUMNS)] ?? 'text-cyan-100';
</script>

<template>
	<!-- Clips itself to the parent's corners, so the parent doesn't need `overflow-hidden`. -->
	<div
		aria-hidden="true"
		class="absolute inset-0 z-0 flex flex-col items-end justify-center overflow-hidden rounded-[inherit]"
		:class="{ '@container/wallpaper': !props.containerless }"
	>
		<div class="flex flex-col items-end justify-center" :style="{ transform: `translateY(${-props.spaceY / 2}px)` }">
			<div
				v-for="row in ROWS"
				:key="row"
				class="flex"
				:style="{
					columnGap: `${props.spaceX}px`,
					paddingRight: `${props.spaceX}px`,
					marginTop: `${props.spaceY}px`,
					marginRight: row % 2 === 0 ? `${props.offset}px` : 0,
				}"
			>
				<Icon
					v-for="column in COLUMNS"
					:key="column"
					:name="props.icon"
					class="fa-width-auto text-[32px]"
					:class="tint(row, column)"
				/>
			</div>
		</div>
		<!-- Two white fades from the top start corner. The second lets more through as the container widens. -->
		<div class="absolute inset-0 bg-[linear-gradient(140deg,#fff_20%,rgba(255,255,255,0.98)_30%,rgba(255,255,255,0))]"></div>
		<div
			class="absolute inset-0 bg-[linear-gradient(140deg,#fff_20%,rgba(255,255,255,0.8)_80%,rgba(255,255,255,0))]"
			:class="
				props.containerless
					? '@3xl:bg-[linear-gradient(140deg,#fff_20%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0))] @5xl:bg-[linear-gradient(140deg,#fff_30%,rgba(255,255,255,0)_80%)]'
					: '@3xl/wallpaper:bg-[linear-gradient(140deg,#fff_20%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0))] @5xl/wallpaper:bg-[linear-gradient(140deg,#fff_30%,rgba(255,255,255,0)_80%)]'
			"
		></div>
	</div>
</template>
