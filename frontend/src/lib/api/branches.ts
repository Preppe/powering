import type { Branch, CreateBranchPayload } from '../models/branch'
import type { PaginatedResponse } from '../models/common'
import { apiFetch, authHeaders } from './client'

export const getBranch = (id: string) =>
  apiFetch<Branch>(`/branches/${id}`, { headers: authHeaders() })

// Usata dai select dropdown (limit fisso)
export const getBranches = () =>
  apiFetch<PaginatedResponse<Branch>>('/branches?limit=100&sortBy=city:ASC', {
    headers: authHeaders(),
  })

// Usata dalla pagina lista /branches
export const listBranches = (page = 1, limit = 10, search = '') =>
  apiFetch<PaginatedResponse<Branch>>(
    `/branches?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}&sortBy=createdAt:DESC`,
    { headers: authHeaders() },
  )

export const createBranch = (d: CreateBranchPayload) =>
  apiFetch<Branch>('/branches', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(d),
  })

export const updateBranch = (id: string, d: Partial<CreateBranchPayload>) =>
  apiFetch<Branch>(`/branches/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(d),
  })

export const deleteBranch = (id: string) =>
  apiFetch<void>(`/branches/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
