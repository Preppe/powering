import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PageHeader } from '#/components/PageHeader'
import { ListPageLayout } from '#/components/ListPageLayout'
import { DataTable, type Column } from '#/components/DataTable'
import { useDebouncedSearch } from '#/lib/hooks/use-debounced-search'
import { deleteBranch, listBranches } from '#/lib/api/branches'
import type { Branch } from '#/lib/models/branch'

export const Route = createFileRoute('/branches')({
  component: BranchesPage,
})

const LIMIT = 10

const columns: Column<Branch>[] = [
  {
    key: 'code',
    header: 'Codice',
    render: (b) => <span className="font-mono text-sm font-semibold text-primary">{b.code}</span>,
    skeletonWidth: 'w-20',
  },
  {
    key: 'city',
    header: 'Città',
    render: (b) => <span className="font-bold text-on-surface">{b.city}</span>,
    skeletonWidth: 'w-28',
  },
  {
    key: 'address',
    header: 'Indirizzo',
    render: (b) => <span className="text-on-surface-variant">{b.address}</span>,
    skeletonWidth: 'w-48',
  },
  {
    key: 'zip',
    header: 'CAP',
    render: (b) => (
      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
        {b.zip}
      </span>
    ),
    skeletonWidth: 'w-16',
    skeletonRounded: 'rounded-full',
  },
]

function BranchesPage() {
  const router = useRouter()
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['branches-list', page, debouncedSearch],
    queryFn: () => listBranches(page, LIMIT, debouncedSearch),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => refetch(),
  })

  return (
    <ListPageLayout>
      <PageHeader
        onAddClick={() => router.navigate({ to: '/branches/$id', params: { id: 'new' } })}
        search={search}
        onSearchChange={setSearch}
        title="Lista Filiali"
        description="Gestisci le filiali aziendali e le loro informazioni operative."
        buttonLabel="Aggiungi Filiale"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyIcon="domain"
        emptyMessage="Nessuna filiale trovata."
        entityLabel="filiali"
        page={page}
        onPageChange={setPage}
        onEdit={(branch) => router.navigate({ to: '/branches/$id', params: { id: branch.id } })}
        onDelete={(branch) => deleteMutation.mutate(branch.id)}
        isDeleting={(branch) => deleteMutation.isPending && deleteMutation.variables === branch.id}
        getId={(branch) => branch.id}
      />
    </ListPageLayout>
  )
}
