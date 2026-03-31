export function PaginationControls({
  page, totalPages, onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase = 'min-w-[36px] h-9 px-2 text-sm font-bold rounded-lg transition-all'
  const activeBtn = `${btnBase} bg-primary text-white`
  const inactiveBtn = `${btnBase} text-on-surface-variant hover:bg-surface-container`
  const navBtn = `${btnBase} text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed`

  return (
    <div className="flex items-center gap-1">
      <button className={navBtn} onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="min-w-[36px] h-9 flex items-center justify-center text-sm text-on-surface-variant">…</span>
        ) : (
          <button key={p} className={p === page ? activeBtn : inactiveBtn} onClick={() => onPageChange(p as number)}>
            {p}
          </button>
        ),
      )}
      <button className={navBtn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  )
}
