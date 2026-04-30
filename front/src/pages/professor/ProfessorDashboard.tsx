import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BookOpen, PlusCircle, Clock, CheckCircle, XCircle, Calendar, ChevronRight, Loader2 } from 'lucide-react'
import { Card, CardContent, Badge, Button, StatCard, Input, Select, Textarea } from '../../components/ui'
import { departments, aiTopics } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'
import workshopService, { Workshop } from '../../services/workshopService'

const sb = (s: string) => {
  if (s==='upcoming') return <Badge variant="success">Upcoming</Badge>
  if (s==='past')     return <Badge variant="outline">Past</Badge>
  if (s==='pending')  return <Badge variant="warning">Pending</Badge>
  if (s==='approved') return <Badge variant="info">Approved</Badge>
  if (s==='rejected') return <Badge variant="danger">Rejected</Badge>
  return <Badge>{s}</Badge>
}

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const path = location.pathname
  const [myWorkshops, setMyWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({title:'',description:'',department:'',topic:'',date:'',time:'',location:'',type:'in-person',capacity:'',audience:''})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f => ({...f,[k]:e.target.value}))

  useEffect(() => {
    loadWorkshops()
  }, [user])

  async function loadWorkshops() {
    try {
      setLoading(true)
      const data = await workshopService.getAllWorkshops()
      // Filter workshops created by this professor
      const filtered = (data as Workshop[]).filter(w => w.professor?.name === user?.name)
      setMyWorkshops(filtered)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workshops')
    } finally {
      setLoading(false)
    }
  }

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
          name: user?.name || 'Unknown',
          role: user?.role || 'Professor'
        }
      })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      setForm({title:'',description:'',department:'',topic:'',date:'',time:'',location:'',type:'in-person',capacity:'',audience:''})
      // Refresh workshop list so the new submission appears
      await loadWorkshops()
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit workshop. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (path.includes('submit')) return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-[#0F1419]">Submit a Workshop</h1>
        <p className="text-[#64748B] mt-1">Fill in the details. It will be reviewed by admin before publication.</p>
      </div>
      {submitted && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
          <CheckCircle className="w-4 h-4"/> Workshop submitted! Awaiting admin review.
        </div>
      )}
      {submitError && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
          <XCircle className="w-4 h-4"/> {submitError}
        </div>
      )}
      <Card><CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Workshop Title *" placeholder="e.g. Introduction to Neural Networks" value={form.title} onChange={set('title')} required/>
          <Textarea label="Description *" placeholder="Describe the workshop content, objectives, and outcomes…" value={form.description} onChange={set('description')} rows={4} required/>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Department *" value={form.department} onChange={set('department')} options={[{value:'',label:'Select department…'},...departments.map(d => ({value:d,label:d}))]} required/>
            <Select label="AI Topic *" value={form.topic} onChange={set('topic')} options={[{value:'',label:'Select topic…'},...aiTopics.map(t => ({value:t,label:t}))]} required/>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Date *" type="date" value={form.date} onChange={set('date')} required/>
            <Input label="Time *" type="time" value={form.time} onChange={set('time')} required/>
          </div>
          <Input label="Location *" placeholder="e.g. Amphithéâtre A, Bâtiment Informatique" value={form.location} onChange={set('location')} required/>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Format" value={form.type} onChange={set('type')} options={[{value:'in-person',label:'📍 In-Person'},{value:'webinar',label:'🖥 Webinar'}]}/>
            <Input label="Capacity" type="number" placeholder="e.g. 50" value={form.capacity} onChange={set('capacity')}/>
          </div>
          <Input label="Target Audience" placeholder="e.g. Master 1 & 2 students" value={form.audience} onChange={set('audience')}/>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" loading={submitting} disabled={submitting}>Submit for Review</Button>
            <Button type="button" variant="outline">Save Draft</Button>
          </div>
        </form>
      </CardContent></Card>
    </div>
  )

  if (path.includes('workshops')) return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-[#0F1419]">My Workshops</h1>
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#0A5F7F]"/>
          <p className="text-[#64748B]">Loading your workshops…</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
          <Button onClick={loadWorkshops} className="mt-3">Retry</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {myWorkshops.map(w => (
            <Card key={w._id}><CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">{sb(w.status)}<Badge variant="outline">{w.type==='webinar'?'🖥 Webinar':'📍 In-Person'}</Badge></div>
                  <h3 className="font-display text-xl text-[#0F1419] mb-1">{w.title}</h3>
                  <p className="text-sm text-[#64748B] mb-3 line-clamp-2">{w.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    <span>📅 {new Date(w.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <span>📍 {w.location}</span>
                    <span>👥 {w.registeredCount}/{w.capacity} enrolled</span>
                  </div>
                  {w.status==='rejected' && <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">Rejected by admin. Please revise and resubmit.</div>}
                  {w.status==='pending'  && <div className="mt-3 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">Under admin review. You'll be notified soon.</div>}
                </div>
              </div>
            </CardContent></Card>
          ))}
          {myWorkshops.length === 0 && (
            <div className="text-center py-12 text-[#64748B]">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30"/>
              <p className="font-display text-lg">No workshops yet</p>
              <p className="text-sm mt-1">Submit your first workshop to see it here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (path.includes('calendar')) return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl text-[#0F1419]">Calendar</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {date:'10 May 2026',title:'Neural Networks Workshop',time:'09:00',color:'bg-[#0A5F7F]'},
          {date:'6 Apr 2026',title:'RL Workshop (Completed)',time:'11:00',color:'bg-gray-400'},
        ].map((ev,i) => (
          <Card key={i}><CardContent className="pt-5 pb-5">
            <div className="flex gap-4 items-center">
              <div className={`w-12 h-12 rounded-2xl ${ev.color} flex flex-col items-center justify-center text-white shrink-0`}><Calendar className="w-5 h-5"/></div>
              <div><p className="text-xs text-[#64748B]">{ev.date} · {ev.time}</p><p className="font-display text-base text-[#0F1419] leading-snug">{ev.title}</p></div>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="pt-6 pb-6 text-center text-[#64748B]">
        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-25"/>
        <p className="font-display text-lg">Full interactive calendar coming soon</p>
        <p className="text-sm mt-1">Scheduling will be available in the next release.</p>
      </CardContent></Card>
    </div>
  )

  // Default dashboard
  const pending  = myWorkshops.filter(w => w.status==='pending').length
  const approved = myWorkshops.filter(w => w.status==='approved'||w.status==='upcoming').length
  const rejected = myWorkshops.filter(w => w.status==='rejected').length

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl text-[#0F1419]">Professor Dashboard</h1>
        <p className="text-[#64748B] mt-1">Welcome back, {user?.name}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Workshops" value={myWorkshops.length} icon={<BookOpen className="w-5 h-5"/>} color="blue"/>
        <StatCard label="Pending Review"  value={pending}            icon={<Clock className="w-5 h-5"/>}    color="amber"/>
        <StatCard label="Approved"        value={approved}           icon={<CheckCircle className="w-5 h-5"/>} color="green"/>
        <StatCard label="Rejected"        value={rejected}           icon={<XCircle className="w-5 h-5"/>}  color="purple"/>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#0A5F7F]"/>
          <p className="text-[#64748B]">Loading your workshops…</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
          <Button onClick={loadWorkshops} className="mt-3">Retry</Button>
        </div>
      ) : (
        <div>
          <h2 className="font-display text-xl text-[#0F1419] mb-4">My Workshops</h2>
          <div className="space-y-3">
            {myWorkshops.map(w => (
              <Card key={w._id}><CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">{sb(w.status)}</div>
                    <h3 className="font-display text-lg text-[#0F1419]">{w.title}</h3>
                    <p className="text-sm text-[#64748B]">{new Date(w.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · {w.location}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#64748B] shrink-0"/>
                </div>
              </CardContent></Card>
            ))}
            {myWorkshops.length === 0 && (
              <div className="text-center py-8 text-[#64748B]">
                <p>No workshops yet. Submit your first workshop!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
