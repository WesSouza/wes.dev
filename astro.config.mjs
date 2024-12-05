import solidJs from '@astrojs/solid-js';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  site:
    process.env.VERCEL_ENV === 'production'
      ? 'https://wes.dev'
      : process.env.VERCEL_GIT_COMMIT_REF === 'wes95'
        ? 'https://95.wes.dev'
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:4321',
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
