import { useMemo, useState } from 'react'
import type { ProjectKind } from '../siteConfig'

type GlassStackVerticalProps = {
  images: string[]
  className?: string
  alt?: string
  flip?: boolean
  kind?: ProjectKind
}

export default function GlassStackVertical({
  images,
  className,
  alt,
  flip = false,
  kind,
}: GlassStackVerticalProps) {
  const panes = useMemo(() => {
    const srcs = images.filter(Boolean).slice(0, 3)
    while (srcs.length < 3) srcs.push('')
    return srcs
  }, [images])

  const [order, setOrder] = useState([0, 1, 2])

  const rootClassName = [
    'glassStackV',
    kind ? `glassStackV--${kind}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (position: number) => {
    setOrder((prev) => {
      if (position === prev.length - 1) return prev

      const next = [...prev]
      const [item] = next.splice(position, 1)
      next.push(item)
      return next
    })
  }

  return (
    <div className={rootClassName} data-flip={flip ? 'true' : 'false'}>
      {order.map((paneIndex, position) => {
        const src = panes[paneIndex]
        const isActive = position === order.length - 1
        return (
          <button
            key={paneIndex}
            type="button"
            className={['glassPaneV', `glassPaneV--${position}`, isActive ? 'isActive' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleClick(position)}
            aria-label={`Focus layer ${paneIndex + 1}`}
          >
            {src ? (
              <img src={src} alt={alt ?? ''} draggable={false} />
            ) : (
              <div className="glassFallbackV" />
            )}
          </button>
        )
      })}
    </div>
  )
}
