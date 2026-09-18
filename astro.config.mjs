import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// SITE_URL must be set to the real production domain before deploying.
// Falls back to a placeholder for local dev so builds work without it.
// See README.md for details.
const SITE_URL = process.env.SITE_URL || 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({
      // Prevents Astro from injecting default base styles if we want total control via global.css
      applyBaseStyles: false,
    }),
    react(),
    sitemap()
  ],
});
