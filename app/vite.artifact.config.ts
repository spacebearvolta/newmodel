import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// One-off build config for producing a single self-contained HTML file to
// preview in a Claude Artifact. Not used for normal development/production
// builds — see vite.config.ts for that.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
