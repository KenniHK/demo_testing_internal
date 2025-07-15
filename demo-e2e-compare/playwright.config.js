import { defineConfig } from '@playwright/test';

console.log('✅ Condsdsfdffig loaded');
export default defineConfig({
  use: {
    headless: false,
    slowMo: 1000, 
  },
});
