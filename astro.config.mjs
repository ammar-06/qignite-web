import { defineConfig } from 'astro/config';
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
    react(),
    sitemap()
  ],
});
