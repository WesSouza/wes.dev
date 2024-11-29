import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  site: 'https://wes.dev',
  output: 'server',
  adapter: vercel(),
  integrations: [solidJs()],
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: '_stats.html',
      }),
    ],
  },
});
