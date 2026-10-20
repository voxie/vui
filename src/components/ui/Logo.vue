
<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// Bottom vertex
const middle = { x: 17.4, y: 21.5 };

// Segment configuration
const length = 11.5;
// Golden-ratio slope
const angle = 31.72; // Degrees from vertical

// Stroke weights
const strokeWidth = 5.5;
// Optical compensation: a round terminal reads lighter than a stroke of the
// same width, so the dot is drawn ~20% heavier to look equal.
const dotWidth = strokeWidth * 1.22;
// The heavier dot's edge would reach past the left arm's cap by half the extra
// weight, so its center is pulled in along the arm by that much. A full circle
// aligned exactly still reads short, like an o on a baseline, so it overshoots
// by about 2% of the mark's height.
const dotOvershoot = 0.4;
const dotInset = (dotWidth - strokeWidth) / 2 - dotOvershoot;

const endpoints = computed(() => {
  const radians = (angle * Math.PI) / 180;

  const dotLength = length - dotInset;

  return {
    left: {
      x: middle.x - length * Math.sin(radians),
      y: middle.y - length * Math.cos(radians),
    },
    right: {
      x: middle.x + dotLength * Math.sin(radians),
      y: middle.y - dotLength * Math.cos(radians),
    },
  };
});

const leftPath = computed(() => {
  const { left } = endpoints.value;
  return `M${left.x} ${left.y}L${middle.x} ${middle.y}`;
});

// A zero-length path gets dropped by Figma on SVG import, so the dot is a
// hairline starting at the dot position and running down the arm toward the vertex.
const dotSpan = 3;

const rightDot = computed(() => {
  const { right } = endpoints.value;
  const radians = (angle * Math.PI) / 180;
  const dx = dotSpan * Math.sin(radians);
  const dy = dotSpan * Math.cos(radians);
  return `M${right.x} ${right.y}L${right.x - dx} ${right.y + dy}`;
});
</script>

<template>
  <span class="contents text-sky-400">
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
    border-radius: 25%;
  }
}
</style>
