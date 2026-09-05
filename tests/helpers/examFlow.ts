import { expect, Page, test } from "@playwright/test";

const TEST_LAST_NAME = "Codex";
const TEST_FIRST_NAME = "テスト";

async function startExam(page: Page, grade: string) {
  await page.goto(`/exam?grade=${grade}`);
  await page.getByPlaceholder("姓").fill(TEST_LAST_NAME);
  await page.getByPlaceholder("名").fill(TEST_FIRST_NAME);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "試験を開始する" }).click();
}

async function expectResult(page: Page) {
  await expect(page).toHaveURL(/\/exam\/result/, { timeout: 20_000 });
  await expect(page.getByText("結果の振り返り")).toBeVisible();
  await expect(page.getByText("正答率", { exact: true })).toBeVisible();
}

async function completeKnowledgeExam(page: Page, grade: string) {
  await startExam(page, grade);

  for (let i = 0; i < 40; i += 1) {
    await expect(page.locator("#exam-screen")).toBeVisible();
    await page.locator('button[class*="choiceBtn"]').first().click();

    const nextButton = page.getByRole("button", { name: /次の問題に進む/ });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      continue;
    }

    await page.getByRole("button", { name: /解答を提出する/ }).click();
    await page.getByRole("button", { name: "提出して採点する" }).click();
    await expectResult(page);
    return;
  }

  throw new Error(`${grade}: knowledge exam did not reach the result screen`);
}

async function completePracticalExam(page: Page, grade: string, os: "windows" | "mac") {
  await startExam(page, grade);

  await expect(page.getByText(/残り時間: (30:00|29:59)/)).toBeVisible();
  await page.getByRole("button", { name: "キーボードを表示" }).click();
  await expect(page.locator("select")).toHaveValue(os === "mac" ? "mac-jis" : "win-jis");
  await page.getByRole("button", { name: "×" }).click();

  for (let i = 0; i < 20; i += 1) {
    await page.getByRole("button", { name: "スキップして次へ" }).click();
    const submitButton = page.getByRole("button", { name: "提出して採点する" });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await expectResult(page);
      return;
    }
  }

  throw new Error(`${grade}: practical exam did not reach the result screen`);
}

export function defineGradeExamTests(grade: string, label: string, hasMacKnowledge = false) {
  test.describe(`${label} exams`, () => {
    test(`Windows knowledge completes: ${grade}`, async ({ page }) => {
      await completeKnowledgeExam(page, grade);
    });

    if (hasMacKnowledge) {
      test(`Mac knowledge completes: mac-${grade}`, async ({ page }) => {
        await completeKnowledgeExam(page, `mac-${grade}`);
      });
    }

    test(`Windows practical completes: practical-${grade}`, async ({ page }) => {
      await completePracticalExam(page, `practical-${grade}`, "windows");
    });

    test(`Mac practical completes: practical-mac-${grade}`, async ({ page }) => {
      await completePracticalExam(page, `practical-mac-${grade}`, "mac");
    });
  });
}
