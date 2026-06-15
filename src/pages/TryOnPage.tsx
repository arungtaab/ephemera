import { HandTryOn } from '../features/try-on/HandTryOn'
import { PageHeader } from '../components/PageHeader'

export function TryOnPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title="Try On"
        subtitle="Point your camera at your hand to preview press-ons in real time"
      />
      <div className="mt-6">
        <HandTryOn />
      </div>
    </div>
  )
}
