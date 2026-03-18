#!/usr/bin/env node
/**
 * generate-pages.js
 * Reads data/plants.json and generates one mobile web page per plant
 * plus an index catalog page at plants/index.html.
 *
 * Usage:  node tools/generate-pages.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

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

// ─── Paths ───
const ROOT      = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'plants.json');
const OUT_DIR   = path.join(ROOT, 'plants');

// Icon base from plants/{id}/index.html
const ICON_BASE  = '../../assets/icons/';
const PHOTO_BASE = '../../assets/photos/';

// ─── Helpers ───

function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escJS(s) {
  if (!s) return '';
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

/** Map SP_ICONS bg color to CSS class name */
function spColorClass(bg) {
  if (!bg) return 'green';
  if (bg === '#dcedc8' || bg === '#e8f5e9') return 'green';
  if (bg === '#fff9c4' || bg === '#fff3e0') return 'yellow';
  if (bg === '#ffcdd2' || bg === '#fce4ec') return 'pink';
  if (bg === '#bbdefb' || bg === '#e1f5fe') return 'blue';
  if (bg === '#d7ccc8') return 'brown';
  if (bg === '#f3e5f5') return 'purple';
  return 'green';
}

// ─── CSS (inline, copied from mobile.html template) ───

const CSS = `
  /* ========== TOKENS ========== */
  :root {
    --sage: #6b8f71;
    --sage-dark: #4a6350;
    --cream: #f8f5ef;
    --cream-dark: #ebe6dc;
    --warm-gray: #8a8478;
    --text: #2a2a2a;
    --text-light: #666;
    --border: #e0dbd0;

    --card-w: 340px;
    --card-h: 520px;
    --stamp-hole-r: 5px;
    --stamp-hole-gap: 14px;
    --stamp-pad: 14px;

    --flip-dur: 0.8s;
    --flip-ease: cubic-bezier(0.4, 0, 0.2, 1);

    --header-h: 56px;
    --bottom-bar-h: 72px;
  }

  /* ========== RESET ========== */
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    background: linear-gradient(145deg, #d4cfc4, #beb7aa);
    color: var(--text);
    -webkit-tap-highlight-color: transparent;
  }

  /* ========== HEADER ========== */
  .app-header {
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--header-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px;
    background: rgba(248, 245, 239, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    z-index: 100;
  }
  @supports not (backdrop-filter: blur(1px)) {
    .app-header { background: rgba(248, 245, 239, 0.95); }
  }

  .header-btn {
    border: none; cursor: pointer;
    font-family: inherit; font-size: 13px; font-weight: 600;
    background: none;
  }
  .back-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(0,0,0,0.05);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
    text-decoration: none;
  }
  .back-btn:hover { background: rgba(0,0,0,0.1); }
  .back-btn svg { width: 20px; height: 20px; stroke: var(--text); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  .header-logo {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
  }
  .header-logo img {
    height: 28px; width: auto; display: block;
  }

  .plants-btn {
    margin-left: auto;
    padding: 8px 16px;
    border-radius: 20px;
    background: var(--sage);
    color: #fff;
    letter-spacing: 0.3px;
    transition: opacity 0.2s;
    text-decoration: none;
    font-size: 13px; font-weight: 600;
  }
  .plants-btn:hover { opacity: 0.85; }

  /* ========== PAGE CONTENT — viewport-fit ========== */
  .page-content {
    position: fixed;
    top: var(--header-h);
    left: 0; right: 0;
    bottom: var(--bottom-bar-h);
    display: flex;
    align-items: center; justify-content: center;
    padding: 8px 20px;
    overflow: hidden;
  }

  /* ========== FLIP HINT ========== */
  .flip-hint {
    position: absolute;
    top: 8px; left: 0; right: 0;
    text-align: center;
    font-size: 13px; color: var(--warm-gray);
    pointer-events: none;
    z-index: 5;
    animation: hint-pulse 2s ease-in-out infinite;
  }
  .flip-hint.fade-out {
    animation: hint-fade 0.4s ease forwards;
  }
  @keyframes hint-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes hint-fade {
    to { opacity: 0; transform: translateY(-6px); }
  }

  /* ========== 3D CARD SCENE ========== */
  .card-scene {
    perspective: 1200px;
    width: calc(var(--card-w) + var(--stamp-pad) * 2);
    max-width: 100%;
    flex-shrink: 1;
    height: calc(var(--card-h) + var(--stamp-pad) * 2);
    max-height: 100%;
  }

  .card-flipper {
    width: 100%;
    height: 100%;
    position: relative;
    transition: transform var(--flip-dur) var(--flip-ease);
    transform-style: preserve-3d;
    will-change: transform;
    cursor: pointer;
  }
  .card-flipper.is-flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    filter: drop-shadow(0 6px 28px rgba(0,0,0,0.14));
  }

  .card-back {
    transform: rotateY(180deg);
  }

  /* ========== STAMP EDGE ========== */
  .stamp-wrapper {
    width: 100%; height: 100%;
    padding: var(--stamp-pad);
    background: var(--cream);
    position: relative;
    overflow: hidden;

    -webkit-mask-image:
      radial-gradient(circle at calc(var(--stamp-hole-gap) / 2) 0, transparent var(--stamp-hole-r), black calc(var(--stamp-hole-r) + 0.5px)),
      radial-gradient(circle at calc(var(--stamp-hole-gap) / 2) 100%, transparent var(--stamp-hole-r), black calc(var(--stamp-hole-r) + 0.5px)),
      radial-gradient(circle at 0 calc(var(--stamp-hole-gap) / 2), transparent var(--stamp-hole-r), black calc(var(--stamp-hole-r) + 0.5px)),
      radial-gradient(circle at 100% calc(var(--stamp-hole-gap) / 2), transparent var(--stamp-hole-r), black calc(var(--stamp-hole-r) + 0.5px));
    -webkit-mask-size:
      var(--stamp-hole-gap) 100%,
      var(--stamp-hole-gap) 100%,
      100% var(--stamp-hole-gap),
      100% var(--stamp-hole-gap);
    -webkit-mask-position: top, bottom, left, right;
    -webkit-mask-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
  }

  /* ========== FRONT FACE ========== */
  .front-inner {
    width: 100%; height: 100%;
    background: #f5f2ea;
    display: flex; flex-direction: column;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  /* Collect heart button */
  .collect-btn {
    position: absolute; top: 12px; right: 12px;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.92);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    z-index: 10;
    transition: transform 0.2s ease;
  }
  .collect-btn:hover { transform: scale(1.08); }
  .collect-btn svg {
    width: 22px; height: 22px;
    stroke: #999; stroke-width: 2; fill: none;
    transition: all 0.25s ease;
  }
  .collect-btn.is-saved svg {
    stroke: #e74c3c; fill: #e74c3c;
    animation: heartbeat 0.5s ease;
  }
  @keyframes heartbeat {
    0%   { transform: scale(1); }
    15%  { transform: scale(1.3); }
    30%  { transform: scale(0.95); }
    50%  { transform: scale(1.15); }
    70%  { transform: scale(1); }
  }

  /* Plant image */
  .plant-image-area {
    flex: 1; position: relative;
    overflow: hidden;
    min-height: 0;
    margin: -2px -2px 0 -2px;
  }
  .plant-image-area img {
    width: calc(100% + 16px);
    height: calc(100% + 16px);
    margin: -8px;
    object-fit: cover; object-position: center;
    display: block;
  }

  /* Pollinator row */
  .pollinator-row {
    position: absolute; bottom: 12px; left: 14px;
    display: flex; gap: 6px;
    z-index: 5;
  }
  .poll-badge {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.95);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }
  .poll-badge img { width: 22px; height: 22px; object-fit: contain; }

  /* Native badge */
  .native-badge-float {
    position: absolute; bottom: 8px; right: 14px;
    z-index: 5;
  }
  .native-badge-float img { width: 42px; height: 42px; object-fit: contain; }

  /* Front name block */
  .front-name-block {
    padding: 12px 16px 14px;
    background: var(--cream);
    text-align: center;
    flex-shrink: 0;
  }
  .plant-common-name {
    font-family: 'Oswald', sans-serif;
    font-weight: 700; font-size: 24px;
    letter-spacing: 1.5px; text-transform: uppercase;
    line-height: 1.1; color: var(--text);
  }
  .plant-scientific-name {
    font-family: 'Libre Baskerville', Georgia, serif;
    font-style: italic; font-size: 13px;
    color: var(--text-light);
    margin-top: 3px;
  }
  .plant-type-tag {
    display: inline-block;
    margin-top: 8px;
    padding: 3px 14px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.8px; text-transform: uppercase;
    color: var(--sage-dark);
    background: rgba(107, 143, 113, 0.12);
    border-radius: 20px;
  }

  /* ========== BACK FACE ========== */
  .back-inner {
    width: 100%; height: 100%;
    background: var(--cream);
    display: flex; flex-direction: column;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  /* Back header */
  .back-header {
    padding: 12px 16px 8px;
    text-align: center;
    flex-shrink: 0;
    cursor: pointer;
    position: relative;
  }
  .back-header .plant-common-name { font-size: 18px; letter-spacing: 1px; }
  .back-header .plant-scientific-name { font-size: 11.5px; }
  .back-header .flip-back-hint {
    display: inline-flex; align-items: center; gap: 4px;
    margin-top: 6px;
    font-size: 10px; color: var(--warm-gray);
    letter-spacing: 0.3px;
  }
  .back-header .flip-back-hint svg {
    width: 12px; height: 12px;
    stroke: var(--warm-gray); fill: none;
    stroke-width: 2;
  }
  .back-header-divider {
    height: 2px; background: var(--sage);
    margin: 0 24px;
    border-radius: 1px;
    flex-shrink: 0;
  }

  /* Back scroll content */
  .back-scroll {
    flex: 1; overflow-y: auto;
    padding: 12px 14px 16px;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    position: relative;
  }
  .back-scroll::-webkit-scrollbar { width: 3px; }
  .back-scroll::-webkit-scrollbar-track { background: transparent; }
  .back-scroll::-webkit-scrollbar-thumb { background: rgba(107,143,113,0.3); border-radius: 3px; }

  /* Scroll fade hint */
  .back-scroll-wrap {
    flex: 1; position: relative; overflow: hidden;
    display: flex; flex-direction: column;
  }
  .scroll-fade {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 32px;
    background: linear-gradient(to bottom, transparent, var(--cream));
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.3s;
  }
  .scroll-fade.hidden { opacity: 0; }

  /* Scroll indicator arrow */
  .scroll-indicator {
    position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
    z-index: 3; pointer-events: none;
    animation: scroll-bounce 1.5s ease-in-out infinite;
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .scroll-indicator.hidden { opacity: 0; }
  .scroll-indicator svg {
    width: 16px; height: 16px;
    stroke: var(--sage-dark); fill: none; stroke-width: 2.5;
  }
  @keyframes scroll-bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(4px); }
  }

  /* Section spacing */
  .back-section { margin-bottom: 16px; }
  .back-section:last-child { margin-bottom: 0; }

  .section-title {
    font-family: 'Oswald', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--sage-dark);
    margin-bottom: 10px;
  }

  /* ─── Growing Conditions Grid ─── */
  .conditions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .condition-item {
    display: flex; flex-direction: column;
    align-items: center; gap: 3px;
    padding: 8px 4px;
    background: rgba(255,255,255,0.6);
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.04);
  }
  .condition-item img { width: 28px; height: 28px; object-fit: contain; }
  .condition-label {
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.8px; text-transform: uppercase;
    color: var(--warm-gray);
  }
  .condition-value {
    font-size: 11px; font-weight: 600;
    color: var(--text); text-align: center;
    line-height: 1.2;
  }
  .conditions-grid-bottom {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px; margin-top: 8px;
  }

  /* ─── Why Grow It ─── */
  .features-list { display: flex; flex-direction: column; gap: 6px; }
  .feature-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px;
    background: rgba(255,255,255,0.5);
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.04);
  }
  .feature-icon {
    width: 30px; height: 30px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .feature-icon img { width: 22px; height: 22px; object-fit: contain; }
  .feature-icon.green  { background: #dcedc8; }
  .feature-icon.yellow { background: #fff9c4; }
  .feature-icon.pink   { background: #ffcdd2; }
  .feature-icon.orange { background: #ffe0b2; }
  .feature-icon.blue   { background: #bbdefb; }
  .feature-icon.brown  { background: #d7ccc8; }
  .feature-icon.purple { background: #e1bee7; }
  .feature-text { display: flex; flex-direction: column; gap: 1px; }
  .feature-text strong { font-size: 12px; color: var(--text); line-height: 1.2; }
  .feature-text span { font-size: 10px; color: var(--text-light); line-height: 1.25; }

  /* ─── Wildlife Value ─── */
  .wildlife-list { display: flex; flex-direction: column; gap: 6px; }
  .wildlife-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 10px;
    background: rgba(255,255,255,0.5);
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.04);
  }
  .wildlife-emoji {
    font-size: 20px; line-height: 1;
    flex-shrink: 0; width: 28px; text-align: center;
    margin-top: 1px;
  }
  .wildlife-text { display: flex; flex-direction: column; gap: 1px; }
  .wildlife-text strong { font-size: 12px; color: var(--text); line-height: 1.2; }
  .wildlife-text span { font-size: 10px; color: var(--text-light); line-height: 1.3; }

  /* ─── Fun Facts ─── */
  .fun-facts { display: flex; flex-direction: column; gap: 8px; }
  .fun-fact {
    padding: 10px 12px;
    background: rgba(255,255,255,0.5);
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.04);
    font-size: 11.5px; line-height: 1.45;
    color: var(--text);
    position: relative;
    padding-left: 36px;
  }
  .fun-fact::before {
    content: attr(data-icon);
    position: absolute; left: 10px; top: 10px;
    font-size: 16px;
  }
  .fun-fact strong { color: var(--sage-dark); }

  /* ─── Photo Scroll ─── */
  .photo-scroll {
    display: flex; gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 6px;
  }
  .photo-scroll::-webkit-scrollbar { height: 2px; }
  .photo-scroll::-webkit-scrollbar-thumb { background: rgba(107,143,113,0.3); border-radius: 2px; }
  .photo-thumb {
    width: 140px; height: 140px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    scroll-snap-align: start;
    border: 1px solid var(--border);
    background: #fff;
    position: relative;
  }
  .photo-thumb img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .photo-credit {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 2px 6px;
    background: rgba(0,0,0,0.45);
    color: rgba(255,255,255,0.85);
    font-size: 8px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─── Seasonal Tip ─── */
  .tip-card {
    background: linear-gradient(135deg, rgba(107,143,113,0.08), rgba(107,143,113,0.04));
    border-left: 4px solid var(--sage);
    border-radius: 0 8px 8px 0;
    padding: 10px 12px;
  }
  .tip-card p {
    font-size: 11.5px; line-height: 1.45;
    color: var(--text);
  }
  .tip-card strong {
    color: var(--sage-dark);
  }

  /* ─── Planting Guide ─── */
  .planting-steps {
    list-style: none; counter-reset: step;
    display: flex; flex-direction: column; gap: 8px;
  }
  .planting-steps li {
    counter-increment: step;
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 11.5px; line-height: 1.4;
    color: var(--text);
  }
  .planting-steps li::before {
    content: counter(step);
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--sage);
    color: #fff; font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ─── Companion Plants ─── */
  .companion-row {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .companion-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 20px;
    font-size: 11px; font-weight: 500;
    color: var(--text);
  }
  .companion-tag .comp-emoji { font-size: 14px; }

  /* ─── Credit ─── */
  .back-credit {
    text-align: center;
    padding: 16px 0 8px;
    font-size: 10px;
    color: var(--warm-gray);
    letter-spacing: 0.3px;
    opacity: 0.6;
  }

  /* ========== BOTTOM ACTION BAR ========== */
  .bottom-actions {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: var(--bottom-bar-h);
    display: flex; gap: 12px;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom, 0px));
    background: rgba(248, 245, 239, 0.8);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(0,0,0,0.06);
    z-index: 100;
    justify-content: center;
    align-items: flex-start;
  }
  @supports not (backdrop-filter: blur(1px)) {
    .bottom-actions { background: rgba(248, 245, 239, 0.96); }
  }

  .action-btn {
    flex: 1; max-width: 180px;
    height: 48px; border-radius: 14px;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .action-btn:active { transform: scale(0.97); }

  .share-btn {
    background: #fff;
    color: var(--text);
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .share-btn svg { width: 18px; height: 18px; stroke: var(--text); fill: none; stroke-width: 2; }

  .save-btn {
    background: var(--sage);
    color: #fff;
  }
  .save-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; }
  .save-btn.is-saved svg { fill: #fff; }

  /* ========== TOAST ========== */
  .toast-container {
    position: fixed;
    bottom: 90px; left: 0; right: 0;
    display: flex; flex-direction: column; align-items: center;
    pointer-events: none;
    z-index: 200;
  }
  .toast {
    padding: 10px 20px;
    background: rgba(42, 42, 42, 0.92);
    color: #fff;
    font-size: 13px; font-weight: 500;
    border-radius: 24px;
    margin-top: 8px;
    opacity: 0;
    transform: translateY(12px);
    animation: toast-in 0.3s ease forwards;
    backdrop-filter: blur(8px);
  }
  .toast.toast-exit {
    animation: toast-out 0.3s ease forwards;
  }
  @keyframes toast-in {
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes toast-out {
    to { opacity: 0; transform: translateY(12px); }
  }

  /* ========== RESPONSIVE ========== */
  @media (max-width: 374px) {
    :root { --card-w: 300px; --card-h: 480px; }
    .plant-common-name { font-size: 20px; }
  }
`;

