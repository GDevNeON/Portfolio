import { useEffect, useState } from 'react'

const PANEL_POSITIONS = [
  'bgBorderPanel bgBorderPanel--topLeft',
  'bgBorderPanel bgBorderPanel--topRight',
  'bgBorderPanel bgBorderPanel--bottomRight',
  'bgBorderPanel bgBorderPanel--bottomLeft',
]

const CYCLE_DURATION = 3400 // ms, nhanh hơn

export default function BackgroundPanelCycler() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PANEL_POSITIONS.length)
    }, CYCLE_DURATION)

    return () => window.clearInterval(id)
  }, [])

  const className = PANEL_POSITIONS[index]

  return (
    <div className="bandLayer" aria-hidden="true">
      <div className={className} />
    </div>
  )
}
