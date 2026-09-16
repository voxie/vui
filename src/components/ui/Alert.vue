<script setup lang="ts">
import { computed } from 'vue';
import { provideSurface, useSurface, type Surface } from './surface.ts';
import Button from './Button.vue';

// The five accents, which carry the meanings Color documents, plus slate.
type AlertColor = 'sky' | 'teal' | 'amber' | 'rose' | 'violet' | 'slate';

const props = withDefaults(
  defineProps<{
    color?: AlertColor;
    // Swaps the tinted fill and border for slate and keeps the color on the
    // text and icon. For a message that shouldn't shout.
    calm?: boolean;
    // What the alert is on, for the one surface no component can announce.
    sitsOn?: Surface;
    // Off, the close button goes and the alert stays until its parent removes it.
    dismissible?: boolean;
  }>(),
  {
    color: 'sky',
    calm: false,
    sitsOn: undefined,
    dismissible: true,
  },
);

// Unbound, the alert manages its own visibility. Bound, the parent can bring
// it back.
const open = defineModel<boolean>({ default: true });

const emit = defineEmits<{ close: [] }>();

// The label tint from Color: a 100 fill, a 900 label, a 300 border, a 500 icon.
// Split by part so `calm` and the surface can each swap what they own.
const fillClasses: Record<AlertColor, string> = {
  sky: 'bg-sky-100',
  teal: 'bg-teal-100',
  amber: 'bg-amber-100',
  rose: 'bg-rose-100',
  violet: 'bg-violet-100',
  slate: 'bg-slate-100',
};

const borderClasses: Record<AlertColor, string> = {
  sky: 'border-sky-300',
  teal: 'border-teal-300',
  amber: 'border-amber-300',
  rose: 'border-rose-300',
  violet: 'border-violet-300',
  slate: 'border-slate-300',
};

// On the page background and the dark panel a shadow does the separating, and
// the border drops to the 50 of the fill so it reads as an edge, not an outline.
const shadowBorderClasses: Record<AlertColor, string> = {
  sky: 'border-sky-50',
  teal: 'border-teal-50',
  amber: 'border-amber-50',
  rose: 'border-rose-50',
  violet: 'border-violet-50',
  slate: 'border-slate-50',
};

const textClasses: Record<AlertColor, string> = {
  sky: 'text-sky-900',
  teal: 'text-teal-900',
  amber: 'text-amber-900',
  rose: 'text-rose-900',
  violet: 'text-violet-900',
  slate: 'text-slate-900',
};

// On the slate fill the 900 loses its tint, so calm text goes one step darker.
const calmTextClasses: Record<AlertColor, string> = {
  sky: 'text-sky-950',
  teal: 'text-teal-950',
  amber: 'text-amber-950',
  rose: 'text-rose-950',
  violet: 'text-violet-950',
  slate: 'text-slate-950',
};

const iconClasses: Record<AlertColor, string> = {
  sky: 'text-sky-500',
  teal: 'text-teal-500',
  amber: 'text-amber-500',
  rose: 'text-rose-500',
  violet: 'text-violet-500',
  slate: 'text-slate-500',
};

const surface = useSurface(() => props.sitsOn);

// What a button in the `actions` slot sees. A slate-100 fill is close enough to
// the page that a slate button needs the sunken step to show; a tint reads as glass.
provideSurface(() => (props.calm || props.color === 'slate' ? 'sunken' : 'glass'));

// Slate-200 or darker. A panel lighter than that gets the border only.
const shadow = computed(() => surface.value === 'background' || surface.value === 'dark');

const border = computed(() => {
  if (shadow.value) return props.calm ? 'border-slate-50' : shadowBorderClasses[props.color];
  return props.calm ? 'border-slate-200' : borderClasses[props.color];
});

// A description makes the alert a block, and drops to the 800 to sit under the title.
const bodyClasses: Record<AlertColor, string> = {
  sky: 'text-sky-800',
  teal: 'text-teal-800',
  amber: 'text-amber-800',
  rose: 'text-rose-800',
  violet: 'text-violet-800',
  slate: 'text-slate-800',
};

const slots = defineSlots<{
  icon?: () => unknown;
  default?: () => unknown;
  description?: () => unknown;
  actions?: () => unknown;
}>();

const hasDescription = computed(() => Boolean(slots.description));

// An action button makes the header row 32px tall, so the description takes a
// bottom margin to balance the space it opens above.
const hasActions = computed(() => Boolean(slots.actions));

const classes = computed(() => [
  props.calm ? 'bg-slate-100' : fillClasses[props.color],
  border.value,
  props.calm ? calmTextClasses[props.color] : textClasses[props.color],
  shadow.value ? 'shadow' : '',
]);

function close(): void {
  open.value = false;
  emit('close');
}
</script>

<template>
  <!-- Three columns: icon, message, buttons. The description starts in the
       message column, so it lines up with the title whatever the icon's width. -->
  <div
    v-if="open"
    role="alert"
    class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-2xl border border-solid p-4 font-sans text-sm"
    :class="classes"
  >
    <div
      class="flex items-center"
      :class="iconClasses[props.color]"
    >
      <slot name="icon">
        <i
          aria-hidden="true"
          class="fa-solid fa-circle-exclamation"
        ></i>
      </slot>
    </div>

    <!-- The message, which is the title once there is a description under it. -->
    <div class="leading-none">
      <slot />
    </div>

    <div class="flex items-center gap-0.5">
      <div
        v-if="$slots.actions"
        class="flex items-center gap-2"
      >
        <slot name="actions" />
      </div>

      <!-- The same button Modal closes with. It reads the surface the alert provides.
           Multiply sinks its hover fill into the tint; on slate the grey already matches. -->
      <Button
        v-if="props.dismissible"
        color="transparent"
        size="sm"
        aria-label="Dismiss"
        :class="{ 'mix-blend-multiply': props.color !== 'slate' }"
        @click="close"
      >
        <i
          aria-hidden="true"
          class="fa-solid fa-xmark"
        ></i>
      </Button>
    </div>

    <div
      v-if="hasDescription"
      class="col-span-2 col-start-2 mt-2 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5"
      :class="[bodyClasses[props.color], { 'mb-2': hasActions }]"
    >
      <slot name="description" />
    </div>
  </div>
</template>