// ─── HTML Section Builders ───

function buildPollinators(plant) {
  if (!plant.pollinators || plant.pollinators.length === 0) return '';
  return plant.pollinators.map(function (p) {
    var iconFile = POLLINATOR_ICONS[p];
    if (!iconFile) return '';
    var label = p.charAt(0).toUpperCase() + p.slice(1);
    return `
                <div class="poll-badge" title="${esc(label)}">
                  <img src="${ICON_BASE}${iconFile}" alt="${esc(label)}">
                </div>`;
  }).join('');
}

function buildNativeBadge(plant) {
  var badge = NATIVE_BADGE[plant.native];
  if (!badge) return '';
  return `
              <div class="native-badge-float">
                <img src="${ICON_BASE}${badge}" alt="${esc(plant.native)} Native">
              </div>`;
}

function buildGrowingConditions(plant) {
  var isFern = (plant.type || '').toLowerCase().includes('fern');
  var bloomOrFoliage = '';

  if (isFern && plant.foliage) {
    bloomOrFoliage = `
                    <div class="condition-item">
                      <img src="${ICON_BASE}attribute/attr_bloom.png" alt="Foliage">
                      <span class="condition-label">Foliage</span>
                      <span class="condition-value">${esc(plant.foliage)}</span>
                    </div>`;
  } else if (plant.bloom_color && plant.bloom_months) {
    bloomOrFoliage = `
                    <div class="condition-item">
                      <img src="${ICON_BASE}attribute/attr_bloom.png" alt="Bloom">
                      <span class="condition-label">Bloom</span>
                      <span class="condition-value">${esc(plant.bloom_color)}, ${esc(plant.bloom_months).replace(' - ', '&ndash;')}</span>
                    </div>`;
  }

  return `
                <div class="back-section">
                  <h3 class="section-title">Growing Conditions</h3>
                  <div class="conditions-grid">
                    <div class="condition-item">
                      <img src="${ICON_BASE}${lightIcon(plant.light)}" alt="Light">
                      <span class="condition-label">Light</span>
                      <span class="condition-value">${esc(lightLabel(plant.light))}</span>
                    </div>
                    <div class="condition-item">
                      <img src="${ICON_BASE}${moistureIcon(plant.moisture)}" alt="Water">
                      <span class="condition-label">Water</span>
                      <span class="condition-value">${esc(moistureLabel(plant.moisture))}</span>
                    </div>
                    <div class="condition-item">
                      <img src="${ICON_BASE}${soilIcon(plant.soil)}" alt="Soil">
                      <span class="condition-label">Soil</span>
                      <span class="condition-value">${esc(plant.soil)}</span>
                    </div>
                  </div>
                  <div class="conditions-grid-bottom">
                    <div class="condition-item">
                      <img src="${ICON_BASE}attribute/attr_size.png" alt="Size">
                      <span class="condition-label">Size</span>
                      <span class="condition-value">${esc(plant.height)}</span>
                    </div>${bloomOrFoliage}
                  </div>
                </div>`;
}

