// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
  enabled: false,
},

  // Docs pages are small static files, so fetching one on link hover makes the
  // click itself instant. `hover` rather than `viewport`, since the sidebar puts
  // every page in view at once.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), vue()],
});