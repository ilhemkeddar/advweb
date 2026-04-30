import api from './api'

export interface Resource {
  _id: string
  title: string
  workshopName: string
  department: string
  type: 'PDF Documents' | 'Videos' | 'Slides' | 'Code'
  link: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface ResourceFilters {
  department?: string
  type?: string
}

const resourceService = {
  getAllResources: (filters?: ResourceFilters) =>
    api.get<Resource[]>('/resources', { params: filters }) as unknown as Promise<Resource[]>,
}

export default resourceService