function buildSeasonalTip(plant) {
  if (!plant.seasonal_tips) return '';
  return `
                <div class="back-section">
                  <div class="tip-card" id="seasonalTip">
                    <p></p>
                  </div>
                </div>`;
}

function buildSellingPoints(plant) {
  if (!plant.selling_points || plant.selling_points.length === 0) return '';
  var items = plant.selling_points.map(function (sp) {
    var info = SP_ICONS[sp];
    if (!info) return '';
    var colorCls = spColorClass(info.bg);
    return `
                    <div class="feature-item">
                      <div class="feature-icon ${colorCls}">
                        <img src="${ICON_BASE}${info.icon}" alt="">
                      </div>
                      <div class="feature-text">
                        <strong>${esc(sp)}</strong>
                        <span>${esc(info.sub)}</span>
                      </div>
                    </div>`;
  }).join('');

  return `
                <div class="back-section">
                  <h3 class="section-title">Why Grow It</h3>
                  <div class="features-list">${items}
                  </div>
                </div>`;
}

function buildFunFacts(plant) {
  // Rich fun_facts (with emoji + HTML text)
  if (plant.fun_facts && plant.fun_facts.length > 0) {
    var items = plant.fun_facts.map(function (f) {
      return `
                    <div class="fun-fact" data-icon="${f.emoji || '&#x1F4A1;'}">${f.text}</div>`;
    }).join('');
    return `
                <div class="back-section">
                  <h3 class="section-title">Did You Know?</h3>
                  <div class="fun-facts">${items}
                  </div>
                </div>`;
  }
  // Simple facts (title + sub)
  if (plant.facts && plant.facts.length > 0) {
    var items = plant.facts.map(function (f) {
      return `
                    <div class="fun-fact" data-icon="&#x1F4A1;"><strong>${esc(f.title)}</strong> &mdash; ${esc(f.sub)}</div>`;
    }).join('');
    return `
                <div class="back-section">
                  <h3 class="section-title">Did You Know?</h3>
                  <div class="fun-facts">${items}
                  </div>
                </div>`;
  }
  return '';
}

