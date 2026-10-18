<script setup lang="ts">
// Inline rather than an image file, so it scales without a second asset and the
// sheen stays editable. `fill-current`, so the color comes from the wrapper.
defineOptions({
  // The caller's class belongs on the svg, not on the box holding the default.
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    width?: number | string;
    height?: number | string;
    radius?: number | string;
  }>(),
  {
    width: 35,
    height: 32,
    radius: 8,
  },
);

// Shared rather than per-instance: Astro hydrates islands in a different order
// than it renders them, so a counter drifts. The defs are identical, so `url(#…)`
// resolving to the first one is the same gradient either way.
const gradientId = 'voxie-mark-sheen';
</script>

<template>
  <!-- The default color one element up, so a caller's `text-*` lands closer and
	     wins outright rather than by stylesheet order. `contents`, so the box
	     generates none of its own and the layout is unchanged. -->
  <span class="contents text-sky-400">
    <svg
      v-bind="$attrs"
      aria-hidden="true"
      :width="width"
      :height="height"
      viewBox="0 0 35 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="h-auto overflow-visible"
    >
      <rect
        :width="width"
        :height="height"
        :rx="radius"
        class="fill-current"
      />
      <path
        d="M11.2 11.2941L17.4999 22.2059"
        stroke-width="5.68465"
        stroke-linecap="round"
        stroke="white"
      />
      <path
        d="M23.7998 11.2942L23.7999 11.2941"
        stroke-width="6.8"
        stroke-linecap="round"
        stroke="white"
      />
      <path
        d="M8 36V31.0938H14.4701L8 36Z"
        class="fill-current"
      />
    </svg>
  </span>
</template>
