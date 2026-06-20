export type NfcTemplate = 'url' | 'vcard' | 'text' | 'wifi'

export interface UrlPayload {
  url: string
  label: string
}

export interface VcardPayload {
  name: string
  phone: string
  email: string
  url?: string
}

export interface TextPayload {
  text: string
}

export interface WifiPayload {
  ssid: string
  password: string
  security: 'WPA' | 'WEP' | 'nopass'
}

type NdefWriteRecord = {
  recordType: string
  data: string | BufferSource
  mediaType?: string
  lang?: string
  encoding?: string
}

const utf8 = new TextEncoder()

/** MIME records require ArrayBuffer / ArrayBufferView — not plain strings. */
function encodeUtf8(value: string): Uint8Array {
  return utf8.encode(value)
}

export function buildVcard(p: VcardPayload): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${p.name}`,
    `N:${p.name};;;;`,
  ]
  if (p.phone) lines.push(`TEL:${p.phone}`)
  if (p.email) lines.push(`EMAIL:${p.email}`)
  if (p.url) lines.push(`URL:${p.url}`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

export function buildWifiRecord(p: WifiPayload): string {
  const escape = (s: string) => s.replace(/([\\;,:"])/g, '\\$1')
  const auth = p.security === 'nopass' ? '' : `T:${p.security};`
  const pass = p.security === 'nopass' ? '' : `P:${escape(p.password)};`
  return `WIFI:S:${escape(p.ssid)};${auth}${pass};`
}

export function getPreview(
  template: NfcTemplate,
  data: UrlPayload | VcardPayload | TextPayload | WifiPayload,
): string {
  switch (template) {
    case 'url':
      return (data as UrlPayload).url
    case 'vcard':
      return buildVcard(data as VcardPayload)
    case 'text':
      return (data as TextPayload).text
    case 'wifi':
      return buildWifiRecord(data as WifiPayload)
  }
}

function buildNdefRecord(
  template: NfcTemplate,
  data: UrlPayload | VcardPayload | TextPayload | WifiPayload,
): NdefWriteRecord {
  switch (template) {
    case 'url': {
      const p = data as UrlPayload
      const url = p.url.trim()
      if (!url) throw new Error('Enter a URL first')
      return { recordType: 'url', data: url }
    }
    case 'vcard': {
      const vcard = buildVcard(data as VcardPayload)
      if (!(data as VcardPayload).name.trim()) {
        throw new Error('Enter at least a name for the contact card')
      }
      return {
        recordType: 'mime',
        mediaType: 'text/vcard',
        data: encodeUtf8(vcard) as BufferSource,
      }
    }
    case 'text': {
      const text = (data as TextPayload).text.trim()
      if (!text) throw new Error('Enter text to write')
      return { recordType: 'text', data: text, lang: 'en' }
    }
    case 'wifi': {
      const p = data as WifiPayload
      if (!p.ssid.trim()) throw new Error('Enter a WiFi network name')
      const wifi = buildWifiRecord(p)
      return {
        recordType: 'mime',
        mediaType: 'application/vnd.wifi.wsc',
        data: encodeUtf8(wifi) as BufferSource,
      }
    }
  }
}

export async function writeNfcTag(
  template: NfcTemplate,
  data: UrlPayload | VcardPayload | TextPayload | WifiPayload,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NDEFReader = (window as any).NDEFReader
  if (!NDEFReader) throw new Error('Web NFC not supported — use Chrome on Android over HTTPS')

  const record = buildNdefRecord(template, data)
  const reader = new NDEFReader()
  await reader.write({ records: [record] })
}
