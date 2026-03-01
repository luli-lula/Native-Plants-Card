# Native Plant Cards — Wild Ones Capital Region NY

36 Keystone native plant cards for the Capital Region of New York.

Each plant has two linked outputs:
- **Print Card** (4 x 6 inch) — physical card with QR code, exported as PNG
- **Mobile Web Page** — interactive card-flip page at the QR code URL

Live site: [ailula.top/Native-Plants-Card/plants/](https://ailula.top/Native-Plants-Card/plants/)

## Quick Start

```bash
npm install                # Install dependencies (qrcode, playwright)
npm run build              # Generate print cards + mobile pages
npm run serve              # Start local server at localhost:8000
```

## Project Structure

```
├── data/plants.json           ← Single source of truth (36 plants)
├── assets/
│   ├── icons/                 ← All icon assets
│   └── photos/                ← Plant photos ({id}.jpg)
├── tools/                     ← Build scripts
│   ├── generate-print-cards.js
│   ├── generate-pages.js
│   └── screenshot-cards.js    ← PNG export (Playwright)
├── plants/                    ← Mobile web pages (GitHub Pages)
│   ├── index.html             ← All Plants catalog
│   ├── collection.html        ← My Plants (saved)
│   └── {plant-id}/index.html  ← Individual plant pages
└── print/
    ├── html/                  ← Print card HTML files
    └── png/                   ← Final PNGs for print (gitignored)
```

See [WORKFLOW.md](WORKFLOW.md) for detailed documentation.

## License

Icons and content created for Wild Ones Capital Region NY.
