import { useEffect, useState } from 'react'
import { Button } from './Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('ephemera-install-dismissed') === '1',
  )

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferred || dismissed) return null

  const install = async () => {
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setDeferred(null)
    setDismissed(true)
    localStorage.setItem('ephemera-install-dismissed', '1')
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md zine-card p-4 md:left-auto">
      <p className="font-serif text-sm font-bold uppercase tracking-wide text-[#1a1a1a]">
        Install Project Ephemera
      </p>
      <p className="mt-1 text-xs text-stone-600">
        Add to your home screen for the full demo.
      </p>
      <div className="mt-3 flex gap-2">
        <Button onClick={install} className="flex-1 py-2 text-xs">
          Install
        </Button>
        <button
          onClick={() => {
            setDismissed(true)
            localStorage.setItem('ephemera-install-dismissed', '1')
          }}
          className="px-4 text-xs font-bold uppercase text-stone-500"
        >
          Later
        </button>
      </div>
    </div>
  )
}
