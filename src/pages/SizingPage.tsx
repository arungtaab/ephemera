import { SizingFlow } from '../features/sizing/SizingFlow'
import { PageHeader } from '../components/PageHeader'

export function SizingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageHeader
        title="Sizing"
        subtitle="HK coin calibration or quick quiz · saved for checkout"
      />
      <div className="mt-8">
        <SizingFlow />
      </div>
    </div>
  )
}
