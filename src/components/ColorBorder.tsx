import type { CSSProperties, PropsWithChildren } from 'react'

type ColorBorderProps = PropsWithChildren<{
  className?: string
  style?: CSSProperties
  radius?: number | string
}>

export default function ColorBorder({
  children,
  className,
  style,
  radius,
}: ColorBorderProps) {
  const resolvedRadius =
    typeof radius === 'number' ? `${radius}px` : radius ?? undefined

  return (
    <div
      className={['colorBorder', className].filter(Boolean).join(' ')}
      style={{
        ...(style ?? {}),
        ...(resolvedRadius ? ({ ['--cb-radius']: resolvedRadius } as CSSProperties) : {}),
      }}
    >
      <div className="colorBorderInner">{children}</div>
    </div>
  )
}
