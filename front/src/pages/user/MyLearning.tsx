import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Award, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent, Badge, Button, StatCard } from '../../components/ui'
import { mockWorkshops, mockCertificates } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

export default function MyLearning() {
  const { user } = useAuth()
  const location = useLocation()
  const isCerts = location.pathname.includes('certificates')

  const enrolled = mockWorkshops.filter(w => ['1','2','5','6'].includes(w.id))
  const completed = enrolled.filter(w => w.status === 'past')
  const upcoming  = enrolled.filter(w => w.status === 'upcoming')

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl text-[#0F1419]">{isCerts ? 'My Certificates' : 'My Learning'}</h1>
        <p className="text-[#64748B] mt-1">{isCerts ? 'Your earned certificates & achievements' : `Welcome back, ${user?.name?.split(' ')[0]}!`}</p>
      </div>

      {!isCerts ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Enrolled"     value={enrolled.length}         icon={<BookOpen className="w-5 h-5"/>}  color="blue"/>
            <StatCard label="Completed"    value={completed.length}        icon={<CheckCircle className="w-5 h-5"/>} color="green"/>
            <StatCard label="Upcoming"     value={upcoming.length}         icon={<Clock className="w-5 h-5"/>}     color="cyan"/>
            <StatCard label="Certificates" value={mockCertificates.length} icon={<Award className="w-5 h-5"/>}    color="amber"/>
          </div>

          <div>
            <h2 className="font-display text-xl text-[#0F1419] mb-4">Registered Workshops</h2>
            <div className="space-y-3">
              {upcoming.map(w => (
                <Card key={w.id}><CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1"><Badge variant="success">Upcoming</Badge><Badge variant="outline">{w.department}</Badge></div>
                      <h3 className="font-display text-lg text-[#0F1419] truncate">{w.title}</h3>
                      <p className="text-sm text-[#64748B] mt-0.5">{w.professor.name} · {new Date(w.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                    </div>
                    <Link to={`/workshop/${w.id}`} className="shrink-0 text-sm px-3 py-1.5 border border-[rgba(15,20,25,0.15)] rounded-xl hover:bg-[#F0F4F8] transition-colors font-medium">Details</Link>
                  </div>
                </CardContent></Card>
              ))}
              {upcoming.length === 0 && (
                <Card><CardContent className="pt-6 text-center text-[#64748B]">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                  <p className="text-sm">No upcoming workshops. <Link to="/training" className="text-[#0A5F7F] underline">Browse workshops</Link></p>
                </CardContent></Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-[#0F1419] mb-4">Completed Workshops</h2>
            <div className="space-y-3">
              {completed.map(w => (
                <Card key={w.id}><CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-emerald-600"/></div>
                      <div>
                        <h3 className="font-display text-lg text-[#0F1419]">{w.title}</h3>
                        <p className="text-sm text-[#64748B]">{w.professor.name} · {new Date(w.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                      </div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {mockCertificates.map(cert => (
              <Card key={cert.id} hover><CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/70 flex items-center justify-center shadow-lg shrink-0"><Award className="w-6 h-6 text-white"/></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-[#0F1419] leading-snug">{cert.workshopTitle}</h3>
                    <p className="text-sm text-[#64748B] mt-1">Issued: {new Date(cert.issuedAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="success">{cert.grade}</Badge>
                      <button className="inline-flex items-center gap-1 text-xs text-[#0A5F7F] hover:underline"><ExternalLink className="w-3 h-3"/> Download</button>
                    </div>
                  </div>
                </div>
              </CardContent></Card>
            ))}
          </div>
          {mockCertificates.length === 0 && (
            <Card><CardContent className="pt-8 pb-8 text-center">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-20"/>
              <p className="font-display text-lg text-[#64748B]">No certificates yet</p>
              <p className="text-sm text-[#64748B] mt-1">Complete a workshop to earn your first certificate.</p>
              <Link to="/training" className="inline-flex mt-4 bg-[#0A5F7F] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#084f6a] transition-colors text-sm">Explore Workshops</Link>
            </CardContent></Card>
          )}
        </div>
      )}
    </div>
  )
}
