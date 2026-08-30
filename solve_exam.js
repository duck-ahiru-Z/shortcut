const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Dynamically import all questions to build a lookup table
const poolPath = path.resolve('c:/Users/iwaku/pro/shortcut2/scripts/archive/practical_pool.json');
const higherPools = JSON.parse(fs.readFileSync(poolPath, 'utf-8'));

// MJS extraction for lower grades
const mjsPath = path.resolve('c:/Users/iwaku/pro/shortcut2/scripts/archive/update_lower_grades.mjs');
const mjsContent = fs.readFileSync(mjsPath, 'utf-8');
const extractArray = (varName) => {
  try {
    const match = mjsContent.match(new RegExp(`const ${varName} = (\\[[\\s\\S]*?\\]);\\n`));
    if (match) return eval(match[1]);
  } catch (e) {
    return [];
  }
};
const p5 = extractArray('p5');
const p4 = extractArray('p4');

const allQuestions = [...p5, ...p4, ...higherPools["practical-3kyu"], ...higherPools["practical-2kyu"], ...higherPools["practical-1kyu"]];

(async () => {
  const browser = await chromium.launch({ headless: true }); // Use headless true
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, locale: 'ja-JP' });
  const page = await context.newPage();
  const artifactDir = path.resolve('C:/Users/iwaku/.gemini/antigravity/brain/25c55d36-eb58-472f-8ea0-364605469c69');

  const gradeToTest = process.argv[2] || '4kyu';
  const urlGrade = `practical-${gradeToTest}`;

  try {
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.localStorage.clear());
    await page.waitForTimeout(500);

    await page.goto(`http://localhost:3000/exam?grade=${urlGrade}`);
    
    await page.getByPlaceholder('姓').fill('AI');
    await page.getByPlaceholder('名').fill('Solver');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '試験を開始する' }).click();

    await page.waitForSelector('text=残り時間', { timeout: 10000 });

    let score = 0;
    
    for (let i = 1; i <= 15; i++) { // Max 15 questions in an exam
      await page.waitForTimeout(1000); // Wait for transition
      
      const rawText = await page.locator('h2').first().textContent().catch(() => '');
      if (!rawText || rawText.includes('合格') || rawText.includes('結果')) break; // Reached result screen
      
      const qText = rawText.replace(/^Q\d+\.\s*/, '').trim();
      console.log(`\n[Q${i}] Text: ${qText}`);
      
      // Find matching question in pool
      const qData = allQuestions.find(q => q.question === qText);
      if (!qData) {
        console.log(`❌ No matching question found in pool for text! Skipping...`);
        await page.getByRole('button', { name: 'スキップして次へ' }).click();
        continue;
      }
      
      console.log(`🔍 Found Question ID: ${qData.id}, Type: ${qData.type}`);
      
      // Execute solution
      if (qData.expectedKeySequence) {
        console.log(`⌨️ Sequence: ${JSON.stringify(qData.expectedKeySequence)}`);
        for (const step of qData.expectedKeySequence) {
          const pwKey = step.keys
            .map(k => {
              const mk = k.toLowerCase();
              if (mk === 'arrowleft') return 'ArrowLeft';
              if (mk === 'arrowright') return 'ArrowRight';
              if (mk === 'arrowup') return 'ArrowUp';
              if (mk === 'arrowdown') return 'ArrowDown';
              if (mk === 'pagedown') return 'PageDown';
              if (mk === 'pageup') return 'PageUp';
              if (mk === 'backspace') return 'Backspace';
              if (mk === 'delete') return 'Delete';
              if (mk === 'escape') return 'Escape';
              if (mk === 'equal') return '=';
              if (mk === 'semicolon') return ';';
              if (mk === 'plus') return '+';
              if (mk === 'slash') return '/';
              if (mk === 'grave') return '\`';
              if (mk === 'period') return '.';
              if (mk === 'comma') return ',';
              if (mk === 'space') return 'Space';
              
              let res = mk.replace(/ctrl/i, 'Control').replace(/control/i, 'Control').replace(/win/i, 'Meta').replace(/^alt$/i, 'Alt').replace(/^shift$/i, 'Shift');
              return res.charAt(0).toUpperCase() + res.slice(1);
            })
            .join('+');
          console.log(`  Pressing: ${pwKey}`);
          await page.keyboard.press(pwKey);
          await page.waitForTimeout(300);
        }
      } else if (qData.expectedKeyCombo) {
        console.log(`⌨️ Combo: ${qData.expectedKeyCombo}`);
        const pwKey = (Array.isArray(qData.expectedKeyCombo) ? qData.expectedKeyCombo : [qData.expectedKeyCombo])
          .map(k => {
              const mk = k.toLowerCase();
              if (mk === 'arrowleft') return 'ArrowLeft';
              if (mk === 'arrowright') return 'ArrowRight';
              if (mk === 'arrowup') return 'ArrowUp';
              if (mk === 'arrowdown') return 'ArrowDown';
              if (mk === 'pagedown') return 'PageDown';
              if (mk === 'pageup') return 'PageUp';
              if (mk === 'backspace') return 'Backspace';
              if (mk === 'delete') return 'Delete';
              if (mk === 'escape') return 'Escape';
              if (mk === 'equal') return '=';
              if (mk === 'semicolon') return ';';
              if (mk === 'plus') return '+';
              if (mk === 'slash') return '/';
              if (mk === 'grave') return '\`';
              if (mk === 'period') return '.';
              if (mk === 'comma') return ',';
              if (mk === 'space') return 'Space';
              
              let res = mk.replace(/ctrl/i, 'Control').replace(/control/i, 'Control').replace(/win/i, 'Meta').replace(/^alt$/i, 'Alt').replace(/^shift$/i, 'Shift');
              return res.charAt(0).toUpperCase() + res.slice(1);
            })
          .join('+');
        console.log(`  Pressing: ${pwKey}`);
        await page.keyboard.press(pwKey);
      } else if (qData.type === 'copy_paste') {
        // Find the copyable text, focus input, paste.
        // Actually, the keyboard hook listens to Control+C then Control+V on the input.
        console.log(`📋 Copy Paste operation`);
        // Just send Ctrl+C then Ctrl+V
        await page.keyboard.press('Control+C');
        await page.waitForTimeout(300);
        await page.keyboard.press('Control+V');
      } else if (qData.type === 'find_password') {
        console.log(`🔍 Find password operation`);
        await page.keyboard.press('Control+F');
        await page.waitForTimeout(300);
        // We have to type the password in the mock, but the validation just checks if the input matches!
        // In the find_password mock, user types 'secret123' in the input.
        // Wait, where is the password? The mock sets it internally.
        // Let's just try typing the known password if we can parse it from taskData, or just send keys.
        // Actually find_password has `qData.taskData.password`.
        const pwd = qData.taskData?.password || 'secret123';
        await page.keyboard.type(pwd);
        await page.keyboard.press('Enter');
      } else {
        console.log(`⚠️ Unhandled type: ${qData.type}, skipping...`);
        await page.getByRole('button', { name: 'スキップして次へ' }).click();
      }
      
      // Wait to see if it was correct (next question loads or success toast)
      await page.waitForTimeout(1000);
      const newText = await page.locator('h2').first().textContent().catch(() => '');
      
      // If it's the last question, the app might open the SubmitConfirmModal instead of changing h2
      const isSubmitModalOpen = await page.locator('[class*="SubmitConfirmModal"]').isVisible().catch(() => false);
      
      if (newText !== qText || isSubmitModalOpen) {
        console.log(`✅ Success! Moved to next question or finished exam.`);
        score++;
        
        if (isSubmitModalOpen) {
          const confirmBtn = page.getByRole('button', { name: '提出して採点する' }).or(page.getByRole('button', { name: '本当に終了する' })).or(page.getByRole('button', { name: '終了する' })).first();
          if (await confirmBtn.isVisible().catch(() => false)) {
              await confirmBtn.click();
              console.log('Clicked submit on last question success.');
              break;
          }
        }
      } else {
        console.log(`❌ Failed to solve. Still on same question.`);
        // Take a debug screenshot
        await page.screenshot({ path: path.join(artifactDir, `failed_${gradeToTest}_q${i}.png`) });
        await page.getByRole('button', { name: 'スキップして次へ' }).click({ force: true });
        
        // Handle SubmitConfirmModal if it appears
        await page.waitForTimeout(500);
          const isSubmitModalOpen = await page.locator('[class*="SubmitConfirmModal"]').isVisible().catch(() => false);
          if (isSubmitModalOpen) {
            const confirmBtn = page.getByRole('button', { name: '提出して採点する' }).first();
            if (await confirmBtn.isVisible().catch(() => false)) {
                await confirmBtn.click();
                console.log('Clicked submit after skip.');
                break;
            }
          }
      }
    }
    
    await page.waitForTimeout(2000); // Wait for result screen
    const finalScreenshot = path.join(artifactDir, `ai_solver_result_${gradeToTest}.png`);
    await page.screenshot({ path: finalScreenshot });
    console.log(`\n🎉 Exam finished! Final screenshot saved to ${finalScreenshot}`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
