import { useEffect, useMemo, useRef } from 'react'

export type EdgeRunnerTarget = {
  id: string
  topPercent: number
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

function wrap01(v: number) {
  const w = v % 1
  return w < 0 ? w + 1 : w
}

function shortestWrapDelta(target: number, current: number) {
  const a = wrap01(target)
  const b = wrap01(current)
  let d = a - b
  if (d > 0.5) d -= 1
  if (d < -0.5) d += 1
  return d
}

export default function EdgeColorRunner({
  activeId,
  targets,
}: {
  activeId: string
  targets: EdgeRunnerTarget[]
}) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const runnerRef = useRef<HTMLDivElement | null>(null)

  const targetMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const t of targets) m.set(t.id, clamp01(t.topPercent))
    return m
  }, [targets])

  useEffect(() => {
    const frameEl = frameRef.current
    const runnerEl = runnerRef.current
    if (!frameEl || !runnerEl) return

    const INSET = 16
    const THICKNESS = 14
    const RUNNER_LEN = 240

    let raf = 0
    let last = performance.now()
    let t = 0
    let velocity = 0

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      const w = Math.max(320, window.innerWidth - INSET * 2)
      const h = Math.max(320, window.innerHeight - INSET * 2)
      const perim = 2 * (w + h)

      const targetT = targetMap.get(activeId) ?? 0
      const delta = shortestWrapDelta(targetT, t)

      const autoSpeed = 0.06
      const seekStrength = 0.9
      velocity += delta * seekStrength * dt
      velocity *= 0.92
      t = wrap01(t + autoSpeed * dt + velocity)

      const d = t * perim
      let x = 0
      let y = 0
      let rot = 0

      if (d <= w) {
        x = d
        y = 0
        rot = 0
      } else if (d <= w + h) {
        x = w
        y = d - w
        rot = 90
      } else if (d <= 2 * w + h) {
        x = w - (d - (w + h))
        y = h
        rot = 180
      } else {
        x = 0
        y = h - (d - (2 * w + h))
        rot = 270
      }

      const offset = THICKNESS / 2
      const xPx = x - RUNNER_LEN / 2
      const yPx = y - THICKNESS / 2

      runnerEl.style.transform = `translate3d(${xPx + offset}px, ${yPx + offset}px, 0) rotate(${rot}deg)`

      raf = window.requestAnimationFrame(step)
    }

    raf = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(raf)
  }, [activeId, targetMap])

  return (
    <div className="edgeFrame" ref={frameRef} aria-hidden="true">
      <div className="edgeRunner" ref={runnerRef} />
    </div>
  )
}
