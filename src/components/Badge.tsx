import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'gold',
}: {
  children: ReactNode
  tone?: 'gold' | 'paper' | 'dark'
}) {
  const tones = {
    gold: 'bg-[#F5A623] text-[#1a1a1a] border border-black/20',
    paper: 'bg-[#F4F0E8] text-[#1a1a1a] border border-black/15',
    dark: 'bg-[#3D2F75] text-[#F5A623] border border-[#F5A623]/40',
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[2px_2px_0_rgba(0,0,0,0.3)] ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
