import { getAccessToken, setAccessToken, getSession } from './auth'

const BASE = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export function authHeaders(): HeadersInit {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Core fetch with auto-refresh ────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const session = await getSession()
  if (session) {
    setAccessToken(session.token)
    return session.token
  }
  return null
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  // Auto-refresh on 401 then retry once
  if (res.status === 401 && path !== '/auth/refresh') {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null })
    }
    const newToken = await refreshPromise

    if (!newToken) {
      setAccessToken(null)
      window.location.href = '/auth'
      throw new ApiError(401, 'Sessione scaduta')
    }

    // Retry with the new token
    const retryRes = await fetch(`${BASE}/api/v1${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...(options?.headers
          ? Object.fromEntries(
              Object.entries(options.headers as Record<string, string>).filter(
                ([k]) => k.toLowerCase() !== 'authorization',
              ),
            )
          : {}),
      },
    })

    if (retryRes.status === 204) return null as T
    const retryBody = await retryRes.json()
    if (!retryRes.ok) {
      throw new ApiError(
        retryRes.status,
        Array.isArray(retryBody.message) ? retryBody.message.join(', ') : (retryBody.message ?? 'Errore di rete'),
      )
    }
    return retryBody as T
  }

  if (res.status === 204) return null as T
  const body = await res.json()
  if (!res.ok) {
    const message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? 'Errore di rete')
    throw new ApiError(res.status, message)
  }
  return body as T
}
