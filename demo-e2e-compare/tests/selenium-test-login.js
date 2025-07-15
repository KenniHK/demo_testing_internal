import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().addArguments('--headed', '--no-sandbox', '--disable-gpu'))
  .build();

// try {
//   console.log('✅ Membuka halaman login');
//   await driver.get('http://localhost:4200');

//   console.log('✅ Mengisi username');
//   const usernameInput = await driver.findElement(By.css('input[placeholder="Username"]'));
//   await usernameInput.sendKeys('admin');

//   console.log('✅ Mengisi password');
//   const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
//   await passwordInput.sendKeys('12345');

//   console.log('✅ Klik tombol login');
//   const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
//   await loginButton.click();

//   console.log('⏳ Menunggu redirect ke dashboard...');
//   await driver.wait(until.urlContains('/dashboard'), 10000);
//   console.log('✅ Login berhasil, redirect ke dashboard');

//   // Screenshot
//   const screenshot = await driver.takeScreenshot();
//   fs.writeFileSync('./screenshots/selenium-login.png', screenshot, 'base64');
//   console.log('📸 Screenshot disimpan');

// } catch (err) {
//   console.error('❌ Terjadi error:', err.message);
// } finally {
//   await driver.quit();
//   console.log('✅ Selenium test selesai');
// }


try {
  console.log('🔍 Membuka halaman login');
  await driver.get('http://localhost:4200');

  // === Test: Validasi form kosong ===
  console.log('✅ Test: Validasi form kosong');
  const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login') or contains(text(), 'login') or contains(text(), 'LOGIN') ]"));
  await loginButton.click();
  await driver.sleep(1000); // tunggu pesan error muncul
  const errorMessage = await driver.findElement(By.css('p')).getText();
  console.log('Error tampil:', errorMessage);

  // === Test: Login Berhasil ===
  console.log('✅ Test: Login berhasil');
  await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys('admin');
  await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('12345');
  await loginButton.click();

  await driver.wait(until.urlContains('/dashboard'), 10000);
  console.log('✅ Redirect ke dashboard berhasil');
  const screenshotDashboard = await driver.takeScreenshot();
  fs.writeFileSync('./screenshots/selenium-dashboard.png', screenshotDashboard, 'base64');

  // === Test: Validasi data toko ===
  console.log('✅ Test: Validasi data toko');
  const tableRows = await driver.findElements(By.css('table tr'));
  console.log(`📊 Jumlah baris data toko: ${tableRows.length}`);

  // === Test: Viewport mobile (simulasi lewat ukuran window) ===
  console.log('✅ Test: Responsivitas (simulasi mobile)');
  await driver.manage().window().setRect({ width: 375, height: 667 });
  await driver.sleep(1000); // beri waktu render ulang
  const mobileScreenshot = await driver.takeScreenshot();
  fs.writeFileSync('./screenshots/selenium-mobile-view.png', mobileScreenshot, 'base64');

} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await driver.quit();
  console.log('✅ Selenium test selesai');
}
