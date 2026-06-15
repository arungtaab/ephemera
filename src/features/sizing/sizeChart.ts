export const FINGER_LABELS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'] as const

export const SIZE_CHART: { maxMm: number; size: string }[] = [
  { maxMm: 12, size: 'XS' },
  { maxMm: 14, size: 'S' },
  { maxMm: 16, size: 'M' },
  { maxMm: 18, size: 'L' },
  { maxMm: 999, size: 'XL' },
]

export function mmToSize(mm: number): string {
  for (const row of SIZE_CHART) {
    if (mm <= row.maxMm) return row.size
  }
  return 'XL'
}

export function dominantSize(sizes: string[]): string {
  const counts: Record<string, number> = {}
  for (const s of sizes) counts[s] = (counts[s] ?? 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'M'
}

/** Quick quiz — comparisons use Hong Kong coins only */
export const QUIZ_OPTIONS = [
  {
    id: 'xs',
    label: 'Smaller than HK$5 / 10¢ (17.5 mm)',
    sizes: ['XS', 'XS', 'XS', 'XS', 'XS'],
  },
  {
    id: 's',
    label: 'About HK$5 or 10¢ size',
    sizes: ['S', 'XS', 'XS', 'XS', 'XS'],
  },
  {
    id: 'm',
    label: 'Between HK$5 and HK$10',
    sizes: ['M', 'S', 'S', 'XS', 'XS'],
  },
  {
    id: 'l',
    label: 'About HK$10 (24 mm)',
    sizes: ['L', 'M', 'M', 'S', 'S'],
  },
  {
    id: 'xl',
    label: 'Larger than HK$2 (26.3 mm)',
    sizes: ['XL', 'L', 'M', 'M', 'S'],
  },
]
