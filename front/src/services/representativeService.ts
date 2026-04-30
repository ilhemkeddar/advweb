import api from './api'

export interface Representative {
  _id: string
  name: string
  role: string
  image: string
  department: string
  status: 'Certified' | 'In Training'
  specialties: string[]
  email: string
  workshopsCount: number
  bioLink?: string
  createdAt: string
  updatedAt: string
}

export interface RepresentativeFilters {
  department?: string
  status?: string
}

const representativeService = {
  getAllRepresentatives: (filters?: RepresentativeFilters) =>
    api.get<{ count: number; data: Representative[] }>('/representatives', { params: filters }) as unknown as Promise<{ count: number; data: Representative[] }>,
}

export default representativeService
