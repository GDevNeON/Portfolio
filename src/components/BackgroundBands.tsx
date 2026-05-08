import { useEffect, useState, type CSSProperties } from 'react'

const PANEL_RUNNER_DURATION = 6400

type PanelInfo = {
  id: number
  sx: string
  sy: string
  ex: string
  ey: string
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
      
      let sx = '-200vw', sy = '-180vh', ex = '100vw', ey = '100vh'

      if (corner === 'tr') {
        sx = '100vw'; sy = '-180vh'; ex = '-200vw'; ey = '100vh'
      } else if (corner === 'bl') {
        sx = '-200vw'; sy = '100vh'; ex = '100vw'; ey = '-180vh'
      } else if (corner === 'br') {
        sx = '100vw'; sy = '100vh'; ex = '-200vw'; ey = '-180vh'
      }

      setPanel({ id, sx, sy, ex, ey })

      window.setTimeout(() => {
        if (!active) return
        setPanel((current) => (current && current.id === id ? null : current))

        // small gap then spawn next panel
        window.setTimeout(() => {
          if (!active) return
          loop()
        }, 400)
      }, PANEL_RUNNER_DURATION)
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
              ['--panel-start-x' as never]: panel.sx,
              ['--panel-start-y' as never]: panel.sy,
              ['--panel-end-x' as never]: panel.ex,
              ['--panel-end-y' as never]: panel.ey,
            } as CSSProperties
          }
        />
      )}
    </div>
  )
}
