import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  site: 'https://wes.dev',
  output: 'server',
  adapter: vercel(),
  integrations: [solidJs()]
});