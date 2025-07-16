import { Builder, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_PATH = './screenshots/selenium-crud.png';

async function run() {
  const driver = await new Builder()
    .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().addArguments('--headed', '--no-sandbox', '--disable-gpu'))
    .build();

  try {
    await driver.get('http://localhost:4200/');

    // ===== LOGIN =====
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys('admin');
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('12345');
    await driver.findElement(By.css('button.login-button')).click();

    // Tunggu hingga dashboard muncul
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), '+ Tambah Toko')]")), 5000);

    // ===== TAMBAH TOKO BARU =====
    await driver.findElement(By.xpath("//button[contains(text(), '+ Tambah Toko')]")).click();
    await driver.sleep(500); // tunggu form render

    await driver.findElement(By.xpath("//label[contains(text(), 'Nama:')]/following-sibling::input")).sendKeys('Toko UI Selenium');
    await driver.findElement(By.xpath("//label[contains(text(), 'Kota:')]/following-sibling::input")).sendKeys('Bandung');
    await driver.findElement(By.xpath("//label[contains(text(), 'Status:')]/following-sibling::select")).sendKeys('Aktif');
    await driver.findElement(By.xpath("//button[contains(text(), 'Simpan')]")).click();

    // Tunggu toko muncul di tabel
    await driver.sleep(1000);

    // ===== EDIT TOKO =====
    const editBtnXPath = `//tr[td[contains(text(), 'Toko UI Selenium')]]//button[contains(text(), 'Edit')]`;
    await driver.wait(until.elementLocated(By.xpath(editBtnXPath)), 5000);
    await driver.findElement(By.xpath(editBtnXPath)).click();

    await driver.sleep(500);
    const namaInput = await driver.findElement(By.xpath("//label[contains(text(), 'Nama:')]/following-sibling::input"));
    await namaInput.clear();
    await namaInput.sendKeys('Toko UI Selenium Edited');

    await driver.findElement(By.xpath("//button[contains(text(), 'Simpan')]")).click();

    // Tunggu perubahan disimpan
    await driver.sleep(1000);

    // ===== HAPUS TOKO =====
    const deleteBtnXPath = `//tr[td[contains(text(), 'Toko UI Selenium Edited')]]//button[contains(text(), 'Hapus')]`;
    await driver.wait(until.elementLocated(By.xpath(deleteBtnXPath)), 5000);
    await driver.findElement(By.xpath(deleteBtnXPath)).click();

    await driver.sleep(1000);

    // Screenshot hasil akhir
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(SCREENSHOT_PATH, screenshot, 'base64');

    console.log('✅ CRUD Selenium test berhasil.');
  } catch (error) {
    console.error('❌ Gagal menjalankan CRUD Selenium:', error);
  } finally {
    await driver.quit();
  }
}

run();
