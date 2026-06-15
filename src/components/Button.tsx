import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'ransom'

const variants: Record<Variant, string> = {
  primary:
    'bg-[#F5A623] text-[#1a1a1a] hover:bg-[#F7C04A] shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px]',
  secondary:
    'bg-[#3D2F75] text-[#F5A623] border-2 border-[#F5A623]/50 hover:bg-[#4B3B8E] shadow-[4px_4px_0_rgba(0,0,0,0.4)]',
  ghost: 'bg-transparent text-[#F5A623] hover:bg-white/10',
  outline:
    'border-2 border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623]/10',
  ransom:
    'ransom-strip !text-[#1a1a1a] hover:brightness-95 -rotate-1 px-5 py-2.5',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  to?: string
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  to,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  const rounded = variant === 'ransom' ? '' : 'rounded-sm'
  const classes = `${base} ${rounded} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
