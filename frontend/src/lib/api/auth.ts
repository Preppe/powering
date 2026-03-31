import { createServerFn } from '@tanstack/react-start'

const API_URL = import.meta.env.VITE_API_URL

// ─── In-memory access token ────────────────────────────────────────────────────

let accessToken: string | null = null

export function getAccessToken() {
  return accessToken
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

// ─── Cookie helper (client-side, for non-httpOnly cookies) ──────────────────────

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  tokenExpires: number
  user: unknown
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

// ─── Server functions ───────────────────────────────────────────────────────────

/** Check if httpOnly refresh cookie exists (SSR auth guard) */
export const checkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { getCookie: serverGetCookie } = await import('@tanstack/react-start/server')
  return !!serverGetCookie('refreshToken')
})

/** Read httpOnly refresh cookie → call backend refresh → return new access token */
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const {
    getCookie: serverGetCookie,
    setCookie: serverSetCookie,
    deleteCookie: serverDeleteCookie,
  } = await import('@tanstack/react-start/server')

  const refreshToken = serverGetCookie('refreshToken')
  if (!refreshToken) return null

  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  })

  if (!res.ok) {
    serverDeleteCookie('refreshToken', { path: '/' })
    return null
  }

  const data = await res.json()

  serverSetCookie('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax' as const,
    path: '/',
  })

  return { token: data.token as string, tokenExpires: data.tokenExpires as number }
})

/** Login: server proxies to backend, sets httpOnly cookie, returns access token */
export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((input: LoginRequest) => input)
  .handler(async ({ data }) => {
    const { setCookie: serverSetCookie } = await import('@tanstack/react-start/server')

    const res = await fetch(`${API_URL}/api/v1/auth/email/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      const msg = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? 'Login failed')
      throw new Error(msg)
    }

    const result = (await res.json()) as LoginResponse

    serverSetCookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax' as const,
      path: '/',
    })

    return { token: result.token, tokenExpires: result.tokenExpires, user: result.user }
  })

/** Register: server proxies to backend */
export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator((input: RegisterRequest) => input)
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/api/v1/auth/email/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      const msg = Array.isArray(body.message)
        ? body.message.join(', ')
        : (body.message ?? 'Registration failed')
      throw new Error(msg)
    }
  })

/** Logout: refresh to get access token → call backend logout → clear httpOnly cookie */
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const {
    getCookie: serverGetCookie,
    deleteCookie: serverDeleteCookie,
  } = await import('@tanstack/react-start/server')

  const refreshToken = serverGetCookie('refreshToken')

  if (refreshToken) {
    try {
      const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
      if (refreshRes.ok) {
        const { token } = await refreshRes.json()
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch {
      // Best-effort: clear cookie even if backend call fails
    }
  }

  serverDeleteCookie('refreshToken', { path: '/' })
})