function buildWildlife(plant) {
  if (!plant.wildlife || plant.wildlife.length === 0) return '';
  var items = plant.wildlife.map(function (w) {
    return `
                    <div class="wildlife-item">
                      <span class="wildlife-emoji">${w.emoji || '&#x1F33F;'}</span>
                      <div class="wildlife-text">
                        <strong>${esc(w.title)}</strong>
                        <span>${esc(w.desc || w.description || '')}</span>
                      </div>
                    </div>`;
  }).join('');
  return `
                <div class="back-section">
                  <h3 class="section-title">Wildlife Value</h3>
                  <div class="wildlife-list">${items}
                  </div>
                </div>`;
}

function buildCompanions(plant) {
  if (!plant.companions || plant.companions.length === 0) return '';
  var tags = plant.companions.map(function (c) {
    return `
                    <span class="companion-tag"><span class="comp-emoji">${c.emoji || '&#x1F33F;'}</span> ${esc(c.name)}</span>`;
  }).join('');
  return `
                <div class="back-section">
                  <h3 class="section-title">Good Companions</h3>
                  <div class="companion-row">${tags}
                  </div>
                </div>`;
}

function buildPlantingSteps(plant) {
  if (!plant.planting_steps || plant.planting_steps.length === 0) return '';
  var items = plant.planting_steps.map(function (step) {
    return `
                    <li>${esc(step)}</li>`;
  }).join('');
  return `
                <div class="back-section">
                  <h3 class="section-title">Planting Guide</h3>
                  <ol class="planting-steps">${items}
                  </ol>
                </div>`;
}

function buildCautions(plant) {
  if (!plant.cautions || plant.cautions.length === 0) return '';
  var items = plant.cautions.map(function (c) {
    var info = CAUTION_ICONS[c];
    if (!info) return '';
    return `
                    <div class="feature-item">
                      <div class="feature-icon orange">
                        <img src="${ICON_BASE}${info.icon}" alt="">
                      </div>
                      <div class="feature-text">
                        <strong>${esc(c)}</strong>
                        <span>${esc(info.sub)}</span>
                      </div>
                    </div>`;
  }).join('');
  return `
                <div class="back-section">
                  <h3 class="section-title">Heads Up</h3>
                  <div class="features-list">${items}
                  </div>
                </div>`;
}

function buildPhotoGallery(plant) {
  // Build list of photos: main photo first, then detail photos from iNaturalist
  var thumbs = '';
  var mainSrc = `${PHOTO_BASE}${plant.id}.jpg`;
  thumbs += `<div class="photo-thumb"><img src="${mainSrc}" alt="${esc(plant.common)}" loading="lazy"></div>`;

  // Add detail photos if available
  if (plant.detail_photos && plant.detail_photos.length > 0) {
    plant.detail_photos.forEach(function (filename) {
      var src = `${PHOTO_BASE}details/${filename}`;
      thumbs += `<div class="photo-thumb"><img src="${src}" alt="${esc(plant.common)} detail" loading="lazy"></div>`;
    });
  }

  return `
                <div class="back-section">
                  <h3 class="section-title">Plant Details</h3>
                  <div class="photo-scroll" id="photoScroll">
                    ${thumbs}
                  </div>
                </div>`;
}

// ─── JavaScript (inline, parameterized) ───

