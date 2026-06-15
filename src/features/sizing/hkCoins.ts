/** Hong Kong coin specs (HKMA) — used for camera sizing calibration */
export interface HkCoin {
  id: string
  label: string
  diameterMm: number
  /** Round or scalloped (fit a bounding circle for calibration) */
  shape: 'round' | 'scalloped'
}

export const HK_COINS: HkCoin[] = [
  { id: '10c', label: 'HK 10¢', diameterMm: 17.5, shape: 'round' },
  { id: '20c', label: 'HK 20¢', diameterMm: 18.01, shape: 'round' },
  { id: '50c', label: 'HK 50¢', diameterMm: 22.5, shape: 'scalloped' },
  { id: '1', label: 'HK$1', diameterMm: 25.5, shape: 'scalloped' },
  { id: '2', label: 'HK$2', diameterMm: 26.3, shape: 'scalloped' },
  { id: '5', label: 'HK$5', diameterMm: 17.5, shape: 'round' },
  { id: '10', label: 'HK$10', diameterMm: 24.0, shape: 'round' },
]

export const DEFAULT_HK_COIN_ID = '10'

export function getHkCoin(id: string): HkCoin {
  return HK_COINS.find((c) => c.id === id) ?? HK_COINS.find((c) => c.id === DEFAULT_HK_COIN_ID)!
}
