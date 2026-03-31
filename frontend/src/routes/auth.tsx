import { useState } from 'react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ApiError } from '#/lib/api/client'
import {
  loginFn,
  registerFn,
  getAccessToken,
  setAccessToken,
  getSession,
  checkAuth,
} from '#/lib/api/auth'

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    if (typeof window !== 'undefined') {
      if (!getAccessToken()) {
        const session = await getSession()
        if (session) setAccessToken(session.token)
      }
      if (getAccessToken()) throw redirect({ to: '/vehicles' })
    } else {
      const hasAuth = await checkAuth()
      if (hasAuth) throw redirect({ to: '/vehicles' })
    }
  },
  component: AuthPage,
})

// ─── Zod Schemas ────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(1, 'Password obbligatoria'),
})

const registerSchema = z.object({
  firstName: z.string().min(1, 'Nome obbligatorio'),
  lastName: z.string().min(1, 'Cognome obbligatorio'),
  email: z.string().email('Email non valida'),
  password: z.string().min(6, 'Minimo 6 caratteri'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

// ─── Root Page ───────────────────────────────────────────────────────────────

function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  return (
    <div className="flex min-h-screen">
      <HeroPanel />
      <section className="flex w-full flex-col items-center justify-between bg-white p-8 md:p-12 lg:w-[520px]">
        {/* Mobile brand */}
        <div className="mb-8 flex w-full max-w-md items-center gap-2 lg:hidden">
          <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">
            rocket_launch
          </span>
          <span className="font-headline text-xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
            Powering
          </span>
        </div>

        {/* Form area */}
        <div className="w-full max-w-md flex-1">
          <div className="mb-8">
            <h2 className="font-headline mb-1 text-3xl font-extrabold text-[var(--color-on-surface)]">
              {mode === 'login' ? 'Bentornato' : 'Crea un account'}
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {mode === 'login'
                ? 'Accedi al centro di controllo della flotta.'
                : 'Registrati per iniziare a gestire la tua flotta.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-8 flex rounded-xl bg-[var(--color-surface-container)] p-1">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab)
                  setRegisterSuccess(false)
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === tab
                    ? 'bg-white text-[var(--color-primary)] shadow-sm'
                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                }`}
              >
                {tab === 'login' ? 'Accedi' : 'Registrati'}
              </button>
            ))}
          </div>

          {mode === 'login' ? (
            <LoginFormComponent />
          ) : registerSuccess ? (
            <RegisterSuccess
              email={registeredEmail}
              onBack={() => {
                setMode('login')
                setRegisterSuccess(false)
              }}
            />
          ) : (
            <RegisterFormComponent
              onSuccess={(email) => {
                setRegisteredEmail(email)
                setRegisterSuccess(true)
              }}
            />
          )}

        </div>

        {/* Footer */}
        <footer className="mt-8 w-full max-w-md border-t border-[var(--color-surface-variant)]/30 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="font-label text-[10px] uppercase tracking-widest text-[var(--color-outline)]">
              © 2024 Powering
            </p>
            <div className="flex gap-5">
              {['Privacy', 'Termini', 'Supporto'].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="font-label text-[10px] uppercase tracking-widest text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}

// ─── Login Form ──────────────────────────────────────────────────────────────

function LoginFormComponent() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation({
    mutationFn: (d: LoginForm) => loginFn({ data: d }),
    onSuccess: (data) => {
      setAccessToken(data.token)
      router.navigate({ to: '/vehicles' })
    },
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
      {/* Email */}
      <Field label="Indirizzo Email" error={errors.email?.message}>
        <FieldIcon icon="mail" />
        <input
          {...register('email')}
          type="email"
          placeholder="nome@azienda.com"
          className={inputClass(!!errors.email)}
        />
      </Field>

      {/* Password */}
      <Field
        label="Password"
        error={errors.password?.message}
        labelRight={
          <a
            href="#"
            className="text-xs font-bold text-[var(--color-primary-container)] hover:underline"
          >
            Password dimenticata?
          </a>
        }
      >
        <FieldIcon icon="lock" />
        <input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          className={`${inputClass(!!errors.password)} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </Field>

      {/* API Error */}
      {mutation.isError && (
        <ErrorBanner
          message={
            mutation.error instanceof ApiError
              ? mutation.error.message
              : 'Errore sconosciuto. Riprova.'
          }
        />
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] px-6 py-4 font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:shadow-xl hover:shadow-[var(--color-primary)]/30 active:scale-[0.98] disabled:opacity-60"
      >
        {mutation.isPending ? (
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : (
          <>
            <span>Accedi alla Dashboard</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  )
}

// ─── Register Form ───────────────────────────────────────────────────────────

function RegisterFormComponent({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const mutation = useMutation({
    mutationFn: (d: RegisterForm) => registerFn({ data: d }),
    onSuccess: () => onSuccess(getValues('email')),
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome" error={errors.firstName?.message}>
          <FieldIcon icon="person" />
          <input
            {...register('firstName')}
            type="text"
            placeholder="Mario"
            className={inputClass(!!errors.firstName)}
          />
        </Field>
        <Field label="Cognome" error={errors.lastName?.message}>
          <FieldIcon icon="person" />
          <input
            {...register('lastName')}
            type="text"
            placeholder="Rossi"
            className={inputClass(!!errors.lastName)}
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email" error={errors.email?.message}>
        <FieldIcon icon="mail" />
        <input
          {...register('email')}
          type="email"
          placeholder="nome@azienda.com"
          className={inputClass(!!errors.email)}
        />
      </Field>

      {/* Password */}
      <Field label="Password" error={errors.password?.message}>
        <FieldIcon icon="lock" />
        <input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 6 caratteri"
          className={`${inputClass(!!errors.password)} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-outline)] transition-colors hover:text-[var(--color-on-surface)]"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </Field>

      {/* API Error */}
      {mutation.isError && (
        <ErrorBanner
          message={
            mutation.error instanceof ApiError
              ? mutation.error.message
              : 'Errore sconosciuto. Riprova.'
          }
        />
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] px-6 py-4 font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:shadow-xl hover:shadow-[var(--color-primary)]/30 active:scale-[0.98] disabled:opacity-60"
      >
        {mutation.isPending ? (
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : (
          <>
            <span>Crea Account</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  )
}

// ─── Register Success ─────────────────────────────────────────────────────────

function RegisterSuccess({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span className="material-symbols-outlined text-5xl text-[var(--color-primary)]">
        mark_email_read
      </span>
      <h3 className="font-headline text-xl font-bold text-[var(--color-on-surface)]">
        Controlla la tua email
      </h3>
      <p className="text-sm text-[var(--color-on-surface-variant)]">
        Abbiamo inviato un link di conferma a{' '}
        <span className="font-semibold text-[var(--color-on-surface)]">{email}</span>.
        <br />
        Clicca il link per attivare il tuo account.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--color-outline-variant)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-surface-container-low)]"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Vai al Login
      </button>
    </div>
  )
}

// ─── Hero Panel ───────────────────────────────────────────────────────────────

function HeroPanel() {
  return (
    <section className="relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#001a40] to-[var(--color-primary)]">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop"
          alt="Fleet of trucks at a logistics hub"
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl px-16 text-white">
        <div className="mb-12 flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-[#acc7ff]">
            rocket_launch
          </span>
          <span className="font-headline text-3xl font-extrabold tracking-tight">
            Powering
          </span>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-8 border-l border-white/20 pl-8">
          <div>
            <div className="font-headline text-3xl font-bold">14k+</div>
            <div className="font-label text-sm uppercase tracking-widest opacity-70">
              Veicoli Attivi
            </div>
          </div>
          <div>
            <div className="font-headline text-3xl font-bold">99.9%</div>
            <div className="font-label text-sm uppercase tracking-widest opacity-70">
              Uptime di Precisione
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  labelRight,
  children,
}: {
  label: string
  error?: string
  labelRight?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-label text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative group">{children}</div>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  )
}

function FieldIcon({ icon }: { icon: string }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-outline)] transition-colors group-focus-within:text-[var(--color-primary)]">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </span>
  )
}

function inputClass(hasError: boolean) {
  return `block w-full pl-11 pr-4 py-3.5 rounded-xl bg-[var(--color-surface-container-low)] border-none text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:bg-white transition-all text-sm ${
    hasError ? 'ring-2 ring-[var(--color-error)]/40' : ''
  }`
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[var(--color-error-container)] px-4 py-3 text-sm text-[#93000a]">
      <span className="material-symbols-outlined text-base">error</span>
      {message}
    </div>
  )
}

