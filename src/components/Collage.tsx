import type { ReactNode, CSSProperties } from 'react'

interface CollageCutoutProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  torn?: 'left' | 'bottom' | 'triangle' | 'none'
}

export function CollageCutout({
  src,
  alt,
  className = '',
  style,
  torn = 'none',
}: CollageCutoutProps) {
  const tornClass =
    torn === 'left'
      ? 'torn-left'
      : torn === 'bottom'
        ? 'torn-bottom'
        : torn === 'triangle'
          ? 'torn-triangle'
          : ''

  return (
    <div
      className={`overflow-hidden bg-black shadow-[4px_5px_0_rgba(0,0,0,0.55)] ${tornClass} ${className}`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className="zine-photo h-full w-full object-cover object-center"
        loading="lazy"
      />
    </div>
  )
}

/** Full polaroid-style frame — image shown complete, not torn */
export function PolaroidFrame({
  src,
  alt,
  caption,
  className = '',
  style,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <figure
      className={`bg-[#F4F0E8] p-2 pb-8 shadow-[6px_6px_0_rgba(0,0,0,0.45)] ${className}`}
      style={style}
    >
      <div className="aspect-[4/5] overflow-hidden bg-black">
        <img
          src={src}
          alt={alt}
          className="zine-photo h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-ransom text-[10px] uppercase tracking-widest text-[#1a1a1a]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** Editorial tile for gallery grids */
export function EditorialTile({
  src,
  alt,
  label,
  className = '',
}: {
  src: string
  alt: string
  label?: string
  className?: string
}) {
  return (
    <div className={`group relative overflow-hidden bg-black shadow-[5px_5px_0_rgba(0,0,0,0.4)] ${className}`}>
      <img
        src={src}
        alt={alt}
        className="zine-photo aspect-[3/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5A623]">
            {label}
          </p>
        </div>
      )}
    </div>
  )
}

export function Starburst({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`starburst-spin ${className}`}
      aria-hidden
    >
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="none"
        stroke="#6b5bb5"
        strokeWidth="1.5"
        transform="rotate(45 50 50)"
      />
      <g stroke="white" strokeWidth="3" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="50"
            x2="50"
            y2="14"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </g>
    </svg>
  )
}

export function RansomStrip({ children }: { children: ReactNode }) {
  return (
    <div className="ransom-strip inline-block -rotate-2 px-4 py-2 text-lg uppercase md:text-xl">
      {children}
    </div>
  )
}
