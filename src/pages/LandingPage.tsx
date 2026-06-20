import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import {
  CollageCutout,
  PolaroidFrame,
  RansomStrip,
  Starburst,
} from '../components/Collage'
import { collagePaths } from '../data/brand'
import {
  COMPARISON_ROWS,
  MANUFACTURING_STEPS,
  PITCH_TIERS,
  VALUE_PROPS,
} from '../data/business'
import { formatPrice, products } from '../data/products'

const steps = [
  {
    title: 'Order a finished set',
    body: '10 ready-to-wear nails — we manufacture, you wear. Not a DIY kit.',
  },
  {
    title: 'Find your size',
    body: 'Web sizing tool with HK coin calibration before you buy.',
  },
  {
    title: 'Wear + tap',
    body: 'Optional NFC chip in accent nail — emergency contact, directions, digital card.',
  },
]

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#4B3B8E] zine-grain">
        <div className="relative z-[2] mx-auto grid min-h-[min(88vh,900px)] max-w-7xl lg:grid-cols-[1fr_1.1fr_1fr]">
          <div className="relative hidden min-h-[420px] lg:block">
            <PolaroidFrame
              src={collagePaths.nails}
              alt="Press-on nails"
              className="collage-float absolute left-4 top-8 w-44 -rotate-6"
              style={{ '--rot': '-6deg' } as CSSProperties}
            />
            <PolaroidFrame
              src={collagePaths.hands}
              alt="Hands in low light"
              className="collage-float absolute bottom-16 left-12 w-52 rotate-3"
              style={{ '--rot': '3deg', animationDelay: '1s' } as CSSProperties}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center lg:py-24">
            <Starburst className="mb-4 h-14 w-14 md:h-16 md:w-16" />
            <Badge tone="gold">Enactus Sleep</Badge>
            <h1 className="font-script mt-4 text-[clamp(3.5rem,12vw,7.5rem)] leading-[0.9] text-[#F5A623] text-shadow-zine">
              Ephemera
            </h1>
            <p className="mt-5 max-w-md font-serif text-xs font-bold uppercase leading-relaxed tracking-[0.18em] text-[#F5A623] md:text-sm">
              Finished press-on sets from Hong Kong food waste
            </p>
            <p className="mt-3 max-w-sm text-sm text-[#F4F0E8]/75">
              Food-waste bioplastic press-ons with compostable tabs — not petrochemical
              plastic and harsh glue on your nail bed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/shop">Shop sets</Button>
              <Button to="/try-on" variant="outline">
                Try in AR
              </Button>
            </div>
          </div>

          <div className="relative hidden min-h-[420px] lg:block">
            <PolaroidFrame
              src={collagePaths.lily}
              alt="Lily and arches"
              className="collage-float absolute right-6 top-6 w-48 rotate-4"
              style={{ '--rot': '4deg' } as CSSProperties}
            />
            <PolaroidFrame
              src={collagePaths.tulip}
              alt="Tulip stem"
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

        <div className="relative z-[2] px-4 pb-10 pt-2 lg:hidden">
          <PolaroidFrame
            src={collagePaths.nails}
            alt="Press-on nails"
            className="mx-auto w-full max-w-xs -rotate-1"
          />
        </div>
      </section>

      {/* Featured sets */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-script text-4xl text-[#F5A623]">Featured sets</h2>
        <p className="mt-2 font-serif text-[10px] uppercase tracking-[0.25em] text-[#F4F0E8]/60">
          Finished sets from {formatPrice(products[0])}
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
                <p className="mt-2 font-ransom text-lg">{formatPrice(p)}</p>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button to="/shop">View all sets</Button>
        </div>
      </section>

      {/* Why — faster / better / cheaper */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-script text-4xl text-[#F5A623]">Why Ephemera?</h2>
        <p className="mt-2 max-w-lg text-sm text-[#F4F0E8]/65">
          Wins without asking you to buy green — composting is the bonus.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="-rotate-1">
            <Badge tone="paper">Faster</Badge>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {VALUE_PROPS.faster.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
          <Card className="rotate-1">
            <Badge tone="paper">Better</Badge>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {VALUE_PROPS.better.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
          <Card className="-rotate-1">
            <Badge tone="paper">Cheaper</Badge>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {VALUE_PROPS.cheaper.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y-2 border-[#F5A623]/20 bg-[#3D2F75] px-4 py-14 zine-grain">
        <div className="relative z-[2] mx-auto max-w-6xl">
          <h2 className="font-script text-4xl text-[#F5A623]">Same convenience. Better product.</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#F5A623]/30">
                  <th className="py-3 pr-4 font-serif text-[10px] uppercase tracking-widest text-[#F5A623]/70" />
                  <th className="py-3 px-2 font-serif text-[10px] uppercase tracking-widest text-[#F4F0E8]/60">
                    Typical plastic
                  </th>
                  <th className="py-3 px-2 font-serif text-[10px] uppercase tracking-widest text-[#F4F0E8]/60">
                    Eco press-ons
                  </th>
                  <th className="py-3 pl-2 font-serif text-[10px] uppercase tracking-widest text-[#F5A623]">
                    Ephemera
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-[#F5A623]/15">
                    <td className="py-2.5 pr-4 font-bold text-[#F4F0E8]/80">{row.label}</td>
                    <td className="py-2.5 px-2 text-[#F4F0E8]/55">{row.typical}</td>
                    <td className="py-2.5 px-2 text-[#F4F0E8]/55">{row.eco}</td>
                    <td className="py-2.5 pl-2 font-bold text-[#F5A623]">{row.ephemera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How we make them */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-script text-4xl text-[#F5A623]">How we make them</h2>
        <p className="mt-2 text-sm text-[#F4F0E8]/65">
          From cull food to finished set — we manufacture, you wear.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MANUFACTURING_STEPS.map((item, i) => (
            <Card key={item.step} className={i % 2 === 0 ? '-rotate-1' : 'rotate-1'}>
              <RansomStrip>{String(i + 1).padStart(2, '0')}</RansomStrip>
              <h3 className="mt-3 font-serif text-xs font-bold uppercase tracking-widest text-[#4B3B8E]">
                {item.step}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{item.detail}</p>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center font-serif text-xs font-bold uppercase tracking-widest text-[#F5A623]">
          Finished nail sets — not a DIY kit
        </p>
      </section>

      {/* Three products */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-script text-4xl text-[#F5A623]">Three products. One supply chain.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PITCH_TIERS.map((tier, i) => (
            <Card key={tier.id} className={i % 2 === 0 ? '-rotate-1' : 'rotate-1'}>
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest">{tier.name}</h3>
              <p className="mt-2 font-ransom text-2xl text-[#F5A623]">
                {'priceLabel' in tier && tier.priceLabel
                  ? tier.priceLabel
                  : `HKD ${tier.priceHkd}`}
              </p>
              <p className="mt-2 text-sm text-stone-600">{tier.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-stone-500">
                {tier.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button to="/shop">Shop sets</Button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y-2 border-[#F5A623]/20 bg-[#3D2F75] px-4 py-14 zine-grain">
        <div className="relative z-[2] mx-auto max-w-6xl">
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

      {/* NFC */}
      <section className="border-y-2 border-[#F5A623]/20 bg-[#3D2F75] px-4 py-16 zine-grain">
        <div className="relative z-[2] mx-auto max-w-6xl">
          <div className="grid items-stretch gap-6 lg:grid-cols-12">
            <Card variant="dark" className="flex flex-col justify-between lg:col-span-5 -rotate-1">
              <div>
                <Badge tone="gold">Smart Set</Badge>
                <h2 className="font-script mt-4 text-5xl text-[#F5A623]">NFC accent nail</h2>
                <p className="mt-3 font-serif text-xs font-bold uppercase tracking-[0.15em] text-[#F5A623]">
                  Premium nail — not a separate app business
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#F4F0E8]/80">
                  Optional compostable NFC chip in the accent nail. Tap for emergency
                  contact, directions home, or a digital card. Our web tool helps sizing —
                  the product is still the nail.
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

            <div className="relative lg:col-span-7">
              <div className="grid h-full grid-cols-2 gap-3 md:grid-cols-3">
                <PolaroidFrame
                  src={collagePaths.hands}
                  alt="Tap to share"
                  className="rotate-2 md:col-span-1"
                />
                <PolaroidFrame
                  src={collagePaths.silhouette}
                  alt="Silhouette in window light"
                  className="-rotate-1 md:col-span-1"
                />
                <PolaroidFrame
                  src={collagePaths.nails}
                  alt="Press-on set"
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

      {/* Brand close */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-script text-5xl text-[#F5A623] text-shadow-zine">
              Project Ephemera
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4F0E8]/75">
              Finished home-compostable press-on sets for the Enactus Sleep competition.
              Faster, better fit, lower cost than salon — with optional NFC on the accent nail.
            </p>
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
