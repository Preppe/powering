import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PageHeader } from '#/components/PageHeader'
import { ListPageLayout } from '#/components/ListPageLayout'
import { DataTable, type Column } from '#/components/DataTable'
import { useDebouncedSearch } from '#/lib/hooks/use-debounced-search'
import { deleteVehicle, getVehicles } from '#/lib/api/vehicles'
import type { Vehicle } from '#/lib/models/vehicle'

export const Route = createFileRoute('/vehicles')({
  component: VehiclesPage,
})

const LIMIT = 10

const columns: Column<Vehicle>[] = [
  {
    key: 'code',
    header: 'Codice',
    render: (v) => <span className="font-mono text-sm font-semibold text-primary">{v.code}</span>,
    skeletonWidth: 'w-20',
  },
  {
    key: 'plate',
    header: 'Targa',
    render: (v) => <span className="font-bold text-on-surface">{v.plate}</span>,
    skeletonWidth: 'w-24',
  },
  {
    key: 'brand',
    header: 'Marca',
    render: (v) => <span className="text-on-surface">{v.brand}</span>,
    skeletonWidth: 'w-28',
  },
  {
    key: 'model',
    header: 'Modello',
    render: (v) => <span className="text-on-surface-variant">{v.model}</span>,
    skeletonWidth: 'w-24',
  },
  {
    key: 'branch',
    header: 'Filiale',
    render: (v) => (
      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
        {v.branch?.city ?? '—'}
      </span>
    ),
    skeletonWidth: 'w-24',
    skeletonRounded: 'rounded-full',
  },
]

function VehiclesPage() {
  const router = useRouter()
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vehicles', page, debouncedSearch],
    queryFn: () => getVehicles(page, LIMIT, debouncedSearch),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => refetch(),
  })

  return (
    <ListPageLayout>
      <PageHeader
        onAddClick={() => router.navigate({ to: '/vehicles/$id', params: { id: 'new' } })}
        search={search}
        onSearchChange={setSearch}
        title="Lista Automezzi"
        description="Gestisci la flotta aziendale e monitora lo stato dei veicoli."
        buttonLabel="Aggiungi Automezzo"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        meta={data?.meta}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyIcon="local_shipping"
        emptyMessage="Nessun automezzo trovato."
        entityLabel="automezzi"
        page={page}
        onPageChange={setPage}
        onEdit={(vehicle) => router.navigate({ to: '/vehicles/$id', params: { id: vehicle.id } })}
        onDelete={(vehicle) => deleteMutation.mutate(vehicle.id)}
        isDeleting={(vehicle) => deleteMutation.isPending && deleteMutation.variables === vehicle.id}
        getId={(vehicle) => vehicle.id}
      />
    </ListPageLayout>
  )
}
