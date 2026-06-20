/** Normalized landmark from MediaPipe (x, y in 0–1 video space) */
export interface NormLandmark {
  x: number
  y: number
  z?: number
}

/** PIP → DIP → tip chains per finger (MediaPipe 21-point hand) */
export const FINGER_NAIL_CHAIN = [
  { pip: 2, dip: 3, tip: 4 }, // thumb
  { pip: 6, dip: 7, tip: 8 },
  { pip: 10, dip: 11, tip: 12 },
  { pip: 14, dip: 15, tip: 16 },
  { pip: 18, dip: 19, tip: 20 },
] as const

export interface VideoLayout {
  displayW: number
  displayH: number
  drawW: number
  drawH: number
  offsetX: number
  offsetY: number
  mirrored: boolean
}

/** object-contain video rect inside display box */
export function computeVideoLayout(
  videoW: number,
  videoH: number,
  displayW: number,
  displayH: number,
  mirrored: boolean,
): VideoLayout {
  const videoAspect = videoW / videoH
  const displayAspect = displayW / displayH
  let drawW: number
  let drawH: number
  let offsetX: number
  let offsetY: number

  if (videoAspect > displayAspect) {
    drawH = displayH
    drawW = displayH * videoAspect
    offsetX = (displayW - drawW) / 2
    offsetY = 0
  } else {
    drawW = displayW
    drawH = displayW / videoAspect
    offsetX = 0
    offsetY = (displayH - drawH) / 2
  }

  return { displayW, displayH, drawW, drawH, offsetX, offsetY, mirrored }
}

export function mapNormToCanvas(
  nx: number,
  ny: number,
  layout: VideoLayout,
): { x: number; y: number } {
  const { drawW, drawH, offsetX, offsetY, mirrored } = layout
  const x = mirrored ? offsetX + drawW - nx * drawW : offsetX + nx * drawW
  const y = offsetY + ny * drawH
  return { x, y }
}

export function smoothLandmarks(
  prev: NormLandmark[] | null,
  next: NormLandmark[],
  alpha = 0.42,
): NormLandmark[] {
  if (!prev || prev.length !== next.length) {
    return next.map((l) => ({ x: l.x, y: l.y, z: l.z }))
  }
  return next.map((l, i) => ({
    x: prev[i].x * (1 - alpha) + l.x * alpha,
    y: prev[i].y * (1 - alpha) + l.y * alpha,
    z: l.z,
  }))
}

export interface NailSegment {
  rootX: number
  rootY: number
  tipX: number
  tipY: number
  widthPx: number
}

/**
 * Nail root at DIP, tip extended past landmark (press-ons sit beyond natural nail).
 * Width from finger thickness (PIP ↔ adjacent axis).
 */
export function computeNailSegment(
  lm: NormLandmark[],
  fingerIndex: number,
  layout: VideoLayout,
  sizeScale: number,
): NailSegment | null {
  const chain = FINGER_NAIL_CHAIN[fingerIndex]
  const pip = lm[chain.pip]
  const dip = lm[chain.dip]
  const tip = lm[chain.tip]
  if (!pip || !dip || !tip) return null

  const extend = fingerIndex === 0 ? 0.22 : 0.28
  const tipNorm = {
    x: tip.x + (tip.x - dip.x) * extend,
    y: tip.y + (tip.y - dip.y) * extend,
  }

  const root = mapNormToCanvas(dip.x, dip.y, layout)
  const tipPx = mapNormToCanvas(tipNorm.x, tipNorm.y, layout)

  const segLen = Math.hypot(tipPx.x - root.x, tipPx.y - root.y)
  if (segLen < 6) return null

  const pipPx = mapNormToCanvas(pip.x, pip.y, layout)
  const jointWidth = Math.hypot(pipPx.x - root.x, pipPx.y - root.y)
  const widthPx = Math.max(10, (jointWidth * 1.35 + segLen * 0.28) * sizeScale)

  return {
    rootX: root.x,
    rootY: root.y,
    tipX: tipPx.x,
    tipY: tipPx.y,
    widthPx,
  }
}
