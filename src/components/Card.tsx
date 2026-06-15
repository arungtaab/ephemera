import type { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'paper' | 'dark' | 'ghost'

export function Card({
  children,
  className = '',
  variant = 'paper',
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  variant?: CardVariant
}) {
  const styles = {
    paper: 'zine-card',
    dark: 'zine-card-dark',
    ghost: 'border border-[#F5A623]/25 bg-[#4B3B8E]/60 text-[#F4F0E8] shadow-none',
  }
  return (
    <div className={`p-6 ${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
