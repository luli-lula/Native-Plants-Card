/**
 * Screenshot Export — Wild Ones Capital Region NY
 * Uses Playwright to screenshot each print card HTML → PNG
 *
 * Card CSS size: 6in × 4in + 11px stamp padding = ~598 × 406 CSS px
 * With deviceScaleFactor 4 → ~2392 × 1624 actual px (≈400 DPI for 6×4 print)
 *
 * Usage: node tools/screenshot-cards.js
 * Output: print/png/{plant-id}.png
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PERSONAL = process.argv.includes('--personal');
const CARDS_DIR = path.join(__dirname, PERSONAL ? '../print/html-personal' : '../print/html');
const PNG_DIR   = path.join(__dirname, PERSONAL ? '../print/png-personal' : '../print/png');

const SCALE = 4;  // 4x CSS resolution → ~400 DPI at 6×4 inch print

async function main() {
  fs.mkdirSync(PNG_DIR, { recursive: true });

  const files = fs.readdirSync(CARDS_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort();

  console.log(`Exporting ${files.length} cards at ${SCALE}x resolution...\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: SCALE,
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const id = file.replace('.html', '');
    const htmlPath = path.join(CARDS_DIR, file);
    const pngPath = path.join(PNG_DIR, `${id}.png`);

    const page = await context.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const card = await page.$('.stamp-outer');
    if (card) {
      await card.screenshot({
        path: pngPath,
        type: 'png',
        omitBackground: true,
      });
    } else {
      await page.screenshot({ path: pngPath, type: 'png' });
    }

    await page.close();

    const size = fs.statSync(pngPath).size;
    const kb = Math.round(size / 1024);
    console.log(`  [${String(i + 1).padStart(2)}/${files.length}] ${id}.png (${kb} KB)`);
  }

  await browser.close();

  // Report final dimensions of first file
  const firstPng = path.join(PNG_DIR, files[0].replace('.html', '.png'));
  console.log(`\n✅ Done! ${files.length} PNGs saved to ${PNG_DIR}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
