import { SLOGAN_MEANINGS } from '../data/brand'

export function SloganBar() {
  return (
    <div className="border-b border-[#F5A623]/15 bg-[#3D2F75]/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-2">
        {SLOGAN_MEANINGS.map(({ word, meaning }) => (
          <p key={word} className="text-[10px] leading-snug text-[#F4F0E8]/75 md:text-[11px]">
            <span className="font-ransom text-[#F5A623]">{word}</span>
            <span className="mx-1 opacity-40">—</span>
            <span className="font-serif">{meaning}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
