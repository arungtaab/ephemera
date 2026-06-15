export type NailShape = 'oval' | 'almond' | 'coffin'
export type NailFinish = 'matte' | 'gloss' | 'sheer'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  nfcAddonPrice: number
  shape: NailShape
  finish: NailFinish
  colors: { name: string; hex: string }[]
  badge?: string
}

export const NFC_ADDON_LABEL = 'NFC sticker pack'

export const products: Product[] = [
  {
    id: '1',
    slug: 'classic-oval',
    name: 'Classic Oval Set',
    description:
      'Timeless oval press-ons in home-compostable bioplastic. Soft edges, salon-smooth finish.',
    price: 14,
    nfcAddonPrice: 4,
    shape: 'oval',
    finish: 'gloss',
    colors: [
      { name: 'Cloud', hex: '#F4F0E8' },
      { name: 'Rose Milk', hex: '#E8C4C4' },
      { name: 'Violet', hex: '#6B5BB5' },
      { name: 'Gold', hex: '#F5A623' },
    ],
    badge: 'Bestseller',
  },
  {
    id: '2',
    slug: 'almond-minimal',
    name: 'Almond Minimal',
    description:
      'Sleek almond silhouette with a barely-there aesthetic. Lighter toxicity profile than gel alternatives.',
    price: 16,
    nfcAddonPrice: 4,
    shape: 'almond',
    finish: 'matte',
    colors: [
      { name: 'Stone', hex: '#D6D3D1' },
      { name: 'Mocha', hex: '#A8A29E' },
      { name: 'Plum', hex: '#4B3B8E' },
      { name: 'Amber', hex: '#F7C04A' },
    ],
    badge: 'New',
  },
  {
    id: '3',
    slug: 'coffin-custom',
    name: 'Coffin Custom',
    description:
      'Bold coffin shape built for customization. Mix colors per nail and pair with optional NFC stickers.',
    price: 18,
    nfcAddonPrice: 4,
    shape: 'coffin',
    finish: 'gloss',
    colors: [
      { name: 'Pearl', hex: '#FAFAF9' },
      { name: 'Lilac', hex: '#C4B5FD' },
      { name: 'Royal', hex: '#3D2F75' },
      { name: 'Flame', hex: '#F5A623' },
    ],
  },
  {
    id: '4',
    slug: 'starter-kit',
    name: 'Starter Kit',
    description:
      'Everything to begin: mixed shapes, sizing guide, adhesive tabs, and optional NFC sticker pack for tap-to-share.',
    price: 24,
    nfcAddonPrice: 0,
    shape: 'oval',
    finish: 'sheer',
    colors: [
      { name: 'Natural', hex: '#FDE68A' },
      { name: 'Blush', hex: '#FECDD3' },
      { name: 'Slate', hex: '#64748B' },
    ],
    badge: 'Kit',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
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
