import type { PropsWithChildren } from 'react'

export default function DeviceFrame({
  kind,
  children,
  className,
}: PropsWithChildren<{ kind: 'mobile' | 'web' | 'game'; className?: string }>) {
  void kind

  return <div className={className}>{children}</div>
}
