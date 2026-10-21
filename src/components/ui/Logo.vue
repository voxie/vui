
<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// Bottom vertex of the V.
const middle = { x: 17.5, y: 22 };

// Slope in degrees from vertical.
const angle = 30;
// Length of each arm from the vertex. Length 12 and width 5.5 make a mark about half the size of the container.
const length = 12;
const strokeWidth = 5.5;
// Optical compensation: a round terminal reads lighter than a stroke of the same width, so the dot is drawn heavier
// to look equal. Around 20% is a good starting point.
const dotWidth = strokeWidth * 1.25;
// At zero the dot is centered on the triangle's top-right vertex, so the heavier dot's edges reach past the left
// arm's cap by half the extra weight. Raising this pulls the center straight in and down by that amount, tuned by
// eye against the left cap.
const dotOpticalOffset = 0;

const endpoints = computed(() => {
  const radians = (angle * Math.PI) / 180;

  return {
    left: {
      x: middle.x - length * Math.sin(radians),
      y: middle.y - length * Math.cos(radians),
    },
    right: {
      x: middle.x + length * Math.sin(radians) - dotOpticalOffset,
      y: middle.y - length * Math.cos(radians) + dotOpticalOffset,
    },
  };
});

const leftPath = computed(() => {
  const { left } = endpoints.value;
  return `M${left.x} ${left.y}L${middle.x} ${middle.y}`;
});

// A zero-length path gets dropped by Figma on SVG import, so the dot is a
// hairline starting at the dot position and running down the arm toward the vertex.
const dotSpan = 0.002;

const rightDot = computed(() => {
  const { right } = endpoints.value;
  const radians = (angle * Math.PI) / 180;
  const dx = dotSpan * Math.sin(radians);
  const dy = dotSpan * Math.cos(radians);
  return `M${right.x} ${right.y}L${right.x - dx} ${right.y + dy}`;
});
</script>

<template>
  <span class="contents text-sky-500">
    <span
      v-bind="$attrs"
      aria-hidden="true"
      class="voxie-logo relative inline-block aspect-[35/32] bg-current align-middle"
    >
      <svg
        viewBox="0 0 35 32"
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
    width: 35px;
    /* 8/35 by 8/32 so the percentage corners are circular on the 35:32 body. */
    border-radius: 22.857142857% / 25%;
  }
}
</style>
