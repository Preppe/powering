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
import { createVehicle, deleteVehicle, getVehicle, updateVehicle } from '#/lib/api/vehicles'
import { getBranches } from '#/lib/api/branches'

export const Route = createFileRoute('/vehicles_/$id')({
  component: VehicleDetailPage,
})

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  code:     z.string().min(1, 'Obbligatorio'),
  plate:    z.string().min(1, 'Obbligatorio'),
  brand:    z.string().min(1, 'Obbligatorio'),
  model:    z.string().min(1, 'Obbligatorio'),
  branchId: z.string().min(1, 'Seleziona una filiale'),
})
type FormValues = z.infer<typeof schema>

// ─── Page ─────────────────────────────────────────────────────────────────────

function VehicleDetailPage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const isNew = id === 'new'

  const { data: vehicle, isLoading: vehicleLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicle(id),
    enabled: !isNew,
  })

  const { data: branchesData } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (vehicle) {
      reset({
        code:     vehicle.code,
        plate:    vehicle.plate,
        brand:    vehicle.brand,
        model:    vehicle.model,
        branchId: vehicle.branch?.id ?? '',
      })
    }
  }, [vehicle, reset])

  const saveMutation = useMutation({
    mutationFn: (d: FormValues) => {
      const payload = { code: d.code, plate: d.plate, brand: d.brand, model: d.model, branch: { id: d.branchId } }
      return isNew ? createVehicle(payload) : updateVehicle(id, payload)
    },
    onSuccess: () => router.navigate({ to: '/vehicles' }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => router.navigate({ to: '/vehicles' }),
  })

  const onSubmit = (d: FormValues) => saveMutation.mutate(d)

  if (!isNew && vehicleLoading) return <DetailPageSkeleton icon="local_shipping" message="Caricamento veicolo..." />

  return (
    <DetailPageLayout
      breadcrumb={`Automezzi / ${isNew ? 'Nuovo Automezzo' : (vehicle?.plate ?? '...')}`}
      backTo="/vehicles"
      onSave={handleSubmit(onSubmit)}
      onDelete={() => deleteMutation.mutate()}
      saveLabel={isNew ? 'Crea Automezzo' : 'Salva Modifiche'}
      deleteConfirm="Eliminare questo automezzo?"
      isSaving={saveMutation.isPending}
      isDeleting={deleteMutation.isPending}
      isNew={isNew}
      isDirty={isDirty}
    >
      <div className="max-w-6xl mx-auto">

        {/* Page title */}
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-outline-variant/10">
          <div>
            {!isNew && vehicle && (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary-fixed text-on-primary-fixed text-xs px-2.5 py-1 rounded-full font-bold font-mono">
                  {vehicle.plate}
                </span>
                <span className="text-outline-variant text-xs">•</span>
                <span className="text-on-surface-variant text-xs font-mono">{vehicle.id.slice(0, 8).toUpperCase()}</span>
              </div>
            )}
            <h2 className="text-4xl font-extrabold text-on-surface font-manrope tracking-tight">
              {isNew ? 'Nuovo Automezzo' : (vehicle ? `${vehicle.brand} ${vehicle.model}` : '...')}
            </h2>
            <p className="text-on-surface-variant mt-2">
              {isNew ? 'Compila i dati per registrare un nuovo veicolo nella flotta.' : 'Gestione configurazione e dati operativi del veicolo.'}
            </p>
          </div>
        </div>

        <ErrorBanner error={saveMutation.error ?? deleteMutation.error ?? null} />

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-8">

          {/* Left column — form */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Identification + specs */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
              <h3 className="text-lg font-bold font-manrope text-primary border-b border-outline-variant/10 pb-4 mb-8">Identificazione e Specifiche</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormField label="Codice Interno" error={errors.code?.message}>
                  <input
                    {...register('code')}
                    placeholder="VEH-001"
                    className={fieldClass(!!errors.code, 'font-mono tracking-wider')}
                  />
                </FormField>

                <FormField label="Targa" error={errors.plate?.message}>
                  <input
                    {...register('plate')}
                    placeholder="AA 123 BB"
                    className={fieldClass(!!errors.plate, 'font-manrope font-extrabold text-2xl tracking-widest')}
                  />
                </FormField>

                <FormField label="Marca / Produttore" error={errors.brand?.message}>
                  <input
                    {...register('brand')}
                    placeholder="Mercedes-Benz"
                    className={fieldClass(!!errors.brand)}
                  />
                </FormField>

                <FormField label="Modello / Variante" error={errors.model?.message}>
                  <input
                    {...register('model')}
                    placeholder="Actros L"
                    className={fieldClass(!!errors.model)}
                  />
                </FormField>
              </div>
            </div>

            {/* Branch assignment */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10">
              <h3 className="text-lg font-bold font-manrope text-primary border-b border-outline-variant/10 pb-4 mb-8">Assegnazione Filiale</h3>

              <FormField label="Filiale di Appartenenza" error={errors.branchId?.message}>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[20px]">location_on</span>
                  <select
                    {...register('branchId')}
                    className={`${fieldClass(!!errors.branchId)} pl-12`}
                  >
                    <option value="">Seleziona filiale...</option>
                    {branchesData?.data.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.city} — {b.code} ({b.address})
                      </option>
                    ))}
                  </select>
                </div>
              </FormField>

              {!isNew && vehicle?.branch && (
                <div className="mt-6 flex items-center gap-4 p-5 bg-secondary-container/20 rounded-2xl border border-secondary-container/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{vehicle.branch.city}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{vehicle.branch.address}, {vehicle.branch.zip}</p>
                  </div>
                  <span className="ml-auto text-xs font-bold bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-mono">
                    {vehicle.branch.code}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right column — image */}
          <div className="col-span-12 lg:col-span-4">
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl bg-gradient-to-br from-[#001b3d] to-[#003f87] flex flex-col items-center justify-center sticky top-24">
              <span className="material-symbols-outlined text-[120px] text-white/20">local_shipping</span>
              <p className="absolute bottom-8 left-0 right-0 text-center text-xs uppercase tracking-widest font-bold text-white/60">
                {isNew ? 'Nuovo Veicolo' : 'Profilo Veicolo'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DetailPageLayout>
  )
}
