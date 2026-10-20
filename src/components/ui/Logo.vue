<script setup lang="ts">
defineOptions({
  // Keep the default color inherited so caller color classes take precedence.
  inheritAttrs: false,
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
        
        <!-- left v line -->
        <path d="M10.9 11.5L17.4 21.5" stroke-width="5.5" stroke-linecap="round" stroke="white"/>
        <!-- right dot -->
        <path d="M23.6 11.6V11.6" stroke-width="6.7" stroke-linecap="round" stroke="white"/>

      </svg>
    </span>
  </span>
</template>

<style scoped>
@layer components {
  .voxie-logo {
    width: 35px;
    /* Components layer so a rounded-* utility can override the default. */
    border-radius: 25%;
  }
}
</style>
