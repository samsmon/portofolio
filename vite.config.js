import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    watch: {
      ignored: ['**/build/**']
    }
  },
  define: {
    // Stamped into the footer telemetry so the "build" label is a real date,
    // not a decorative version string.
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
