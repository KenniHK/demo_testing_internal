import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';

const SCREENSHOT_PATH = './screenshots/selenium-login-validation.png';

async function run() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--headed', '--no-sandbox', '--disable-gpu'))
    .build();

  try {
    await driver.get('http://localhost:4200');

    // Klik tombol login tanpa isi username/password
    await driver.findElement(By.css('button.login-button')).click();

    // Tunggu elemen error muncul
    const errorMessage = By.css('.error-message');
    await driver.wait(until.elementLocated(errorMessage), 3000);

    const errorText = await driver.findElement(errorMessage).getText();

    if (
      /Username is required/i.test(errorText) ||
      /Password is required/i.test(errorText)
    ) {
      console.log('✅ Validasi tampil sesuai harapan');
    } else {
      console.log('⚠️ Validasi tidak sesuai, isi:', errorText);
    }

    // Screenshot hasil validasi
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(SCREENSHOT_PATH, screenshot, 'base64');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await driver.quit();
  }
}

run();
