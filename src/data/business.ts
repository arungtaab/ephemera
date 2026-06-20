export const PRESS_ON_DEFINITION =
  'Pre-shaped artificial nails you glue on at home — no salon. Change your look in minutes.'

export const PITCH_TIERS = [
  {
    id: 'ready-set',
    name: 'Ephemera Ready Set',
    priceHkd: 89,
    description: '10 finished press-ons, adhesive tabs, and fit guide. We manufacture — you wear.',
    features: ['10 finished nails', 'Compostable adhesive tabs', 'Fit guide'],
  },
  {
    id: 'smart-set',
    name: 'Ephemera Smart Set',
    priceHkd: 109,
    description: 'Ready Set plus one compostable NFC chip in the accent nail.',
    features: ['Everything in Ready Set', '1 NFC chip (accent nail)', 'Tap-to-trigger actions'],
  },
  {
    id: 'rotation',
    name: 'The Rotation',
    priceHkd: 69,
    priceLabel: 'HKD 69/mo',
    description: 'Monthly nail refresh with chip return and reuse.',
    features: ['Monthly nail refresh', 'Chip return & reuse', 'Priority sizing'],
  },
] as const

export const COMPARISON_ROWS = [
  { label: 'Wear time', typical: '1–2 weeks', eco: '1–2 weeks', ephemera: '1–2 weeks' },
  {
    label: 'Nail + adhesive',
    typical: 'Acrylic/ABS + solvent glue',
    eco: 'Petrochemical plastic + conventional tabs',
    ephemera: 'Food-waste bioplastic + compostable tabs',
  },
  { label: 'Fit', typical: 'Standard sizes', eco: 'Standard sizes', ephemera: 'Custom-sized' },
  { label: 'Salon visit', typical: 'Optional', eco: 'Optional', ephemera: 'Not needed' },
  { label: 'Price (HK)', typical: '~$50–80/pack', eco: '~$100+', ephemera: '$89 ready set' },
  {
    label: 'After use',
    typical: '500+ years',
    eco: '2–3 yrs + microplastics',
    ephemera: '4 months home compost',
  },
  { label: 'Smart feature', typical: 'None', eco: 'None', ephemera: 'Optional NFC tap' },
] as const

export const VALUE_PROPS = {
  faster: [
    '~5 min at home vs 60+ min salon',
    'Monthly Rotation subscription',
  ],
  better: [
    'Bioplastic + compostable tabs — not solvent glue',
    'Custom sizing → fewer pop-offs',
  ],
  cheaper: [
    'HKD 89/set vs HKD 300–500 salon',
    'COGS ~HKD 9.48/set → margin room',
  ],
} as const

export const TARGET_CUSTOMERS = [
  {
    title: 'HK women 18–28',
    detail: 'IG beauty, nights out, campus events',
  },
  {
    title: 'Eco-conscious commuters',
    detail: 'Buy “clean” beauty, hate greenwashing',
  },
  {
    title: 'Creators / side-hustlers',
    detail: 'NFC tap = digital business card on accent nail',
  },
] as const

export const MANUFACTURING_STEPS = [
  { step: 'Source', detail: 'Cull potatoes, café coffee grounds, bakery eggshells' },
  { step: 'Formulate', detail: 'Starch + alginate + coffee filler → bioplastic' },
  { step: 'Cast & finish', detail: 'Mold, cure, shape (oval / almond / coffin)' },
  { step: 'Ship', detail: '10 finished nails + fit guide in paper box' },
] as const

export const PROJECTIONS = {
  year1: {
    label: 'Year 1 — validate',
    sets: 400,
    mix: '70% Standard / 30% Smart',
    revenueHkd: 38_000,
    revenueNote: '280×89 + 120×109',
  },
  year2: {
    label: 'Year 2 — scale',
    sets: 1200,
    subscribers: 50,
    note: 'Café waste partnerships formalized',
  },
  year3: {
    label: 'Year 3 — break-even',
    sets: 2500,
    subscribers: 150,
    fixedCostsHkd: 15_000,
    breakEvenMonth: 30,
  },
} as const

export const IMPACT_AT_10K = {
  sets: 10_000,
  nailsDiverted: 100_000,
  acrylicKgAvoided: 40,
  foodWasteKgUpcycled: 200,
} as const

export const UNIT_ECONOMICS = {
  standardCogs: 9.48,
  smartCogs: 12.88,
  grossMarginPct: 62,
  readySetPrice: 89,
  smartSetPrice: 109,
} as const

export const SALES_CHANNELS = [
  'Instagram shop',
  'Campus / pop-up markets',
  'Café partner displays',
] as const
