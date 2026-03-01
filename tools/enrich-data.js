/**
 * One-shot script: Enrich plants.json with rich mobile page content
 * Adds: fun_facts, wildlife, companions, planting_steps, seasonal_tips
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/plants.json');
const plants = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// ─── RICH CONTENT FOR ALL 36 PLANTS ───

const RICH = {

  'new-jersey-tea': {
    fun_facts: [
      { icon: '&#x1F375;', text: 'During the American Revolution, colonists brewed its dried leaves as a <strong>caffeine-free tea substitute</strong> when boycotting British tea.' },
      { icon: '&#x1F525;', text: 'This plant <strong>thrives after fire</strong>. Its deep taproot can resprout from 6 feet underground.' },
      { icon: '&#x1F9EC;', text: 'Native Americans used the root bark to make a <strong>red dye</strong> and the leaves as a remedy for respiratory ailments.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Bee Magnet', desc: 'Supports 40+ species of native bees, including bumblebees and mining bees' },
      { emoji: '&#x1F98B;', title: 'Butterfly Host Plant', desc: 'Larval host for Spring Azure and Mottled Duskywing butterflies' },
      { emoji: '&#x1F426;', title: 'Bird Habitat', desc: 'Dense branching offers nesting cover; seeds feed songbirds in fall' },
      { emoji: '&#x1FAB2;', title: 'Soil Life', desc: 'Roots partner with Frankia bacteria, creating tiny nitrogen factories underground' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F33B;', name: 'Black-Eyed Susan' },
      { emoji: '&#x1F33C;', name: 'Wild Bergamot' },
      { emoji: '&#x2618;&#xFE0F;', name: 'Butterfly Milkweed' },
    ],
    planting_steps: [
      'Choose a spot with good drainage &mdash; this plant hates wet feet',
      'Dig a hole twice the width of the root ball, same depth as the pot',
      'Backfill with native soil (no amendments needed), water deeply, and mulch 2&ndash;3&Prime; around the base',
    ],
    seasonal_tips: {
      0: 'January: Plan your spring garden layout &mdash; New Jersey Tea pairs beautifully with Little Bluestem and Black-Eyed Susan.',
      1: 'February: Still dormant &mdash; perfect time to pick your planting spot. Remember: good drainage is key!',
      2: 'March: Watch for new growth. Prune dead branches before leaves emerge, but go easy &mdash; it blooms on old wood.',
      3: 'April: Prime planting time! Water deeply after planting and give it space to spread.',
      4: 'May: New growth is underway. Water weekly until established, then you can mostly leave it alone.',
      5: 'June: Buds are forming. Back off the watering &mdash; this plant actually prefers it on the dry side.',
      6: 'July: Bloom time! Watch for the parade of pollinators visiting those fluffy white flower clusters.',
      7: 'August: Still blooming. Leave spent flowers &mdash; they\'ll become seeds that songbirds love in fall.',
      8: 'September: Seeds are ripening. Cardinals and sparrows will thank you for leaving them on the plant.',
      9: 'October: Leaves turning golden yellow. Leave everything standing for winter interest and wildlife shelter.',
      10: 'November: Going dormant. A thin layer of leaf mulch around the base is all it needs for winter.',
      11: 'December: Resting underground. A great time to plan which native companions to add next spring!',
    },
  },

  'canada-anemone': {
    fun_facts: [
      { icon: '&#x1F41E;', text: 'Attracts <strong>predatory insects</strong> like lacewings and hoverflies that eat garden pests like aphids.' },
      { icon: '&#x1F4A8;', text: 'Spreads by underground rhizomes to form dense colonies &mdash; nature\'s own <strong>weed suppressor</strong>.' },
      { icon: '&#x1F33F;', text: 'The name "Anemone" comes from Greek <em>anemos</em> (wind) &mdash; these are the <strong>windflowers</strong>.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Pollen Specialist', desc: 'Visited by small native bees that specialize in collecting anemone pollen' },
      { emoji: '&#x1F41E;', title: 'Beneficial Insects', desc: 'Flowers attract predatory insects that provide natural pest control' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Wild Geranium' },
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
    ],
    planting_steps: [
      'Plant in moist soil with partial shade for best results',
      'Space 12&ndash;18&Prime; apart &mdash; it will fill in quickly via rhizomes',
      'Use a root barrier if you need to contain its spread in small gardens',
    ],
  },

  'columbine': {
    fun_facts: [
      { icon: '&#x1F3A8;', text: 'The red and yellow flowers are perfectly shaped for <strong>hummingbird bills</strong> &mdash; each spur holds a drop of nectar.' },
      { icon: '&#x1F4AB;', text: 'Self-seeds freely in the garden, and seedlings may produce <strong>new color variations</strong>.' },
      { icon: '&#x1F48A;', text: 'Native Americans used tiny amounts of crushed seeds as a <strong>love charm</strong> and perfume.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Hummingbird Favorite', desc: 'One of the first nectar sources for Ruby-throated Hummingbirds in spring' },
      { emoji: '&#x1F41D;', title: 'Long-Tongued Bees', desc: 'Bumblebees and mason bees visit for nectar and pollen' },
      { emoji: '&#x1F98B;', title: 'Butterfly Nectar', desc: 'Swallowtails and skippers feed from the tubular flowers' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Foam Flower' },
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
      { emoji: '&#x1F33C;', name: 'Wild Blue Phlox' },
    ],
    planting_steps: [
      'Plant in part shade with well-drained soil &mdash; it likes woodland edges',
      'Scatter seeds in fall for spring germination, or transplant in early spring',
      'Let spent flowers go to seed for natural self-sowing each year',
    ],
  },

  'wild-ginger': {
    fun_facts: [
      { icon: '&#x1F98B;', text: 'The only larval host for the <strong>Pipevine Swallowtail butterfly</strong> in our region.' },
      { icon: '&#x1F443;', text: 'Crush a leaf or root to release a <strong>spicy ginger scent</strong> &mdash; though it\'s not related to culinary ginger.' },
      { icon: '&#x1F33A;', text: 'Flowers bloom at <strong>ground level</strong>, hidden under the leaves, and are pollinated by ground-crawling beetles.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Pipevine Swallowtail Host', desc: 'Critical larval food source for this declining butterfly species' },
      { emoji: '&#x1FAB2;', title: 'Beetle Pollinated', desc: 'Ground-level flowers attract small beetles and flies as pollinators' },
    ],
    companions: [
      { emoji: '&#x1F338;', name: 'Wild Red Columbine' },
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
      { emoji: '&#x2B50;', name: 'Foam Flower' },
      { emoji: '&#x1F33C;', name: 'Wild Blue Phlox' },
    ],
    planting_steps: [
      'Plant in full to part shade in rich, moist soil',
      'Space rhizomes 12&Prime; apart &mdash; they\'ll slowly spread to form a lush carpet',
      'Mulch with leaf litter to mimic its natural woodland habitat',
    ],
  },

  'tall-bell-flower': {
    fun_facts: [
      { icon: '&#x1F31F;', text: 'Despite its name, this is actually a <strong>biennial</strong> &mdash; it grows leaves the first year and flowers the second.' },
      { icon: '&#x1F4A7;', text: 'The star-shaped blue flowers only last <strong>one day each</strong>, but new ones open continuously for weeks.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Native Bee Favorite', desc: 'Especially attractive to small sweat bees and leaf-cutter bees' },
      { emoji: '&#x1F98B;', title: 'Butterfly Nectar', desc: 'Visited by various butterfly species for its abundant nectar' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
      { emoji: '&#x1F338;', name: 'Cardinal Flower' },
    ],
    planting_steps: [
      'Sow seeds directly in moist, partly shaded soil in fall',
      'Thin seedlings to 12&Prime; apart in spring',
      'Let plants self-seed freely to maintain a continuous colony year after year',
    ],
  },

  'turtlehead': {
    fun_facts: [
      { icon: '&#x1F98B;', text: 'The <strong>only</strong> larval host plant for the <strong>Baltimore Checkerspot butterfly</strong>, a species of conservation concern.' },
      { icon: '&#x1F422;', text: 'Named because the flower looks exactly like a <strong>turtle\'s head</strong> with its mouth open.' },
      { icon: '&#x1F41D;', text: 'Only <strong>strong bumblebees</strong> can force open the closed flowers to reach the nectar inside.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Baltimore Checkerspot Host', desc: 'Essential breeding habitat for this rare and beautiful butterfly' },
      { emoji: '&#x1F41D;', title: 'Bumblebee Specialist', desc: 'Flowers require the strength of bumblebees to pry open for pollination' },
    ],
    companions: [
      { emoji: '&#x1F4A7;', name: 'Cardinal Flower' },
      { emoji: '&#x1F33E;', name: 'Blue Vervain' },
      { emoji: '&#x1F343;', name: 'Lady Fern' },
    ],
    planting_steps: [
      'Plant in consistently moist to wet soil &mdash; perfect near streams or rain gardens',
      'Part shade to full shade works best; it tolerates sun only if soil stays moist',
      'Pinch stems in early June to encourage bushier growth and more blooms',
    ],
  },

  'black-cohosh': {
    fun_facts: [
      { icon: '&#x1F3F0;', text: 'Dramatic flower spires reach <strong>3&ndash;5 feet tall</strong>, earning it the nickname "fairy candles."' },
      { icon: '&#x1F48A;', text: 'Used for centuries by Native Americans and now widely studied for <strong>menopausal symptom relief</strong>.' },
      { icon: '&#x1F4A8;', text: 'The flowers have a musky scent that attracts <strong>specialized flies and beetles</strong> as pollinators.' },
    ],
    wildlife: [
      { emoji: '&#x1FAB0;', title: 'Fly & Beetle Pollinated', desc: 'Unusual musky fragrance attracts specialized fly and beetle pollinators' },
      { emoji: '&#x1F41D;', title: 'Bumble Bee Resource', desc: 'Bumblebees also visit for pollen, especially in shadier sites' },
    ],
    companions: [
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Foam Flower' },
    ],
    planting_steps: [
      'Plant in rich, moist soil in part to full shade &mdash; woodland edges are ideal',
      'Space 2&ndash;3 feet apart; it forms impressive clumps over time',
      'Mulch generously with composted leaves to keep roots cool and moist',
    ],
  },

  'bottle-gentian': {
    fun_facts: [
      { icon: '&#x1F41D;', text: 'The flowers <strong>never fully open</strong> &mdash; only bumblebees are strong enough to pry them apart for nectar.' },
      { icon: '&#x1F499;', text: 'One of the <strong>most intensely blue</strong> wildflowers in North America, blooming when little else does in late fall.' },
      { icon: '&#x1F3C6;', text: 'Named "gentian" after King Gentius of ancient Illyria, who reputedly discovered the plant\'s medicinal properties.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Bumblebee Exclusive', desc: 'Only bumblebees have the strength and technique to force open the closed petals' },
      { emoji: '&#x1F98B;', title: 'Late Season Nectar', desc: 'Provides critical fuel for migrating butterflies in autumn' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F33B;', name: 'Woodland Sunflower' },
      { emoji: '&#x1F33C;', name: 'Aromatic Aster' },
    ],
    planting_steps: [
      'Plant in moist, rich soil in partial shade &mdash; meadow edges work well',
      'Do not let soil dry out during the first growing season',
      'Patience is key &mdash; plants are slow to establish but long-lived once settled',
    ],
  },

  'prairie-smoke': {
    fun_facts: [
      { icon: '&#x1F32C;', text: 'Named for its <strong>feathery pink seed heads</strong> that look like wisps of smoke drifting across the prairie.' },
      { icon: '&#x2744;&#xFE0F;', text: 'One of the <strong>earliest spring bloomers</strong> &mdash; its nodding pink flowers appear before most other wildflowers.' },
      { icon: '&#x1F343;', text: 'The fernlike foliage turns brilliant <strong>red and orange</strong> in fall, providing a second season of interest.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Early Bee Food', desc: 'One of the first nectar sources for emerging queen bumblebees in spring' },
      { emoji: '&#x1F98B;', title: 'Butterfly Nectar', desc: 'Early spring butterflies visit the nodding pink flowers' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x2B50;', name: 'Yellow Star Grass' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
    ],
    planting_steps: [
      'Plant in full sun with dry, well-drained or rocky soil',
      'Seeds need cold stratification &mdash; sow outdoors in fall for best results',
      'Space 8&ndash;12&Prime; apart in rock gardens or dry meadow areas',
    ],
  },

  'woodland-sunflower': {
    fun_facts: [
      { icon: '&#x1F426;', text: 'Seeds feed <strong>goldfinches, chickadees, and other songbirds</strong> throughout autumn and winter.' },
      { icon: '&#x2600;&#xFE0F;', text: 'Unlike most sunflowers, this species thrives in <strong>partial shade</strong> at woodland edges.' },
      { icon: '&#x1F33B;', text: 'Spreads by underground rhizomes to form cheerful <strong>golden colonies</strong> in late summer.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Bird Food', desc: 'Seeds are a key fall food source for goldfinches, sparrows, and juncos' },
      { emoji: '&#x1F41D;', title: 'Pollinator Hub', desc: 'Attracts bees, butterflies, and beneficial wasps to its broad flower heads' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F33C;', name: 'Aromatic Aster' },
      { emoji: '&#x1F490;', name: 'Wild Geranium' },
    ],
    planting_steps: [
      'Plant in partial shade to full sun with average to moist soil',
      'Space 18&ndash;24&Prime; apart &mdash; rhizomes will fill in gaps over time',
      'Cut back by half in early June if you want shorter, bushier plants',
    ],
  },

  'cardinal-flower': {
    fun_facts: [
      { icon: '&#x1F426;', text: 'The <strong>brilliant red</strong> color is perfectly tuned to attract hummingbirds, which are its primary pollinator.' },
      { icon: '&#x1F331;', text: 'A <strong>short-lived perennial</strong> &mdash; the parent plant fades after 2&ndash;3 years but readily self-seeds nearby.' },
      { icon: '&#x1F451;', text: 'Named after the <strong>red robes</strong> worn by Roman Catholic cardinals.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Hummingbird Magnet', desc: 'Primary pollinator is the Ruby-throated Hummingbird, drawn to its vivid red' },
      { emoji: '&#x1F98B;', title: 'Swallowtail Nectar', desc: 'Swallowtail butterflies also visit the tubular flowers for nectar' },
    ],
    companions: [
      { emoji: '&#x1F4A7;', name: 'Blue Vervain' },
      { emoji: '&#x1F422;', name: 'White Turtlehead' },
      { emoji: '&#x1F343;', name: 'Lady Fern' },
    ],
    planting_steps: [
      'Plant in moist to wet soil along stream banks or in rain gardens',
      'Part shade is ideal; full sun works only if soil stays consistently moist',
      'Allow plants to self-seed by leaving spent stalks standing through winter',
    ],
  },

  'wild-lupine': {
    fun_facts: [
      { icon: '&#x1F98B;', text: 'The <strong>only</strong> host plant for the federally endangered <strong>Karner Blue butterfly</strong>.' },
      { icon: '&#x1F331;', text: 'Like other legumes, it <strong>fixes nitrogen</strong> in the soil, enriching the ground for neighboring plants.' },
      { icon: '&#x1F525;', text: 'Historically dependent on <strong>periodic fire</strong> to keep competing vegetation at bay.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Karner Blue Host', desc: 'Critical and sole food source for the rare Karner Blue butterfly larvae' },
      { emoji: '&#x1F41D;', title: 'Bumble Bee Visited', desc: 'Bumblebees work the pea-like flowers, tripping the pollination mechanism' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
      { emoji: '&#x1F32C;', name: 'Prairie Smoke' },
    ],
    planting_steps: [
      'Plant in full sun with sandy, well-drained soil &mdash; it hates wet feet',
      'Nick or scarify seeds before planting to improve germination',
      'Do not fertilize &mdash; it makes its own nitrogen and prefers lean soil',
    ],
  },

  'brown-eyed-susan': {
    fun_facts: [
      { icon: '&#x1F33B;', text: 'Unlike its cousin Black-Eyed Susan, this species has a <strong>dark brown-purple center cone</strong>.' },
      { icon: '&#x1F9F1;', text: 'One of the <strong>toughest native wildflowers</strong> &mdash; thrives in poor soils where others struggle.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Bee & Butterfly Buffet', desc: 'Flat flower heads provide easy landing pads for all pollinators' },
      { emoji: '&#x1F426;', title: 'Winter Bird Food', desc: 'Seed heads feed goldfinches and sparrows through the cold months' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x2618;&#xFE0F;', name: 'New Jersey Tea' },
      { emoji: '&#x1F33C;', name: 'Wild Lupine' },
    ],
    planting_steps: [
      'Plant in full sun with any well-drained soil &mdash; even poor, dry clay',
      'Direct sow seeds in fall for natural cold stratification',
      'Leave seed heads standing all winter for birds and self-seeding',
    ],
  },

  'false-solomons-seal': {
    fun_facts: [
      { icon: '&#x1F426;', text: 'Produces clusters of <strong>bright red berries</strong> in fall that attract thrushes, catbirds, and other songbirds.' },
      { icon: '&#x1F4AB;', text: 'Distinguished from true Solomon\'s Seal by its <strong>fluffy white flower clusters</strong> at the stem tip.' },
      { icon: '&#x1F343;', text: 'The arching stems and graceful form make it an elegant <strong>shade garden focal point</strong>.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Bird Berry Bush', desc: 'Red fall berries are eagerly eaten by thrushes, catbirds, and grouse' },
      { emoji: '&#x1F41D;', title: 'Pollinator Friendly', desc: 'Tiny fragrant flowers attract small bees and flower flies' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
      { emoji: '&#x1F338;', name: 'Foam Flower' },
    ],
    planting_steps: [
      'Plant in rich, moist woodland soil in part to full shade',
      'Space 18&Prime; apart; rhizomes slowly form graceful colonies',
      'Top-dress with composted leaves annually to maintain rich soil',
    ],
  },

  'culvers-root': {
    fun_facts: [
      { icon: '&#x1F98B;', text: 'Larval host for the <strong>Common Buckeye butterfly</strong>, which feeds on its leaves.' },
      { icon: '&#x1F3F0;', text: 'Elegant white flower spires can reach <strong>4&ndash;6 feet</strong>, making it a dramatic back-of-border plant.' },
      { icon: '&#x1F48A;', text: 'Named after Dr. Culver, a colonial physician who used the root as a powerful <strong>medicinal purgative</strong>.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Buckeye Host Plant', desc: 'Caterpillars of the Common Buckeye butterfly feed on the foliage' },
      { emoji: '&#x1F41D;', title: 'Pollinator Beacon', desc: 'White spires attract a wide variety of bees, wasps, and butterflies' },
    ],
    companions: [
      { emoji: '&#x1F4A7;', name: 'Cardinal Flower' },
      { emoji: '&#x1F33B;', name: 'Woodland Sunflower' },
      { emoji: '&#x1F33E;', name: 'Blue Vervain' },
    ],
    planting_steps: [
      'Plant in full sun to part shade in moist, rich soil',
      'Space 2&ndash;3 feet apart; it gets large and impressive',
      'Stake in windy locations or plant behind shorter perennials for support',
    ],
  },

  'little-bluestem': {
    fun_facts: [
      { icon: '&#x1F525;', text: 'Fall foliage turns stunning <strong>copper-orange to burgundy</strong>, with fluffy white seed heads that glow in winter light.' },
      { icon: '&#x1F33E;', text: 'Once the <strong>dominant grass</strong> of the tallgrass prairie, supporting vast ecosystems of wildlife.' },
      { icon: '&#x1F98B;', text: 'Host plant for several <strong>skipper butterflies</strong>, including the Dusted Skipper and Cobweb Skipper.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Skipper Host', desc: 'Larval food plant for multiple skipper butterfly species' },
      { emoji: '&#x1F426;', title: 'Bird Nesting Cover', desc: 'Dense clumps provide sheltered nest sites for ground-nesting birds' },
      { emoji: '&#x2744;&#xFE0F;', title: 'Winter Shelter', desc: 'Standing dried stems provide crucial winter cover for small mammals' },
    ],
    companions: [
      { emoji: '&#x2618;&#xFE0F;', name: 'New Jersey Tea' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
      { emoji: '&#x1F33C;', name: 'Aromatic Aster' },
    ],
    planting_steps: [
      'Plant in full sun with dry to average, well-drained soil',
      'Space 18&ndash;24&Prime; apart in groups for a natural prairie look',
      'Cut back to 4&ndash;6&Prime; in late winter before new growth emerges',
    ],
  },

  'wood-sedge': {
    fun_facts: [
      { icon: '&#x1F343;', text: 'One of the best <strong>native lawn alternatives</strong> for shady areas &mdash; stays green and needs no mowing.' },
      { icon: '&#x1F331;', text: 'Forms soft, flowing mounds of <strong>evergreen foliage</strong> that look good year-round.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Butterfly Host', desc: 'Larval food for several sedge-feeding skipper butterflies' },
      { emoji: '&#x1F426;', title: 'Ground Cover Habitat', desc: 'Dense low growth provides shelter for ground-nesting birds and toads' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Foam Flower' },
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
    ],
    planting_steps: [
      'Plant in part to full shade in moist, well-drained soil',
      'Space 8&ndash;12&Prime; apart for a flowing groundcover effect',
      'No mowing needed &mdash; just comb out dead foliage in early spring',
    ],
  },

  'witch-hazel': {
    fun_facts: [
      { icon: '&#x1F319;', text: 'Blooms in <strong>late October&ndash;November</strong> when almost nothing else is flowering &mdash; a true garden surprise.' },
      { icon: '&#x1FAB0;', text: 'Pollinated by <strong>owlet moths</strong> that fly in cold late-fall weather when other insects are dormant.' },
      { icon: '&#x1F4A5;', text: 'Seed capsules <strong>explode</strong> when ripe, shooting seeds up to 30 feet from the parent plant!' },
    ],
    wildlife: [
      { emoji: '&#x1FAB0;', title: 'Moth Pollinated', desc: 'Owlet moths brave the cold to pollinate these late-season flowers' },
      { emoji: '&#x1F426;', title: 'Bird Shelter', desc: 'Large spreading form provides excellent year-round bird habitat' },
    ],
    companions: [
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x2B50;', name: 'Black Cohosh' },
    ],
    planting_steps: [
      'Plant in part shade to shade in moist, acidic to neutral soil',
      'Give it room &mdash; mature specimens spread 15&ndash;20 feet wide',
      'Prune only right after flowering if needed; blooms form on old wood',
    ],
  },

  'coral-honeysuckle': {
    fun_facts: [
      { icon: '&#x1F426;', text: 'A <strong>non-invasive native</strong> alternative to the destructive Japanese honeysuckle.' },
      { icon: '&#x2764;&#xFE0F;', text: 'Tubular red flowers are perfectly designed for <strong>hummingbird bills</strong> &mdash; a top hummingbird plant.' },
      { icon: '&#x1F352;', text: 'Produces clusters of <strong>bright red berries</strong> in fall that feed migrating songbirds.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Hummingbird Magnet', desc: 'One of the most reliable plants for attracting Ruby-throated Hummingbirds' },
      { emoji: '&#x1F98B;', title: 'Clearwing Moth Host', desc: 'Larval food for the Snowberry Clearwing and Hummingbird Clearwing moths' },
      { emoji: '&#x1F426;', title: 'Berry Feast', desc: 'Red berries are devoured by thrushes, waxwings, and other songbirds in fall' },
    ],
    companions: [
      { emoji: '&#x1F338;', name: 'Wild Red Columbine' },
      { emoji: '&#x1F4A7;', name: 'Cardinal Flower' },
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
    ],
    planting_steps: [
      'Plant near a fence, trellis, or arbor &mdash; this vine needs something to climb',
      'Full sun to part shade; more sun means more flowers',
      'Water regularly the first year, then it\'s quite drought tolerant once established',
    ],
  },

  'virgins-bower': {
    fun_facts: [
      { icon: '&#x1FAB0;', text: 'Larval food for the <strong>Clematis Clearwing moth</strong>, a beautiful day-flying moth.' },
      { icon: '&#x2728;', text: 'The fluffy, silvery seed heads in fall are as ornamental as the flowers &mdash; great for <strong>winter arrangements</strong>.' },
      { icon: '&#x1F33F;', text: 'This is the <strong>native clematis</strong> &mdash; a vigorous vine that covers fences and dead trees with white flowers.' },
    ],
    wildlife: [
      { emoji: '&#x1FAB0;', title: 'Moth Host', desc: 'Larval food for the Clematis Clearwing moth and Virgin Tiger moth' },
      { emoji: '&#x1F41D;', title: 'Pollinator Haven', desc: 'Masses of small white flowers attract dozens of bee and butterfly species' },
    ],
    companions: [
      { emoji: '&#x1F33A;', name: 'Coral Honeysuckle' },
      { emoji: '&#x1F33B;', name: 'Woodland Sunflower' },
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
    ],
    planting_steps: [
      'Plant at the base of a fence, trellis, or shrub it can climb',
      'Full sun to part shade in moist, well-drained soil',
      'Prune hard in late winter if it gets too vigorous',
    ],
  },

  'aromatic-aster': {
    fun_facts: [
      { icon: '&#x1F4A8;', text: 'Crush a leaf to enjoy the <strong>pleasant spicy scent</strong> &mdash; rare among asters.' },
      { icon: '&#x1F3C6;', text: 'One of the <strong>last flowers blooming</strong> in fall, providing crucial late-season nectar for migrating monarchs.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Monarch Fuel Stop', desc: 'Critical late-season nectar for migrating Monarch butterflies' },
      { emoji: '&#x1F41D;', title: 'Native Bee Favorite', desc: 'Attracts a wide diversity of native bees in fall when little else blooms' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
      { emoji: '&#x2618;&#xFE0F;', name: 'New Jersey Tea' },
    ],
    planting_steps: [
      'Plant in full sun with dry to average, well-drained soil',
      'Space 18&ndash;24&Prime; apart; it mounds to about 3 feet wide',
      'Cut back by half in early June for a more compact shape and more blooms',
    ],
  },

  'wild-geranium': {
    fun_facts: [
      { icon: '&#x1F3A8;', text: 'Flowers range from <strong>pale pink to deep lavender</strong> &mdash; every plant is slightly different.' },
      { icon: '&#x1F4A5;', text: 'Seed pods have a spring-loaded mechanism that <strong>catapults seeds</strong> several feet from the parent plant.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Spring Bee Resource', desc: 'Important early nectar and pollen source for emerging native bees' },
      { emoji: '&#x1F98B;', title: 'Butterfly Visited', desc: 'Swallowtails and blues visit the open-faced flowers in spring' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Wild Red Columbine' },
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
    ],
    planting_steps: [
      'Plant in part shade in average to rich, well-drained soil',
      'Space 12&ndash;18&Prime; apart for a natural woodland carpet',
      'Let seed pods mature and fling seeds for natural spreading',
    ],
  },

  'prairie-phlox': {
    fun_facts: [
      { icon: '&#x1F98B;', text: 'A <strong>butterfly magnet</strong> &mdash; swallowtails hover around the fragrant flower clusters all day.' },
      { icon: '&#x1F4AB;', text: 'The ancestor of many popular <strong>garden phlox cultivars</strong>, but this wild form is more disease-resistant.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Swallowtail Favorite', desc: 'Long-tongued butterflies especially love the tubular fragrant flowers' },
      { emoji: '&#x1F41D;', title: 'Bee Nectar Source', desc: 'Bumblebees and long-tongued native bees visit for nectar' },
    ],
    companions: [
      { emoji: '&#x1F33C;', name: 'Wild Lupine' },
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
    ],
    planting_steps: [
      'Plant in full sun to light shade with average, well-drained soil',
      'Space 12&ndash;18&Prime; apart; good air circulation prevents powdery mildew',
      'Deadhead spent flowers to encourage reblooming',
    ],
  },

  'foam-flower': {
    fun_facts: [
      { icon: '&#x2744;&#xFE0F;', text: 'The foliage is <strong>semi-evergreen</strong>, persisting through mild winters for year-round groundcover.' },
      { icon: '&#x1F52C;', text: 'Named for the frothy, <strong>foam-like</strong> appearance of its white flower clusters in spring.' },
      { icon: '&#x1F343;', text: 'Maple-shaped leaves often develop <strong>burgundy markings</strong> along the veins in fall.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Native Bee Visited', desc: 'Small native bees and sweat bees visit the delicate spring flowers' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Wild Red Columbine' },
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
    ],
    planting_steps: [
      'Plant in part to full shade in moist, rich, acidic soil',
      'Space 12&Prime; apart; stolons spread to form a lush carpet',
      'Mulch with shredded leaves to mimic the forest floor',
    ],
  },

  'blue-vervain': {
    fun_facts: [
      { icon: '&#x1F41D;', text: 'A <strong>pollinator powerhouse</strong> &mdash; attracts dozens of bee and butterfly species to its purple flower spikes.' },
      { icon: '&#x1F48A;', text: 'Used in traditional herbalism for <strong>calming and digestive</strong> remedies for centuries.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Bee & Wasp Magnet', desc: 'Flower spikes are covered with native bees, wasps, and flies all summer' },
      { emoji: '&#x1F98B;', title: 'Butterfly Nectar', desc: 'Skippers, hairstreaks, and small butterflies visit the tiny flowers' },
      { emoji: '&#x1F426;', title: 'Seed Food', desc: 'Small birds feed on the abundant seeds in late summer' },
    ],
    companions: [
      { emoji: '&#x1F4A7;', name: 'Cardinal Flower' },
      { emoji: '&#x1F422;', name: 'White Turtlehead' },
      { emoji: '&#x1F33B;', name: 'Woodland Sunflower' },
    ],
    planting_steps: [
      'Plant in full sun to part shade in moist to wet soil',
      'Perfect for rain gardens, pond edges, and low wet spots',
      'Self-seeds readily &mdash; remove spent stalks if you want to limit spread',
    ],
  },

  'maidenhair-fern': {
    fun_facts: [
      { icon: '&#x1F343;', text: 'The delicate, fan-shaped fronds on <strong>jet-black stems</strong> make this one of the most elegant native ferns.' },
      { icon: '&#x1F4A7;', text: 'The name "maidenhair" refers to the fine, <strong>hair-like black stems</strong> (stipes) of the fronds.' },
    ],
    wildlife: [
      { emoji: '&#x1F438;', title: 'Habitat Provider', desc: 'Dense fronds create cool, moist microclimates for salamanders and frogs' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Wild Red Columbine' },
      { emoji: '&#x2B50;', name: 'Foam Flower' },
    ],
    planting_steps: [
      'Plant in part to full shade in moist, rich, neutral to alkaline soil',
      'Keep soil consistently moist &mdash; this fern will not tolerate drought',
      'Shelter from wind, which can damage the delicate fronds',
    ],
  },

  'pasture-rose': {
    fun_facts: [
      { icon: '&#x1F426;', text: '<strong>Rose hips</strong> persist through winter, feeding birds when other food is scarce.' },
      { icon: '&#x1F33A;', text: 'Unlike invasive multiflora rose, this native rose is <strong>well-behaved</strong> and only mildly thorny.' },
      { icon: '&#x1F36F;', text: 'Rose hips are rich in <strong>vitamin C</strong> &mdash; historically used to make teas and jams.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Native Bee Haven', desc: 'Simple open flowers provide easy access to pollen for native bees' },
      { emoji: '&#x1F426;', title: 'Winter Bird Food', desc: 'Rose hips feed cedar waxwings, robins, and mockingbirds all winter' },
      { emoji: '&#x1F98B;', title: 'Butterfly Nectar', desc: 'Fragrant pink flowers attract a variety of butterflies' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x2618;&#xFE0F;', name: 'New Jersey Tea' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
    ],
    planting_steps: [
      'Plant in full sun to part shade in average, well-drained soil',
      'Give it 3&ndash;4 feet of space; it forms a low, arching shrub',
      'Prune out dead canes in late winter; leave rose hips for birds',
    ],
  },

  'great-st-johns-wort': {
    fun_facts: [
      { icon: '&#x1F31F;', text: 'The <strong>largest native St. John\'s Wort</strong> &mdash; flowers reach a showy 2 inches across.' },
      { icon: '&#x1F4A1;', text: 'Historically associated with <strong>St. John\'s Day</strong> (June 24) when it typically begins blooming.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Pollen Source', desc: 'Abundant stamens produce copious pollen for native bees and flower beetles' },
      { emoji: '&#x1F98B;', title: 'Butterfly Visited', desc: 'Various butterflies visit the large, open golden flowers' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Blue Vervain' },
      { emoji: '&#x1F4A7;', name: 'Cardinal Flower' },
      { emoji: '&#x1F33C;', name: 'Aromatic Aster' },
    ],
    planting_steps: [
      'Plant in full sun to part shade in moist to average soil',
      'Space 2&ndash;3 feet apart; it forms a rounded shrubby mound',
      'Prune lightly in early spring to encourage dense growth',
    ],
  },

  'yellow-star-grass': {
    fun_facts: [
      { icon: '&#x2B50;', text: 'Despite its name, it\'s not a grass at all &mdash; it\'s in the <strong>iris family</strong>.' },
      { icon: '&#x1F31E;', text: 'Bright yellow <strong>star-shaped flowers</strong> open only on sunny days and close by evening.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Small Bee Pollinated', desc: 'Tiny sweat bees and halictid bees visit the cheerful yellow flowers' },
    ],
    companions: [
      { emoji: '&#x1F33E;', name: 'Little Bluestem' },
      { emoji: '&#x1F32C;', name: 'Prairie Smoke' },
      { emoji: '&#x1F33B;', name: 'Brown-eyed Susan' },
    ],
    planting_steps: [
      'Plant in full sun with dry to average, well-drained soil',
      'Space 6&ndash;8&Prime; apart in rock gardens or meadow edges',
      'Avoid rich soils and overwatering &mdash; it prefers lean conditions',
    ],
  },

  'partridge-berry': {
    fun_facts: [
      { icon: '&#x1F534;', text: 'Each red berry requires <strong>two flowers</strong> to form &mdash; you can see the two "eyes" on each fruit.' },
      { icon: '&#x2744;&#xFE0F;', text: 'A beautiful <strong>evergreen groundcover</strong> that stays green even under snow.' },
      { icon: '&#x1F343;', text: 'Traditionally used to make <strong>terrarium plantings</strong> &mdash; thrives in enclosed, moist conditions.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Winter Bird Food', desc: 'Bright red berries persist all winter, feeding grouse, quail, and thrushes' },
      { emoji: '&#x1F41D;', title: 'Bumblebee Pollinated', desc: 'Fragrant white flowers attract bumblebees in early summer' },
    ],
    companions: [
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x2B50;', name: 'Foam Flower' },
    ],
    planting_steps: [
      'Plant in part to full shade in moist, acidic soil',
      'Perfect under evergreens or in woodland paths',
      'Do not disturb once established &mdash; it spreads slowly on its own',
    ],
  },

  'sweet-cicely': {
    fun_facts: [
      { icon: '&#x1F98B;', text: 'Larval food for the <strong>Black Swallowtail butterfly</strong>, which feeds on plants in the carrot family.' },
      { icon: '&#x1F36C;', text: 'Crush the leaves or roots for a sweet <strong>anise/licorice scent</strong> &mdash; historically used as a flavoring.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Swallowtail Host', desc: 'Black Swallowtail butterfly larvae feed on the foliage' },
      { emoji: '&#x1F41D;', title: 'Early Pollinator Food', desc: 'White umbel flowers provide spring nectar for small bees and flies' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
      { emoji: '&#x1F338;', name: 'Wild Blue Phlox' },
    ],
    planting_steps: [
      'Plant in part to full shade in rich, moist woodland soil',
      'Space 12&ndash;18&Prime; apart; it self-seeds gently in good conditions',
      'Leave foliage standing to support swallowtail caterpillars',
    ],
  },

  'wild-blue-phlox': {
    fun_facts: [
      { icon: '&#x1F4A8;', text: 'Flowers emit a <strong>sweet, light fragrance</strong> especially noticeable on warm spring evenings.' },
      { icon: '&#x1F3A8;', text: 'Flower color varies from <strong>sky blue to lavender to pale violet</strong> depending on soil conditions.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Swallowtail Nectar', desc: 'Long-tongued butterflies like swallowtails favor the tubular flowers' },
      { emoji: '&#x1F41D;', title: 'Spring Bee Resource', desc: 'Bumblebees and mason bees visit for early spring nectar' },
    ],
    companions: [
      { emoji: '&#x1F338;', name: 'Wild Red Columbine' },
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F343;', name: 'Maidenhair Fern' },
    ],
    planting_steps: [
      'Plant in part shade in rich, moist, well-drained soil',
      'Space 12&Prime; apart for a solid carpet of spring blooms',
      'Let it self-seed to naturalize through the woodland garden',
    ],
  },

  'tall-ironweed': {
    fun_facts: [
      { icon: '&#x1F4AA;', text: 'Named "ironweed" for its <strong>incredibly tough stems</strong> that resist breaking even in strong winds.' },
      { icon: '&#x1F3F0;', text: 'Can reach <strong>6&ndash;8 feet tall</strong> &mdash; a towering presence in late-summer gardens.' },
    ],
    wildlife: [
      { emoji: '&#x1F98B;', title: 'Monarch Fuel', desc: 'Rich nectar source for migrating Monarch butterflies in late summer' },
      { emoji: '&#x1F41D;', title: 'Bee Magnet', desc: 'Bumblebees swarm the vivid purple flower clusters' },
    ],
    companions: [
      { emoji: '&#x1F33B;', name: 'Woodland Sunflower' },
      { emoji: '&#x1F33E;', name: 'Blue Vervain' },
      { emoji: '&#x1F4A7;', name: 'Cardinal Flower' },
    ],
    planting_steps: [
      'Plant in full sun in moist to average soil &mdash; great at pond or stream edges',
      'Space 2&ndash;3 feet apart; it gets very tall',
      'Pinch stems in late May to reduce height and encourage branching',
    ],
  },

  'smooth-yellow-violet': {
    fun_facts: [
      { icon: '&#x2705;', text: 'Unlike many violets, this one is <strong>well-behaved</strong> &mdash; it does not spread aggressively.' },
      { icon: '&#x1F33C;', text: 'One of the few native violets with <strong>yellow flowers</strong> &mdash; a cheerful spring groundcover.' },
    ],
    wildlife: [
      { emoji: '&#x1F41D;', title: 'Spring Bee Food', desc: 'Early flowers provide pollen for bees emerging from winter hibernation' },
      { emoji: '&#x1F98B;', title: 'Fritillary Host', desc: 'Violets are the larval food plant for Greater Spangled Fritillary butterflies' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Wild Blue Phlox' },
      { emoji: '&#x1F343;', name: 'Christmas Fern' },
    ],
    planting_steps: [
      'Plant in part shade in moist, rich woodland soil',
      'Space 8&ndash;12&Prime; apart for a gentle groundcover',
      'Pairs beautifully with spring ephemerals under deciduous trees',
    ],
  },

  'lady-fern': {
    fun_facts: [
      { icon: '&#x1F343;', text: 'The lacy, <strong>finely-divided fronds</strong> give this fern an exceptionally delicate, graceful appearance.' },
      { icon: '&#x1F4A7;', text: 'Deciduous &mdash; fronds emerge as tight <strong>fiddleheads</strong> in spring, unfurling in elegant spirals.' },
    ],
    wildlife: [
      { emoji: '&#x1F438;', title: 'Amphibian Habitat', desc: 'Dense fronds create cool, moist shelter for frogs, toads, and salamanders' },
      { emoji: '&#x1F426;', title: 'Nesting Cover', desc: 'Low fern thickets provide hiding spots for ground-nesting birds' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x1F338;', name: 'Foam Flower' },
      { emoji: '&#x2B50;', name: 'False Solomon\'s Seal' },
    ],
    planting_steps: [
      'Plant in part to full shade in rich, moist, acidic soil',
      'Space 18&ndash;24&Prime; apart; fronds arch gracefully to 2&ndash;3 feet',
      'Keep soil consistently moist; mulch with shredded leaves annually',
    ],
  },

  'christmas-fern': {
    fun_facts: [
      { icon: '&#x1F384;', text: 'Named because its fronds stay <strong>green through Christmas</strong> &mdash; one of very few evergreen ferns.' },
      { icon: '&#x1F9E6;', text: 'Each leaflet is shaped like a tiny <strong>Christmas stocking</strong>, complete with a little "toe" at the base.' },
      { icon: '&#x2744;&#xFE0F;', text: 'Colonists used the fronds as <strong>holiday decorations</strong> when fresh greenery was scarce in winter.' },
    ],
    wildlife: [
      { emoji: '&#x1F426;', title: 'Winter Cover', desc: 'Evergreen fronds shelter small birds and amphibians even in deep winter' },
      { emoji: '&#x1F438;', title: 'Salamander Habitat', desc: 'Dense root crowns and moist conditions attract woodland salamanders' },
    ],
    companions: [
      { emoji: '&#x1F33F;', name: 'Wild Ginger' },
      { emoji: '&#x2B50;', name: 'Foam Flower' },
      { emoji: '&#x1F338;', name: 'Wild Blue Phlox' },
    ],
    planting_steps: [
      'Plant in part to full shade in moist, well-drained, slightly acidic soil',
      'Space 18&Prime; apart; clumps expand slowly over the years',
      'Leave old fronds in place &mdash; they protect new fiddleheads emerging in spring',
    ],
  },

};

// ─── APPLY ENRICHMENT ───
let enriched = 0;

for (const plant of plants) {
  const rich = RICH[plant.id];
  if (rich) {
    Object.assign(plant, rich);
    enriched++;
  }
}

fs.writeFileSync(DATA_FILE, JSON.stringify(plants, null, 2), 'utf8');
console.log(`✅ Enriched ${enriched} / ${plants.length} plants with rich content`);
console.log(`   Remaining without rich content: ${plants.length - enriched}`);
