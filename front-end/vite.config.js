import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
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
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        dashboard: 'src/dashboard/index.html',
        background: 'src/background.ts'
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
