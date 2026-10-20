
<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// Bottom vertex
const middle = { x: 17.4, y: 21.5 };

// Segment configuration
const length = 11.5;
const angle = 33; // Degrees from vertical

const endpoints = computed(() => {
  const radians = (angle * Math.PI) / 180;

  const dx = length * Math.sin(radians);
  const dy = length * Math.cos(radians);

  return {
    left: {
      x: middle.x - dx,
      y: middle.y - dy,
    },
    right: {
      x: middle.x + dx,
      y: middle.y - dy,
    },
  };
});

const leftPath = computed(() => {
  const { left } = endpoints.value;
  return `M${left.x} ${left.y}L${middle.x} ${middle.y}`;
});

const rightDot = computed(() => {
  const { right } = endpoints.value;
  return `M${right.x} ${right.y}V${right.y}`;
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
          stroke-width="5.5"
          stroke-linecap="round"
          stroke="white"
        />

        <!-- Separate right dot -->
        <path
          :d="rightDot"
          stroke-width="6.7"
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
