<script setup lang="ts">
import { computed } from 'vue';
import { provideSurface, type Surface } from './surface.ts';

// Classes from the caller belong on the card itself, not on the wrapper that
// only the layered surface needs.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		surface?: 'default' | 'glass' | 'glassRaised' | 'layered' | 'sunken' | 'dark';
		padding?: 'none' | 'compact' | 'default' | 'spacious';
		/*
		  The tag the card renders as. A card is a box, not a meaning, so reach
		  for `section` or `article` when the content is a landmark or stands on
		  its own. Left as a plain string rather than a union so callers aren't
		  blocked on this list growing.
		*/
		as?: string;
	}>(),
	{ surface: 'default', padding: 'default', as: 'div' },
);

const surfaceClasses: Record<string, string> = {
  default: 'bg-white shadow-sm',
  glass: 'bg-slate-50 border border-white shadow-sm',
  glassRaised: 'bg-white/80 border border-white shadow-2xl backdrop-blur-lg',
  layered: 'bg-white shadow-lg',
  sunken: 'bg-slate-300/30 shadow-inner border-b border-b-white',
  dark: 'bg-slate-700 text-slate-100',
};

/*
  What the card hands to everything inside it, which isn't always what the card
  is. Four of the six surfaces are themselves. The two composites aren't: a
  `glassRaised` card is a white panel over glass, and a `layered` one is a plain
  white card in front of its stack, so a button in either sits on what it can
  actually see rather than on the name of the effect.
*/
const childSurface: Record<string, Surface> = {
  default: 'default',
  glass: 'glass',
  glassRaised: 'glass',
  layered: 'default',
  sunken: 'sunken',
  dark: 'dark',
};

provideSurface(() => childSurface[props.surface]);

const paddingClasses: Record<string, string> = {
  none: '',
  compact: 'p-4',
  default: 'p-6',
  spacious: 'p-8'
};

const cardClass = computed(
  () => `rounded-2xl ${paddingClasses[props.padding]} ${surfaceClasses[props.surface]}`,
);
</script>

<template>
  <!-- The layered wrapper stays a div: it only exists to position the stack,
       so the semantic tag goes on the card that holds the content. -->
  <div v-if="surface === 'layered'" class="p-10 pl-0 pt-0 relative">
    <component
      :is="as"
      :class="cardClass"
      class="relative"
      v-bind="$attrs"
    >
      <slot />
    </component>

    <div
      class="absolute -z-10 inset-5 bg-white/80 backdrop-blur-lg border border-white rounded-2xl shadow-lg"
    ></div>
    <div
      class="absolute -z-20 inset-5 translate-5 bg-sky-300 rounded-2xl"
    ></div>
  </div>

  <component
    :is="as"
    v-else
    :class="cardClass"
    class="relative"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
