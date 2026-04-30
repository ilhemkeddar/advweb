import api from './api'

export type AdminWorkshopStatus = 'pending' | 'approved' | 'rejected' | 'upcoming' | 'past'

export interface AdminWorkshop {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  department: string
  type: string
  status: AdminWorkshopStatus
  professor: {
    name: string
    title: string
  }
  capacity: number
  registeredCount: number
}

export interface AdminReport {
  id: string
  senderName: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
  date: string
  read: boolean
}

export interface ContactMessage {
  id: string
  fullName: string
  email: string
  subject: string
  message: string
  status: 'New' | 'Read' | 'Replied'
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'student' | 'professor' | 'admin'
  department?: string
  joined: string
  activityCount: number
}

export interface AdminStats {
  totalStudents: number
  totalProfessors: number
  totalWorkshops: number
  pendingApprovals: number
  upcomingEvents: number
  certificatesIssued: number
}

export interface AdminAnalytics {
  monthlyEnrollments: Array<{ month: string; enrollments: number }>
  workshopsByDepartment: Array<{ department: string; count: number }>
}

export interface AdminDashboardData {
  stats: AdminStats
  analytics: AdminAnalytics
  workshops: AdminWorkshop[]
  reports: AdminReport[]
  contactMessages: ContactMessage[]
  users: AdminUser[]
  completedWorkshops: AdminWorkshop[]
}

const DEFAULT_MONTHLY_ENROLLMENTS = [
  { month: 'Jan', enrollments: 32 },
  { month: 'Feb', enrollments: 48 },
  { month: 'Mar', enrollments: 61 },
  { month: 'Apr', enrollments: 77 },
  { month: 'May', enrollments: 54 },
  { month: 'Jun', enrollments: 89 },
]

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeStatus = (value: unknown): AdminWorkshopStatus => {
  const status = String(value || '').toLowerCase()
  if (status === 'approved' || status === 'rejected' || status === 'pending' || status === 'upcoming' || status === 'past') {
    return status
  }
  return 'pending'
}

export const normalizeWorkshop = (raw: any): AdminWorkshop => {
  const professorName = raw?.professor?.name ?? raw?.professor?.fullName ?? raw?.professorName ?? raw?.professorId?.fullName ?? 'Unknown professor'
  const professorTitle = raw?.professor?.title ?? raw?.professor?.role ?? raw?.professorId?.title ?? raw?.professorId?.role ?? ''
  const department = typeof raw?.department === 'string' ? raw.department : raw?.department?.name ?? ''

  return {
    id: String(raw?._id ?? raw?.id ?? ''),
    title: raw?.title ?? '',
    description: raw?.description ?? '',
    date: raw?.date ?? '',
    time: raw?.time ?? '',
    location: raw?.location ?? '',
    department,
    type: raw?.type ?? '',
    status: normalizeStatus(raw?.status),
    professor: {
      name: professorName,
      title: professorTitle,
    },
    capacity: toNumber(raw?.capacity),
    registeredCount: toNumber(raw?.registeredCount ?? raw?.enrolled),
  }
}

const normalizeReport = (raw: any): AdminReport => ({
  id: String(raw?._id ?? raw?.id ?? ''),
  senderName: raw?.senderName ?? raw?.from ?? 'Unknown sender',
  subject: raw?.subject ?? '',
  message: raw?.message ?? raw?.body ?? '',
  priority: raw?.priority === 'low' || raw?.priority === 'high' ? raw.priority : 'medium',
  date: raw?.date ?? raw?.createdAt ?? '',
  read: Boolean(raw?.read),
})

const normalizeContactMessage = (raw: any): ContactMessage => ({
  id: String(raw?._id ?? raw?.id ?? ''),
  fullName: raw?.fullName ?? raw?.name ?? 'Unknown sender',
  email: raw?.email ?? '',
  subject: raw?.subject ?? '',
  message: raw?.message ?? '',
  status: raw?.status === 'New' || raw?.status === 'Read' || raw?.status === 'Replied' ? raw.status : 'New',
  createdAt: raw?.createdAt ?? '',
})

const normalizeUser = (raw: any): AdminUser => ({
  id: String(raw?._id ?? raw?.id ?? ''),
  name: raw?.fullName ?? raw?.name ?? '',
  email: raw?.email ?? '',
  role: String(raw?.role ?? 'student').toLowerCase() as AdminUser['role'],
  department: raw?.department,
  joined: raw?.createdAt ?? raw?.joined ?? '',
  activityCount: toNumber(raw?.activityCount),
})

