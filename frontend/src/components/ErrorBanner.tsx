import { ApiError } from '#/lib/api/client'

export function ErrorBanner({ error }: { error: Error | null }) {
  if (!error) return null

  return (
    <div className="mb-8 flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-sm text-[#93000a]">
      <span className="material-symbols-outlined text-base">error</span>
      {error instanceof ApiError ? error.message : 'Errore sconosciuto'}
    </div>
  )
}
