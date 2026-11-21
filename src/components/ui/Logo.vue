
<script setup lang="ts">
import { computed } from 'vue';
import { bubble, dotPath, dotWidth, leftPath, strokeWidth, tailPath } from './logo';
import { wordmarkBox, wordmarkPaths } from './logoWordmark';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** The mark alone, the mark with the word mark, or the word mark alone. */
    type?: 'mark' | 'full' | 'word-mark';
    /** The word mark's ink: dark for a light background, light for a dark one. */
    appearance?: 'dark' | 'light';
  }>(),
  { type: 'mark', appearance: 'dark' },
);

// Beside the mark the word mark is about half the bubble's height, centered on the bubble and not on the tail.
const wordHeight = 17;
const wordGap = 10;
const wordScale = wordHeight / wordmarkBox.height;
const wordX = bubble.width + wordGap;
const wordY = (bubble.height - wordHeight) / 2;
const wordTransform = `translate(${wordX} ${wordY}) scale(${wordScale}) translate(${-wordmarkBox.x} ${-wordmarkBox.y})`;

// Each type's box at one unit per pixel. The tail hangs below it.
const box = computed(() => {
  if (props.type === 'word-mark') return wordmarkBox;
  const width = props.type === 'full' ? wordX + wordmarkBox.width * wordScale : bubble.width;
  return { x: 0, y: 0, width, height: bubble.height };
});
</script>

<template>
  <span class="contents text-sky-500">
    <span
      v-bind="$attrs"
      aria-hidden="true"
      class="voxie-logo relative inline-block align-middle"
      :style="{ aspectRatio: `${box.width} / ${box.height}`, '--voxie-logo-width': `${box.width}px` }"
    >
      <!-- The body is an element so a rounded-* class on the logo can set its corners. -->
      <span
        v-if="props.type !== 'word-mark'"
        class="absolute inset-y-0 left-0 rounded-[inherit] bg-current"
        :style="{ width: `${(bubble.width / box.width) * 100}%` }"
      />
      <svg
        :viewBox="`${box.x} ${box.y} ${box.width} ${box.height}`"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute inset-0 size-full overflow-visible"
      >
        <template v-if="props.type !== 'word-mark'">
          <path :d="tailPath" class="fill-current" />

          <!-- The symbol is a slot so LogoLoading can draw an animated one in its place. -->
          <slot>
            <!-- Left V segment -->
            <path :d="leftPath" :stroke-width="strokeWidth" stroke-linecap="round" stroke="white" />
            <!-- Separate right dot -->
            <path :d="dotPath" :stroke-width="dotWidth" stroke-linecap="round" stroke="white" />
          </slot>
        </template>

        <g
          v-if="props.type !== 'mark'"
          :transform="props.type === 'full' ? wordTransform : undefined"
          :class="props.appearance === 'light' ? 'fill-white' : 'fill-slate-900'"
        >
          <path v-for="(path, index) in wordmarkPaths" :key="index" :d="path" />
        </g>
      </svg>
    </span>
  </span>
</template>

<style scoped>
@layer components {
  .voxie-logo {
    width: var(--voxie-logo-width);
    /* 8/34 by 8/32. The body inherits it, so the corners are circular on its 34:32 box. */
    border-radius: 23.529411765% / 25%;
  }
}
</style>
