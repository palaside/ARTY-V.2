const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  cacheDir: 'C:/Users/EVE/Documents/Codex/2026-08-14/new-chat/tmp/vite-cache',
  build: {
    outDir: 'C:/Users/EVE/Documents/Codex/2026-08-14/new-chat/tmp/arty-v2-dist',
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    open: true,
  },
});
