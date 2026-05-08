import { useEffect, useMemo, useRef, useState } from 'react'

type GlassStackProps = {
  images: string[]
  className?: string
  alt?: string
}

export default function GlassStack({ images, className, alt }: GlassStackProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})

  const validImages = useMemo(() => {
    return images.filter(Boolean).slice(0, 3)
  }, [images])

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }))
  }

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
    <div className={['glassStackV', className].filter(Boolean).join(' ')} ref={sceneRef}>
      {validImages.map((src, index) => (
        <button
          key={index}
          type="button"
          className={`glassPaneV glassPaneV--${index}`}
          aria-label={alt ?? ''}
        >
          {!loadedImages[index] && <div className="skeleton" />}
          <img
            src={src}
            alt={alt ?? ''}
            draggable={false}
            loading="eager"
            onLoad={() => handleImageLoad(index)}
            className={`lazy-image ${loadedImages[index] ? 'fade-in' : ''}`}
            style={{ display: loadedImages[index] ? 'block' : 'none' }}
          />
        </button>
      ))}
      {validImages.length === 0 && (
        <div className="glassPaneV glassPaneV--0">
          <div className="glassFallbackV" />
        </div>
      )}
    </div>
  )
}
