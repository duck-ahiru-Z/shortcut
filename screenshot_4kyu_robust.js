const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const artifactDir = path.resolve('C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69');
  
  const seenQuestions = new Set();
  let screenshotsTaken = 0;

  for (let run = 1; run <= 4; run++) {
    console.log(`Starting Run ${run}...`);
    // Create a new context for each run to clear localStorage
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: 'ja-JP'
    });
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:3000/exam?grade=practical-4kyu');
      
      // Wait for either Pre-screen or Active-screen (just in case)
      const isPreScreen = await page.getByPlaceholder('姓').isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isPreScreen) {
        await page.getByPlaceholder('姓').fill('Test');
        await page.getByPlaceholder('名').fill(`Run${run}`);
        await page.getByRole('checkbox').check();
        await page.getByRole('button', { name: '試験を開始する' }).click();
      }

      await page.waitForSelector('text=残り時間', { timeout: 10000 });
      console.log(`Run ${run} Exam started.`);

      for (let i = 1; i <= 10; i++) {
        await page.waitForTimeout(1000); // Wait for animations
        
        // Try to get question text to avoid duplicates
        const qText = await page.locator('h2').first().textContent().catch(() => 'unknown');
        
        if (!seenQuestions.has(qText)) {
          seenQuestions.add(qText);
          screenshotsTaken++;
          const screenshotPath = path.join(artifactDir, `practical_4kyu_unique_${screenshotsTaken}.png`);
          await page.screenshot({ path: screenshotPath });
          console.log(`Saved screenshot ${screenshotsTaken}: ${qText.substring(0, 30)}...`);
        } else {
          console.log(`Skipping duplicate: ${qText.substring(0, 30)}...`);
        }
        
        const skipBtn = page.getByRole('button', { name: 'スキップ' });
        if (await skipBtn.isVisible()) {
          await skipBtn.click();
        } else {
          break; // Exam finished
        }
      }
    } catch (err) {
      console.error(`Error during Run ${run}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log(`Finished. Total unique screenshots: ${screenshotsTaken}`);
})();
