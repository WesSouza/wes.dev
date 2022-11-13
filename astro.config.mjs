import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/edge';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wes.dev',
  integrations: [mdx(), sitemap()],
  output: 'server',
  adapter: vercel(),
});
