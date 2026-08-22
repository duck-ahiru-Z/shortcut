import { test, expect } from '@playwright/test';

test.describe('5kyu Exams', () => {
  test('Knowledge Exam (5級 知識試験) - Happy Path', async ({ page }) => {
    // 1. トップページから一覧へ
    await page.goto('/');
    
    // 2. 直接試験URLへ移動
    await page.goto('/exam?grade=5kyu');

    // 3. 名前入力画面
    await page.getByPlaceholder('姓').fill('Playwright');
    await page.getByPlaceholder('名').fill('知識');
    
    // 利用規約に同意する
    await page.getByRole('checkbox').check();
    
    // 「試験を開始する」ボタンをクリック
    await page.getByRole('button', { name: '試験を開始する' }).click();

    // 4. 問題画面 (全10問)
    for (let i = 1; i <= 10; i++) {
      // 選択肢の最初のものをクリックし続ける
      await expect(page.locator('#exam-screen')).toBeVisible({ timeout: 10000 });
      // 選択肢ボタンの中で、一番最初のものをクリックする
      await page.locator('button[class*="choiceBtn"]').first().click();
      
      const nextBtn = page.getByRole('button', { name: '次の問題に進む' });
      const resultBtn = page.getByRole('button', { name: '解答を提出する' });

      if (await nextBtn.isVisible()) {
        await nextBtn.click();
      } else if (await resultBtn.isVisible()) {
        await resultBtn.click();
        break;
      }
    }

    // 5. 結果画面の確認
    await expect(page.getByText('結果の振り返り')).toBeVisible({ timeout: 15000 });
    // 「正答率」の文字が表示されていればOK
    await expect(page.getByText('正答率')).toBeVisible();
  });

  test('Practical Exam (5級 実務検定) - Navigation Test', async ({ page }) => {
    await page.goto('/exam?grade=practical-5kyu');
    
    await page.getByPlaceholder('姓').fill('Playwright');
    await page.getByPlaceholder('名').fill('実務');
    
    // 利用規約に同意する
    await page.getByRole('checkbox').check();
    
    await page.getByRole('button', { name: '試験を開始する' }).click();

    // 問題文が表示されるか確認
    await expect(page.getByText('残り時間')).toBeVisible({ timeout: 10000 });

    // キーボードショートカットの送信例
    // 実際の実務試験はDOMにfocusを当ててからキーボードを押す必要がある
    await page.keyboard.press('Control+C');

    // スキップボタンがある場合はスキップしてみる
    const skipBtn = page.getByRole('button', { name: 'スキップ' });
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      await page.waitForTimeout(500); // 遷移待ち
    }

    // 結果画面に行ければOKだが、今回は出題画面のレンダリング確認までとする
  });
});
