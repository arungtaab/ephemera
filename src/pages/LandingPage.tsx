import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import {
  CollageCutout,
  EditorialTile,
  PolaroidFrame,
  RansomStrip,
  Starburst,
} from '../components/Collage'
import { collagePaths, SLOGAN_LINE, SLOGAN_MEANINGS, sloganImages } from '../data/brand'
import { products } from '../data/products'

const steps = [
  {
    title: 'Find your size',
    body: 'Camera + HK coin calibration, or the quick quiz.',
  },
  {
    title: 'Customize',
    body: 'Shape, color, finish. Preview in AR before you order.',
  },
  {
    title: 'Wear + tap',
    body: 'Optional NFC stickers — links, contacts, custom payloads.',
  },
]

export function LandingPage() {
  const [wear, tap, returnWord, bloom] = sloganImages

  return (
    <div>
      {/* Hero collage */}
      <section className="relative overflow-hidden bg-[#4B3B8E] zine-grain">
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl lg:grid-cols-[1fr_1.1fr_1fr]">
          {/* Left column */}
          <div className="relative hidden min-h-[420px] lg:block">
            <PolaroidFrame
              src={collagePaths[wear.key]}
              alt={wear.alt}
              caption={wear.word}
              className="collage-float absolute left-4 top-8 w-44 -rotate-6"
              style={{ '--rot': '-6deg' } as CSSProperties}
            />
            <PolaroidFrame
              src={collagePaths[tap.key]}
              alt={tap.alt}
              caption={tap.word}
              className="collage-float absolute bottom-16 left-12 w-52 rotate-3"
              style={{ '--rot': '3deg', animationDelay: '1s' } as CSSProperties}
            />
          </div>

          {/* Center */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center lg:py-24">
            <Starburst className="mb-4 h-14 w-14 md:h-16 md:w-16" />
            <Badge tone="gold">Enactus Sleep</Badge>
            <h1 className="font-script mt-4 text-[5.5rem] leading-[0.9] text-[#F5A623] text-shadow-zine md:text-[7.5rem]">
              Ephemera
            </h1>
            <p className="mt-5 max-w-md font-serif text-xs font-bold uppercase leading-relaxed tracking-[0.18em] text-[#F5A623] md:text-sm">
              The first smart, home-compostable press-ons
            </p>
            <p className="mt-3 font-serif text-xs font-bold uppercase tracking-[0.18em] text-[#F5A623]">
              {SLOGAN_LINE}
            </p>
            <ul className="mt-4 max-w-sm space-y-1.5 text-left text-[11px] text-[#F4F0E8]/75">
              {SLOGAN_MEANINGS.map((m) => (
                <li key={m.word}>
                  <span className="font-ransom text-[#F5A623]">{m.word}</span>
                  <span className="mx-1.5 opacity-40">—</span>
                  {m.meaning}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/shop">Shop sets</Button>
              <Button to="/try-on" variant="outline">
                Try in AR
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2 rotate-[-1deg]">
              {sloganImages.map(({ word }) => (
                <RansomStrip key={word}>{word}</RansomStrip>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="relative hidden min-h-[420px] lg:block">
            <PolaroidFrame
              src={collagePaths[returnWord.key]}
              alt={returnWord.alt}
              caption={returnWord.word}
              className="collage-float absolute right-6 top-6 w-48 rotate-4"
              style={{ '--rot': '4deg' } as CSSProperties}
            />
            <PolaroidFrame
              src={collagePaths[bloom.key]}
              alt={bloom.alt}
              caption={bloom.word}
              className="collage-float absolute bottom-12 right-2 w-44 -rotate-3"
              style={{ '--rot': '-3deg', animationDelay: '0.8s' } as CSSProperties}
            />
            <CollageCutout
              src={collagePaths.silhouette}
              alt="Silhouette in window light"
              className="collage-float absolute right-0 top-[42%] h-32 w-24 opacity-90"
              style={{ '--rot': '6deg', animationDelay: '1.4s' } as CSSProperties}
            />
          </div>
        </div>

        {/* Mobile film strip — four slogan words */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-10 pt-2 lg:hidden">
          {sloganImages.map((item) => (
            <PolaroidFrame
              key={item.word}
              src={collagePaths[item.key]}
              alt={item.alt}
              caption={item.word}
              className="w-36 shrink-0 -rotate-1"
            />
          ))}
        </div>
      </section>

      {/* Editorial gallery */}
      <section className="border-y-2 border-[#F5A623]/20 bg-[#3D2F75] px-4 py-14 zine-grain">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-script text-4xl text-[#F5A623] md:text-5xl">Ephemera</h2>
              <p className="mt-2 font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#F5A623]">
                {SLOGAN_LINE}
              </p>
              <p className="mt-2 max-w-md text-sm text-[#F4F0E8]/65">
                Wear compostable press-ons. Tap NFC stickers. Return to soil. Bloom —
                then fade.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <EditorialTile
              src={collagePaths.nails}
              alt={wear.alt}
              label="Wear"
              className="col-span-2 row-span-2 md:col-span-2"
            />
            <EditorialTile src={collagePaths.hands} alt={tap.alt} label="Tap" />
            <EditorialTile src={collagePaths.lily} alt={returnWord.alt} label="Return" />
            <EditorialTile src={collagePaths.tulip} alt={bloom.alt} label="Bloom" />
            <EditorialTile
              src={collagePaths.silhouette}
              alt="Silhouette in window light"
              className="col-span-2 md:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Featured sets */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-script text-4xl text-[#F5A623]">Featured sets</h2>
        <p className="mt-2 font-serif text-[10px] uppercase tracking-[0.25em] text-[#F4F0E8]/60">
          Home-compostable bioplastic · from ${products[0].price}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Link
              key={p.id}
              to={`/shop/${p.slug}`}
              className={`group ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
            >
              <Card className="h-full transition-transform group-hover:scale-[1.02]">
                <div className="mb-3 flex gap-1.5">
                  {p.colors.slice(0, 3).map((c) => (
                    <div
                      key={c.hex}
                      className="h-8 w-5 rounded-t-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <h3 className="font-serif text-xs font-bold uppercase tracking-widest">
                  {p.name}
                </h3>
                <p className="mt-2 font-ransom text-lg">${p.price}</p>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button to="/shop">View all sets</Button>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-script text-4xl text-[#F5A623]">Why Ephemera?</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="-rotate-1">
            <Badge tone="paper">Wear</Badge>
            <h3 className="mt-3 font-serif text-sm font-bold uppercase tracking-widest">
              Home compostable
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Bioplastic press-ons designed to break down in home compost.
            </p>
          </Card>
          <Card className="rotate-1">
            <Badge tone="paper">Tap</Badge>
            <h3 className="mt-3 font-serif text-sm font-bold uppercase tracking-widest">
              NFC smart stickers
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Program links, contacts, or messages — tap to share.
            </p>
          </Card>
          <Card className="-rotate-1">
            <Badge tone="paper">Bloom</Badge>
            <h3 className="mt-3 font-serif text-sm font-bold uppercase tracking-widest">
              Ephemeral beauty
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Beauty that blooms briefly — gentler on you and the planet.
            </p>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y-2 border-[#F5A623]/20 bg-[#3D2F75] px-4 py-14 zine-grain">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-script text-4xl text-[#F5A623]">How it works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className={i % 2 === 0 ? '-rotate-1' : 'rotate-1'}>
                <RansomStrip>{String(i + 1).padStart(2, '0')}</RansomStrip>
                <h3 className="mt-4 font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#F5A623]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#F4F0E8]/70">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button to="/sizing" variant="secondary">
              Find my size
            </Button>
            <Button to="/try-on" variant="outline">
              AR try-on
            </Button>
            <Button to="/nfc" variant="outline">
              Program NFC
            </Button>
          </div>
        </div>
      </section>

      {/* NFC — Tap */}
      <section className="border-y-2 border-[#F5A623]/20 bg-[#3D2F75] px-4 py-16 zine-grain">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            {/* Copy + features */}
            <Card variant="dark" className="flex flex-col justify-between lg:col-span-5 -rotate-1">
              <div>
                <Badge tone="gold">Tap</Badge>
                <h2 className="font-script mt-4 text-5xl text-[#F5A623]">NFC stickers</h2>
                <p className="mt-3 font-serif text-xs font-bold uppercase tracking-[0.15em] text-[#F5A623]">
                  {SLOGAN_LINE}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#F4F0E8]/80">
                  Add optional NFC stickers to any nail. Program them from this app in
                  seconds — then tap your nail to share a link, contact card, WiFi, or
                  custom message.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    { label: 'URL / Social', desc: 'Instagram, Linktree, portfolio' },
                    { label: 'Contact card', desc: 'Name, phone, email' },
                    { label: 'WiFi', desc: 'Share network credentials' },
                    { label: 'Custom text', desc: 'Note, promo, mantra' },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-3 border-l-2 border-[#F5A623]/40 pl-3"
                    >
                      <span className="font-ransom text-xs text-[#F5A623]">{item.label}</span>
                      <span className="text-xs text-[#F4F0E8]/55">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/nfc">Program NFC</Button>
                <Button to="/shop" variant="outline">
                  Add to order
                </Button>
              </div>
            </Card>

            {/* Visual collage */}
            <div className="relative lg:col-span-7">
              <div className="grid h-full grid-cols-2 gap-3 md:grid-cols-3">
                <PolaroidFrame
                  src={collagePaths.hands}
                  alt="Tap to share"
                  caption="Tap"
                  className="rotate-2 md:col-span-1"
                />
                <PolaroidFrame
                  src={collagePaths.silhouette}
                  alt="Silhouette in window light"
                  className="-rotate-1 md:col-span-1"
                />
                <PolaroidFrame
                  src={collagePaths.nails}
                  alt="Wear with NFC"
                  caption="Wear"
                  className="rotate-1 md:col-span-1"
                />
                <div className="col-span-2 flex flex-col justify-center gap-4 rounded-sm border-2 border-[#F5A623]/25 bg-[#4B3B8E]/80 p-5 md:col-span-3">
                  <p className="font-serif text-[10px] font-bold uppercase tracking-[0.25em] text-[#F5A623]">
                    How it works
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { n: '01', t: 'Order', d: 'Add NFC pack at checkout' },
                      { n: '02', t: 'Program', d: 'Write from the app' },
                      { n: '03', t: 'Tap', d: 'Phone reads your nail' },
                    ].map((s) => (
                      <div key={s.n} className="text-center sm:text-left">
                        <span className="font-ransom text-2xl text-[#F5A623]/40">{s.n}</span>
                        <p className="mt-1 font-serif text-xs font-bold uppercase tracking-widest text-[#F5A623]">
                          {s.t}
                        </p>
                        <p className="mt-1 text-[11px] text-[#F4F0E8]/60">{s.d}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-[#F4F0E8]/45 sm:text-left">
                    Android Chrome for writing · QR fallback on iOS & desktop
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand close + moodboard */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-script text-5xl text-[#F5A623] text-shadow-zine">
              Project Ephemera
            </h2>
            <p className="mt-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#F5A623]">
              {SLOGAN_LINE}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4F0E8]/75">
              Home-compostable bioplastic press-ons for the Enactus Sleep competition.
              Less toxic, more affordable, and fully yours to customize.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {sloganImages.map(({ word, key }) => (
                <div
                  key={word}
                  className="flex items-center gap-2 border border-[#F5A623]/30 bg-[#4B3B8E]/50 px-3 py-2"
                >
                  <div className="h-8 w-6 overflow-hidden bg-black">
                    <img
                      src={collagePaths[key]}
                      alt=""
                      className="zine-photo h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-ransom text-xs uppercase">{word}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/shop">Shop now</Button>
              <Button to="/try-on" variant="secondary">
                Try in AR
              </Button>
            </div>
          </div>

          <div className="-rotate-1 overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.45)]">
            <img
              src="/assets/brand/moodboard.png"
              alt="Project Ephemera brand moodboard"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
