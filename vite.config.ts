import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    host: '127.0.0.1',
    port: 8678,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 8678,
    strictPort: true,
  },
});
