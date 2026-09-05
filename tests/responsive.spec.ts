import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("share page fits a mobile viewport", async ({ page }) => {
  await page.goto("/share?grade=5kyu&gradeTitle=5%E7%B4%9A&score=8&rate=80&passed=true");
  await expect(page.getByText("ショートカットキー検定").first()).toBeVisible();
  const sizes = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
});

test("result page fits a mobile viewport", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("examResult", JSON.stringify({
      score: 0,
      total: 5,
      rate: 0,
      passed: false,
      wrongAnswers: [],
      lastName: "Codex",
      firstName: "テスト",
      gradeTitle: "5級 (Windows版)",
      gradeId: "5kyu",
    }));
  });
  await page.goto("/exam/result");
  await expect(page.getByText("結果の振り返り")).toBeVisible();
  const sizes = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
});
