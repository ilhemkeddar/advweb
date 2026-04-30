import api from './api'

export interface Registration {
  _id: string
  studentId: string
  workshopId: string
  status: 'Upcoming' | 'Completed'
  joinedAt: string
  createdAt: string
  updatedAt: string
}

export interface RegistrationRequest {
  studentId: string
  workshopId: string
}

const registrationService = {
  registerToWorkshop: (data: RegistrationRequest) =>
    api.post<Registration>('/registrations/register', data) as unknown as Promise<Registration>,

  getStudentWorkshops: (studentId: string) =>
    api.get<Registration[]>(`/registrations/my-workshops/${studentId}`) as unknown as Promise<Registration[]>,
}

export default registrationService
