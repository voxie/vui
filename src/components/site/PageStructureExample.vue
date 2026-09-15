<script setup lang="ts">
// One of the page layouts, rendered twice by `PageStructureDemo`. A component
// rather than MDX markup so the same markup can sit in the docs column and in
// the full-screen dialog.
import Card from '@ui/Card.vue';
import Button from '@ui/Button.vue';
import type { Layout } from './pageStructure';

defineProps<{
  layout: Layout;
}>();

const container = 'container mx-auto px-4 sm:px-6 md:px-8 max-w-(--breakpoint-xl) text-slate-700';
const gaps = 'gap-4 md:gap-6 xl:gap-8';
const buttonContainer = 'w-full flex gap-2 sticky bottom-8 z-30';
// Small cards share one width on every page, so a form looks the same on a
// create page and beside a sidebar.
const cardSm = 'w-full md:max-w-2xl';
const shell = 'flex flex-col md:flex-row';
const sidebar = 'flex flex-col pb-3 md:w-48 lg:w-56 md:shrink-0';
const main = 'flex flex-col flex-1 min-w-0';
</script>

<template>
  <div
    v-if="layout === 'base'"
    :class="container"
  >
    <div
      class="grid grid-cols-12"
      :class="gaps"
    >
      <div class="col-span-full text-3xl font-extrabold">Example Heading</div>
      <Card class="col-span-full md:col-span-6 h-24" />
      <Card class="col-span-full md:col-span-6 h-24" />

      <Card class="col-span-full md:col-span-4 h-24" />
      <Card class="col-span-full md:col-span-4 h-24" />
      <Card class="col-span-full md:col-span-4 h-24" />

      <Card class="col-span-full md:col-span-6 h-24" />
      <Card class="col-span-full md:col-span-6 h-24" />
    </div>
  </div>

  <div
    v-else-if="layout === 'create'"
    class="flex flex-col items-center"
    :class="[gaps, container]"
  >
    <div class="text-center">
      <div class="text-3xl font-extrabold mb-3 leading-none">Example Heading</div>
      <p class="leading-tight">Single sentence page description.</p>
    </div>

    <div class="sticky top-4 rounded-full border-solid border border-white/60 bg-slate-100/50 px-4 shadow-xl backdrop-blur-md z-20">
      <div class="text-slate-700 relative no-underline hover:no-underline overflow-hidden py-2 px-2 text-xs transition inline-flex justify-center cursor-pointer">Sticky Nav</div>
    </div>

    <Card
      surface="glass"
      class="h-24"
      :class="cardSm"
    />
    <Card
      surface="glass"
      class="h-24"
      :class="cardSm"
    />
    <Card
      surface="glass"
      class="h-24"
      :class="cardSm"
    />
    <Card
      surface="glass"
      class="h-24"
      :class="cardSm"
    />
    <Card
      surface="glassRaised"
      :class="[buttonContainer, cardSm]"
    >
      <Button size="lg" data-preview-close>Cancel</Button>
      <Button
        size="lg"
        color="sky"
        class="w-full"
        data-preview-close
        >Save</Button
      >
    </Card>
  </div>

  <div
    v-else-if="layout === 'edit'"
    class="flex flex-col"
    :class="[gaps, container]"
  >
    <div class="text-3xl font-extrabold">Example Heading</div>

    <div
      :class="[shell, gaps]"
    >
      <div :class="sidebar">
        <a class="group no-underline! py-1 hover:text-sky-600 flex items-center font-extrabold text-sky-600">Details</a>
        <a class="group no-underline! py-1 hover:text-sky-600 flex items-center font-extrabold text-slate-600">Contacts</a>
      </div>

      <div :class="[main, gaps]">
        <Card
          surface="glass"
          class="h-24"
          :class="cardSm"
        />
        <Card
          surface="glass"
          class="h-24"
          :class="cardSm"
        />
        <Card
          surface="glass"
          class="h-24"
          :class="cardSm"
        />
        <Card
          surface="glass"
          class="w-full h-24"
        />
        <Card
          surface="glass"
          class="w-full h-24"
        />
        <Card
          surface="glassRaised"
          :class="[buttonContainer, cardSm]"
        >
          <Button size="lg" data-preview-close>Cancel</Button>
          <Button
            size="lg"
            color="sky"
            class="w-full"
            data-preview-close
            >Save</Button
          >
        </Card>
      </div>
    </div>
  </div>

  <div
    v-else-if="layout === 'settings'"
    class="flex flex-col"
    :class="[gaps, container]"
  >
    <div class="text-3xl font-extrabold">Settings</div>

    <div
      :class="[shell, gaps]"
    >
      <div
        class="text-sm gap-1.5 leading-tight"
        :class="sidebar"
      >
        <div class="font-extrabold text-base leading-tight">User Settings</div>
        <a class="text-slate-500">Profile</a>
        <a class="text-slate-500">Teams</a>
        <a class="text-slate-500">Notifications</a>
        <a class="text-slate-500">Invites</a>
        <a class="text-slate-500">Security</a>
        <a class="text-slate-500">API Tokens</a>
      </div>

      <div :class="[main, gaps]">
        <div class="font-extrabold text-2xl">Multi-width Page</div>
        <Card
          surface="layered"
          padding="spacious"
          class="w-full"
        >
          <div class="font-extrabold text-base mb-1">Overview</div>
          <p class="max-w-prose text-sm text-slate-500 leading-relaxed">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </p>
        </Card>
        <Card
          surface="glass"
          class="h-24"
          :class="cardSm"
        />
        <Card
          surface="glass"
          class="h-24"
          :class="cardSm"
        />

        <div class="w-full flex flex-col gap-2">
          <div class="flex justify-between items-center mb-2">
            <div class="font-extrabold text-lg">Table Rows</div>
            <Button color="sky">New Item</Button>
          </div>
          <Card
            surface="glass"
            class="w-full h-12"
          />
          <Card
            surface="glass"
            class="w-full h-12"
          />
          <Card
            surface="glass"
            class="w-full h-12"
          />
        </div>

        <Card
          surface="glassRaised"
          :class="[buttonContainer, cardSm]"
        >
          <Button size="lg" data-preview-close>Cancel</Button>
          <Button
            size="lg"
            color="sky"
            class="w-full"
            data-preview-close
            >Save</Button
          >
        </Card>
      </div>
    </div>
  </div>
</template>
