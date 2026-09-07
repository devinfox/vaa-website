import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  tone = 'gold',
}: {
  eyebrow: string
  title: ReactNode
  body?: ReactNode
  align?: 'center' | 'left'
  tone?: 'gold' | 'violet'
}) {
  const a = align === 'center' ? 'mx-auto text-center' : 'text-left'
  const dot = tone === 'gold' ? 'bg-gold' : 'bg-violet'
  return (
    <div className={`max-w-3xl ${a}`}>
      <div className="eyebrow">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {eyebrow}
      </div>
      <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {body && <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">{body}</p>}
    </div>
  )
}
