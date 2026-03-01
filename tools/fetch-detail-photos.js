#!/usr/bin/env node
/**
 * fetch-detail-photos.js
 *
 * Downloads 4-6 detail photos per plant from iNaturalist (research-grade observations).
 * Saves to assets/photos/details/{plant-id}-1.jpg, {plant-id}-2.jpg, etc.
 * Updates data/plants.json with a "detail_photos" array for each plant.
 *
 * Usage:
 *   node tools/fetch-detail-photos.js              # All plants
 *   node tools/fetch-detail-photos.js new-jersey-tea  # Single plant
 *
 * iNaturalist API:
 *   GET https://api.inaturalist.org/v1/observations
 *   ?taxon_name=SPECIES&quality_grade=research&photos=true&per_page=20&order_by=votes
 *
 * Rate limit: ~1 req/sec (we add 1.2s delay between plants)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'plants.json');
const DETAILS_DIR = path.join(ROOT, 'assets', 'photos', 'details');
const PHOTOS_PER_PLANT = 5;

// ── helpers ──────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'WildOnes-CapitalNY-PlantCards/1.0' } }, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        res.resume();
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'WildOnes-CapitalNY-PlantCards/1.0' } }, res => {
      // Follow redirects (up to 3)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return downloadFile(res.headers.location, destPath).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} downloading ${url}`));
        return;
      }
      const ws = fs.createWriteStream(destPath);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(); });
      ws.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── main logic ───────────────────────────────────────────────────────

async function fetchPhotosForPlant(plant) {
  const species = encodeURIComponent(plant.species);
  const url = `https://api.inaturalist.org/v1/observations?taxon_name=${species}&quality_grade=research&photos=true&per_page=30&order_by=votes&locale=en`;

  console.log(`  Querying iNaturalist for "${plant.species}"...`);
  let data;
  try {
    data = await fetchJSON(url);
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
    return [];
  }

  if (!data.results || data.results.length === 0) {
    console.log(`  No observations found for ${plant.species}`);
    return [];
  }

  console.log(`  Found ${data.total_results} total observations`);

  // Collect unique photos from different observations for variety
  // Each observation can have multiple photos — pick the best one per observation
  const photoURLs = [];
  const seenObservations = new Set();

  for (const obs of data.results) {
    if (photoURLs.length >= PHOTOS_PER_PLANT) break;
    if (seenObservations.has(obs.id)) continue;
    seenObservations.add(obs.id);

    if (!obs.photos || obs.photos.length === 0) continue;

    // Use "medium" size (500px wide, good for mobile gallery)
    // iNaturalist URLs: .../photos/{id}/square.jpg, medium.jpg, large.jpg, original.jpg
    for (const photo of obs.photos) {
      if (photoURLs.length >= PHOTOS_PER_PLANT) break;
      let photoUrl = photo.url;
      if (!photoUrl) continue;
      // Convert square to medium size
      photoUrl = photoUrl.replace('/square.', '/medium.');
      photoURLs.push({
        url: photoUrl,
        attribution: photo.attribution || 'iNaturalist',
        observationId: obs.id
      });
    }
  }

  // Download each photo
  const savedPhotos = [];
  for (let i = 0; i < photoURLs.length; i++) {
    const photoInfo = photoURLs[i];
    const ext = photoInfo.url.match(/\.(jpe?g|png)/) ? photoInfo.url.match(/\.(jpe?g|png)/)[1] : 'jpg';
    const filename = `${plant.id}-${i + 1}.${ext}`;
    const destPath = path.join(DETAILS_DIR, filename);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`  [${i + 1}/${photoURLs.length}] Already exists: ${filename}`);
      savedPhotos.push(filename);
      continue;
    }

    try {
      console.log(`  [${i + 1}/${photoURLs.length}] Downloading ${filename}...`);
      await downloadFile(photoInfo.url, destPath);

      // Verify file was actually written and has content
      const stat = fs.statSync(destPath);
      if (stat.size < 1000) {
        console.log(`    WARNING: File too small (${stat.size} bytes), removing`);
        fs.unlinkSync(destPath);
        continue;
      }

      savedPhotos.push(filename);
    } catch (err) {
      console.log(`    FAILED: ${err.message}`);
      // Clean up partial file
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    }

    // Small delay between downloads
    await sleep(200);
  }

  return savedPhotos;
}

async function main() {
  // Create details directory
  if (!fs.existsSync(DETAILS_DIR)) {
    fs.mkdirSync(DETAILS_DIR, { recursive: true });
    console.log(`Created ${DETAILS_DIR}`);
  }

  // Load plant data
  const plants = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  // Check if a specific plant was requested
  const targetId = process.argv[2];
  const plantsToProcess = targetId
    ? plants.filter(p => p.id === targetId)
    : plants;

  if (targetId && plantsToProcess.length === 0) {
    console.error(`Plant "${targetId}" not found in plants.json`);
    process.exit(1);
  }

  console.log(`\n=== Fetching detail photos for ${plantsToProcess.length} plants ===\n`);

  let totalDownloaded = 0;
  let totalSkipped = 0;

  for (let i = 0; i < plantsToProcess.length; i++) {
    const plant = plantsToProcess[i];
    console.log(`[${i + 1}/${plantsToProcess.length}] ${plant.common} (${plant.species})`);

    const savedPhotos = await fetchPhotosForPlant(plant);

    // Update the plant object with detail_photos
    const fullPlant = plants.find(p => p.id === plant.id);
    if (savedPhotos.length > 0) {
      fullPlant.detail_photos = savedPhotos;
      totalDownloaded += savedPhotos.length;
      console.log(`  -> Saved ${savedPhotos.length} photos\n`);
    } else {
      console.log(`  -> No photos downloaded\n`);
      totalSkipped++;
    }

    // Rate limit: 1.2s delay between API calls
    if (i < plantsToProcess.length - 1) {
      await sleep(1200);
    }
  }

  // Write updated plants.json
  fs.writeFileSync(DATA_FILE, JSON.stringify(plants, null, 2) + '\n');
  console.log(`\n=== Done ===`);
  console.log(`Downloaded: ${totalDownloaded} photos`);
  console.log(`Plants skipped (no results): ${totalSkipped}`);
  console.log(`Updated: ${DATA_FILE}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
