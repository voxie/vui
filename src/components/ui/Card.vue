<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    content: string;
    surface?: 'base' | 'glass' | 'glassRaised' | 'layered' | 'sunken' | 'dark';
  }>(),
  { surface: 'base' },
);

const surfaceClasses: Record<string, string> = {
  base: 'bg-white shadow-sm',
  glass: 'bg-slate-50 border border-white shadow-sm',
  glassRaised: 'bg-white/80 border border-white shadow-2xl backdrop-blur-lg',
  layered: 'bg-white shadow-lg',
  sunken: 'bg-slate-300/30 shadow-inner border-b border-b-white',
  dark: 'bg-slate-600 text-slate-100',
};

const cardClass = computed(() => `rounded-2xl p-6 ${surfaceClasses[props.surface]}`);
</script>

<template>
  <div :class="surface === 'layered' ? 'p-10 pl-0 pt-0 relative' : ''">
    <div
      :class="cardClass"
      class="relative"
    >
      {{ content }}
    </div>

    <div
      v-if="surface === 'layered'"
      class="absolute -z-10 inset-5 bg-white/80 backdrop-blur-lg border border-white rounded-2xl shadow-lg"
    ></div>
    <div
      v-if="surface === 'layered'"
      class="absolute -z-20 inset-5 translate-5 bg-sky-300 rounded-2xl"
    ></div>
  </div>
</template>
