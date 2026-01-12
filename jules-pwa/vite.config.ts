/// <reference types="vitest" />
import { defineConfig as viteDefineConfig } from 'vite'
import { defineConfig as vitestDefineConfig, mergeConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

const viteConfig = viteDefineConfig({
  plugins: [preact()],
});

const vitestConfig = vitestDefineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
});

// https://vite.dev/config/
export default mergeConfig(viteConfig, vitestConfig);
