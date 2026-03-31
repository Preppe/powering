import { useEffect } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DetailPageLayout } from '#/components/DetailPageLayout'
import { DetailPageSkeleton } from '#/components/DetailPageSkeleton'
import { ErrorBanner } from '#/components/ErrorBanner'
import { FormField, fieldClass } from '#/components/ui/form-field'
import { createBranch, deleteBranch, getBranch, updateBranch } from '#/lib/api/branches'
import { getVehiclesByBranch } from '#/lib/api/vehicles'
import type { Vehicle } from '#/lib/models/vehicle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

export const Route = createFileRoute('/branches_/$id')({
  component: BranchDetailPage,
})

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  code:    z.string().min(1, 'Obbligatorio'),
  address: z.string().min(1, 'Obbligatorio'),
  city:    z.string().min(1, 'Obbligatorio'),
  zip:     z.string().min(1, 'Obbligatorio'),
})
type FormValues = z.infer<typeof schema>

// ─── Page ─────────────────────────────────────────────────────────────────────

function BranchDetailPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const isNew = id === 'new'

  const { data: branch, isLoading: branchLoading } = useQuery({
    queryKey: ['branch', id],
    queryFn: () => getBranch(id),
    enabled: !isNew,
  })

  const { data: vehiclesData } = useQuery({
    queryKey: ['branch-vehicles', id],
    queryFn: () => getVehiclesByBranch(id),
    enabled: !isNew,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (branch) {
      reset({
        code:    branch.code,
        address: branch.address,
        city:    branch.city,
        zip:     branch.zip,
      })
    }
  }, [branch, reset])

  const saveMutation = useMutation({
    mutationFn: (d: FormValues) =>
      isNew ? createBranch(d) : updateBranch(id, d),
    onSuccess: () => router.navigate({ to: '/branches' }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteBranch(id),
    onSuccess: () => router.navigate({ to: '/branches' }),
  })

  const onSubmit = (d: FormValues) => saveMutation.mutate(d)

  const vehicles = vehiclesData?.data ?? []
  const vehicleCount = vehiclesData?.meta.totalItems ?? 0
  const liveCity = watch('city')

  if (!isNew && branchLoading) return <DetailPageSkeleton icon="domain" message="Caricamento filiale..." />

  return (
    <DetailPageLayout
      breadcrumb={`Filiali / ${isNew ? 'Nuova Filiale' : (branch?.city ?? '...')}`}
      backTo="/branches"
      onSave={handleSubmit(onSubmit)}
      onDelete={vehicleCount === 0 ? () => deleteMutation.mutate() : undefined}
      saveLabel={isNew ? 'Crea Filiale' : 'Salva Modifiche'}
      deleteConfirm="Eliminare questa filiale?"
      isSaving={saveMutation.isPending}
      isDeleting={deleteMutation.isPending}
      isNew={isNew}
      isDirty={isDirty}
    >
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-manrope">
              {isNew ? 'Nuova Filiale' : (branch ? `${branch.city} — ${branch.code}` : '...')}
            </h1>
            <p className="text-on-surface-variant font-medium">
              {isNew ? 'Compila i dati per registrare una nuova filiale.' : 'Coordinate e operatività del centro logistico.'}
            </p>
          </div>
        </header>

        <ErrorBanner error={saveMutation.error ?? deleteMutation.error ?? null} />

        {/* 12-col grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">

          {/* Left column */}
          <div className="col-span-12 lg:col-span-7 space-y-8">

            {/* Form card */}
            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">info</span>
                <h2 className="text-xl font-bold tracking-tight">Informazioni Base</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Codice Filiale" error={errors.code?.message}>
                  <input
                    {...register('code')}
                    placeholder="MN-042-XP"
                    className={fieldClass(!!errors.code)}
                  />
                </FormField>
                <FormField label="Indirizzo" error={errors.address?.message}>
                  <input
                    {...register('address')}
                    placeholder="Via dell'Innovazione, 12"
                    className={fieldClass(!!errors.address)}
                  />
                </FormField>
                <FormField label="Città" error={errors.city?.message}>
                  <input
                    {...register('city')}
                    placeholder="Milano"
                    className={fieldClass(!!errors.city)}
                  />
                </FormField>
                <FormField label="CAP" error={errors.zip?.message}>
                  <input
                    {...register('zip')}
                    placeholder="20126"
                    className={fieldClass(!!errors.zip)}
                  />
                </FormField>
              </div>
            </section>

            {/* Vehicles table (only in edit mode) */}
            {!isNew && (
              <section className="bg-surface-container-lowest overflow-hidden rounded-xl shadow-sm border border-outline-variant/10">
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    <h2 className="text-xl font-bold tracking-tight">Automezzi Ospitati</h2>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full">
                    {vehicleCount} Veicoli
                  </span>
                </div>
                {vehicles.length === 0 ? (
                  <div className="px-8 py-12 text-center">
                    <span className="material-symbols-outlined text-3xl text-outline mb-2 block">local_shipping</span>
                    <p className="text-sm text-on-surface-variant">Nessun automezzo assegnato a questa filiale.</p>
                  </div>
                ) : (
                  <Table className="text-left border-collapse [&_div]:overflow-visible">
                    <TableHeader>
                      <TableRow className="bg-surface-container-low hover:bg-surface-container-low border-b-0">
                        <TableHead className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Targa / Modello</TableHead>
                        <TableHead className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Codice</TableHead>
                        <TableHead className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Marca</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr:last-child]:border-0">
                      {vehicles.map((v, i) => (
                        <VehicleRow key={v.id} vehicle={v} index={i} />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="col-span-12 lg:col-span-5 space-y-8">

            {/* Map placeholder */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden h-[320px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#001b3d] via-[#003f87] to-[#0056b3]" />
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-0.5">Geolocalizzazione</span>
                <span className="text-sm font-bold text-on-surface">Mappa della Sede</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[64px] text-white/30">location_on</span>
                </div>
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-xl">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  {liveCity || branch?.city || 'Sede'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DetailPageLayout>
  )
}

// ─── Vehicle Row ──────────────────────────────────────────────────────────────

function VehicleRow({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <TableRow
      className={`${
        index % 2 === 0
          ? 'bg-surface-container-lowest hover:bg-surface border-b-0'
          : 'bg-surface hover:bg-surface-container-high/30 border-b-0'
      }`}
    >
      <TableCell className="px-8 py-5">
        <div className="font-bold text-on-surface">{vehicle.plate}</div>
        <div className="text-xs text-on-surface-variant">{vehicle.brand} {vehicle.model}</div>
      </TableCell>
      <TableCell className="px-8 py-5 font-mono text-sm text-primary font-semibold">{vehicle.code}</TableCell>
      <TableCell className="px-8 py-5 text-sm text-on-surface-variant">{vehicle.brand}</TableCell>
    </TableRow>
  )
}
