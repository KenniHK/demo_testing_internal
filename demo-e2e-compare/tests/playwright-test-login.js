import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false, slowMo: 300 }); // Bisa ubah jadi true setelah testing
const page = await browser.newPage();

// console.log('✅ Membuka halaman login');
// await page.goto('http://localhost:4200');

// await page.fill('input[placeholder="Username"]', 'admin');
// console.log('✅ Username diisi');

// await page.fill('input[placeholder="Password"]', '12345');
// console.log('✅ Password diisi');

// await page.getByRole('button', { name: /login/i }).click();
// console.log('✅ Klik tombol login');

// await page.waitForURL('**/dashboard', { timeout: 10000 });
// console.log('✅ Login berhasil, redirect ke dashboard');

// await page.screenshot({ path: './screenshots/playwright-login.png' });

// await browser.close();
// console.log('✅ Playwright test selesai');

try {
  console.log('🔍 Membuka halaman login');
  await page.goto('http://localhost:4200');

  // === Test: Login Field Validation ===
  console.log('✅ Test: Validasi form kosong');
  await page.click('button');
  const errorText = await page.textContent('p');
  console.log('Error tampil:', errorText);

  // === Test: Login Success ===
  console.log('✅ Test: Login berhasil');
  await page.fill('input[placeholder="Username"]', 'admin');
  await page.fill('input[placeholder="Password"]', '12345');
  await page.click('button');

  await page.waitForURL('**/dashboard');
  console.log('✅ Berhasil redirect ke dashboard');
  await page.screenshot({ path: './screenshots/playwright-dashboard.png' });

  // === Test: Tabel Data Toko ===
  console.log('✅ Test: Menampilkan data toko');
  const rows = await page.$$eval('table tr', trs => trs.length);
  console.log(`📊 Jumlah baris data toko: ${rows}`);

  // === Test: Responsive Mobile View ===
  console.log('✅ Test: Viewport mobile');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: './screenshots/playwright-mobile-view.png' });

} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await browser.close();
  console.log('✅ Selesai semua test Playwright');
}
