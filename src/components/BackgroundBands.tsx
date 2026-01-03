import { useEffect, useState, type CSSProperties } from 'react'

const PANEL_RUNNER_DURATION = 6400

type PanelInfo = {
  id: number
  x: string
  y: string
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export default function BackgroundBands({
  enabled = true,
}: {
  enabled?: boolean
}) {
  const [panel, setPanel] = useState<PanelInfo | null>(null)

  useEffect(() => {
    if (!enabled) return

    let active = true

    const loop = () => {
      if (!active) return
      const id = Date.now()
      const corner = pick(['tl', 'tr', 'bl', 'br'] as const)
      let x = '-120vw'
      let y = '-120vh'

      if (corner === 'tr') {
        x = '-70vw'
        y = '-120vh'
      } else if (corner === 'bl') {
        x = '-120vw'
        y = '-70vh'
      } else if (corner === 'br') {
        x = '-70vw'
        y = '-70vh'
      }

      setPanel({ id, x, y })

      window.setTimeout(() => {
        if (!active) return
        setPanel((current) => (current && current.id === id ? null : current))

        // small gap then spawn next panel
        window.setTimeout(() => {
          if (!active) return
          loop()
        }, 400)
      }, PANEL_RUNNER_DURATION + 80)
    }

    loop()

    return () => {
      active = false
    }
  }, [enabled])

  return (
    <div className="bandLayer" aria-hidden="true">
      {panel && (
        <div
          key={panel.id}
          className="bgBorderPanel"
          style={
            {
              ['--panel-duration' as never]: `${PANEL_RUNNER_DURATION}ms`,
              ['--panel-x' as never]: panel.x,
              ['--panel-y' as never]: panel.y,
            } as CSSProperties
          }
        />
      )}
    </div>
  )
}
