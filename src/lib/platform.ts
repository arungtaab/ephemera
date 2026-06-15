export function supportsNfc(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window
}

export function supportsCamera(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia
  )
}

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isAndroidChrome(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent)
}
