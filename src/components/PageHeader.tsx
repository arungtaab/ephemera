import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-10">
      <h1 className="font-script text-5xl text-[#F5A623] text-shadow-zine md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl font-serif text-sm uppercase tracking-[0.15em] text-[#F4F0E8]/85">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}
