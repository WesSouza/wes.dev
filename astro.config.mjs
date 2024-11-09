import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wes.dev',
  output: 'server',
  adapter: vercel({
    functionPerRoute: false,
  }),
  integrations: [solidJs()],
});
