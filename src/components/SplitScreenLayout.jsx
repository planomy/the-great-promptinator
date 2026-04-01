export function SplitScreenLayout({ children, projectorView = false }) {
  return (
    <div
      className={`grid gap-4 xl:grid-cols-2 ${projectorView ? 'h-[calc(100vh-4.5rem)] items-stretch' : ''}`}
    >
      {children}
    </div>
  )
}
