import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
    name: 'copy-manifest',
    closeBundle() {
      copyFileSync(
        join(__dirname, 'manifest.json'),
        join(__dirname, 'dist', 'manifest.json')
      );
    }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        dashboard: 'src/dashboard/index.html',
        background: 'src/background.js'
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'chunks/[name].js'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  publicDir: 'public'
});
