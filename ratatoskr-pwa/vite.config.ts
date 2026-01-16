/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ratatoskr',
        short_name: 'Ratatoskr',
        description: 'A PWA client for the Google Jules API',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'Ratatoskr.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'Ratatoskr.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'Ratatoskr.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
