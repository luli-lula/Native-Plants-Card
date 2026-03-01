# Wild Ones CRNY — Native Plant Cards Workflow

## Project Overview

This project produces two linked outputs for each native plant:

1. **Print Card** (4×6 inch) — physical card with QR code, produced as PNG
2. **Mobile Web Page** — interactive card-flip page at the QR code URL

Both outputs are generated from a single data source: `data/plants.json`

## Directory Structure

```
site/
├── data/plants.json              ← Single source of truth
├── assets/
│   ├── icons/                    ← All icon assets (attribute, badge, pollinator, selling-point, warning, ui)
│   └── photos/                   ← Plant photos ({id}.jpg)
├── tools/
│   ├── icon-map.js               ← Shared icon/color mappings
│   ├── generate-print-cards.js   ← Print card generator
│   ├── generate-pages.js         ← Mobile page generator
│   └── screenshot-cards.js       ← PNG export (Playwright)
├── plants/                       ← DEPLOYED: Mobile web pages (GitHub Pages)
│   ├── index.html                ← Plant catalog
│   └── {plant-id}/index.html     ← Individual plant pages
├── print/
│   ├── html/                     ← Intermediate: Print card HTML files
│   └── png/                      ← Output: Final PNGs (gitignored)
└── package.json
```

## Quick Commands

```bash
npm run print    # Generate print card HTML → print/html/
npm run pages    # Generate mobile pages → plants/
npm run build    # Generate both
npm run serve    # Start local server at localhost:8000
```

## Adding a New Plant

### Step 1: Prepare photo
Save the plant photo as `assets/photos/{plant-id}.jpg`
- Use lowercase, hyphen-separated common name as ID (e.g., `bee-balm`)
- JPG format, reasonable size (100-300KB)

### Step 2: Add data entry
Edit `data/plants.json`, add a new object with **required** fields:

```json
{
  "id": "bee-balm",
  "common": "Bee Balm",
  "species": "Monarda didyma",
  "type": "Perennial",
  "native": "New York",
  "pollinators": ["bees", "butterflies", "hummingbirds"],
  "light": "Sun to Part",
  "moisture": "Moist",
  "soil": "Clay, Loam",
  "bloom_color": "Red",
  "bloom_months": "Jul - Sep",
  "height": "2-4'",
  "selling_points": ["Pollinator Magnet", "Deer Resistant"],
  "cautions": ["Spreads by Root"],
  "notes": "Host plant for several moth species"
}
```

### Step 3: Generate
```bash
npm run build
```

### Step 4: Preview
- Print card: open `print/html/{id}.html` in browser
- Mobile page: open `plants/{id}/index.html` directly in browser

### Step 5: Deploy
```bash
git add data/plants.json assets/photos/{id}.jpg plants/{id}/
git commit -m "Add {plant name}"
git push
```
GitHub Pages auto-deploys the `plants/` directory.

## Data Schema

### Required Fields
| Field | Type | Example |
|---|---|---|
| `id` | string | `"canada-anemone"` |
| `common` | string | `"Canada Anemone"` |
| `species` | string | `"Anemone canadensis"` |
| `type` | string | `"Perennial"`, `"Shrub"`, `"Vine"`, etc. |
| `native` | string | `"New York"` or `"USA"` |
| `pollinators` | string[] | `["bees", "butterflies"]` |
| `light` | string | `"Sun"`, `"Sun to Part"`, `"Part to Shade"`, `"Shade"` |
| `moisture` | string | `"Dry"`, `"Dry to Moist"`, `"Moist"`, `"Moist to Wet"` |
| `soil` | string | `"Clay, Loam"`, `"Sandy"`, `"Any"`, etc. |
| `bloom_color` | string | `"White"`, `"Red & Yellow"` |
| `bloom_months` | string | `"Apr - Jun"` |
| `height` | string | `"1-2'"`, `"6-12\""` |
| `selling_points` | string[] | `["Deer Resistant", "Ground Cover"]` |
| `cautions` | string[] | `["Spreads by Root"]` |
| `notes` | string | Short description |

### Optional Fields
| Field | Used In | Purpose |
|---|---|---|
| `foliage` | Print + Mobile | Ferns only: `"Evergreen"` or `"Deciduous"` |
| `facts` | Print + Mobile | Badge-style facts: `[{title, sub}]` |
| `fun_facts` | Mobile only | Rich facts with emoji: `[{icon, text}]` |
| `wildlife` | Mobile only | Wildlife value: `[{emoji, title, desc}]` |
| `companions` | Mobile only | Companion plants: `[{emoji, name}]` |
| `planting_steps` | Mobile only | Planting guide: `[string]` |
| `seasonal_tips` | Mobile only | Monthly tips: `{"0": "January...", ...}` |

### Available Selling Points
`Deer Resistant`, `Drought Tolerant`, `Rabbit Resistant`, `Nitrogen Fixing`, `Rain Garden`, `Winter Interest`, `Ground Cover`, `Rock Garden`, `Self-Seeding`, `Cut Flower`, `Fragrant`, `Pollinator Magnet`, `Shade Garden`, `Late Bloomer`

### Available Cautions
`Deep Roots`, `Spreads by Root`, `Spreads by Seed`, `Thorns`, `Toxic to Humans`, `Toxic to Pets`

## Adding a New Icon

1. Create the icon as 512×512 PNG
2. Save to `assets/icons/{category}/` with consistent naming:
   - `sp_` prefix for selling points
   - `warn_` prefix for warnings
   - `attr_` prefix for attributes
3. Add the mapping in `tools/icon-map.js`
4. Regenerate: `npm run build`

## Regenerating Everything

After modifying a template or icon-map:
```bash
npm run build
```
This regenerates all 36+ print cards AND mobile pages.

## QR Code URLs

Print cards contain QR codes pointing to:
```
https://ailula.top/Native-Plants-Card/plants/{plant-id}/
```
The base URL is configurable in `tools/generate-print-cards.js` → `GITHUB_PAGES_BASE`.

GitHub repo: https://github.com/luli-lula/Native-Plants-Card
Custom domain: ailula.top

## Print Export (PNG)

```bash
node tools/screenshot-cards.js    # Requires Playwright
```
PNGs are saved to `print/png/` (gitignored — large files for print shop only).
