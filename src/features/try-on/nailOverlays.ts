import type { NailShape } from '../../data/products'

export interface NailOverlayConfig {
  shape: NailShape
  color: string
  opacity: number
}

/** DIP/IP joint (nail root) → fingertip */
export const NAIL_BASE = [3, 7, 11, 15, 19] as const
export const FINGER_TIPS = [4, 8, 12, 16, 20] as const

export function getNailPath(shape: NailShape, w: number, h: number): Path2D {
  const path = new Path2D()
  const cx = w / 2

  switch (shape) {
    case 'oval':
      path.ellipse(cx, h * 0.42, w * 0.44, h * 0.4, 0, 0, Math.PI * 2)
      break
    case 'almond':
      path.moveTo(cx, 0)
      path.quadraticCurveTo(w, h * 0.32, cx, h)
      path.quadraticCurveTo(0, h * 0.32, cx, 0)
      break
    case 'coffin':
      path.moveTo(w * 0.22, h)
      path.lineTo(w * 0.3, h * 0.12)
      path.lineTo(w * 0.7, h * 0.12)
      path.lineTo(w * 0.78, h)
      path.closePath()
      break
  }
  return path
}

/** Draw nail anchored on the fingertip, extending toward the nail root */
export function drawNailOverlay(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  tipX: number,
  tipY: number,
  config: NailOverlayConfig,
) {
  const dx = tipX - baseX
  const dy = tipY - baseY
  const segLen = Math.hypot(dx, dy)
  if (segLen < 4) return

  const angle = Math.atan2(dy, dx)
  const nailLen = segLen * 0.72
  const nailWidth = segLen * 0.62

  ctx.save()
  ctx.translate(tipX, tipY)
  ctx.rotate(angle - Math.PI / 2)
  ctx.translate(0, -nailLen * 0.45)
  ctx.globalAlpha = config.opacity

  const path = getNailPath(config.shape, nailWidth, nailLen)
  ctx.fillStyle = config.color
  ctx.fill(path)

  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1
  ctx.stroke(path)

  ctx.restore()
}