const normalizeStats = (raw: any, certificatesIssued: number): AdminStats => ({
  totalStudents: toNumber(raw?.totalStudents ?? raw?.cards?.activeStudents),
  totalProfessors: toNumber(raw?.totalProfessors ?? raw?.cards?.totalProfessors),
  totalWorkshops: toNumber(raw?.totalWorkshops ?? raw?.cards?.totalWorkshops),
  pendingApprovals: toNumber(raw?.pendingApprovals),
  upcomingEvents: toNumber(raw?.upcomingEvents),
  certificatesIssued,
})

const normalizeAnalytics = (raw: any): AdminAnalytics => {
  const workshopsByDepartment = Array.isArray(raw?.chartData)
    ? raw.chartData.map((item: any) => ({
        department: String(item?._id ?? item?.department ?? 'Other'),
        count: toNumber(item?.count),
      }))
    : Array.isArray(raw?.workshopsByDepartment)
      ? raw.workshopsByDepartment.map((item: any) => ({
          department: String(item?.department ?? 'Other'),
          count: toNumber(item?.count),
        }))
      : []

  return {
    monthlyEnrollments: Array.isArray(raw?.monthlyEnrollments) && raw.monthlyEnrollments.length > 0
      ? raw.monthlyEnrollments.map((item: any) => ({
          month: String(item?.month ?? ''),
          enrollments: toNumber(item?.enrollments),
        }))
      : DEFAULT_MONTHLY_ENROLLMENTS,
    workshopsByDepartment,
  }
}

const adminService = {
  getStats: () => api.get<any>('/admin/stats') as unknown as Promise<any>,
  getAnalytics: () => api.get<any>('/admin/analytics') as unknown as Promise<any>,
  getPendingWorkshops: () => api.get<any[]>('/admin/pending') as unknown as Promise<any[]>,
  getWorkshops: () => api.get<any[]>('/admin/workshops') as unknown as Promise<any[]>,
  getReports: () => api.get<any[]>('/admin/reports') as unknown as Promise<any[]>,
  getContactMessages: () => api.get<any[]>('/admin/contacts') as unknown as Promise<any[]>,
  getCompletedWorkshops: () => api.get<any[]>('/admin/certificates/completed') as unknown as Promise<any[]>,
  getUsersByRole: (role: 'Student' | 'Professor') => api.get<any[]>('/admin/users', { params: { role } }) as unknown as Promise<any[]>,
  validateWorkshop: async (workshopId: string, action: 'Approved' | 'Rejected') => {
    const response = await (api.patch<{ message?: string; workshop?: any }>('/admin/validate', { workshopId, action }) as unknown as Promise<{ message?: string; workshop?: any }>)
    return response.workshop ? normalizeWorkshop(response.workshop) : null
  },
  markReportResolved: async (reportId: string) => {
    const response = await api.patch<{ message?: string; report?: any }>(`/admin/reports/${reportId}/resolve`) as unknown as Promise<{ message?: string; report?: any }>
    return response.report ? normalizeReport(response.report) : null
  },
  markContactMessageRead: async (messageId: string) => {
    const response = await api.patch<{ message?: string; message: any }>(`/admin/contacts/${messageId}/read`) as unknown as Promise<{ message?: string; message: any }>
    return response.message ? normalizeContactMessage(response.message) : null
  },
  sendCertificates: (workshopId: string) => api.post<{ message?: string }>(`/admin/certificates/send/${workshopId}`) as unknown as Promise<{ message?: string }>,
  getDashboardData: async (): Promise<AdminDashboardData> => {
    const [statsResponse, analyticsResponse, workshopsResponse, reportsResponse, contactMessagesResponse, studentsResponse, professorsResponse, completedResponse] = await Promise.all([
      adminService.getStats(),
      adminService.getAnalytics(),
      adminService.getWorkshops(),
      adminService.getReports(),
      adminService.getContactMessages(),
      adminService.getUsersByRole('Student'),
      adminService.getUsersByRole('Professor'),
      adminService.getCompletedWorkshops(),
    ])

    const completedWorkshops = Array.isArray(completedResponse) ? completedResponse.map(normalizeWorkshop) : []
    return {
      stats: normalizeStats(statsResponse, completedWorkshops.length),
      analytics: normalizeAnalytics(analyticsResponse),
      workshops: Array.isArray(workshopsResponse) ? workshopsResponse.map(normalizeWorkshop) : [],
      reports: Array.isArray(reportsResponse) ? reportsResponse.map(normalizeReport) : [],
      contactMessages: Array.isArray(contactMessagesResponse) ? contactMessagesResponse.map(normalizeContactMessage) : [],
      users: [...(Array.isArray(studentsResponse) ? studentsResponse.map(normalizeUser) : []), ...(Array.isArray(professorsResponse) ? professorsResponse.map(normalizeUser) : [])],
      completedWorkshops,
    }
  },
}

export default adminService