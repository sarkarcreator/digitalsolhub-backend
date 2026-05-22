import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        headers: {
          'Cache-Control': 'no-store'
        },
        proxy: {
          '/api': {
            target: env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000',
            changeOrigin: true,
            rewrite: (path) => path,
            secure: false,
            followRedirects: true,
          }
        }
      },
      plugins: [react()],
      cacheDir: 'node_modules/.vite_dev_cache',
      define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
