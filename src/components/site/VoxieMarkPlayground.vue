<script setup lang="ts">
import { computed, ref } from 'vue';
import VoxieMark from '@ui/VoxieMark.vue';
import Card from '@ui/Card.vue';
import Button from '@ui/Button.vue';

const axis = ref<'width' | 'height'>('width');
const size = ref(70);
const fixedRadius = ref(false);
const radius = ref(8);
const markRadius = computed(() => fixedRadius.value ? radius.value : undefined);
const dimensions = computed(() => axis.value === 'width'
  ? { width: `${size.value}px`, height: 'auto' }
  : { width: 'auto', height: `${size.value}px` });
const width = computed(() => axis.value === 'width' ? size.value : size.value * 35 / 32);
const height = computed(() => width.value * 32 / 35);
const snippet = computed(() => `<VoxieMark style="${axis.value}: ${size.value}px; ${axis.value === 'width' ? 'height' : 'width'}: auto;"${fixedRadius.value ? ` :radius="${radius.value}"` : ''} />`);
function reset() {
  axis.value = 'width';
  size.value = 70;
  fixedRadius.value = false;
  radius.value = 8;
}
</script>

<template>
  <div class="not-prose space-y-5">
    <Card padding="spacious">
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="grid gap-2 text-sm font-semibold">
          Size by
          <select v-model="axis" class="rounded-lg border border-slate-300 bg-white p-2">
            <option value="width">Width</option>
            <option value="height">Height</option>
          </select>
        </label>
        <label class="grid gap-2 text-sm font-semibold">
          {{ axis === 'width' ? 'Width' : 'Height' }} · {{ size }}px
          <input v-model.number="size" type="range" min="16" max="160" step="1" class="w-full accent-sky-600" />
        </label>
        <label class="flex items-center gap-2 text-sm font-semibold">
          <input v-model="fixedRadius" type="checkbox" class="accent-sky-600" />
          Fixed pixel radius
        </label>
        <label class="grid gap-2 text-sm font-semibold" :class="{ 'opacity-50': !fixedRadius }">
          Radius · {{ radius }}px
          <input v-model.number="radius" type="range" min="0" max="40" step="1" :disabled="!fixedRadius" class="w-full accent-sky-600" />
        </label>
      </div>
      <div class="mt-6 flex min-h-64 items-center justify-center rounded-xl bg-slate-200 p-8 pb-12" role="img" aria-label="Live Voxie mark preview">
        <VoxieMark data-preview-mark :style="dimensions" :radius="markRadius" />
      </div>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>Body {{ width.toFixed(1) }} × {{ height.toFixed(1) }}px · {{ fixedRadius ? `${radius}px requested radius` : `${(width * 8 / 35).toFixed(1)}px proportional radius` }}</p>
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
            <VoxieMark :style="{ width: `${preset}px` }" :radius="markRadius" />
            <span class="text-xs text-slate-500">{{ preset }}px</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
