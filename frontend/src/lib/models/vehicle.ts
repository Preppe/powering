import type { Branch } from './branch'

export interface Vehicle {
  id: string
  code: string
  plate: string
  brand: string
  model: string
  branch: Branch
  createdAt: string
  updatedAt: string
}

export interface CreateVehiclePayload {
  code: string
  plate: string
  brand: string
  model: string
  branch: { id: string }
}
