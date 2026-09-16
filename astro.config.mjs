import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aakashdhakal.netlify.app',
  adapter: netlify(),
  integrations: [sitemap()],
  vite: {
    ssr: {
      external: ['rss-parser'],
    },
  },
});
