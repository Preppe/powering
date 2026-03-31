import type { ReactNode } from 'react'
import { SideNavBar } from '#/components/SideNavBar'
import { TopNavBar } from '#/components/TopNavBar'
import { useSidebar } from '#/lib/sidebar-context'

export function ListPageLayout({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <>
      <SideNavBar />
      <TopNavBar />
      <main className={`p-12 max-w-[var(--layout-container-max)] bg-background min-h-screen transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {children}
      </main>
    </>
  )
}
