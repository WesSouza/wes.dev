import vercel from '@astrojs/vercel/edge';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wes.dev',
  output: 'server',
  adapter: vercel(),
});
