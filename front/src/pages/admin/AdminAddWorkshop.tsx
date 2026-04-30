import { useState } from 'react'
import { PlusCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, Button, Input, Select, Textarea } from '../../components/ui'
import { departments, aiTopics } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'
import workshopService from '../../services/workshopService'

export default function AdminAddWorkshop() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    description: '',
    department: '',
    topic: '',
    date: '',
    time: '',
    location: '',
    type: 'in-person',
    capacity: '',
    audience: '',
    professorName: '',
    professorRole: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      await workshopService.createWorkshop({
        title: form.title,
        description: form.description,
        department: form.department,
        category: form.topic,
        date: form.date,
        time: form.time,
        location: form.location,
        type: form.type,
        capacity: Number(form.capacity) || 60,
        targetAudience: form.audience,
        professor: {
          name: form.professorName || user?.name || 'Unknown',
          role: form.professorRole || user?.role || 'Professor'
        },
        status: 'approved' // Admin workshops are automatically approved
      })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      setForm({
        title: '',
        description: '',
        department: '',
        topic: '',
        date: '',
        time: '',
        location: '',
        type: 'in-person',
        capacity: '',
        audience: '',
        professorName: '',
        professorRole: ''
      })
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.response?.data?.error || 'Failed to create workshop. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-[#0F1419]">Add Workshop</h1>
        <p className="text-[#64748B] mt-1">Create a new workshop. It will be automatically approved and visible to students.</p>
      </div>

      {submitted && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Workshop created successfully! It's now visible to students.
        </div>
      )}

      {submitError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
          <XCircle className="w-4 h-4" /> {submitError}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Workshop Title *" 
              placeholder="e.g. Introduction to Neural Networks" 
              value={form.title} 
              onChange={set('title')} 
              required 
            />
            
            <Textarea 
              label="Description *" 
              placeholder="Describe the workshop content, objectives, and outcomes…" 
              value={form.description} 
              onChange={set('description')} 
              rows={4} 
              required 
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Select 
                label="Department *" 
                value={form.department} 
                onChange={set('department')} 
                options={[
                  { value: '', label: 'Select department…' },
                  ...departments.map(d => ({ value: d, label: d }))
                ]} 
                required 
              />
              <Select 
                label="AI Topic *" 
                value={form.topic} 
                onChange={set('topic')} 
                options={[
                  { value: '', label: 'Select topic…' },
                  ...aiTopics.map(t => ({ value: t, label: t }))
                ]} 
                required 
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input 
                label="Date *" 
                type="date" 
                value={form.date} 
                onChange={set('date')} 
                required 
              />
              <Input 
                label="Time *" 
                type="time" 
                value={form.time} 
                onChange={set('time')} 
                required 
              />
            </div>

            <Input 
              label="Location *" 
              placeholder="e.g. Amphithéâtre A, Bâtiment Informatique" 
              value={form.location} 
              onChange={set('location')} 
              required 
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Select 
                label="Format" 
                value={form.type} 
                onChange={set('type')} 
                options={[
                  { value: 'in-person', label: '📍 In-Person' },
                  { value: 'webinar', label: '🖥 Webinar' }
                ]} 
              />
              <Input 
                label="Capacity" 
                type="number" 
                placeholder="e.g. 50" 
                value={form.capacity} 
                onChange={set('capacity')} 
              />
            </div>

            <Input 
              label="Target Audience" 
              placeholder="e.g. Master 1 & 2 students" 
              value={form.audience} 
              onChange={set('audience')} 
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input 
                label="Professor Name" 
                placeholder={user?.name || 'Professor name'} 
                value={form.professorName} 
                onChange={set('professorName')} 
              />
              <Input 
                label="Professor Role" 
                placeholder={user?.role || 'Professor'} 
                value={form.professorRole} 
                onChange={set('professorRole')} 
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1" 
                loading={submitting} 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Workshop...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Workshop
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
