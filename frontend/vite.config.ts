import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  base: './', // CRITICAL: Makes assets load relatively for Electron
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: /^(@[^\/]+\/[^@]+)@.+$/,
        replacement: '$1',
      },
      {
        find: /^([^@\/]+)@.+$/,
        replacement: '$1',
      },
    ],
  },
});