// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          content: { type: 'text', value: '#' },
          properties: { className: ['anchor-link'] } 
        }
      ],
      [
        rehypeExternalLinks, 
        { target: '_blank', rel: ['noopener', 'noreferrer'] }
      ],
    ],
  },

  integrations: [mdx(), sitemap(), vue(), react()],

  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
