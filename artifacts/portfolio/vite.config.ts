import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { validateUrl } from './src/lib/project-links';
import { CRM_LINK, ECOMMERCE_LINK } from './src/content/site';

// Vite does not execute browser modules during bundling. Validate the links
// here too, so a bad project URL stops the build, not just the visitor's browser.
validateUrl(CRM_LINK, 'CRM_LINK');
validateUrl(ECOMMERCE_LINK, 'ECOMMERCE_LINK');

// PORT only affects the dev and preview servers; BASE_PATH serves the site from a sub-path.
const rawPort = process.env.PORT || '5173';
const port = Number(rawPort);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/attached_assets/**', '**/.agents/**'],
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
