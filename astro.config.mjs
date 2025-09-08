import cloudflare from '@astrojs/cloudflare';
import solidJs from '@astrojs/solid-js';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  site:
    process.env.CF_PAGES_BRANCH === 'main'
      ? 'https://wes.dev'
      : process.env.CF_PAGES_URL
        ? process.env.CF_PAGES_URL
        : 'http://localhost:4321',
  output: 'server',
  adapter: cloudflare(),
  integrations: [solidJs()],
  vite: {
    optimizeDeps: {
      include: ['solid-markdown > micromark', 'solid-markdown > unified'],
    },
    plugins: [
      visualizer({
        emitFile: true,
        filename: '_stats.html',
      }),
    ],
  },
});
