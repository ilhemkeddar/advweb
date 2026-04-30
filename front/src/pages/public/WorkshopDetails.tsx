import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileText, Video, Code, SlidersHorizontal, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, Badge, Button } from '../../components/ui'
import workshopService, { Workshop } from '../../services/workshopService'
import registrationService from '../../services/registrationService'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'

const rIcon = (t: string) => {
  if (t==='pdf') return <FileText className="w-4 h-4"/>
  if (t==='video') return <Video className="w-4 h-4"/>
  if (t==='code') return <Code className="w-4 h-4"/>
  if (t==='slides') return <SlidersHorizontal className="w-4 h-4"/>
  return <FileText className="w-4 h-4"/>
}

export default function WorkshopDetails() {
  const { id } = useParams<{id:string}>()
  const { user } = useAuth()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    if (id) loadWorkshop()
  }, [id])

  async function loadWorkshop() {
    try {
      setLoading(true)
      const data = await workshopService.getWorkshopById(id!)
      setWorkshop(data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workshop')
      setWorkshop(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    if (!user) {
      setError('Please login to register')
      return
    }
    try {
      setRegistering(true)
      await registrationService.registerToWorkshop({
        studentId: user.id,
        workshopId: id!
      })
      setRegistered(true)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <div className="w-8 h-8 border-2 border-[#0A5F7F] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
      <p className="text-[#64748B]">Loading workshop…</p>
    </div>
  )

  if (!workshop) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <h2 className="font-display text-3xl mb-4">Workshop not found</h2>
      <Link to="/training" className="inline-flex bg-[#0A5F7F] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#084f6a] transition-colors">Back to Training Hub</Link>
    </div>
  )

  const isFull = workshop.registeredCount >= workshop.capacity
  const fillPct = Math.min(100,(workshop.registeredCount/workshop.capacity)*100)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/training" className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F1419] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4"/> Back to Training Hub
      </Link>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={workshop.status==='approved'?'success':'outline'}>{workshop.status.charAt(0).toUpperCase()+workshop.status.slice(1)}</Badge>
                <Badge variant="outline">{workshop.type==='webinar'?'🖥 Webinar':'📍 In-Person'}</Badge>
                <Badge variant="info">{workshop.department}</Badge>
              </div>
              <h1 className="font-display text-3xl text-[#0F1419] mb-3 leading-tight">{workshop.title}</h1>
              <p className="text-[#64748B] leading-relaxed">{workshop.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-display text-xl mb-5">Workshop Details</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  {icon:Calendar,label:'Date',value:new Date(workshop.date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})},
                  {icon:Clock,label:'Time',value:workshop.time},
                  {icon:MapPin,label:'Location',value:workshop.location},
                  {icon:Users,label:'Target Audience',value:workshop.targetAudience||'All students'},
                ].map((item,i) => { const Icon = item.icon; return (
                  <div key={i} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0A5F7F]/10 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-[#0A5F7F]"/></div>
                    <div><p className="text-xs text-[#64748B] mb-0.5">{item.label}</p><p className="text-sm font-medium text-[#0F1419]">{item.value}</p></div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-display text-xl mb-4">About the Instructor</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white font-semibold text-lg">
                  {workshop.professor.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p className="font-semibold text-[#0F1419]">{workshop.professor.name}</p>
                  <p className="text-sm text-[#64748B]">{workshop.professor.role}</p>
                  <p className="text-sm text-[#0A5F7F]">{workshop.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {workshop.resources && workshop.resources.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-display text-xl mb-4">Workshop Resources</h2>
                <div className="space-y-3">
                  {workshop.resources.map((r,i) => (
                    <a key={i} href={r.url} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(15,20,25,0.08)] hover:border-[#0A5F7F]/30 hover:bg-[#F0F4F8]/50 transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-[#0A5F7F]/10 flex items-center justify-center text-[#0A5F7F] group-hover:bg-[#0A5F7F] group-hover:text-white transition-all">{rIcon('pdf')}</div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#0F1419] truncate">{r.name}</p></div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardContent className="pt-6">
              <h2 className="font-display text-xl mb-4">Register</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"/>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              {workshop.status === 'approved' ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-[#64748B]">Seats available</span><span className="font-medium text-[#0F1419]">{workshop.registeredCount}/{workshop.capacity}</span></div>
                    <div className="h-2 bg-[#F0F4F8] rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#0A5F7F] to-[#06B6D4] transition-all" style={{width:`${fillPct}%`}}/></div>
                    {isFull && <p className="text-xs text-red-500 mt-1">This workshop is full</p>}
                  </div>
                  {registered ? (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl p-3 text-sm font-medium"><CheckCircle className="w-5 h-5"/>You are registered!</div>
                  ) : (
                    <Button className="w-full" disabled={isFull || registering} loading={registering} onClick={handleRegister}>{isFull?'Workshop Full':'Register Now'}</Button>
                  )}
                </>
              ) : (
                <div className="text-center py-4"><Badge variant="outline" className="mb-2">Pending Approval</Badge><p className="text-sm text-[#64748B]">This workshop is awaiting admin approval.</p></div>
              )}
              <div className="mt-5 pt-5 border-t border-[rgba(15,20,25,0.06)] space-y-3 text-sm">
                {[{k:'Category',v:workshop.category},{k:'Format',v:workshop.type.replace('-',' ')},{k:'Department',v:workshop.department}].map(item => (
                  <div key={item.k} className="flex justify-between"><span className="text-[#64748B]">{item.k}</span><span className="font-medium text-[#0F1419] capitalize">{item.v}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Link to="/training" className="block w-full text-center py-2.5 border border-[rgba(15,20,25,0.15)] rounded-xl text-sm font-medium hover:bg-[#F0F4F8] transition-colors">Browse More Workshops</Link>
        </div>
      </div>
    </div>
  )
}
