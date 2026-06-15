import { isMobile } from './platform'

const CAMERA_RELEASE_MS = 300

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function stopMediaStream(stream: MediaStream | null | undefined): void {
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
}

function pushError(errors: DOMException[], err: unknown): void {
  if (err instanceof DOMException) errors.push(err)
}

/**
 * Open the best available camera with progressive fallbacks.
 * Desktop: plain `{ video: true }` first — most reliable on Mac Chrome.
 */
export async function openUserCamera(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException('Camera not supported in this browser.', 'NotSupportedError')
  }

  const errors: DOMException[] = []
  const attempts: MediaStreamConstraints[] = []

  if (isMobile()) {
    attempts.push(
      { video: { facingMode: { ideal: 'environment' } }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
    )
  }

  attempts.push(
    { video: true, audio: false },
    { video: { facingMode: { ideal: 'user' } }, audio: false },
    { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
  )

  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      pushError(errors, err)
    }
  }

  let cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
    (d) => d.kind === 'videoinput',
  )

  if (cameras.length === 0) {
    try {
      await navigator.permissions.query({ name: 'camera' as PermissionName })
    } catch {
      // Permissions API unsupported — ignore
    }
    cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
      (d) => d.kind === 'videoinput',
    )
  }

  for (const cam of cameras) {
    if (!cam.deviceId) continue
    for (const exact of [false, true]) {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: exact ? { exact: cam.deviceId } : { ideal: cam.deviceId },
          },
          audio: false,
        })
      } catch (err) {
        pushError(errors, err)
      }
    }
  }

  const best =
    errors.find((e) => e.name === 'NotAllowedError') ??
    errors.find((e) => e.name === 'NotReadableError') ??
    errors.find((e) => e.name === 'NotFoundError') ??
    errors.at(-1)

  if (best) throw best

  throw new DOMException(
    'No camera reported by the browser.',
    'NotFoundError',
  )
}

export async function openUserCameraWithRetry(): Promise<MediaStream> {
  try {
    return await openUserCamera()
  } catch (first) {
    if (
      first instanceof DOMException &&
      (first.name === 'NotReadableError' || first.name === 'AbortError')
    ) {
      await delay(CAMERA_RELEASE_MS)
      return openUserCamera()
    }
    throw first
  }
}

export function waitForVideoReady(
  video: HTMLVideoElement,
  timeoutMs = 12_000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const check = () => video.readyState >= 2 && video.videoWidth > 0

    const finish = (ok: boolean) => {
      clearTimeout(timer)
      clearInterval(poll)
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('canplay', onReady)
      ok ? resolve() : reject(new Error('Video failed to load'))
    }

    const onReady = () => {
      if (check()) finish(true)
    }

    if (check()) return resolve()

    video.addEventListener('loadeddata', onReady)
    video.addEventListener('loadedmetadata', onReady)
    video.addEventListener('canplay', onReady)

    const poll = setInterval(() => {
      if (check()) finish(true)
    }, 80)

    const timer = setTimeout(() => finish(false), timeoutMs)
  })
}

export async function playVideoElement(video: HTMLVideoElement): Promise<void> {
  video.muted = true
  video.playsInline = true
  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      await video.play()
      return
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError' && attempt < 3) {
        await delay(150)
        continue
      }
      throw err
    }
  }
}

export function formatCameraError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') {
      return [
        'Camera blocked for this site.',
        'In Chrome: click the lock/tune icon in the address bar → Site settings → Camera → Allow.',
        'Also check Mac System Settings → Privacy & Security → Camera → Google Chrome.',
      ].join(' ')
    }
    if (err.name === 'NotFoundError') {
      return [
        'Chrome could not open a camera.',
        'Confirm Mac System Settings → Privacy & Security → Camera allows Google Chrome.',
        'Then in Chrome click the lock icon on this page → Camera → Allow, and tap Try again.',
        'If you use Continuity Camera, unlock your iPhone.',
      ].join(' ')
    }
    if (err.name === 'NotReadableError') {
      return 'Camera is busy (Zoom, FaceTime, Photo Booth, etc.). Quit those apps, wait a few seconds, then Try again.'
    }
    if (err.name === 'AbortError') {
      return 'Camera startup was interrupted. Tap Try again.'
    }
    if (err.name === 'OverconstrainedError') {
      return 'Camera settings not supported on this device. Tap Try again.'
    }
    if (err.name === 'NotSupportedError') {
      return 'Camera not supported in this browser.'
    }
  }
  if (err instanceof Error) {
    if (err.message.includes('timed out')) {
      return 'Camera took too long to start. Close other apps using the camera and Try again.'
    }
    return err.message
  }
  return 'Could not start the camera.'
}
