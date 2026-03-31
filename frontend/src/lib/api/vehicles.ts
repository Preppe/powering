import type { PaginatedResponse } from '../models/common'
import type { CreateVehiclePayload, Vehicle } from '../models/vehicle'
import { apiFetch, authHeaders } from './client'

export const getVehicles = (page = 1, limit = 10, search = '') =>
  apiFetch<PaginatedResponse<Vehicle>>(
    `/vehicles?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}&sortBy=createdAt:DESC`,
    { headers: authHeaders() },
  )

export const getVehicle = (id: string) =>
  apiFetch<Vehicle>(`/vehicles/${id}`, { headers: authHeaders() })

export const getVehiclesByBranch = (branchId: string, limit = 50) =>
  apiFetch<PaginatedResponse<Vehicle>>(
    `/vehicles?limit=${limit}&filter.branch.id=$eq:${branchId}&sortBy=createdAt:DESC`,
    { headers: authHeaders() },
  )

export const createVehicle = (d: CreateVehiclePayload) =>
  apiFetch<Vehicle>('/vehicles', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(d),
  })

export const updateVehicle = (id: string, d: Partial<CreateVehiclePayload>) =>
  apiFetch<Vehicle>(`/vehicles/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(d),
  })

export const deleteVehicle = (id: string) =>
  apiFetch<void>(`/vehicles/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
