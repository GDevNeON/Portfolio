import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

type GlassStackProps = {
  images: string[]
  className?: string
  alt?: string
}

export default function GlassStack({ images, className, alt }: GlassStackProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)

  const panes = useMemo(() => {
    const srcs = images.filter(Boolean).slice(0, 3)
    while (srcs.length < 3) srcs.push('')
    return srcs
  }, [images])

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return

    let frameId: number | null = null
    let lastEvent: PointerEvent | null = null

    const updateTilt = () => {
      if (!lastEvent) return
      const rect = el.getBoundingClientRect()
      const px = (lastEvent.clientX - rect.left) / rect.width
      const py = (lastEvent.clientY - rect.top) / rect.height
      const x = (px - 0.5) * 2
      const y = (py - 0.5) * 2

      el.style.setProperty('--gs-ry', `${x * 10}deg`)
      el.style.setProperty('--gs-rx', `${-y * 8}deg`)
      frameId = null
    }

    const onMove = (e: PointerEvent) => {
      lastEvent = e
      if (frameId == null) {
        frameId = window.requestAnimationFrame(updateTilt)
      }
    }

    const onLeave = () => {
      el.style.setProperty('--gs-ry', `0deg`)
      el.style.setProperty('--gs-rx', `0deg`)
      lastEvent = null
      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <div
      className={['glassStack', className].filter(Boolean).join(' ')}
      ref={sceneRef}
      style={{ ['--gs-active' as never]: active } as CSSProperties}
    >
      {panes.map((src, idx) => {
        const paneClass = ['glassPane', `glassPane--${idx}`, idx === active ? 'isActive' : '']
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={idx}
            type="button"
            className={paneClass}
            onClick={() => setActive(idx)}
            aria-label={`Focus layer ${idx + 1}`}
          >
            {src ? (
              <img src={src} alt={alt ?? ''} draggable={false} />
            ) : (
              <div className="glassFallback" />
            )}
          </button>
        )
      })}
    </div>
  )
}
