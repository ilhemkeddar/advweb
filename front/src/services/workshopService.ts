import api from './api'

export interface Workshop {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  department: string
  professor: {
    name: string
    role: string
  }
  type: string
  category: string
  targetAudience: string
  resources?: Array<{ name: string; url: string }>
  capacity: number
  registeredCount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface WorkshopFilters {
  department?: string
  type?: string
  category?: string
  search?: string
  status?: string
  limit?: number
}

const workshopService = {
  getAllWorkshops: (filters?: WorkshopFilters) =>
    api.get<Workshop[]>('/workshops', { params: filters }) as unknown as Promise<Workshop[]>,

  getWorkshopById: (id: string) =>
    api.get<Workshop>(`/workshops/${id}`) as unknown as Promise<Workshop>,

  createWorkshop: (data: Partial<Workshop>) =>
    api.post<Workshop>('/workshops', data) as unknown as Promise<Workshop>,

  updateWorkshop: (id: string, data: Partial<Workshop>) =>
    api.patch<Workshop>(`/workshops/${id}`, data) as unknown as Promise<Workshop>,
}

export default workshopService
