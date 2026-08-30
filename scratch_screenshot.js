const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP'
  });
  const page = await context.newPage();
  
  const artifactDir = path.resolve('C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69');

  try {
    console.log('Navigating to 5kyu practical exam...');
    await page.goto('http://localhost:3000/exam?grade=practical-5kyu');
    
    await page.getByPlaceholder('姓').fill('Test');
    await page.getByPlaceholder('名').fill('QA');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '試験を開始する' }).click();

    await page.waitForSelector('text=残り時間', { timeout: 10000 });
    console.log('Exam started.');

    // We will take 5 screenshots
    for (let i = 1; i <= 5; i++) {
      await page.waitForTimeout(1000); // Wait for mock UI to settle
      const screenshotPath = path.join(artifactDir, `practical_5kyu_q${i}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved screenshot: practical_5kyu_q${i}.png`);
      
      const skipBtn = page.getByRole('button', { name: 'スキップ' });
      if (await skipBtn.isVisible()) {
        await skipBtn.click();
      } else {
        break; // Exam finished or modal appeared
      }
    }
  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    await browser.close();
  }
})();
