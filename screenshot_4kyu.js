const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP'
  });
  
  const artifactDir = path.resolve('C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69');

  // Do 4 runs for 4kyu
  for (let run = 1; run <= 4; run++) {
    const page = await context.newPage();
    try {
      console.log(`Starting 4kyu Run ${run}...`);
      await page.goto('http://localhost:3000/exam?grade=practical-4kyu');
      
      await page.getByPlaceholder('姓').fill('Test');
      await page.getByPlaceholder('名').fill(`4KyuRun${run}`);
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: '試験を開始する' }).click();

      await page.waitForSelector('text=残り時間', { timeout: 10000 });
      console.log(`Run ${run} Exam started.`);

      // Take 4 screenshots per run
      for (let i = 1; i <= 4; i++) {
        await page.waitForTimeout(1000); // Wait for UI
        const screenshotPath = path.join(artifactDir, `practical_4kyu_run${run}_q${i}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Saved screenshot: practical_4kyu_run${run}_q${i}.png`);
        
        const skipBtn = page.getByRole('button', { name: 'スキップ' });
        if (await skipBtn.isVisible()) {
          await skipBtn.click();
        } else {
          break;
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