function buildJS(plant) {
  var tipsBlock = '';
  if (plant.seasonal_tips) {
    tipsBlock = `
  /* ── Seasonal Tip (month-based) ── */
  var tips = ${JSON.stringify(plant.seasonal_tips)};
  var tipEl = document.querySelector('#seasonalTip p');
  var month = new Date().getMonth();
  if (tips[month]) {
    var parts = tips[month].split(':');
    tipEl.innerHTML = '<strong>' + parts[0] + ':</strong>' + parts.slice(1).join(':');
  }`;
  }

  return `
(function () {
  'use strict';

  /* ── Elements ── */
  var cardScene   = document.getElementById('cardScene');
  var cardFlipper = document.getElementById('cardFlipper');
  var collectBtn  = document.getElementById('collectBtn');
  var saveBtn     = document.getElementById('saveBtn');
  var shareBtn    = document.getElementById('shareBtn');
  var flipHint    = document.getElementById('flipHint');
  var backScroll  = document.getElementById('backScroll');
  var backHeader  = document.getElementById('backHeader');
  var photoScroll = document.getElementById('photoScroll');
  var toastBox    = document.getElementById('toastContainer');
  var scrollFade  = document.getElementById('scrollFade');
  var scrollInd   = document.getElementById('scrollIndicator');

  var PLANT_ID     = '${escJS(plant.id)}';
  var PLANT_COMMON = '${escJS(plant.common)}';
  var PLANT_SPECIES = '${escJS(plant.species)}';
  var STORAGE_KEY  = 'wildones-saved-plants';

  var isFlipped = false;

  /* ── Dynamic card sizing to fit viewport ── */
  function sizeCard() {
    var vh = window.innerHeight;
    var available = vh - 56 - 72 - 44; /* header - bottom bar - hint+padding */
    var maxH = Math.min(548, available);  /* 520 + 28 stamp padding */
    var scale = maxH / 548;
    if (scale < 1) {
      var newW = Math.floor(368 * scale); /* 340 + 28 stamp padding */
      var newH = Math.floor(548 * scale);
      cardScene.style.width = newW + 'px';
      cardScene.style.height = newH + 'px';
    } else {
      cardScene.style.width = '';
      cardScene.style.height = '';
    }
  }
  sizeCard();
  window.addEventListener('resize', sizeCard);

  /* ── Flip logic ──
     Core idea: track touch movement distance.
     - If finger moved > 8px it is a scroll, don't flip
     - If finger barely moved (tap) flip the card
  */
  var touchStartX = 0;
  var touchStartY = 0;
  var touchMoved  = false;
  var TAP_THRESHOLD = 8;

  function shouldIgnoreFlip(target) {
    return target.closest('.collect-btn, a, button:not(#backHeader)');
  }

  cardScene.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved  = false;
  }, { passive: true });

  cardScene.addEventListener('touchmove', function (e) {
    var dx = Math.abs(e.touches[0].clientX - touchStartX);
    var dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > TAP_THRESHOLD || dy > TAP_THRESHOLD) {
      touchMoved = true;
    }
  }, { passive: true });

  cardScene.addEventListener('touchend', function (e) {
    if (touchMoved) return;
    if (shouldIgnoreFlip(e.target)) return;
    flipCard();
  });

  /* Desktop click fallback */
  cardScene.addEventListener('click', function (e) {
    if ('ontouchend' in window) return;
    if (shouldIgnoreFlip(e.target)) return;
    flipCard();
  });

  /* Back header is also a flip-back trigger */
  backHeader.addEventListener('click', function (e) {
    e.stopPropagation();
    flipCard();
  });

  function flipCard() {
    isFlipped = !isFlipped;
    cardFlipper.classList.toggle('is-flipped', isFlipped);
    dismissHint();
    if (isFlipped) {
      backScroll.scrollTop = 0;
    }
  }

  /* ── Flip hint ── */
  var hintTimer = setTimeout(function () { dismissHint(); }, 5000);

  function dismissHint() {
    clearTimeout(hintTimer);
    if (flipHint && flipHint.parentNode) {
      flipHint.classList.add('fade-out');
      flipHint.addEventListener('animationend', function () {
        if (flipHint.parentNode) flipHint.parentNode.removeChild(flipHint);
      });
    }
  }

  /* ── Photo scroll: stop horizontal swipe propagation ── */
  if (photoScroll) {
    photoScroll.addEventListener('touchmove', function (e) { e.stopPropagation(); }, { passive: true });
  }

  /* ── Update scroll fade indicator ── */
  function updateScrollHint() {
    var atBottom = backScroll.scrollTop + backScroll.clientHeight >= backScroll.scrollHeight - 8;
    if (atBottom) {
      scrollFade.classList.add('hidden');
      scrollInd.classList.add('hidden');
    } else {
      scrollFade.classList.remove('hidden');
      scrollInd.classList.remove('hidden');
    }
  }
  backScroll.addEventListener('scroll', updateScrollHint, { passive: true });
  /* Initialize after flip */
  var observer = new MutationObserver(function () {
    if (cardFlipper.classList.contains('is-flipped')) {
      setTimeout(updateScrollHint, 100);
    }
  });
  observer.observe(cardFlipper, { attributes: true, attributeFilter: ['class'] });

  /* ── Save / Collect ── */
  function getSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
  }

  function isSaved() { return getSaved().indexOf(PLANT_ID) !== -1; }

  function toggleSave() {
    var list = getSaved();
    var was  = list.indexOf(PLANT_ID) !== -1;
    if (was) {
      list = list.filter(function (id) { return id !== PLANT_ID; });
    } else {
      list.push(PLANT_ID);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    updateSaveUI(!was);
    showToast(was ? 'Removed from My Plants' : 'Saved to My Plants!');
  }

  function updateSaveUI(saved) {
    collectBtn.classList.toggle('is-saved', saved);
    saveBtn.classList.toggle('is-saved', saved);
    saveBtn.querySelector('span').textContent = saved ? 'Saved' : 'Save';
    collectBtn.setAttribute('aria-pressed', String(saved));
  }

  collectBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleSave();
  });
  saveBtn.addEventListener('click', function () { toggleSave(); });

  updateSaveUI(isSaved());

  /* ── Share ── */
  shareBtn.addEventListener('click', async function () {
    var data = {
      title: PLANT_COMMON + ' \\u2014 Native Plant Cards',
      text: 'Check out this native plant: ' + PLANT_COMMON + ' (' + PLANT_SPECIES + ')!',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try { await navigator.clipboard.writeText(window.location.href); } catch (_) {}
        showToast('Link copied!');
      }
    }
  });

  /* ── Toast ── */
  function showToast(msg, ms) {
    ms = ms || 2500;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toastBox.appendChild(el);
    setTimeout(function () {
      el.classList.add('toast-exit');
      el.addEventListener('animationend', function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    }, ms);
  }
${tipsBlock}
})();`;
}

// ─── Full Page Generator ───

