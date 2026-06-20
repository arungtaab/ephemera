export type NailShape = 'oval' | 'almond' | 'coffin'
export type NailFinish = 'matte' | 'gloss' | 'sheer'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  priceLabel?: string
  nfcAddonPrice: number
  shape: NailShape
  finish: NailFinish
  colors: { name: string; hex: string }[]
  badge?: string
}

export const NFC_ADDON_LABEL = 'NFC accent nail chip'

/** Pitch-aligned product tiers — prices in HKD for Enactus demo */
export const products: Product[] = [
  {
    id: '1',
    slug: 'ephemera-ready-set',
    name: 'Ephemera Ready Set',
    description:
      '10 finished press-ons in home-compostable bioplastic, adhesive tabs, and fit guide. We manufacture — you wear. Not a DIY kit.',
    price: 89,
    nfcAddonPrice: 0,
    shape: 'oval',
    finish: 'gloss',
    colors: [
      { name: 'Cloud', hex: '#F4F0E8' },
      { name: 'Rose Milk', hex: '#E8C4C4' },
      { name: 'Violet', hex: '#6B5BB5' },
      { name: 'Gold', hex: '#F5A623' },
    ],
    badge: 'Standard',
  },
  {
    id: '2',
    slug: 'ephemera-smart-set',
    name: 'Ephemera Smart Set',
    description:
      'Ready Set plus one compostable NFC chip in the accent nail. Tap for emergency contact, directions, or a digital card.',
    price: 109,
    nfcAddonPrice: 0,
    shape: 'almond',
    finish: 'gloss',
    colors: [
      { name: 'Stone', hex: '#D6D3D1' },
      { name: 'Mocha', hex: '#A8A29E' },
      { name: 'Plum', hex: '#4B3B8E' },
      { name: 'Amber', hex: '#F7C04A' },
    ],
    badge: 'Smart',
  },
  {
    id: '3',
    slug: 'the-rotation',
    name: 'The Rotation',
    description:
      'Monthly nail refresh at HKD 69/mo. Chip return and reuse included — recurring sets, lower effective chip cost.',
    price: 69,
    priceLabel: 'HKD 69/mo',
    nfcAddonPrice: 0,
    shape: 'coffin',
    finish: 'matte',
    colors: [
      { name: 'Pearl', hex: '#FAFAF9' },
      { name: 'Lilac', hex: '#C4B5FD' },
      { name: 'Royal', hex: '#3D2F75' },
      { name: 'Flame', hex: '#F5A623' },
    ],
    badge: 'Subscribe',
  },
  {
    id: '4',
    slug: 'shape-collection',
    name: 'Shape Collection',
    description:
      'Mix oval, almond, and coffin in one finished set. Custom-sized via our web sizing tool before you order.',
    price: 99,
    nfcAddonPrice: 20,
    shape: 'oval',
    finish: 'sheer',
    colors: [
      { name: 'Natural', hex: '#FDE68A' },
      { name: 'Blush', hex: '#FECDD3' },
      { name: 'Slate', hex: '#64748B' },
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function formatPrice(product: Product): string {
  if (product.priceLabel) return product.priceLabel
  return `HKD ${product.price}`
}

export const COLOR_PALETTE = [
  '#F4F0E8',
  '#E8C4C4',
  '#6B5BB5',
  '#4B3B8E',
  '#3D2F75',
  '#F5A623',
  '#F7C04A',
  '#1C1917',
  '#D6D3D1',
  '#C4B5FD',
]
