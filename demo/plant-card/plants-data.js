/**
 * Plant registry — shared data for all pages.
 * Each plant has: id, name, scientific, type, image, page URL.
 * Add new plants here; collection.html and index.html read from this list.
 */
var PLANTS = [
  {
    id: 'new-jersey-tea',
    name: 'New Jersey Tea',
    scientific: 'Ceanothus americanus',
    type: 'Shrub',
    image: 'Newjerseytea_card.png',
    url: 'mobile.html' /* will become /plants/new-jersey-tea/ in production */
  }
  // ── Add more plants below ──
  // {
  //   id: 'wild-bergamot',
  //   name: 'Wild Bergamot',
  //   scientific: 'Monarda fistulosa',
  //   type: 'Perennial',
  //   image: 'wildbergamot_card.png',
  //   url: 'wild-bergamot.html'
  // },
];
