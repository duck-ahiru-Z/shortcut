const { chromium } = require('playwright');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const artifactDir = "C:\\Users\\iwaku\\.gemini\\antigravity\\brain\\25c55d36-eb58-472f-8ea0-364605469c69";
  
  for (const grade of ['3kyu', '2kyu', '1kyu']) {
    console.log(`Taking screenshot for ${grade}...`);
    await page.goto(`http://localhost:3000/exam?grade=practical-${grade}`);
    await page.getByPlaceholder('姓').fill('Test');
    await page.getByPlaceholder('名').fill('User');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '試験を開始する' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(artifactDir, `preview_${grade}.png`) });
  }
  
  await browser.close();
  console.log("Screenshots captured!");
}

run();
