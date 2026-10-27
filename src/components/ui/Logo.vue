
<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// Bubble size. A mathematically square 32 bubble reads too tall, so it is slightly wider.
const bubble = { width: 34, height: 32 };

// Slope in degrees from vertical.
const angle = 33;
// Length of each arm from the vertex. Length 12 and width 6 make a mark about half the size of the container.
const length = 12;
const strokeWidth = 6;
// Optical compensation: a round terminal reads lighter than a stroke of the same width, so the dot is drawn heavier
// to look equal.
const dotWidth = strokeWidth * 1.2;
// The heavier dot overshoots the arm's cap, so its center is pulled slightly in and down.
const dotOpticalOffset = 0.1;
// The wide top of the V carries more visual weight, so the mark sits a touch below the bubble's center.
const verticalShift = 0.7;

const radians = (angle * Math.PI) / 180;
const dx = length * Math.sin(radians);
const dy = length * Math.cos(radians);

// Bottom vertex of the V, centered horizontally with the arm centered vertically, then shifted down.
const middle = { x: bubble.width / 2, y: bubble.height / 2 + verticalShift + dy / 2 };

const endpoints = computed(() => ({
  left: {
    x: middle.x - dx,
    y: middle.y - dy,
  },
  right: {
    x: middle.x + dx - dotOpticalOffset,
    y: middle.y - dy + dotOpticalOffset,
  },
}));

const leftPath = computed(() => {
  const { left } = endpoints.value;
  return `M${left.x} ${left.y}L${middle.x} ${middle.y}`;
});

// A zero-length path gets dropped by Figma on SVG import, so the dot is a
// hairline starting at the dot position and running down the arm toward the vertex.
const dotSpan = 0.002;

const rightDot = computed(() => {
  const { right } = endpoints.value;
  const sx = dotSpan * Math.sin(radians);
  const sy = dotSpan * Math.cos(radians);
  return `M${right.x} ${right.y}L${right.x - sx} ${right.y + sy}`;
});
</script>

<template>
  <span class="contents text-sky-500">
    <span
      v-bind="$attrs"
      aria-hidden="true"
      class="voxie-logo relative inline-block aspect-[34/32] bg-current align-middle"
    >
      <svg
        :viewBox="`0 0 ${bubble.width} ${bubble.height}`"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute inset-0 size-full overflow-visible"
      >

        <!-- tail -->
        <path
          d="M8 36V24H23.825L8 36Z"
          class="fill-current"
        />

        <!-- Left V segment -->
        <path
          :d="leftPath"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          stroke="white"
        />

        <!-- Separate right dot -->
        <path
          :d="rightDot"
          :stroke-width="dotWidth"
          stroke-linecap="round"
          stroke="white"
        />
      </svg>
    </span>
  </span>
</template>

<style scoped>
@layer components {
  .voxie-logo {
    width: 34px;
    /* 8/34 by 8/32 so the percentage corners are circular on the 34:32 body. */
    border-radius: 23.529411765% / 25%;
  }
}
</style>
