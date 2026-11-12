<script setup lang="ts">
// One of the page layouts, rendered twice by `PageStructureDemo`. A component
// rather than MDX markup so the same markup can sit in the docs column and in
// the full-screen dialog.
import Alert from '@ui/Alert.vue';
import Button from '@ui/Button.vue';
import Card from '@ui/Card.vue';
import PageLayout from '@ui/PageLayout.vue';
import type { Layout } from './pageStructure';

defineProps<{
  layout: Layout;
}>();

const buttonContainer = 'w-full flex gap-2 sticky bottom-8 z-30';
// Small cards share one width on every page, so a form looks the same on a
// create page and beside a sidebar.
const cardSm = 'w-full md:max-w-2xl';
</script>

<template>
  <!-- Every slot the header has, on the plain layout. -->
  <PageLayout
    v-if="layout === 'base'"
    title="Contacts"
    description="Everyone who has opted in to your messages."
  >
    <template #callout>
      <Alert sits-on="background" :dismissible="false">Callout slot</Alert>
    </template>
    <template #subtitle>
      <a class="hover:text-sky-600">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        Subtitle slot
      </a>
    </template>
    <template #actions>
      <Button sits-on="background">Import</Button>
      <Button color="sky">New Contact</Button>
    </template>

    <div class="flex w-full flex-col gap-2">
      <Card class="h-12 w-full" />
      <Card class="h-12 w-full" />
      <Card class="h-12 w-full" />
      <Card class="h-12 w-full" />
    </div>
  </PageLayout>

  <PageLayout
    v-else-if="layout === 'grid'"
    layout="grid"
    title="Example Heading"
  >
    <Card class="col-span-full md:col-span-6 h-24" />
    <Card class="col-span-full md:col-span-6 h-24" />

    <Card class="col-span-full md:col-span-4 h-24" />
    <Card class="col-span-full md:col-span-4 h-24" />
    <Card class="col-span-full md:col-span-4 h-24" />

    <Card class="col-span-full md:col-span-6 h-24" />
    <Card class="col-span-full md:col-span-6 h-24" />
  </PageLayout>

  <PageLayout
    v-else-if="layout === 'create'"
    layout="create"
    title="Example Heading"
    description="Single sentence page description."
  >
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
  </PageLayout>

  <PageLayout
    v-else-if="layout === 'edit'"
    layout="sidebar"
    title="Example Heading"
  >
    <template #sidebar>
      <a class="group no-underline! py-1 hover:text-sky-600 flex items-center font-extrabold text-sky-600">Details</a>
      <a class="group no-underline! py-1 hover:text-sky-600 flex items-center font-extrabold text-slate-600">Contacts</a>
    </template>

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
  </PageLayout>

  <PageLayout
    v-else-if="layout === 'settings'"
    layout="sidebar"
    title="Settings"
  >
    <template #sidebar>
      <div class="flex flex-col gap-1.5 text-sm leading-tight">
        <div class="font-extrabold text-base leading-tight">User Settings</div>
        <a class="text-slate-500">Profile</a>
        <a class="text-slate-500">Teams</a>
        <a class="text-slate-500">Notifications</a>
        <a class="text-slate-500">Invites</a>
        <a class="text-slate-500">Security</a>
        <a class="text-slate-500">API Tokens</a>
      </div>
    </template>

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
  </PageLayout>
</template>
