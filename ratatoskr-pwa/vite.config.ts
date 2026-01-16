/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@stablelib/pbkdf2',
      '@stablelib/hmac',
      '@stablelib/sha256',
      '@stablelib/chacha20poly1305',
      '@stablelib/random',
      'uint8arrays',
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
