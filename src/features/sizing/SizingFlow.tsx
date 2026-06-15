import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FilesetResolver,
  HandLandmarker,
} from '@mediapipe/tasks-vision'
import { useCart } from '../cart/CartContext'
import {
  dominantSize,
  FINGER_LABELS,
  mmToSize,
  QUIZ_OPTIONS,
} from './sizeChart'
import { DEFAULT_HK_COIN_ID, getHkCoin, HK_COINS } from './hkCoins'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Badge } from '../../components/Badge'

type Mode = 'choose' | 'camera' | 'quiz' | 'result'

/** Coin position: center + radius as fractions of container width */
interface CoinOverlay {
  cx: number
  cy: number
  r: number
}

const DEFAULT_COIN: CoinOverlay = { cx: 0.5, cy: 0.7, r: 0.1 }

const WIDTH_LANDMARKS = [
  [3, 4],
  [5, 8],
  [9, 12],
  [13, 16],
  [17, 20],
] as const

export function SizingFlow() {
  const { saveSizing } = useCart()
  const [mode, setMode] = useState<Mode>('choose')
  const [coin, setCoin] = useState<CoinOverlay>(DEFAULT_COIN)
  const [coinId, setCoinId] = useState(DEFAULT_HK_COIN_ID)
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [recommended, setRecommended] = useState('')
  const [cameraError, setCameraError] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const frameRef = useRef<number>(0)

  const selectedCoin = getHkCoin(coinId)

  const moveCenter = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const cy = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
    setCoin((prev) => ({ ...prev, cx, cy }))
  }

  const setRadiusFromPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (clientX - rect.left) / rect.width
    const py = (clientY - rect.top) / rect.height
    const r = Math.min(
      0.35,
      Math.max(0.03, Math.hypot(px - coin.cx, py - coin.cy)),
    )
    setCoin((prev) => ({ ...prev, r }))
  }

  const finish = (fingers: Record<string, string>, method: 'camera' | 'quiz') => {
    const rec = dominantSize(Object.values(fingers))
    setResult(fingers)
    setRecommended(rec)
    setMode('result')
    saveSizing({ fingers, recommendedSet: rec, method })
  }

  const runQuiz = (optionId: string) => {
    const opt = QUIZ_OPTIONS.find((o) => o.id === optionId)
    if (!opt) return
    const fingers: Record<string, string> = {}
    FINGER_LABELS.forEach((label, i) => {
      fingers[label] = opt.sizes[i]
    })
    finish(fingers, 'quiz')
  }

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        await video.play()
      }
    } catch {
      setCameraError('Camera unavailable. Try the quick quiz instead.')
    }
  }, [])

  const initLandmarker = useCallback(async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    )
    landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
    })
  }, [])

  useEffect(() => {
    if (mode !== 'camera') return
    initLandmarker()
    initCamera()
    return () => {
      cancelAnimationFrame(frameRef.current)
      const video = videoRef.current
      const stream = video?.srcObject as MediaStream | null
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [mode, initCamera, initLandmarker])

  const measureFromFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const landmarker = landmarkerRef.current
    const container = containerRef.current
    if (!video || !canvas || !landmarker || !container || video.readyState < 2) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    const rect = container.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const diameterPx = coin.r * 2 * rect.width * scaleX
    const mmPerPx = selectedCoin.diameterMm / diameterPx

    const detection = landmarker.detectForVideo(video, performance.now())
    if (!detection.landmarks[0]) {
      alert('Hand not detected. Place your hand in frame with an HK coin below.')
      return
    }

    const lm = detection.landmarks[0]
    const fingers: Record<string, string> = {}

    WIDTH_LANDMARKS.forEach(([a, b], i) => {
      const pa = lm[a]
      const pb = lm[b]
      const px = Math.hypot(
        (pb.x - pa.x) * canvas.width,
        (pb.y - pa.y) * canvas.height,
      )
      const mm = px * mmPerPx * 1.8
      fingers[FINGER_LABELS[i]] = mmToSize(mm)
    })

    finish(fingers, 'camera')
  }

  if (mode === 'choose') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer -rotate-1 hover:scale-[1.02]" onClick={() => setMode('camera')}>
          <Badge tone="gold">Recommended</Badge>
          <h3 className="mt-3 font-serif font-bold uppercase tracking-wide">Camera + HK coin</h3>
          <p className="mt-2 text-sm text-stone-600">
            Place a Hong Kong coin next to your hand — no cards or personal details
            needed. We measure finger widths using computer vision.
          </p>
        </Card>
        <Card className="cursor-pointer rotate-1 hover:scale-[1.02]" onClick={() => setMode('quiz')}>
          <Badge tone="gold">Quick</Badge>
          <h3 className="mt-3 font-serif font-bold uppercase tracking-wide">Size quiz</h3>
          <p className="mt-2 text-sm text-stone-600">
            Compare your nails to HK coin sizes. Less precise but works everywhere.
          </p>
        </Card>
      </div>
    )
  }

  if (mode === 'quiz') {
    return (
      <div>
        <Button variant="ghost" onClick={() => setMode('choose')}>
          ← Back
        </Button>
        <p className="mt-4 font-serif text-sm font-bold uppercase tracking-widest text-[#F5A623]">
          How does your thumb nail compare?
        </p>
        <div className="mt-4 space-y-2">
          {QUIZ_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => runQuiz(opt.id)}
              className="zine-card w-full p-4 text-left text-[#1a1a1a] hover:scale-[1.01]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'camera') {
    const cxPct = coin.cx * 100
    const cyPct = coin.cy * 100
    const rPct = coin.r * 100

    return (
      <div>
        <Button variant="ghost" onClick={() => setMode('choose')}>
          ← Back
        </Button>

        <label className="mt-4 block">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#F5A623]">
            Hong Kong coin
          </span>
          <select
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="mt-1 w-full border-2 border-[#F5A623]/40 bg-[#3D2F75] px-4 py-3 text-sm text-[#F4F0E8]"
          >
            {HK_COINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} · {c.diameterMm} mm
                {c.shape === 'scalloped' ? ' (scalloped)' : ''}
              </option>
            ))}
          </select>
        </label>

        <p className="mt-4 text-sm text-[#F4F0E8]/75">
          Place your <strong>{selectedCoin.label}</strong> on a flat surface beside your
          hand. Drag the <strong>gold center</strong> to move the circle, and the{' '}
          <strong>orange edge</strong> to match the coin size.
        </p>

        {cameraError ? (
          <p className="mt-4 text-red-400">{cameraError}</p>
        ) : (
          <div
            ref={containerRef}
            className="relative mt-4 aspect-[3/4] max-h-[60vh] overflow-hidden bg-black shadow-[6px_6px_0_rgba(0,0,0,0.5)]"
          >
            <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              <circle
                cx={`${cxPct}%`}
                cy={`${cyPct}%`}
                r={`${rPct}%`}
                fill="rgba(245,166,35,0.12)"
                stroke="#F5A623"
                strokeWidth="2"
                strokeDasharray={selectedCoin.shape === 'scalloped' ? '4 3' : '0'}
              />
            </svg>
            {/* Center handle */}
            <div
              role="slider"
              aria-label="Move coin overlay"
              className="absolute z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-move touch-none rounded-full border-2 border-[#F5A623] bg-[#4B3B8E] shadow-lg"
              style={{ left: `${cxPct}%`, top: `${cyPct}%` }}
              onPointerDown={(e) => {
                e.preventDefault()
                e.currentTarget.setPointerCapture(e.pointerId)
                moveCenter(e.clientX, e.clientY)
              }}
              onPointerMove={(e) => {
                if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
                moveCenter(e.clientX, e.clientY)
              }}
              onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
            />
            {/* Radius handle */}
            <div
              role="slider"
              aria-label="Resize coin overlay"
              className="absolute z-10 h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none rounded-full border-2 border-white bg-[#F5A623] shadow-lg"
              style={{ left: `${cxPct + rPct}%`, top: `${cyPct}%` }}
              onPointerDown={(e) => {
                e.preventDefault()
                e.currentTarget.setPointerCapture(e.pointerId)
                setRadiusFromPoint(e.clientX, e.clientY)
              }}
              onPointerMove={(e) => {
                if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
                setRadiusFromPoint(e.clientX, e.clientY)
              }}
              onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
            />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        <Button className="mt-4" onClick={measureFromFrame}>
          Measure my size
        </Button>
        <p className="mt-2 text-xs text-[#F4F0E8]/50">
          Approximate for demo — uses HK coin diameters only. Professional sizing kit
          coming soon.
        </p>
      </div>
    )
  }

  if (mode === 'result' && result) {
    return (
      <div>
        <Card variant="dark" className="text-center">
          <p className="font-serif text-xs font-bold uppercase tracking-widest">Recommended set</p>
          <p className="font-ransom mt-2 text-5xl">{recommended}</p>
        </Card>
        <table className="mt-6 w-full text-left text-sm text-[#F4F0E8]">
          <thead>
            <tr className="border-b border-[#F5A623]/30">
              <th className="py-2 font-serif text-xs font-bold uppercase tracking-widest">Finger</th>
              <th className="py-2 font-serif text-xs font-bold uppercase tracking-widest">Size</th>
            </tr>
          </thead>
          <tbody>
            {FINGER_LABELS.map((label) => (
              <tr key={label} className="border-b border-[#F5A623]/15">
                <td className="py-2">{label}</td>
                <td className="py-2 font-ransom text-lg text-[#F5A623]">{result[label]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex gap-3">
          <Button to="/shop">Shop with my size</Button>
          <Button variant="ghost" onClick={() => setMode('choose')}>
            Measure again
          </Button>
        </div>
      </div>
    )
  }

  return null
}