function generatePage(plant) {
  var photoSrc = `${PHOTO_BASE}${plant.id}.jpg`;
  var title = `${esc(plant.common)} &mdash; Native Plant Cards`;

  // Build back sections conditionally
  var backSections = [
    buildGrowingConditions(plant),
    buildSeasonalTip(plant),
    buildSellingPoints(plant),
    buildFunFacts(plant),
    buildWildlife(plant),
    buildCompanions(plant),
    buildPlantingSteps(plant),
    buildCautions(plant),
    buildPhotoGallery(plant),
  ].filter(Boolean).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#c8c2b6">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Libre+Baskerville:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>

<!-- ========== HEADER ========== -->
<header class="app-header">
  <a class="header-btn back-btn" href="../index.html" aria-label="All plants">
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
  </a>
  <div class="header-logo"><span style="font-family:'Oswald',sans-serif;font-size:13px;font-weight:600;color:var(--sage);letter-spacing:1.5px;text-transform:uppercase">Native Plants</span></div>
  <a class="header-btn plants-btn" href="../index.html">All Plants</a>
</header>

<!-- ========== MAIN ========== -->
<main class="page-content">

  <p class="flip-hint" id="flipHint">Tap card to flip</p>

  <div class="card-scene" id="cardScene">
    <div class="card-flipper" id="cardFlipper">

      <!-- ===== FRONT ===== -->
      <div class="card-face card-front">
        <div class="stamp-wrapper">
          <div class="front-inner">

            <button class="collect-btn" id="collectBtn" aria-label="Save to collection" aria-pressed="false">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>

            <div class="plant-image-area">
              <img src="${photoSrc}" alt="${esc(plant.common)} &mdash; ${esc(plant.species)}">

              <div class="pollinator-row">${buildPollinators(plant)}
              </div>
${buildNativeBadge(plant)}
            </div>

            <div class="front-name-block">
              <h1 class="plant-common-name">${esc(plant.common)}</h1>
              <p class="plant-scientific-name">${esc(plant.species)}</p>
              <span class="plant-type-tag">${esc(plant.type)}</span>
            </div>

          </div>
        </div>
      </div>

      <!-- ===== BACK ===== -->
      <div class="card-face card-back">
        <div class="stamp-wrapper">
          <div class="back-inner">

            <!-- Back header -->
            <div class="back-header" id="backHeader">
              <h2 class="plant-common-name">${esc(plant.common)}</h2>
              <p class="plant-scientific-name">${esc(plant.species)}</p>
              <span class="flip-back-hint"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Tap to flip back</span>
            </div>
            <div class="back-header-divider"></div>

            <!-- Scroll wrapper with fade hint -->
            <div class="back-scroll-wrap">
              <div class="back-scroll" id="backScroll">

${backSections}

                <div class="back-credit">Made with &hearts; by Lu Li</div>

              </div>

              <!-- Scroll fade + indicator -->
              <div class="scroll-fade" id="scrollFade"></div>
              <div class="scroll-indicator" id="scrollIndicator">
                <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</main>

<!-- ========== BOTTOM ACTIONS ========== -->
<div class="bottom-actions">
  <button class="action-btn share-btn" id="shareBtn">
    <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="16 6 12 2 8 6" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="2" x2="12" y2="15" stroke-linecap="round"/></svg>
    <span>Share</span>
  </button>
  <button class="action-btn save-btn" id="saveBtn">
    <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>Save</span>
  </button>
</div>

<!-- ========== TOAST ========== -->
<div class="toast-container" id="toastContainer"></div>

<script>
${buildJS(plant)}
</script>
</body>
</html>`;
}

// ─── Index / Catalog Page ───

// ─── Plants Data JS (shared by index + collection) ───

function generatePlantsDataJS(plants) {
  var arr = plants.map(function (p) {
    return `  { id: ${JSON.stringify(p.id)}, name: ${JSON.stringify(p.common)}, scientific: ${JSON.stringify(p.species)}, type: ${JSON.stringify(p.type)}, image: "../assets/photos/${p.id}.jpg", url: "${p.id}/index.html" }`;
  });
  return `var PLANTS = [\n${arr.join(',\n')}\n];\n`;
}

// ─── All Plants Page (index.html) ───

function generateAllPlantsPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#c8c2b6">
<title>All Plants &mdash; Native Plant Cards</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Libre+Baskerville:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --sage: #6b8f71;
    --sage-dark: #4a6350;
    --cream: #f8f5ef;
    --cream-dark: #ebe6dc;
    --warm-gray: #8a8478;
    --text: #2a2a2a;
    --text-light: #666;
    --border: #e0dbd0;
    --header-h: 56px;
    --tab-h: 56px;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    background: linear-gradient(145deg, #d4cfc4, #beb7aa);
    min-height: 100vh;
    color: var(--text);
    -webkit-tap-highlight-color: transparent;
  }

  /* ========== HEADER ========== */
  .app-header {
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--header-h);
    display: flex; align-items: center; justify-content: center;
    padding: 0 16px;
    background: rgba(248, 245, 239, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    z-index: 100;
  }
  @supports not (backdrop-filter: blur(1px)) {
    .app-header { background: rgba(248, 245, 239, 0.95); }
  }
  .header-title {
    font-family: 'Oswald', sans-serif;
    font-size: 14px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--sage-dark);
  }

  /* ========== PAGE ========== */
  .page {
    padding: calc(var(--header-h) + 16px) 16px calc(var(--tab-h) + 16px + env(safe-area-inset-bottom, 0px));
    max-width: 480px;
    margin: 0 auto;
  }

  /* Search */
  .search-wrap {
    position: relative;
    margin-bottom: 16px;
  }
  .search-wrap svg {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    width: 18px; height: 18px;
    stroke: var(--warm-gray); fill: none; stroke-width: 2;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: rgba(255,255,255,0.7);
    font-family: inherit;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .search-input:focus {
    border-color: var(--sage);
    background: rgba(255,255,255,0.9);
  }
  .search-input::placeholder { color: var(--warm-gray); }

  /* ========== PLANT LIST ========== */
  .plant-list {
    display: flex; flex-direction: column;
    gap: 8px;
  }
  .plant-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(0,0,0,0.04);
    border-radius: 12px;
    text-decoration: none;
    color: var(--text);
    transition: background 0.2s, transform 0.15s;
  }
  .plant-row:active { transform: scale(0.98); }
  .plant-row:hover { background: rgba(255,255,255,0.85); }
  .plant-row-thumb {
    width: 52px; height: 52px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--border);
    background: #f5f2ea;
  }
  .plant-row-thumb img {
    width: calc(100% + 4px); height: calc(100% + 4px);
    margin: -2px;
    object-fit: cover; display: block;
  }
  .plant-row-info {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column; gap: 2px;
  }
  .plant-row-name {
    font-family: 'Oswald', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
    line-height: 1.15;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .plant-row-scientific {
    font-family: 'Libre Baskerville', Georgia, serif;
    font-style: italic; font-size: 11px;
    color: var(--text-light);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .plant-row-type {
    display: inline-block;
    margin-top: 2px;
    padding: 1px 8px;
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.5px; text-transform: uppercase;
    color: var(--sage-dark);
    background: rgba(107, 143, 113, 0.12);
    border-radius: 10px;
    width: fit-content;
  }
  .plant-row-saved {
    flex-shrink: 0;
    font-size: 14px;
    opacity: 0.6;
  }
  .plant-row-arrow {
    flex-shrink: 0;
    width: 16px; height: 16px;
    stroke: var(--warm-gray);
    fill: none; stroke-width: 2;
    opacity: 0.5;
  }
  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: var(--warm-gray);
    font-size: 14px;
    display: none;
  }

  /* ========== BOTTOM TAB BAR ========== */
  .tab-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: var(--tab-h);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: flex;
    background: rgba(248, 245, 239, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(0,0,0,0.06);
    z-index: 100;
  }
  @supports not (backdrop-filter: blur(1px)) {
    .tab-bar { background: rgba(248, 245, 239, 0.96); }
  }
  .tab {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    text-decoration: none;
    color: var(--warm-gray);
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.3px;
    transition: color 0.2s;
    position: relative;
  }
  .tab svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 1.8; }
  .tab.active { color: var(--sage-dark); }
  .tab.active::after {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 32px; height: 2px;
    background: var(--sage); border-radius: 0 0 2px 2px;
  }
  .tab-badge {
    position: absolute; top: 4px; right: calc(50% - 24px);
    min-width: 16px; height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--sage);
    color: #fff;
    font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .tab-badge.hidden { display: none; }
</style>
</head>
<body>

<header class="app-header">
  <span class="header-title">Native Plant Cards</span>
</header>

<div class="page">
  <div class="search-wrap">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input class="search-input" id="searchInput" type="text" placeholder="Search by name&hellip;" autocomplete="off">
  </div>
  <div class="plant-list" id="plantList"></div>
  <div class="no-results" id="noResults">No plants found</div>
</div>

<nav class="tab-bar">
  <a class="tab active" href="index.html">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    All Plants
  </a>
  <a class="tab" href="collection.html">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    My Plants
    <span class="tab-badge hidden" id="tabBadge">0</span>
  </a>
</nav>

<script src="plants-data.js"></script>
<script>
(function () {
  'use strict';

  var STORAGE_KEY = 'wildones-saved-plants';
  var plantList = document.getElementById('plantList');
  var searchInput = document.getElementById('searchInput');
  var noResults = document.getElementById('noResults');
  var tabBadge = document.getElementById('tabBadge');

  function getSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
  }

  function render(query) {
    query = (query || '').trim().toLowerCase();
    var saved = getSaved();
    plantList.innerHTML = '';

    if (saved.length > 0) {
      tabBadge.textContent = saved.length;
      tabBadge.classList.remove('hidden');
    } else {
      tabBadge.classList.add('hidden');
    }

    var filtered = PLANTS.filter(function (p) {
      if (!query) return true;
      return p.name.toLowerCase().indexOf(query) !== -1 ||
             p.scientific.toLowerCase().indexOf(query) !== -1 ||
             p.type.toLowerCase().indexOf(query) !== -1;
    });

    if (filtered.length === 0) {
      noResults.style.display = '';
      return;
    }
    noResults.style.display = 'none';

    filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });

    filtered.forEach(function (plant) {
      var isSaved = saved.indexOf(plant.id) !== -1;
      var row = document.createElement('a');
      row.className = 'plant-row';
      row.href = plant.url;
      row.innerHTML =
        '<div class="plant-row-thumb"><img src="' + plant.image + '" alt="' + plant.name + '" loading="lazy"></div>' +
        '<div class="plant-row-info">' +
          '<span class="plant-row-name">' + plant.name + '</span>' +
          '<span class="plant-row-scientific">' + plant.scientific + '</span>' +
          '<span class="plant-row-type">' + plant.type + '</span>' +
        '</div>' +
        (isSaved ? '<span class="plant-row-saved">&#x2764;&#xFE0F;</span>' : '') +
        '<svg class="plant-row-arrow" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      plantList.appendChild(row);
    });
  }

  searchInput.addEventListener('input', function () {
    render(searchInput.value);
  });

  render();
})();
</script>
</body>
</html>`;
}

