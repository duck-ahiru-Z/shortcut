import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  
  const grades = ['5kyu', '4kyu', '3kyu', '2kyu', '1kyu'];
  const platforms = ['windows', 'mac'];

  for (const grade of grades) {
    for (const os of platforms) {
      const page = await context.newPage();
      const examName = os === 'mac' ? `practical-mac-${grade}` : `practical-${grade}`;
      console.log(`\n=== Testing ${examName} ===`);
      
      try {
        await page.goto(`http://localhost:3000/exam?grade=${examName}`, { waitUntil: 'networkidle' });
        
        console.log("Filling out pre-exam form...");
        await page.fill('input[placeholder="姓"]', 'Test');
        await page.fill('input[placeholder="名"]', 'User');
        await page.check('input[type="checkbox"]');
        await page.waitForTimeout(500);

        console.log("Starting exam...");
        await page.click('text="試験を開始する"');
        await page.waitForTimeout(1000);

        // Take a screenshot of the first question
        await page.screenshot({ path: `C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69/scratch/test_${examName}_q1.png` });
        console.log(`Captured ${examName} Q1`);

        // Try skipping a few questions
        for (let i = 2; i <= 3; i++) {
          const skipBtn = page.locator('text="スキップして次へ"');
          if (await skipBtn.isVisible()) {
            await skipBtn.click();
            await page.waitForTimeout(500);
            await page.screenshot({ path: `C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69/scratch/test_${examName}_q${i}.png` });
            console.log(`Captured ${examName} Q${i}`);
          }
        }
        
        console.log(`${examName} test passed!`);
      } catch (e) {
        console.error(`Error during ${examName}:`, e.message);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log("\nAll tests completed!");
})();
