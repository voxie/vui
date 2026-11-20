
<script setup lang="ts">
import { bubble, dotPath, dotWidth, leftPath, strokeWidth, tailPath } from './logo';

defineOptions({
  inheritAttrs: false,
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

        <path :d="tailPath" class="fill-current" />

        <!-- The symbol is a slot so LogoLoading can draw an animated one in its place. -->
        <slot>
          <!-- Left V segment -->
          <path :d="leftPath" :stroke-width="strokeWidth" stroke-linecap="round" stroke="white" />
          <!-- Separate right dot -->
          <path :d="dotPath" :stroke-width="dotWidth" stroke-linecap="round" stroke="white" />
        </slot>
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
