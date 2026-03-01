/**
 * One-shot icon migration script
 * Copies icons/export/ → assets/icons/ with clean, consistent filenames
 *
 * Rules:
 *   - All lowercase
 *   - Underscores within prefix (sp_, warn_, attr_, poll_, badge_, ui_)
 *   - No spaces in filenames
 *   - Subdirectory: selling_point → selling-point
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../icons/export');
const DST = path.join(__dirname, '../assets/icons');

// Explicit rename map for files with problematic names
const RENAME = {
  'selling_point/Rain Garden .png':                'selling-point/sp_rain_garden.png',
  'selling_point/Winter Garden.png':               'selling-point/sp_winter_garden.png',
  'warning/ Thorns.png':                           'warning/warn_thorns.png',
  'warning/Deep Roots.png':                        'warning/warn_deep_roots.png',
  'warning/Aggressive Spreads by Root.png':        'warning/warn_spreads_root.png',
  'warning/Aggressive Spreads by Seed.png':        'warning/warn_spreads_seed.png',
  'warning/Toxic to Humans.png':                   'warning/warn_toxic_humans.png',
  'warning/Toxic to Pets.png':                     'warning/warn_toxic_pets.png',
  'warning/warn_aggressive.png':                   'warning/warn_aggressive.png',
  'warning/warn_pet.png':                          'warning/warn_pet.png',
  'badge/Naturalized.png':                         'badge/badge_naturalized.png',
  'badge/newjeserytea_real.png':                    null, // skip - not an icon
  'badge/badge_native_eastern.jpg':                null, // skip - duplicate format
};

// Directory rename map
const DIR_RENAME = {
  'selling_point': 'selling-point',
};

let copied = 0;
let skipped = 0;

function processDir(relDir) {
  const srcDir = path.join(SRC, relDir);
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir);
  for (const entry of entries) {
    if (entry === '.DS_Store') continue;

    const relPath = relDir ? `${relDir}/${entry}` : entry;
    const srcPath = path.join(SRC, relPath);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      processDir(relPath);
      continue;
    }

    // Check explicit rename map
    if (RENAME.hasOwnProperty(relPath)) {
      if (RENAME[relPath] === null) {
        console.log(`  SKIP  ${relPath}`);
        skipped++;
        continue;
      }
      const dstPath = path.join(DST, RENAME[relPath]);
      fs.mkdirSync(path.dirname(dstPath), { recursive: true });
      fs.copyFileSync(srcPath, dstPath);
      console.log(`  RENAME  ${relPath}  →  ${RENAME[relPath]}`);
      copied++;
      continue;
    }

    // Auto-copy with directory rename
    let dstRelPath = relPath;
    for (const [from, to] of Object.entries(DIR_RENAME)) {
      dstRelPath = dstRelPath.replace(from, to);
    }

    const dstPath = path.join(DST, dstRelPath);
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
    if (dstRelPath !== relPath) {
      console.log(`  MOVE  ${relPath}  →  ${dstRelPath}`);
    } else {
      console.log(`  COPY  ${relPath}`);
    }
    copied++;
  }
}

// Also copy LOGO.png and nfc-tap.png from root level
function copyRootAssets() {
  const logo = path.join(SRC, 'LOGO.png');
  if (fs.existsSync(logo)) {
    fs.copyFileSync(logo, path.join(DST, 'LOGO.png'));
    console.log(`  COPY  LOGO.png`);
    copied++;
  }

  // nfc-tap.png from demo folder
  const nfc = path.join(__dirname, '../demo/plant-card/nfc-tap.png');
  if (fs.existsSync(nfc)) {
    fs.copyFileSync(nfc, path.join(DST, 'nfc-tap.png'));
    console.log(`  COPY  nfc-tap.png → assets/icons/nfc-tap.png`);
    copied++;
  }
}

console.log('Migrating icons...\n');

// Process subdirectories
for (const dir of ['attribute', 'badge', 'pollinator', 'selling_point', 'warning', 'ui']) {
  processDir(dir);
}

copyRootAssets();

console.log(`\n✅ Done: ${copied} files copied, ${skipped} skipped`);
