<script setup lang="ts">
defineOptions({
  // Keep the default color inherited so caller color classes take precedence.
  inheritAttrs: false,
});

defineProps<{
  radius?: number | string;
}>();
</script>

<template>
  <span class="contents text-sky-400">
    <span
      v-bind="$attrs"
      aria-hidden="true"
      class="voxie-mark relative inline-block aspect-[35/32] bg-current align-middle"
      :style="{ borderRadius: radius == null ? '22.857142857% / 25%' : `${radius}px` }"
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
      </svg>
    </span>
  </span>
</template>

<style scoped>
@layer components {
  .voxie-mark {
    width: 35px;
  }
}
</style>
