<script setup lang="ts">
import { computed, ref } from 'vue';
import Logo from '@ui/Logo.vue';
import Card from '@ui/Card.vue';
import Button from '@ui/Button.vue';
import Switch from '@ui/Switch.vue';

const sizeByHeight = ref(false);
const axis = computed(() => sizeByHeight.value ? 'height' : 'width');
const size = ref(70);
const fixedRadius = ref(false);
// Full class names so Tailwind picks them up when scanning.
const radiusClasses = ['rounded-none', 'rounded-xs', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-4xl', 'rounded-full'];
const radiusIndex = ref(5);
const radiusClass = computed(() => radiusClasses[radiusIndex.value]);
const markRadius = computed(() => fixedRadius.value ? radiusClass.value : undefined);
const dimensions = computed(() => axis.value === 'width'
  ? { width: `${size.value}px`, height: 'auto' }
  : { width: 'auto', height: `${size.value}px` });
const width = computed(() => axis.value === 'width' ? size.value : size.value * 35 / 32);
const height = computed(() => width.value * 32 / 35);
const snippet = computed(() => `<Logo style="${axis.value}: ${size.value}px; ${axis.value === 'width' ? 'height' : 'width'}: auto;"${fixedRadius.value ? ` class="${radiusClass.value}"` : ''} />`);
function reset() {
  sizeByHeight.value = false;
  size.value = 70;
  fixedRadius.value = false;
  radiusIndex.value = 5;
}
</script>

<template>
  <div class="not-prose space-y-5">
    <Card padding="spacious">
      <div class="grid gap-5">
        <div class="grid justify-items-start gap-2">
          <span class="text-sm font-semibold">Size by</span>
          <Switch v-model="sizeByHeight" off="Width" on="Height" aria-label="Size by height" />
        </div>
        <label class="grid gap-2 text-sm font-semibold">
          {{ axis === 'width' ? 'Width' : 'Height' }} · {{ size }}px
          <input v-model.number="size" type="range" min="16" max="160" step="1" class="w-full accent-sky-600" />
        </label>
        <div class="grid justify-items-start gap-2">
          <span class="text-sm font-semibold">Radius mode</span>
          <Switch v-model="fixedRadius" off="Relative" on="Tailwind" aria-label="Tailwind radius" />
        </div>
        <label v-if="fixedRadius" class="grid gap-2 text-sm font-semibold">
          Radius · {{ radiusClass }}
          <input v-model.number="radiusIndex" type="range" min="0" :max="radiusClasses.length - 1" step="1" class="w-full accent-sky-600" />
        </label>
      </div>
      <div class="mt-6 flex min-h-64 items-center justify-center rounded-xl bg-slate-200 p-8" role="img" aria-label="Live Voxie logo preview">
        <Logo data-preview-mark :style="dimensions" :class="markRadius" />
      </div>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>Body {{ width.toFixed(1) }} × {{ height.toFixed(1) }}px · {{ fixedRadius ? `${radiusClass} radius` : `${(width * 8 / 35).toFixed(1)}px proportional radius` }}</p>
        <Button size="sm" @click="reset">Reset</Button>
      </div>
      <pre class="mt-4 overflow-x-auto rounded-lg bg-slate-800 p-4 text-xs text-slate-100"><code>{{ snippet }}</code></pre>
    </Card>

    <div>
      <h3 class="mb-2 font-extrabold text-slate-800">Compare sizes</h3>
      <p class="mb-4 text-sm">Each mark uses the selected radius mode. Labels show body width.</p>
      <Card>
        <div class="flex flex-wrap items-end gap-8 py-6">
          <div v-for="preset in [24, 35, 48, 70, 105]" :key="preset" class="grid justify-items-center gap-6">
            <Logo :style="{ width: `${preset}px` }" :class="markRadius" />
            <span class="text-xs text-slate-500">{{ preset }}px</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
