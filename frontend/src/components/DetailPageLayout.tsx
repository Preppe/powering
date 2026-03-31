import type { ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { SideNavBar } from '#/components/SideNavBar'
import { TopNavBar } from '#/components/TopNavBar'
import { useSidebar } from '#/lib/sidebar-context'

interface DetailPageLayoutProps {
  breadcrumb: string
  backTo: string
  onSave: () => void
  onDelete?: () => void
  saveLabel: string
  deleteLabel?: string
  deleteConfirm?: string
  isSaving: boolean
  isDeleting?: boolean
  isNew: boolean
  isDirty: boolean
  children: ReactNode
}

export function DetailPageLayout({
  breadcrumb,
  backTo,
  onSave,
  onDelete,
  saveLabel,
  deleteLabel = 'Elimina',
  deleteConfirm = 'Eliminare questo elemento?',
  isSaving,
  isDeleting = false,
  isNew,
  isDirty,
  children,
}: DetailPageLayoutProps) {
  const router = useRouter()
  const { collapsed } = useSidebar()

  return (
    <>
      <SideNavBar />
      <TopNavBar />
      <main className={`flex flex-col min-h-screen bg-surface transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Fixed top bar */}
        <div className={`fixed top-0 right-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 h-16 border-b border-outline-variant/10 transition-all duration-200 ${collapsed ? 'w-[calc(100%-4rem)]' : 'w-[calc(100%-16rem)]'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.navigate({ to: backTo })}
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <span className="text-primary font-bold font-manrope text-sm">
              {breadcrumb}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!isNew && onDelete && (
              <button
                onClick={() => { if (confirm(deleteConfirm)) onDelete() }}
                disabled={isDeleting}
                className="px-5 py-2 text-error font-bold font-manrope hover:bg-error-container rounded-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                {deleteLabel}
              </button>
            )}
            <button
              onClick={onSave}
              disabled={isSaving || (!isNew && !isDirty)}
              className="px-8 py-2 bg-primary text-white font-bold font-manrope rounded-lg shadow-lg hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isSaving ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">{isNew ? 'add_circle' : 'save'}</span>
              )}
              {saveLabel}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-16 overflow-y-auto p-8 md:p-12">
          {children}
        </div>
      </main>
    </>
  )
}