// ─── My Plants / Collection Page ───

function generateCollectionPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#c8c2b6">
<title>My Plants &mdash; Native Plant Cards</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Libre+Baskerville:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --sage: #6b8f71;
    --sage-dark: #4a6350;
    --cream: #f8f5ef;
    --cream-dark: #ebe6dc;
    --warm-gray: #8a8478;
    --text: #2a2a2a;
    --text-light: #666;
    --border: #e0dbd0;
    --header-h: 56px;
    --tab-h: 56px;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    background: linear-gradient(145deg, #d4cfc4, #beb7aa);
    min-height: 100vh;
    color: var(--text);
    -webkit-tap-highlight-color: transparent;
  }

  /* ========== HEADER ========== */
  .app-header {
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--header-h);
    display: flex; align-items: center; justify-content: center;
    padding: 0 16px;
    background: rgba(248, 245, 239, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    z-index: 100;
  }
  @supports not (backdrop-filter: blur(1px)) {
    .app-header { background: rgba(248, 245, 239, 0.95); }
  }
  .header-title {
    font-family: 'Oswald', sans-serif;
    font-size: 14px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--sage-dark);
  }

  /* ========== PAGE ========== */
  .page {
    padding: calc(var(--header-h) + 20px) 16px calc(var(--tab-h) + 20px + env(safe-area-inset-bottom, 0px));
    max-width: 480px;
    margin: 0 auto;
  }
  .page-title {
    font-family: 'Oswald', sans-serif;
    font-size: 22px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--text);
    margin-bottom: 4px;
  }
  .page-subtitle {
    font-size: 13px; color: var(--warm-gray);
    margin-bottom: 20px;
  }

  /* ========== EMPTY STATE ========== */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
  }
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  .empty-state h2 {
    font-family: 'Oswald', sans-serif;
    font-size: 18px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--text);
    margin-bottom: 8px;
  }
  .empty-state p {
    font-size: 14px; color: var(--text-light);
    line-height: 1.5;
    margin-bottom: 20px;
  }
  .empty-cta {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 24px;
    background: var(--sage);
    color: #fff;
    border-radius: 24px;
    text-decoration: none;
    font-size: 14px; font-weight: 600;
    transition: opacity 0.2s;
  }
  .empty-cta:hover { opacity: 0.85; }

  /* ========== CARD GRID ========== */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .mini-card {
    text-decoration: none;
    color: var(--text);
    display: block;
    transition: transform 0.2s;
  }
  .mini-card:active { transform: scale(0.97); }
  .mini-stamp {
    padding: 8px;
    background: var(--cream);
    -webkit-mask-image:
      radial-gradient(circle at 6px 0, transparent 4px, black 4.5px),
      radial-gradient(circle at 6px 100%, transparent 4px, black 4.5px),
      radial-gradient(circle at 0 6px, transparent 4px, black 4.5px),
      radial-gradient(circle at 100% 6px, transparent 4px, black 4.5px);
    -webkit-mask-size: 12px 100%, 12px 100%, 100% 12px, 100% 12px;
    -webkit-mask-position: top, bottom, left, right;
    -webkit-mask-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    -webkit-mask-composite: source-in;
    mask-composite: intersect;
    filter: drop-shadow(0 3px 12px rgba(0,0,0,0.12));
  }
  .mini-inner {
    background: #f5f2ea;
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .mini-image {
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
  }
  .mini-image img {
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    margin: -4px;
    object-fit: cover;
    display: block;
  }
  .mini-info {
    padding: 8px 10px 10px;
    background: var(--cream);
    text-align: center;
  }
  .mini-name {
    font-family: 'Oswald', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.8px; text-transform: uppercase;
    line-height: 1.15;
  }
  .mini-scientific {
    font-family: 'Libre Baskerville', Georgia, serif;
    font-style: italic; font-size: 10px;
    color: var(--text-light);
    margin-top: 2px;
  }
  .mini-type {
    display: inline-block;
    margin-top: 5px;
    padding: 2px 10px;
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.6px; text-transform: uppercase;
    color: var(--sage-dark);
    background: rgba(107, 143, 113, 0.12);
    border-radius: 12px;
  }
  .mini-remove {
    display: flex; align-items: center; justify-content: center; gap: 4px;
    width: 100%;
    margin-top: 8px;
    padding: 6px;
    border: none; cursor: pointer;
    background: rgba(0,0,0,0.04);
    border-radius: 8px;
    font-family: inherit;
    font-size: 11px; font-weight: 500;
    color: var(--warm-gray);
    transition: background 0.2s, color 0.2s;
  }
  .mini-remove:hover { background: rgba(231, 76, 60, 0.08); color: #c0392b; }
  .mini-remove svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; }

  /* ========== BOTTOM TAB BAR ========== */
  .tab-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: var(--tab-h);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: flex;
    background: rgba(248, 245, 239, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(0,0,0,0.06);
    z-index: 100;
  }
  @supports not (backdrop-filter: blur(1px)) {
    .tab-bar { background: rgba(248, 245, 239, 0.96); }
  }
  .tab {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 3px;
    text-decoration: none;
    color: var(--warm-gray);
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.3px;
    transition: color 0.2s;
    position: relative;
  }
  .tab svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 1.8; }
  .tab.active { color: var(--sage-dark); }
  .tab.active::after {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 32px; height: 2px;
    background: var(--sage); border-radius: 0 0 2px 2px;
  }

  /* ========== TOAST ========== */
  .toast-container {
    position: fixed;
    bottom: calc(var(--tab-h) + 12px + env(safe-area-inset-bottom, 0px));
    left: 0; right: 0;
    display: flex; flex-direction: column; align-items: center;
    pointer-events: none; z-index: 200;
  }
  .toast {
    padding: 10px 20px;
    background: rgba(42, 42, 42, 0.92);
    color: #fff;
    font-size: 13px; font-weight: 500;
    border-radius: 24px;
    opacity: 0; transform: translateY(12px);
    animation: toast-in 0.3s ease forwards;
  }
  .toast.toast-exit { animation: toast-out 0.3s ease forwards; }
  @keyframes toast-in { to { opacity: 1; transform: translateY(0); } }
  @keyframes toast-out { to { opacity: 0; transform: translateY(12px); } }
