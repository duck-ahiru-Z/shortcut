import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log("Navigating to Windows 2kyu...");
  await page.goto('http://localhost:3000/exam?grade=practical-2kyu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log("Filling out pre-exam form...");
  await page.fill('input[placeholder="姓"]', 'Test');
  await page.fill('input[placeholder="名"]', 'User');
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(1000);

  // Start the exam
  console.log("Starting Windows 2kyu exam...");
  await page.click('text="試験を開始する"');
  await page.waitForTimeout(2000);

  // Take screenshot of Q1
  await page.screenshot({ path: 'C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69/scratch/exam_win_2kyu_q1.png' });
  console.log("Captured Windows 2kyu Q1");
  
  for (let i = 2; i <= 3; i++) {
    await page.click('text="スキップして次へ"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69/scratch/exam_win_2kyu_q${i}.png` });
    console.log(`Captured Windows 2kyu Q${i}`);
  }

  console.log("Navigating to Mac 2kyu...");
  await page.goto('http://localhost:3000/exam?grade=practical-mac-2kyu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log("Filling out pre-exam form...");
  await page.fill('input[placeholder="姓"]', 'Test');
  await page.fill('input[placeholder="名"]', 'User');
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(1000);

  console.log("Starting Mac 2kyu exam...");
  await page.click('text="試験を開始する"');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69/scratch/exam_mac_2kyu_q1.png' });
  console.log("Captured Mac 2kyu Q1");
  
  for (let i = 2; i <= 3; i++) {
    await page.click('text="スキップして次へ"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69/scratch/exam_mac_2kyu_q${i}.png` });
    console.log(`Captured Mac 2kyu Q${i}`);
  }

  // End exam early by clicking "試験を終了する" which appears at the top left maybe?
  // Let's just go back and test something else.
  
  await browser.close();
})();
