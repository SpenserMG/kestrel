const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:60209/games', { waitUntil: 'networkidle' });
  await page.waitForSelector('mat-card');
  await page.evaluate(() => document.fonts.ready);

  const measure = () => page.evaluate(() => {
    const c = document.querySelector('mat-card-content');
    const range = document.createRange();
    range.selectNodeContents(c);
    const rects = range.getClientRects();
    return {
      contentHeight: c.getBoundingClientRect().height,
      lineRects: Array.from(rects).map((r) => ({ top: r.top, height: r.height })),
      computedFontSize: getComputedStyle(c).fontSize,
      computedLineHeight: getComputedStyle(c).lineHeight,
      computedPadding: getComputedStyle(c).padding,
    };
  });

  console.log('BEFORE:', JSON.stringify(await measure(), null, 2));

  const card = await page.locator('mat-card');
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  console.log('DURING:', JSON.stringify(await measure(), null, 2));
  await page.mouse.up().catch(() => {});

  await browser.close();
})();
