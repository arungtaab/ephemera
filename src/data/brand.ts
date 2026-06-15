/** Four-word brand slogan — one word per hero image */
export const SLOGAN_WORDS = ['Wear', 'Tap', 'Return', 'Bloom'] as const

export const SLOGAN_LINE = 'Wear · Tap · Return · Bloom'

export const SLOGAN_MEANINGS: { word: (typeof SLOGAN_WORDS)[number]; meaning: string }[] = [
  { word: 'Wear', meaning: 'Compostable press-ons you put on' },
  { word: 'Tap', meaning: 'NFC stickers — tap to share' },
  { word: 'Return', meaning: 'Breaks down in home compost' },
  { word: 'Bloom', meaning: 'Ephemeral beauty, meant to fade' },
]

export type CollageKey = 'nails' | 'hands' | 'lily' | 'tulip' | 'silhouette'

export const collagePaths: Record<CollageKey, string> = {
  nails: '/assets/collage/nails-stiletto.png',
  hands: '/assets/collage/hands-reach.png',
  lily: '/assets/collage/lily-arch.png',
  tulip: '/assets/collage/tulip.png',
  silhouette: '/assets/collage/silhouette-window.png',
}

export const sloganImages: {
  key: CollageKey
  word: (typeof SLOGAN_WORDS)[number]
  alt: string
}[] = [
  { key: 'nails', word: 'Wear', alt: 'Stiletto press-on nails' },
  { key: 'hands', word: 'Tap', alt: 'Hands reaching — tap to share' },
  { key: 'lily', word: 'Return', alt: 'Lily — compostable, returns to soil' },
  { key: 'tulip', word: 'Bloom', alt: 'Tulip — ephemeral beauty in bloom' },
]
