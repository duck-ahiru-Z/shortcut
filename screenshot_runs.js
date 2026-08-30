const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP'
  });
  
  const artifactDir = path.resolve('C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69');

  for (let run = 2; run <= 3; run++) {
    const page = await context.newPage();
    try {
      console.log(`Starting Run ${run}...`);
      await page.goto('http://localhost:3000/exam?grade=practical-5kyu');
      
      await page.getByPlaceholder('姓').fill('Test');
      await page.getByPlaceholder('名').fill(`Run${run}`);
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: '試験を開始する' }).click();

      await page.waitForSelector('text=残り時間', { timeout: 10000 });
      console.log(`Run ${run} Exam started.`);

      // Take 5 screenshots per run to show variety
      for (let i = 1; i <= 5; i++) {
        await page.waitForTimeout(1000); // Wait for mock UI to settle
        const screenshotPath = path.join(artifactDir, `practical_5kyu_run${run}_q${i}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved screenshot: practical_5kyu_run${run}_q${i}.png`);
        
        const skipBtn = page.getByRole('button', { name: 'スキップ' });
        if (await skipBtn.isVisible()) {
          await skipBtn.click();
        } else {
          break; // Exam finished
        }
      }
    } catch (err) {
      console.error(`Error during Run ${run}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
})();
