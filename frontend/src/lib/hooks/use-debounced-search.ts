import { useEffect, useRef, useState } from 'react'

export function useDebouncedSearch(delay = 300) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, delay)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, delay])

  return { search, setSearch, debouncedSearch, page, setPage }
}
