import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Указываем путь к фавикону в сгенерированной сборке
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
