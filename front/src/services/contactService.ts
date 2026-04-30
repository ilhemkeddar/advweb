import api from './api'

export interface ContactMessage {
  fullName: string
  email: string
  subject: string
  message: string
  status?: 'New' | 'Read' | 'Replied'
  _id?: string
  createdAt?: string
  updatedAt?: string
}

const contactService = {
  submitMessage: async (data: Omit<ContactMessage, 'status' | '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/contacts', data)
    return response
  },

  getAllMessages: async () => {
    const response = await api.get('/contacts')
    return response
  }
}

export default contactService
