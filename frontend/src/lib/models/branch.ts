export interface Branch {
  id: string
  code: string
  address: string
  city: string
  zip: string
  createdAt: string
  updatedAt: string
}

export interface CreateBranchPayload {
  code: string
  address: string
  city: string
  zip: string
}
