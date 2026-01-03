import type { ProjectKind } from '../siteConfig'

export default function DeviceSupportFrame({
  kind,
  className,
}: {
  kind: ProjectKind
  className?: string
}) {
  return (
    <div
      className={['supportFrame', `supportFrame--${kind}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <div className="supportFrameBorder" />
      <div className="supportFrameLabel">{kind}</div>
    </div>
  )
}
