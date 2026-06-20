import type { NailShape } from '../../data/products'

export interface NailOverlayConfig {
  shape: NailShape
  color: string
  opacity: number
  sizeScale?: number
}

export function getNailPath(shape: NailShape, w: number, h: number): Path2D {
  const path = new Path2D()
  const cx = w / 2

  switch (shape) {
    case 'oval':
      path.ellipse(cx, h * 0.4, w * 0.46, h * 0.38, 0, 0, Math.PI * 2)
      break
    case 'almond':
      path.moveTo(cx, 0)
      path.quadraticCurveTo(w, h * 0.3, cx, h)
      path.quadraticCurveTo(0, h * 0.3, cx, 0)
      break
    case 'coffin':
      path.moveTo(w * 0.2, h)
      path.lineTo(w * 0.28, h * 0.1)
      path.lineTo(w * 0.72, h * 0.1)
      path.lineTo(w * 0.8, h)
      path.closePath()
      break
  }
  return path
}

/** Draw nail along DIP → extended tip; width passed in pixels */
export function drawNailOverlay(
  ctx: CanvasRenderingContext2D,
  rootX: number,
  rootY: number,
  tipX: number,
  tipY: number,
  widthPx: number,
  config: NailOverlayConfig,
) {
  const dx = tipX - rootX
  const dy = tipY - rootY
  const segLen = Math.hypot(dx, dy)
  if (segLen < 6) return

  const scale = config.sizeScale ?? 1
  const angle = Math.atan2(dy, dx)
  const nailLen = segLen * 0.92 * scale
  const nailWidth = widthPx * 0.95

  ctx.save()
  ctx.translate(tipX, tipY)
  ctx.rotate(angle - Math.PI / 2)
  ctx.translate(0, -nailLen * 0.48)
  ctx.globalAlpha = config.opacity

  const path = getNailPath(config.shape, nailWidth, nailLen)
  ctx.fillStyle = config.color
  ctx.fill(path)

  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.lineWidth = Math.max(0.5, nailWidth * 0.04)
  ctx.stroke(path)

  ctx.restore()
}
