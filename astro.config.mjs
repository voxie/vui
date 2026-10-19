// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import vue from '@astrojs/vue';

import { rehypeBaseLinks } from './src/lib/base.ts';

// GitHub Pages serves a project repo under its name and redirects to the
// slashed URL, so hrefs are built slashed. Templates use `withBase` from
// `src/lib/base.ts`, prose gets the prefix from the rehype plugin. Base stays
// on in dev so a missed prefix breaks locally.
//
// PR previews publish into a subfolder of the same Pages site, so the base is
// settable per build. See .github/workflows/pr-preview.yml.
const site = 'https://voxie.github.io';
const base = process.env.BASE_PATH || '/vui';

// https://astro.build/config
export default defineConfig({
  site,
  base,

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

  markdown: {
    rehypePlugins: [[rehypeBaseLinks, { base }]],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), vue()],
});
