/**
 * Shared Icon Mappings — Wild Ones Capital Region NY
 * Used by both generate-print-cards.js and generate-pages.js
 *
 * All icon paths are RELATIVE (no base prefix).
 * Each generator prepends its own base path.
 */

const POLLINATOR_ICONS = {
  bees:         'pollinator/poll_bee.png',
  butterflies:  'pollinator/poll_butterfly.png',
  hummingbirds: 'pollinator/poll_hummingbird.png',
  birds:        'pollinator/poll_bird.png',
};

const NATIVE_BADGE = {
  'New York': 'badge/badge_native_ny.png',
  'USA':      'badge/badge_native_us.png',
};

const SP_ICONS = {
  'Deer Resistant':    { icon: 'selling-point/sp_deer.png',             bg: '#ffcdd2', sub: 'Great for gardens without fencing' },
  'Drought Tolerant':  { icon: 'selling-point/sp_drought.png',          bg: '#fff9c4', sub: 'Thrives with little water once established' },
  'Rabbit Resistant':  { icon: 'selling-point/sp_rabbit.png',           bg: '#ffcdd2', sub: "Won't be browsed by rabbits" },
  'Nitrogen Fixing':   { icon: 'selling-point/sp_nitrogen.png',         bg: '#dcedc8', sub: 'Enriches your soil naturally' },
  'Rain Garden':       { icon: 'selling-point/sp_rain_garden.png',      bg: '#bbdefb', sub: 'Thrives in wet areas & manages runoff' },
  'Winter Interest':   { icon: 'selling-point/sp_winter_garden.png',    bg: '#e1f5fe', sub: 'Beautiful structure in the cold months' },
  'Ground Cover':      { icon: 'selling-point/sp_groundcover.png',      bg: '#dcedc8', sub: 'Fills in to form a living carpet' },
  'Rock Garden':       { icon: 'selling-point/sp_rockgarden.png',       bg: '#d7ccc8', sub: 'Thrives in rocky, well-drained spots' },
  'Self-Seeding':      { icon: 'selling-point/sp_selfseeding.png',      bg: '#fff9c4', sub: 'Returns each year from dropped seeds' },
  'Cut Flower':        { icon: 'selling-point/sp_cutflower.png',        bg: '#f3e5f5', sub: 'Beautiful in bouquets & arrangements' },
  'Fragrant':          { icon: 'selling-point/sp_fragrant.png',         bg: '#fce4ec', sub: 'Enjoy its lovely natural scent' },
  'Pollinator Magnet': { icon: 'selling-point/sp_pollinator_magnet.png',bg: '#fff9c4', sub: 'Attracts many types of pollinators' },
  'Shade Garden':      { icon: 'selling-point/sp_shadegarden.png',      bg: '#e8f5e9', sub: 'Thrives in low-light woodland areas' },
  'Late Bloomer':      { icon: 'selling-point/sp_latebloomer.png',      bg: '#fff3e0', sub: 'Provides nectar when others have faded' },
};

const CAUTION_ICONS = {
  'Deep Roots':      { icon: 'warning/warn_deep_roots.png',     sub: 'Choose a spot carefully; hard to move later' },
  'Spreads by Root': { icon: 'warning/warn_spreads_root.png',   sub: 'Spreads quickly; may need containment' },
  'Spreads by Seed': { icon: 'warning/warn_spreads_seed.png',   sub: 'Self-seeds freely; manage seedlings' },
  'Thorns':          { icon: 'warning/warn_thorns.png',         sub: 'Handle with care; has sharp thorns' },
  'Toxic to Humans': { icon: 'warning/warn_toxic_humans.png',   sub: 'Keep away from children' },
  'Toxic to Pets':   { icon: 'warning/warn_toxic_pets.png',     sub: 'Harmful to cats and dogs' },
};

// ─── Attribute Helpers ───

function lightIcon(light) {
  if (light === 'Sun') return 'attribute/attr_sun_full.png';
  if (light === 'Shade') return 'attribute/attr_sun_shade.png';
  if (light === 'Part to Shade') return 'attribute/attr_sun_shade.png';
  return 'attribute/attr_sun_part.png'; // Sun to Part, Sun to Shade
}

function moistureIcon(moisture) {
  if (moisture.includes('Wet')) return 'attribute/attr_water_high.png';
  if (moisture === 'Dry') return 'attribute/attr_water_low.png';
  if (moisture === 'Dry to Moist') return 'attribute/attr_water_med.png';
  return 'attribute/attr_water_med.png'; // Moist
}

function soilIcon(soil) {
  const s = soil.toLowerCase();
  if (s.startsWith('clay')) return 'attribute/attr_soil_clay.png';
  if (s.startsWith('sand') || s.startsWith('sandy')) return 'attribute/attr_soil_sand.png';
  return 'attribute/attr_soil_loam.png'; // Rich, Loam, Any
}

function lightLabel(light) {
  return light
    .replace('Sun to Part', 'Sun \u2013 Part Shade')
    .replace('Part to Shade', 'Part \u2013 Full Shade')
    .replace('Sun to Shade', 'Sun \u2013 Shade');
}

function moistureLabel(moisture) {
  return moisture.replace(' to ', ' \u2013 ');
}

module.exports = {
  POLLINATOR_ICONS,
  NATIVE_BADGE,
  SP_ICONS,
  CAUTION_ICONS,
  lightIcon,
  moistureIcon,
  soilIcon,
  lightLabel,
  moistureLabel,
};
