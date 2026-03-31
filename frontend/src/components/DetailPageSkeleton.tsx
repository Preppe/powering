import { SideNavBar } from '#/components/SideNavBar'
import { TopNavBar } from '#/components/TopNavBar'
import { useSidebar } from '#/lib/sidebar-context'

export function DetailPageSkeleton({ icon, message }: { icon: string; message: string }) {
  const { collapsed } = useSidebar()

  return (
    <>
      <SideNavBar />
      <TopNavBar />
      <main className={`min-h-screen bg-surface flex items-center justify-center transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-outline animate-pulse">{icon}</span>
          <p className="text-sm text-on-surface-variant animate-pulse">{message}</p>
        </div>
      </main>
    </>
  )
}
