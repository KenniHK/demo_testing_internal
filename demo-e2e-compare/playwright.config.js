import { defineConfig } from '@playwright/test';

console.log('✅ Config loaded');
export default defineConfig({
  use: {
    headless: false,
    slowMo: 1000, 
  },
});
