/**
 * Batch Card Generator — Wild Ones Capital Region NY
 * Reads plants.json → generates 36 self-contained HTML card files
 */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const {
  POLLINATOR_ICONS,
  NATIVE_BADGE,
  SP_ICONS,
  CAUTION_ICONS,
  lightIcon,
  moistureIcon,
  soilIcon,
  lightLabel,
  moistureLabel,
} = require('./icon-map');

// ─── CONFIG ───
const DATA_FILE = path.join(__dirname, '../data/plants.json');
const CARDS_DIR = path.join(__dirname, '../print/html');
const ICONS_BASE = '../../assets/icons';  // relative from print/html/ → ../../ = repo root
const ASSETS_DIR = '../../assets/icons';  // nfc-tap.png and LOGO.png live here too
const GITHUB_PAGES_BASE = 'https://ailula.top/Native-Plants-Card/plants';

// ─── HTML GENERATORS ───
function pollinatorSlots(pollinators) {
  return pollinators.map(p => {
    const icon = POLLINATOR_ICONS[p];
    if (!icon) return '';
    const label = p.charAt(0).toUpperCase() + p.slice(1);
    return `        <div class="icon-slot" title="${label}">
          <img class="icon-img" alt="${label}" src="${ICONS_BASE}/${icon}">
        </div>`;
  }).join('\n');
}

function badgeSlots(sellingPoints, cautions, facts) {
  const items = [];

  sellingPoints.forEach(sp => {
    const def = SP_ICONS[sp];
    if (!def) { console.warn('  ⚠ Unknown selling point:', sp); return; }
    items.push(`            <div class="sp-badge">
              <div class="sp-icon" style="background:${def.bg}">
                <img class="icon-img" alt="${sp}" src="${ICONS_BASE}/${def.icon}">
              </div>
              <div class="sp-text">
                <span class="sp-title">${sp}</span>
                <span class="sp-sub">${def.sub}</span>
              </div>
            </div>`);
  });

  cautions.forEach(c => {
    const def = CAUTION_ICONS[c];
    if (!def) { console.warn('  ⚠ Unknown caution:', c); return; }
    items.push(`            <div class="sp-badge">
              <div class="sp-icon" style="background:#ffe0b2">
                <img class="icon-img" alt="${c}" src="${ICONS_BASE}/${def.icon}">
              </div>
              <div class="sp-text">
                <span class="sp-title">${c}</span>
                <span class="sp-sub">${def.sub}</span>
              </div>
            </div>`);
  });

  // Fact badges — Did You Know lightbulb icon
  if (facts && facts.length) {
    facts.forEach(f => {
      items.push(`            <div class="sp-badge">
              <div class="sp-icon" style="background:#e8eaf6">
                <img class="icon-img" alt="Did You Know" src="${ICONS_BASE}/ui/ui_didyouknow.png">
              </div>
              <div class="sp-text">
                <span class="sp-title">${f.title}</span>
                <span class="sp-sub">${f.sub}</span>
              </div>
            </div>`);
    });
  }

  return items.join('\n');
}

function bloomAttr(plant) {
  // Fern — show foliage type instead of bloom
  if (plant.foliage) {
    return `      <div class="attr-item">
        <img class="icon-img" alt="Foliage" src="${ICONS_BASE}/attribute/attr_foliage.png">
        <span class="attr-value">${plant.foliage}</span>
      </div>`;
  }
  return `      <div class="attr-item">
        <img class="icon-img" alt="Bloom" src="${ICONS_BASE}/attribute/attr_bloom.png">
        <span class="attr-value">${plant.bloom_color}<br>${plant.bloom_months}</span>
      </div>`;
}

