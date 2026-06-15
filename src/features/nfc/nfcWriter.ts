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

export async function writeNfcTag(
  template: NfcTemplate,
  data: UrlPayload | VcardPayload | TextPayload | WifiPayload,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NDEFReader = (window as any).NDEFReader
  if (!NDEFReader) throw new Error('Web NFC not supported')

  const reader = new NDEFReader()
  let record: { recordType: string; data: string | BufferSource; mediaType?: string }

  switch (template) {
    case 'url': {
      const p = data as UrlPayload
      record = { recordType: 'url', data: p.url }
      break
    }
    case 'vcard': {
      const vcard = buildVcard(data as VcardPayload)
      record = { recordType: 'mime', mediaType: 'text/vcard', data: vcard }
      break
    }
    case 'text': {
      record = { recordType: 'text', data: (data as TextPayload).text }
      break
    }
    case 'wifi': {
      const wifi = buildWifiRecord(data as WifiPayload)
      record = {
        recordType: 'mime',
        mediaType: 'application/vnd.wifi.wsc',
        data: wifi,
      }
      break
    }
  }

  await reader.write({ records: [record] })
}
