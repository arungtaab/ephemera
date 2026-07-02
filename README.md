# Project Ephemera PWA

Home compostable bioplastic press-on nails — demo PWA for Enactus Sleep Competition.

## Pitch materials

5-minute deck copy, timed script, demo flow, and presenter roles: [`pitch/`](./pitch/README.md)

## Features

- Brand landing + mock shop with cart/checkout
- NFC programmer (URL, vCard, text, WiFi) with QR fallback
- AR try-on with MediaPipe Hand Landmarker
- CV sizing with HK coin calibration + quiz fallback
- Installable PWA (purple + gold zine branding)

## Stack

Vite · React · TypeScript · Tailwind CSS · React Router · vite-plugin-pwa · MediaPipe

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (free)

Deploy to [Vercel](https://vercel.com) or Netlify for HTTPS (required for camera, NFC, and PWA install).

```bash
npx vercel
```

## Notes

- **NFC write**: Chrome for Android only. iOS/desktop use QR/copy fallback.
- **Font**: Outfit (Google Fonts) as Wicky Javick stand-in; drop licensed Wicky Javick `.woff2` files into `public/fonts/wicky-javick/` to swap.
