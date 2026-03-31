import type { ReactNode } from 'react'

export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

export function fieldClass(hasError: boolean, extra = '') {
  return `w-full px-4 py-3 rounded-xl bg-surface-container-low border-none text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium ${hasError ? 'ring-2 ring-error/40' : ''} ${extra}`
}
