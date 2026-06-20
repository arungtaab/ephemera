import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision'
import { COLOR_PALETTE, type NailShape } from '../../data/products'
import {
  delay,
  formatCameraError,
  openUserCameraWithRetry,
  playVideoElement,
  stopMediaStream,
  waitForVideoReady,
} from '../../lib/camera'
import { isMobile } from '../../lib/platform'
import {
  computeNailSegment,
  computeVideoLayout,
  smoothLandmarks,
  type NormLandmark,
} from './handMapping'
import { drawNailOverlay, type NailOverlayConfig } from './nailOverlays'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'

const SHAPES: NailShape[] = ['oval', 'almond', 'coffin']
const INIT_TIMEOUT_MS = 25_000
const SMOOTH_ALPHA = 0.42

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

let cachedLandmarker: HandLandmarker | null = null
let landmarkerPromise: Promise<HandLandmarker> | null = null

async function getHandLandmarker(signal: AbortSignal): Promise<HandLandmarker> {
  if (cachedLandmarker) return cachedLandmarker

  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm',
      )
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError')

      const options = {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' as const },
        runningMode: 'VIDEO' as const,
        numHands: 1,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.55,
      }

      try {
        cachedLandmarker = await HandLandmarker.createFromOptions(vision, options)
      } catch {
        cachedLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      }
      return cachedLandmarker!
    })().catch((err) => {
      landmarkerPromise = null
      throw err
    })
  }

  return landmarkerPromise
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out`)), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      },
    )
  })
}

export function HandTryOn() {
  const [searchParams] = useSearchParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animRef = useRef<number>(0)
  const sessionRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const smoothLmRef = useRef<NormLandmark[] | null>(null)

  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [status, setStatus] = useState('Starting camera…')
  const [error, setError] = useState('')
  const [mirrored, setMirrored] = useState(!isMobile())
  const [handDetected, setHandDetected] = useState(false)
  const [landmarkerReady, setLandmarkerReady] = useState(false)
  const [sizeScale, setSizeScale] = useState(1)
  const [config, setConfig] = useState<NailOverlayConfig>({
    shape: (searchParams.get('shape') as NailShape) || 'oval',
    color: searchParams.get('color') || COLOR_PALETTE[2],
    opacity: 0.88,
  })

  const stopCamera = () => {
    cancelAnimationFrame(animRef.current)
    abortRef.current?.abort()
    abortRef.current = null
    smoothLmRef.current = null
    stopMediaStream(streamRef.current)
    streamRef.current = null
    const video = videoRef.current
    if (video) {
      video.pause()
      video.srcObject = null
    }
  }

  const start = async () => {
    const session = ++sessionRef.current
    stopCamera()
    await delay(300)

    const ac = new AbortController()
    abortRef.current = ac

    setPhase('loading')
    setError('')
    setHandDetected(false)
    setLandmarkerReady(false)

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera not supported in this browser.')
      setPhase('error')
      return
    }

    if (!window.isSecureContext) {
      setError('Camera requires HTTPS or localhost.')
      setPhase('error')
      return
    }

    try {
      await withTimeout(
        (async () => {
          setStatus('Opening camera…')

          const stream = await openUserCameraWithRetry()
          if (session !== sessionRef.current) {
            stopMediaStream(stream)
            return
          }

          const video = videoRef.current
          if (!video) throw new Error('Video element not ready')

          streamRef.current = stream
          video.srcObject = stream

          await waitForVideoReady(video)
          if (session !== sessionRef.current) return

          await playVideoElement(video)
          if (session !== sessionRef.current) return

          setPhase('ready')
          setStatus('Loading hand tracking…')

          await getHandLandmarker(ac.signal)
          if (session !== sessionRef.current) return

          setLandmarkerReady(true)
          setStatus('')
        })(),
        INIT_TIMEOUT_MS,
        'Camera startup',
      )
    } catch (err) {
      if (session !== sessionRef.current) return
      stopCamera()
      setError(formatCameraError(err))
      setPhase('error')
    }
  }

  useEffect(() => {
    start()
    return () => {
      sessionRef.current += 1
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'ready') return

    const video = videoRef.current
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!video || !canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let detectTick = 0
    let active = true

    const render = () => {
      if (!active) return

      const landmarker = cachedLandmarker
      if (video.readyState < 2 || video.videoWidth === 0) {
        animRef.current = requestAnimationFrame(render)
        return
      }

      const vw = video.videoWidth
      const vh = video.videoHeight
      const rect = container.getBoundingClientRect()
      const displayW = Math.round(rect.width)
      const displayH = Math.round(rect.height)

      canvas.width = displayW
      canvas.height = displayH

      const layout = computeVideoLayout(vw, vh, displayW, displayH, mirrored)
      const { drawW, drawH, offsetX, offsetY } = layout

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, displayW, displayH)

      ctx.save()
      if (mirrored) {
        ctx.translate(offsetX + drawW, offsetY)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, drawW, drawH)
      } else {
        ctx.drawImage(video, offsetX, offsetY, drawW, drawH)
      }
      ctx.restore()

      if (landmarkerReady && landmarker) {
        try {
          const result: HandLandmarkerResult = landmarker.detectForVideo(
            video,
            performance.now(),
          )
          const hasHand = !!result.landmarks[0]
          if (detectTick++ % 10 === 0) setHandDetected(hasHand)

          if (hasHand) {
            const raw = result.landmarks[0].map((l) => ({ x: l.x, y: l.y, z: l.z }))
            smoothLmRef.current = smoothLandmarks(smoothLmRef.current, raw, SMOOTH_ALPHA)
          } else {
            smoothLmRef.current = null
          }
        } catch {
          // skip frame
        }
      }

      const lm = smoothLmRef.current
      if (lm) {
        for (let i = 0; i < 5; i++) {
          const seg = computeNailSegment(lm, i, layout, sizeScale)
          if (!seg) continue
          drawNailOverlay(
            ctx,
            seg.rootX,
            seg.rootY,
            seg.tipX,
            seg.tipY,
            seg.widthPx,
            config,
          )
        }
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)
    return () => {
      active = false
      smoothLmRef.current = null
      cancelAnimationFrame(animRef.current)
    }
  }, [phase, landmarkerReady, config, mirrored, sizeScale])

  const capture = () => {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0) return
    const link = document.createElement('a')
    link.download = 'ephemera-tryon.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[3/4] max-h-[70vh] w-full overflow-hidden bg-black"
      >
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="h-full w-full" />

        {phase === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#3D2F75]/90 p-6 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5A623] border-t-transparent" />
            <p className="text-sm text-[#F4F0E8]">{status}</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-900/95 p-6 text-center">
            <p className="max-w-sm text-sm text-white">{error}</p>
            <Button onClick={start}>Try again</Button>
          </div>
        )}

        {phase === 'ready' && !landmarkerReady && (
          <div className="pointer-events-none absolute inset-x-4 top-4 rounded-sm bg-black/60 px-3 py-2 text-center text-xs text-[#F4F0E8]">
            Loading hand tracking…
          </div>
        )}

        {phase === 'ready' && landmarkerReady && !handDetected && (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-sm bg-black/60 px-3 py-2 text-center text-xs text-[#F4F0E8]">
            Show the back of your hand — nails facing camera, fingers spread, good light
          </div>
        )}
      </div>

      <Card className="mx-auto mt-4 max-w-2xl -rotate-1">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="font-serif text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Shape
            </p>
            <div className="mt-1 flex gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s}
                  onClick={() => setConfig({ ...config, shape: s })}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wide capitalize ${
                    config.shape === s
                      ? 'bg-[#4B3B8E] text-[#F5A623]'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-serif text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Color
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {COLOR_PALETTE.map((hex) => (
                <button
                  key={hex}
                  onClick={() => setConfig({ ...config, color: hex })}
                  className={`h-8 w-8 rounded-full border-2 ${
                    config.color === hex ? 'border-[#4B3B8E]' : 'border-stone-300'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-serif text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Nail size
            </label>
            <input
              type="range"
              min={0.65}
              max={1.45}
              step={0.05}
              value={sizeScale}
              onChange={(e) => setSizeScale(parseFloat(e.target.value))}
              className="mt-1 w-full accent-[#F5A623]"
            />
          </div>
          <div>
            <label className="font-serif text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Opacity
            </label>
            <input
              type="range"
              min={0.5}
              max={1}
              step={0.05}
              value={config.opacity}
              onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
              className="mt-1 w-full accent-[#F5A623]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={capture} disabled={phase !== 'ready'}>
            Capture look
          </Button>
          <Button variant="ghost" onClick={() => setMirrored(!mirrored)}>
            {mirrored ? 'Unmirror' : 'Mirror'}
          </Button>
        </div>

        <p className="mt-4 text-[10px] text-stone-500">
          Preview uses hand landmarks — adjust size to match your fingers. Production would add
          nail segmentation for pixel-perfect fit.
        </p>
        <p className="mt-2 text-[10px] text-stone-500">
          Mac + Chrome: allow camera in System Settings and in the site lock icon · quit
          Zoom/FaceTime if the camera is busy
        </p>
      </Card>
    </div>
  )
}