</style>
</head>
<body>

<header class="app-header">
  <span class="header-title">Native Plant Cards</span>
</header>

<div class="page">
  <h1 class="page-title">My Plants</h1>
  <p class="page-subtitle" id="subtitle"></p>

  <div class="empty-state" id="emptyState" style="display:none;">
    <div class="empty-icon">&#x1F331;</div>
    <h2>No plants saved yet</h2>
    <p>Scan a plant card at the event or browse all plants to start building your collection.</p>
    <a class="empty-cta" href="index.html">Browse Plants</a>
  </div>

  <div class="card-grid" id="cardGrid"></div>
</div>

<nav class="tab-bar">
  <a class="tab" href="index.html">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    All Plants
  </a>
  <a class="tab active" href="collection.html">
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    My Plants
  </a>
</nav>

<div class="toast-container" id="toastContainer"></div>

<script src="plants-data.js"></script>
<script>
(function () {
  'use strict';

  var STORAGE_KEY = 'wildones-saved-plants';
  var grid = document.getElementById('cardGrid');
  var emptyState = document.getElementById('emptyState');
  var subtitle = document.getElementById('subtitle');
  var toastBox = document.getElementById('toastContainer');

  function getSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
  }

  function setSaved(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function render() {
    var saved = getSaved();
    grid.innerHTML = '';

    if (saved.length === 0) {
      emptyState.style.display = '';
      subtitle.textContent = '';
      return;
    }

    emptyState.style.display = 'none';
    subtitle.textContent = saved.length + (saved.length === 1 ? ' plant' : ' plants') + ' in your collection';

    saved.forEach(function (plantId) {
      var plant = PLANTS.find(function (p) { return p.id === plantId; });
      if (!plant) return;

      var card = document.createElement('div');
      card.className = 'mini-card-wrap';
      card.innerHTML =
        '<a class="mini-card" href="' + plant.url + '">' +
          '<div class="mini-stamp">' +
            '<div class="mini-inner">' +
              '<div class="mini-image"><img src="' + plant.image + '" alt="' + plant.name + '"></div>' +
              '<div class="mini-info">' +
                '<div class="mini-name">' + plant.name + '</div>' +
                '<div class="mini-scientific">' + plant.scientific + '</div>' +
                '<span class="mini-type">' + plant.type + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</a>' +
        '<button class="mini-remove" data-id="' + plant.id + '" data-name="' + plant.name + '">' +
          '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          'Remove' +
        '</button>';

      grid.appendChild(card);
    });

    grid.querySelectorAll('.mini-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var name = btn.getAttribute('data-name');
        var list = getSaved().filter(function (pid) { return pid !== id; });
        setSaved(list);
        render();
        showToast('Removed ' + name);
      });
    });
  }

  function showToast(msg) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toastBox.appendChild(el);
    setTimeout(function () {
      el.classList.add('toast-exit');
      el.addEventListener('animationend', function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    }, 2500);
  }

  render();
})();
</script>
</body>
</html>`;
}

// ─── Main ───

function main() {
  var plants = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`Found ${plants.length} plants in data file.`);

  // Ensure output directory
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Generate individual pages
  var count = 0;
  plants.forEach(function (plant) {
    var dir = path.join(OUT_DIR, plant.id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    var html = generatePage(plant);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    count++;
    console.log(`  [${count}/${plants.length}] ${plant.id}/index.html`);
  });

  // Generate shared plants-data.js
  var plantsJS = generatePlantsDataJS(plants);
  fs.writeFileSync(path.join(OUT_DIR, 'plants-data.js'), plantsJS, 'utf-8');
  console.log(`  plants-data.js (${plants.length} plants)`);

  // Generate All Plants page (index.html)
  var allPlantsHtml = generateAllPlantsPage();
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), allPlantsHtml, 'utf-8');
  console.log(`  index.html (All Plants)`);

  // Generate My Plants / Collection page
  var collectionHtml = generateCollectionPage();
  fs.writeFileSync(path.join(OUT_DIR, 'collection.html'), collectionHtml, 'utf-8');
  console.log(`  collection.html (My Plants)`);

  console.log(`\nDone! Generated ${count} plant pages + index + collection + plants-data.js in plants/`);
}

main();
