import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // Prevents Astro from injecting default base styles if we want total control via global.css
      applyBaseStyles: false, 
    }),
    react()
  ],
});