// ─── MAIN CARD TEMPLATE ───
function generateCard(plant, qrDataUri) {
  const nativeBadge = NATIVE_BADGE[plant.native] || NATIVE_BADGE['USA'];
  const pollinators = pollinatorSlots(plant.pollinators);
  const badges = badgeSlots(plant.selling_points, plant.cautions, plant.facts);
  const bloom = bloomAttr(plant);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${plant.common} — Wild Ones Plant Card</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Libre+Baskerville:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
  :root {
    --sage:#6b8f71;--sage-light:#e9f0ea;--cream:#f5f0e6;--cream-light:#faf8f3;
    --warm-gray:#8a8478;--text:#2a2a2a;--text-light:#666;--border:#e0dbd0;
    --badge-bg:#f4f1eb;--card-w:6in;--card-h:4in;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#d6d1c8;font-family:'DM Sans',system-ui,sans-serif;
    min-height:100vh;display:flex;flex-direction:column;align-items:center;
    padding:40px 20px 60px;color:var(--text)}

  .stamp-outer{position:relative;padding:11px;background:var(--cream);
    -webkit-mask-image:
      radial-gradient(circle at 5.5px 0,transparent 4px,black 4.5px),
      radial-gradient(circle at 5.5px 100%,transparent 4px,black 4.5px),
      radial-gradient(circle at 0 5.5px,transparent 4px,black 4.5px),
      radial-gradient(circle at 100% 5.5px,transparent 4px,black 4.5px);
    -webkit-mask-size:11px 100%,11px 100%,100% 11px,100% 11px;
    -webkit-mask-position:top,bottom,left,right;
    -webkit-mask-repeat:repeat-x,repeat-x,repeat-y,repeat-y;
    -webkit-mask-composite:source-in;mask-composite:intersect;
    box-shadow:0 8px 40px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.08);user-select:none}

  .card{position:relative;width:var(--card-w);height:var(--card-h);
    background:var(--cream-light);display:grid;grid-template-rows:auto 1fr auto;
    overflow:hidden;border:1px solid var(--border)}

  .card-header{padding:7px 12px 6px 15px;display:flex;align-items:center;
    justify-content:space-between;gap:8px;border-bottom:1px solid var(--border);background:#3d5a40}
  .header-left{display:flex;align-items:baseline;gap:10px}
  .name-block{display:flex;flex-direction:column}
  .common-name{font-family:'Oswald',sans-serif;font-weight:700;font-size:21px;
    letter-spacing:1px;text-transform:uppercase;line-height:1.05;color:#fff}
  .scientific-name{font-family:'Libre Baskerville',Georgia,serif;font-style:italic;
    font-size:9.5px;margin-top:1px;color:rgba(255,255,255,.75)}
  .header-right{display:flex;align-items:center;gap:4px;flex-shrink:0}
  .icon-slot{width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(255,255,255,.95);
    display:flex;align-items:center;justify-content:center;
    background:rgba(255,255,255,.98);box-shadow:0 1px 0 rgba(0,0,0,.18)}
  .icon-slot .icon-img{width:24px;height:24px;object-fit:contain;image-rendering:-webkit-optimize-contrast}
  .native-badge{flex-shrink:0;width:38px;height:38px;margin-left:2px;
    display:flex;align-items:center;justify-content:center}
  .native-badge img{width:38px;height:38px;object-fit:contain;display:block}

  .card-body{display:grid;grid-template-columns:42% 1fr;gap:14px;padding:10px 16px;min-height:0}
  .photo-area{border-radius:5px;overflow:hidden;height:100%;width:100%;background:#fff;
    display:flex;align-items:center;justify-content:center}
  .photo-area img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
  .photo-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;
    width:100%;height:100%;background:#e8e4dc;color:#999;font-size:11px;text-align:center;gap:4px}
  .photo-placeholder .ph-name{font-family:'Oswald',sans-serif;font-size:14px;color:#777;
    text-transform:uppercase;letter-spacing:1px}

  .info-panel{display:flex;flex-direction:column;justify-content:space-between}
  .badge-list{display:flex;flex-direction:column;gap:5px}
  .sp-badge{display:flex;align-items:center;gap:7px;background:var(--badge-bg);
    border-radius:6px;padding:6px 8px;border:1px solid rgba(0,0,0,.04)}
  .sp-badge .sp-icon{width:24px;height:24px;border-radius:5px;
    display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .sp-icon .icon-img{width:24px;height:24px;object-fit:contain;image-rendering:-webkit-optimize-contrast}
  .sp-text{display:flex;flex-direction:column}
  .sp-text .sp-title{font-size:10px;font-weight:700;color:var(--text);line-height:1.15;letter-spacing:.2px}
  .sp-text .sp-sub{font-size:7.5px;font-weight:400;color:var(--text-light);line-height:1.2}

  .branding-row{display:flex;align-items:center;margin-top:auto;padding-top:6px;
    border-top:1px solid var(--border);gap:12px}
  .scan-section{display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex:1}
  .brand-cta{text-align:center}
  .brand-cta-line{font-size:7px;font-weight:400;color:var(--warm-gray);line-height:1.3;display:block}
  .brand-cta-line.main{font-weight:500;font-size:7.5px;letter-spacing:.3px}
  .brand-divider{width:0;height:36px;border-left:1px dashed var(--border);flex-shrink:0}
  .scan-panel{display:flex;align-items:center;gap:4px;flex-shrink:0}
  .nfc-icon{height:38px;width:auto;object-fit:contain;opacity:.7}
  .scan-label{font-size:7.5px;font-weight:700;color:#3d5a40;text-transform:uppercase;letter-spacing:.8px}
  .scan-or{display:flex;flex-direction:column;align-items:center;gap:2px;padding:0 3px}
  .scan-or-line{width:1px;height:10px;background:rgba(0,0,0,.12)}
  .scan-or span{font-size:6.5px;color:var(--warm-gray);font-style:italic}
  .scan-frame{position:relative;width:42px;height:42px;padding:3px;flex-shrink:0}
  .corner{display:none}
  .scan-frame .qr-img{width:100%;height:100%;border-radius:1px;display:block}
  .logo-wrap{position:relative;display:flex;flex-direction:column;align-items:center;
    justify-content:center;flex-shrink:0}
  .logo-img{height:46px;width:auto;object-fit:contain}

  .attr-strip{position:relative;background:#f0ece4;border-top:1px solid var(--border);
    padding:6px 15px 8px;display:flex;align-items:center;justify-content:space-around}
  .attr-item{display:flex;flex-direction:column;align-items:center;gap:1px;flex:1}
  .attr-item .icon-img{width:36px;height:36px;object-fit:contain;image-rendering:-webkit-optimize-contrast}
  .attr-item .attr-value{font-size:8.5px;font-weight:500;color:var(--text);text-align:center;line-height:1.2}
  .attr-divider{width:1px;height:26px;background:var(--border);flex-shrink:0}
</style>
</head>
<body>

<div class="stamp-outer">
  <div class="card">

    <!-- Header -->
    <div class="card-header">
      <div class="header-left">
        <div class="name-block">
          <span class="common-name">${plant.common}</span>
          <span class="scientific-name">${plant.species}</span>
        </div>
      </div>
      <div class="header-right">
${pollinators}
        <div class="native-badge" title="${plant.native} Native">
          <img alt="${plant.native} Native" src="${ICONS_BASE}/${nativeBadge}">
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <div class="photo-area">
        <img src="../../assets/photos/${plant.id}.jpg" alt="${plant.common}">
      </div>

      <div class="info-panel">
        <div>
          <div class="badge-list">
${badges}
          </div>
        </div>

        <div class="branding-row">
          <div class="scan-section">
            <div class="scan-panel">
              <img class="nfc-icon" src="${ASSETS_DIR}/nfc-tap.png" alt="Tap NFC">
              <span class="scan-label">Tap</span>
              <div class="scan-or">
                <div class="scan-or-line"></div>
                <span>or</span>
                <div class="scan-or-line"></div>
              </div>
              <div class="scan-frame">
                <img class="qr-img" src="${qrDataUri}" alt="QR code">
              </div>
              <span class="scan-label">Scan</span>
            </div>
            <div class="brand-cta">
              <span class="brand-cta-line main">Plant guide &middot; wildlife value &middot; companions</span>
            </div>
          </div>
          <div class="brand-divider"></div>
          <div class="logo-wrap">
            <img class="logo-img" alt="Wild Ones Capital Region NY" src="${ASSETS_DIR}/LOGO.png">
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom strip -->
    <div class="attr-strip">
      <div class="attr-item">
        <img class="icon-img" alt="Light" src="${ICONS_BASE}/${lightIcon(plant.light)}">
        <span class="attr-value">${lightLabel(plant.light)}</span>
      </div>
      <div class="attr-divider"></div>
      <div class="attr-item">
        <img class="icon-img" alt="Water" src="${ICONS_BASE}/${moistureIcon(plant.moisture)}">
        <span class="attr-value">${moistureLabel(plant.moisture)}</span>
      </div>
      <div class="attr-divider"></div>
      <div class="attr-item">
        <img class="icon-img" alt="Soil" src="${ICONS_BASE}/${soilIcon(plant.soil)}">
        <span class="attr-value">${plant.soil}</span>
      </div>
      <div class="attr-divider"></div>
      <div class="attr-item">
        <img class="icon-img" alt="Size" src="${ICONS_BASE}/attribute/attr_size.png">
        <span class="attr-value">${plant.height}</span>
      </div>
      <div class="attr-divider"></div>
${bloom}
    </div>

  </div>
</div>

</body>
</html>`;
}

// ─── MAIN ───
async function main() {
  const plants = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  fs.mkdirSync(CARDS_DIR, { recursive: true });

  console.log(`Generating ${plants.length} plant cards...\n`);

  for (const plant of plants) {
    const qrUrl = `${GITHUB_PAGES_BASE}/${plant.id}/`;
    const qrDataUri = await QRCode.toDataURL(qrUrl, {
      width: 150, margin: 1,
      color: { dark: '#3d5a40', light: '#ffffff' }
    });

    const html = generateCard(plant, qrDataUri);
    const outPath = path.join(CARDS_DIR, `${plant.id}.html`);
    fs.writeFileSync(outPath, html, 'utf8');

    const badgeCount = plant.selling_points.length + plant.cautions.length + (plant.facts ? plant.facts.length : 0);
    console.log(`  ✓ ${plant.common.padEnd(25)} ${badgeCount} badges`);
  }

  // Generate an index page listing all cards
  const indexHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wild Ones — All Plant Cards</title>
<style>
  body{font-family:'DM Sans',system-ui,sans-serif;max-width:600px;margin:40px auto;padding:0 20px;color:#2a2a2a}
  h1{font-size:20px;color:#3d5a40;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px}
  a{display:block;padding:8px 0;color:#3d5a40;text-decoration:none;border-bottom:1px solid #e0dbd0}
  a:hover{background:#f5f0e6}
  .count{color:#8a8478;font-size:12px;float:right}
</style></head><body>
<h1>Plant Cards (${plants.length})</h1>
${plants.map(p => {
  const n = p.selling_points.length + p.cautions.length + (p.facts ? p.facts.length : 0);
  return `<a href="${p.id}.html">${p.common} <i style="color:#8a8478;font-size:12px">${p.species}</i><span class="count">${n} badges</span></a>`;
}).join('\n')}
</body></html>`;
  fs.writeFileSync(path.join(CARDS_DIR, 'index.html'), indexHtml, 'utf8');

  console.log(`\n✅ Done! ${plants.length} cards generated in ${CARDS_DIR}`);
  console.log(`   Open print/html/index.html to browse all cards`);
}

main().catch(console.error);
