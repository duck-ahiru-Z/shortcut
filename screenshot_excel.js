const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, locale: 'ja-JP' });
  const page = await context.newPage();
  const artifactDir = path.resolve('C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69');

  try {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.localStorage.clear());
    await page.waitForTimeout(500);

    await page.goto('http://localhost:3000/exam?grade=practical-4kyu');
    
    await page.getByPlaceholder('姓').fill('Test');
    await page.getByPlaceholder('名').fill('ExcelFix');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '試験を開始する' }).click();

    await page.waitForSelector('text=残り時間', { timeout: 10000 });

    for (let i = 1; i <= 15; i++) {
      await page.waitForTimeout(1000);
      const qText = await page.locator('h2').first().textContent().catch(() => '');
      
      if (qText.includes('Excel') || qText.includes('表の') || qText.includes('セル')) {
        const screenshotPath = path.join(artifactDir, `practical_4kyu_excel_fixed.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved screenshot: practical_4kyu_excel_fixed.png`);
        break;
      }
      
      const skipBtn = page.getByRole('button', { name: 'スキップ' });
      if (await skipBtn.isVisible()) {
        await skipBtn.click();
      } else {
        break;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
