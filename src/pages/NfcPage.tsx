import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import {
  buildVcard,
  buildWifiRecord,
  getPreview,
  writeNfcTag,
  type NfcTemplate,
  type TextPayload,
  type UrlPayload,
  type VcardPayload,
  type WifiPayload,
} from '../features/nfc/nfcWriter'
import { supportsNfc, isAndroidChrome } from '../lib/platform'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'

const inputClass =
  'mt-1 w-full border-2 border-stone-300 bg-white px-4 py-3 text-[#1a1a1a] focus:border-[#4B3B8E] focus:outline-none'

const templates: { id: NfcTemplate; label: string; desc: string }[] = [
  { id: 'url', label: 'URL / Social', desc: 'Instagram, Linktree, portfolio' },
  { id: 'vcard', label: 'Contact card', desc: 'Name, phone, email' },
  { id: 'text', label: 'Custom text', desc: 'Note, mantra, promo code' },
  { id: 'wifi', label: 'WiFi', desc: 'Share network credentials' },
]

export function NfcPage() {
  const [template, setTemplate] = useState<NfcTemplate>('url')
  const [urlData, setUrlData] = useState<UrlPayload>({
    url: 'https://instagram.com/',
    label: 'My profile',
  })
  const [vcardData, setVcardData] = useState<VcardPayload>({
    name: '',
    phone: '',
    email: '',
    url: '',
  })
  const [textData, setTextData] = useState<TextPayload>({ text: '' })
  const [wifiData, setWifiData] = useState<WifiPayload>({
    ssid: '',
    password: '',
    security: 'WPA',
  })
  const [status, setStatus] = useState<'idle' | 'writing' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [qrUrl, setQrUrl] = useState('')

  const nfcSupported = supportsNfc()
  const payload = getPreview(
    template,
    template === 'url'
      ? urlData
      : template === 'vcard'
        ? vcardData
        : template === 'text'
          ? textData
          : wifiData,
  )

  useEffect(() => {
    const qrPayload =
      template === 'url'
        ? urlData.url
        : template === 'vcard'
          ? buildVcard(vcardData)
          : template === 'wifi'
            ? buildWifiRecord(wifiData)
            : textData.text
    if (qrPayload) {
      QRCode.toDataURL(qrPayload, { width: 200, margin: 2 }).then(setQrUrl)
    }
  }, [template, urlData, vcardData, textData, wifiData])

  const getData = () => {
    switch (template) {
      case 'url':
        return urlData
      case 'vcard':
        return vcardData
      case 'text':
        return textData
      case 'wifi':
        return wifiData
    }
  }

  const handleWrite = async () => {
    setStatus('writing')
    setError('')
    try {
      await writeNfcTag(template, getData())
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Write failed')
    }
  }

  const copyPayload = () => {
    navigator.clipboard.writeText(payload)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageHeader
        title="NFC"
        subtitle="Program your optional Ephemera stickers · tap to share"
      />

      {!nfcSupported && (
        <Card variant="dark" className="mt-6">
          <Badge tone="gold">Fallback mode</Badge>
          <p className="mt-2 text-sm text-[#F4F0E8]/80">
            Web NFC writing works on <strong>Chrome for Android</strong> over HTTPS.
            {isAndroidChrome()
              ? ' Your browser may need permission.'
              : ' Use the QR code or copy payload below for this demo.'}
          </p>
        </Card>
      )}

      <div className="mt-8 grid grid-cols-2 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTemplate(t.id)
              setStatus('idle')
            }}
            className={`border-2 p-4 text-left transition-colors ${
              template === t.id
                ? 'border-[#F5A623] bg-[#F5A623]/20 text-[#F5A623]'
                : 'border-[#F4F0E8]/20 text-[#F4F0E8]/80 hover:border-[#F5A623]/50'
            }`}
          >
            <p className="font-serif text-xs font-bold uppercase tracking-widest">{t.label}</p>
            <p className="mt-1 text-[10px] opacity-70">{t.desc}</p>
          </button>
        ))}
      </div>

      <Card className="mt-6 space-y-4">
        {template === 'url' && (
          <>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest">URL</label>
              <input
                value={urlData.url}
                onChange={(e) => setUrlData({ ...urlData, url: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-bold">Label (optional)</label>
              <input
                value={urlData.label}
                onChange={(e) => setUrlData({ ...urlData, label: e.target.value })}
                className={inputClass}
              />
            </div>
          </>
        )}

        {template === 'vcard' && (
          <>
            {(['name', 'phone', 'email', 'url'] as const).map((field) => (
              <div key={field}>
                <label className="text-sm font-bold capitalize">{field}</label>
                <input
                  value={vcardData[field] ?? ''}
                  onChange={(e) => setVcardData({ ...vcardData, [field]: e.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
          </>
        )}

        {template === 'text' && (
          <div>
            <label className="text-sm font-bold">Message</label>
            <textarea
              value={textData.text}
              onChange={(e) => setTextData({ text: e.target.value })}
              className={inputClass}
              rows={4}
            />
          </div>
        )}

        {template === 'wifi' && (
          <>
            <div>
              <label className="text-sm font-bold">Network name (SSID)</label>
              <input
                value={wifiData.ssid}
                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold">Password</label>
              <input
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-bold">Security</label>
              <select
                value={wifiData.security}
                onChange={(e) =>
                  setWifiData({
                    ...wifiData,
                    security: e.target.value as WifiPayload['security'],
                  })
                }
                className={inputClass}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open network</option>
              </select>
            </div>
          </>
        )}
      </Card>

      <Card className="mt-6">
        <p className="text-sm font-bold text-stone-700">Preview</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-stone-100 p-3 text-xs">{payload}</pre>
      </Card>

      {qrUrl && (
        <Card className="mt-6 text-center">
          <p className="text-sm font-bold text-stone-700">QR fallback</p>
          <img src={qrUrl} alt="QR code" className="mx-auto mt-3" />
          <p className="mt-2 text-xs text-stone-500">Scan when NFC write isn&apos;t available</p>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {nfcSupported && (
          <Button onClick={handleWrite} disabled={status === 'writing'}>
            {status === 'writing' ? 'Hold tag near phone…' : 'Write to NFC sticker'}
          </Button>
        )}
        <Button variant="secondary" onClick={copyPayload}>
          Copy payload
        </Button>
      </div>

      {status === 'success' && (
        <p className="mt-4 font-bold text-[#F5A623]">NFC tag written successfully!</p>
      )}
      {status === 'error' && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  )
}
