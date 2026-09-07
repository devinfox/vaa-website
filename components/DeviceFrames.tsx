import Image from 'next/image'
import type { ReactNode } from 'react'

type ShotProps = {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
}

export function MacBook({ src, alt, priority, sizes = '(min-width: 1024px) 60vw, 100vw' }: ShotProps) {
  return (
    <div className="mac">
      <div className="mac-screen">
        <div className="mac-display">
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover object-top" />
        </div>
      </div>
      <div className="mac-base" />
    </div>
  )
}

export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        <div className="phone-island" />
        {children}
      </div>
    </div>
  )
}

export function Browser({
  src,
  alt,
  url = 'voicealchemyacademy.app',
  aspect = 'aspect-[16/10]',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority,
}: ShotProps & { url?: string; aspect?: string }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <span className="browser-dot" />
        <span className="browser-dot" />
        <span className="browser-dot" />
        <div className="browser-url">{url}</div>
        <span className="w-8" />
      </div>
      <div className={`relative ${aspect} bg-ink-2`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  )
}

export function Tablet({ src, alt, sizes = '(min-width: 1024px) 50vw, 100vw' }: ShotProps) {
  return (
    <div className="tablet">
      <div className="tablet-screen">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-left-top" />
      </div>
    </div>
  )
}
