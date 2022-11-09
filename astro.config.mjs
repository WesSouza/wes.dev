import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wes.dev',
  integrations: [mdx(), sitemap()],
  output: 'server',
  adapter: vercel(),
});
