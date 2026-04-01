export function AppShell({ children, projectorView }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-mesh">
      <div
        className={`mx-auto w-full ${
          projectorView ? 'max-w-[2145px]' : 'max-w-[1950px]'
        } px-4 pb-4 ${projectorView ? 'pt-2' : 'pt-4'} md:px-6`}
      >
        {!projectorView && (
          <header className="mb-6 rounded-2xl border border-violet-400/20 bg-slate-900/80 p-5 shadow-glow backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-violet-200">Classroom Writing Coach</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Great Promptinator</h1>
                <p className="mt-1 text-sm text-slate-300 md:text-base">
                  Generate high-value writing briefs with repeatable skill variation.
                </p>
              </div>
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
                Premium prototype - frontend only
              </div>
            </div>
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
