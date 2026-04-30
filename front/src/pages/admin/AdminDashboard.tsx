import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AlertCircle, Award, BookOpen, CheckCircle, Eye, Loader2, Mail, RefreshCcw, Send, Users, XCircle, MessageSquare } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, Badge, Button, StatCard } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import adminService, { type AdminAnalytics, type AdminReport, type AdminStats, type AdminUser, type AdminWorkshop, type ContactMessage } from '../../services/adminService'

const MONTHLY_ENROLLMENTS = [
  { month: 'Jan', enrollments: 32 },
  { month: 'Feb', enrollments: 48 },
  { month: 'Mar', enrollments: 61 },
  { month: 'Apr', enrollments: 77 },
  { month: 'May', enrollments: 54 },
  { month: 'Jun', enrollments: 89 },
]

const sb = (status: string) => {
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>
  if (status === 'approved' || status === 'upcoming') return <Badge variant="success">Approved</Badge>
  if (status === 'rejected') return <Badge variant="danger">Rejected</Badge>
  if (status === 'past') return <Badge variant="outline">Past</Badge>
  return <Badge>{status}</Badge>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const section = location.pathname.split('/')[2] ?? ''
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [workshops, setWorkshops] = useState<AdminWorkshop[]>([])
  const [reports, setReports] = useState<AdminReport[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [completedWorkshops, setCompletedWorkshops] = useState<AdminWorkshop[]>([
    {
      id: 'cert-1',
      title: 'Machine Learning Fundamentals',
      description: 'Learn the fundamentals of machine learning including supervised and unsupervised learning, model evaluation, and practical implementations.',
      date: '2026-03-15',
      time: '09:00',
      location: 'Amphithéâtre A, Bâtiment Informatique',
      department: 'Computer Science',
      type: 'in-person',
      status: 'completed',
      professor: {
        name: 'Dr. Meriem Hadj',
        title: 'Associate Professor'
      },
      capacity: 60,
      registeredCount: 50
    },
    {
      id: 'cert-2',
      title: 'Data Science & Machine Learning Pipeline',
      description: 'From raw data to production ML models. Learn data cleaning, feature engineering, model selection, hyperparameter tuning, and MLOps fundamentals.',
      date: '2026-04-12',
      time: '09:00',
      location: 'Salle Informatique 205',
      department: 'Mathematics',
      type: 'in-person',
      status: 'completed',
      professor: {
        name: 'Dr. Yacine Bouziane',
        title: 'Associate Professor'
      },
      capacity: 50,
      registeredCount: 50
    },
    {
      id: 'cert-3',
      title: 'Reinforcement Learning: From Theory to Games',
      description: 'Understand Markov decision processes, Q-learning, policy gradients and train AI agents to play classic games and solve complex control tasks.',
      date: '2026-04-05',
      time: '11:00',
      location: 'Webinar en ligne',
      department: 'Computer Science',
      type: 'webinar',
      status: 'completed',
      professor: {
        name: 'Dr. Meriem Hadj',
        title: 'Associate Professor'
      },
      capacity: 60,
      registeredCount: 58
    },
    {
      id: 'cert-4',
      title: 'Natural Language Processing Basics',
      description: 'Introduction to NLP concepts including tokenization, sentiment analysis, and text classification using modern Python libraries.',
      date: '2026-02-20',
      time: '14:00',
      location: 'Salle Multimédia 101',
      department: 'Computer Science',
      type: 'in-person',
      status: 'completed',
      professor: {
        name: 'Dr. Karim Saadi',
        title: 'Professor'
      },
      capacity: 40,
      registeredCount: 38
    },
    {
      id: 'cert-5',
      title: 'Computer Vision & Image Recognition',
      description: 'Master convolutional neural networks and modern computer vision techniques. Build image classifiers and object detectors.',
      date: '2026-01-25',
      time: '10:00',
      location: 'Labo Vision par Ordinateur',
      department: 'Engineering',
      type: 'webinar',
      status: 'completed',
      professor: {
        name: 'Dr. Faiza Benali',
        title: 'Lecturer'
      },
      capacity: 80,
      registeredCount: 72
    }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingWorkshopId, setSavingWorkshopId] = useState<string | null>(null)
  const [sendingCertificateId, setSendingCertificateId] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [markingResolvedId, setMarkingResolvedId] = useState<string | null>(null)
  const [markingReadId, setMarkingReadId] = useState<string | null>(null)

  useEffect(() => {
    void loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getDashboardData()
      setStats(data.stats)
      setAnalytics(data.analytics)
      setWorkshops(data.workshops)
      setReports(data.reports)
      setContactMessages(data.contactMessages)
      setUsers(data.users)
      // Only update completed workshops if API returns data, otherwise keep mock data
      if (data.completedWorkshops && data.completedWorkshops.length > 0) {
        setCompletedWorkshops(data.completedWorkshops)
      }
      setSelectedReportId((current) => current ?? data.reports[0]?.id ?? null)
      setSelectedContactId((current) => current ?? data.contactMessages[0]?.id ?? null)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to load admin dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async (workshopId: string, action: 'Approved' | 'Rejected') => {
    setSavingWorkshopId(workshopId)
    try {
      const updatedWorkshop = await adminService.validateWorkshop(workshopId, action)
      if (updatedWorkshop) {
        setWorkshops((current) => current.map((workshop) => (workshop.id === workshopId ? updatedWorkshop : workshop)))
        setCompletedWorkshops((current) => current.filter((workshop) => workshop.id !== workshopId))
      } else {
        setWorkshops((current) => current.map((workshop) => (workshop.id === workshopId ? { ...workshop, status: action.toLowerCase() as AdminWorkshop['status'] } : workshop)))
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Unable to update workshop status')
    } finally {
      setSavingWorkshopId(null)
    }
  }

  const markReportRead = async (reportId: string) => {
    setMarkingResolvedId(reportId)
    try {
      await adminService.markReportResolved(reportId)
      setReports((current) => current.map((report) => (report.id === reportId ? { ...report, read: true } : report)))
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Unable to mark report as resolved')
    } finally {
      setMarkingResolvedId(null)
    }
  }

  const markContactMessageRead = async (messageId: string) => {
    setMarkingReadId(messageId)
    try {
      await adminService.markContactMessageRead(messageId)
      setContactMessages((current) => current.map((msg) => (msg.id === messageId ? { ...msg, status: 'Read' } : msg)))
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Unable to mark message as read')
    } finally {
      setMarkingReadId(null)
    }
  }

  const handleSendCertificates = async (workshopId: string) => {
    setSendingCertificateId(workshopId)
    try {
      await adminService.sendCertificates(workshopId)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Unable to send certificates')
    } finally {
      setSendingCertificateId(null)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadDashboard()} />
  }

  if (section === 'validation') {
    return <ValidationView workshops={workshops} onValidate={handleValidate} busyId={savingWorkshopId} />
  }

  if (section === 'users') {
    return <UsersView users={users} />
  }

  if (section === 'analytics') {
    return <AnalyticsView stats={stats} analytics={analytics} />
  }

  if (section === 'messages') {
    return <MessagesView reports={reports} contactMessages={contactMessages} selectedReportId={selectedReportId} selectedContactId={selectedContactId} onSelectReport={(reportId) => { setSelectedReportId(reportId); markReportRead(reportId) }} onSelectContact={(contactId) => { setSelectedContactId(contactId); markContactMessageRead(contactId) }} onMarkResolved={markReportRead} onMarkRead={markContactMessageRead} busyId={markingResolvedId} markingReadId={markingReadId} />
  }

  if (section === 'certificates') {
    return <CertificatesView workshops={completedWorkshops} onSendCertificates={handleSendCertificates} busyId={sendingCertificateId} />
  }

  const pending = workshops.filter((workshop) => workshop.status === 'pending').length
  const unread = reports.filter((report) => !report.read).length
  const unreadContacts = contactMessages.filter((msg) => msg.status === 'New').length
  const totalUnread = unread + unreadContacts
  const certificatesIssued = completedWorkshops.length

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl text-[#0F1419]">Admin Dashboard</h1>
        <p className="text-[#64748B] mt-1">Platform overview — {user?.name}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.totalStudents ?? 0} icon={<Users className="w-5 h-5"/>} color="blue"/>
        <StatCard label="Professors" value={stats?.totalProfessors ?? 0} icon={<Users className="w-5 h-5"/>} color="cyan"/>
        <StatCard label="Workshops" value={stats?.totalWorkshops ?? 0} icon={<BookOpen className="w-5 h-5"/>} color="green"/>
        <StatCard label="Certificates" value={certificatesIssued} icon={<Award className="w-5 h-5"/>} color="amber"/>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl">Pending Validation</h2><Badge variant="warning">{pending} pending</Badge></div>
          <div className="space-y-3">
            {workshops.filter((workshop) => workshop.status === 'pending').slice(0, 3).map((workshop) => (
              <div key={workshop.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAFBFC] border border-[rgba(15,20,25,0.06)]">
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#0F1419] truncate">{workshop.title}</p><p className="text-xs text-[#64748B]">{workshop.professor.name}</p></div>
                <div className="flex gap-1.5">
                  <button onClick={() => void handleValidate(workshop.id, 'Approved')} disabled={savingWorkshopId === workshop.id} className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors disabled:opacity-50"><CheckCircle className="w-4 h-4"/></button>
                  <button onClick={() => void handleValidate(workshop.id, 'Rejected')} disabled={savingWorkshopId === workshop.id} className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50"><XCircle className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
            {pending===0 && <p className="text-sm text-[#64748B] text-center py-4">All caught up! No pending workshops.</p>}
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl">Inbox</h2><Badge variant={totalUnread>0?'danger':'outline'}>{totalUnread} unread</Badge></div>
          <div className="space-y-3">
            {contactMessages.slice(0, 3).map((msg) => (
              <div key={msg.id} className={`p-3 rounded-xl border transition-all ${msg.status==='New'?'border-[#0A5F7F]/20 bg-[#0A5F7F]/3':'border-[rgba(15,20,25,0.06)] bg-white'}`}>
                <div className="flex items-start justify-between gap-2">
                  <button type="button" onClick={() => { setSelectedContactId(msg.id); markContactMessageRead(msg.id) }} className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-[#0A5F7F]"/>
                      <p className="text-sm font-medium text-[#0F1419] truncate">{msg.subject}</p>
                    </div>
                    <p className="text-xs text-[#64748B]">{msg.fullName}</p>
                  </button>
                  {msg.status === 'New' && <div className="w-2 h-2 rounded-full bg-[#0A5F7F] shrink-0 mt-1.5"/>}
                </div>
              </div>
            ))}
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className={`p-3 rounded-xl border transition-all ${report.read?'border-[rgba(15,20,25,0.06)] bg-white':'border-[#0A5F7F]/20 bg-[#0A5F7F]/3'}`}>
                <div className="flex items-start justify-between gap-2">
                  <button type="button" onClick={() => { setSelectedReportId(report.id); markReportRead(report.id) }} className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F1419] truncate">{report.subject}</p>
                    <p className="text-xs text-[#64748B]">{report.senderName}</p>
                  </button>
                  {!report.read && <div className="w-2 h-2 rounded-full bg-[#0A5F7F] shrink-0 mt-1.5"/>}
                </div>
              </div>
            ))}
            {contactMessages.length === 0 && reports.length === 0 && <p className="text-sm text-[#64748B] text-center py-4">No messages yet</p>}
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-5xl">
      <Card>
        <CardContent className="py-16 text-center space-y-3">
          <Loader2 className="w-10 h-10 mx-auto text-[#0A5F7F] animate-spin" />
          <p className="font-display text-xl text-[#0F1419]">Loading admin dashboard</p>
          <p className="text-sm text-[#64748B]">Fetching workshops, reports, analytics, and user data.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-5xl">
      <Card>
        <CardContent className="py-14 text-center space-y-4">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <div>
            <p className="font-display text-xl text-[#0F1419]">Admin data unavailable</p>
            <p className="text-sm text-[#64748B] mt-1">{message}</p>
          </div>
          <Button onClick={onRetry} className="mx-auto"><RefreshCcw className="w-4 h-4"/> Retry</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ValidationView({ workshops, onValidate, busyId }: { workshops: AdminWorkshop[]; onValidate: (id: string, action: 'Approved' | 'Rejected') => void; busyId: string | null }) {
  const pending = workshops.filter((workshop) => workshop.status === 'pending')
  const others = workshops.filter((workshop) => workshop.status !== 'pending')
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-[#0F1419]">Workshop Validation</h1>
      {pending.length > 0 ? (
        <div>
          <h2 className="font-display text-xl mb-4">Awaiting Review</h2>
          <div className="space-y-4">
            {pending.map(w => (
              <Card key={w.id}><CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="warning" className="mb-2">Pending</Badge>
                    <h3 className="font-display text-xl text-[#0F1419]">{w.title}</h3>
                    <p className="text-sm text-[#64748B] mt-1 mb-3 line-clamp-2">{w.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                      <span>👤 {w.professor.name}</span><span>📅 {new Date(w.date).toLocaleDateString('en-GB')}</span>
                      <span>📍 {w.location}</span><span>👥 Cap: {w.capacity}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="success" loading={busyId === w.id} onClick={() => onValidate(w.id, 'Approved')}><CheckCircle className="w-4 h-4"/> Approve</Button>
                    <Button size="sm" variant="danger" loading={busyId === w.id} onClick={() => onValidate(w.id, 'Rejected')}><XCircle className="w-4 h-4"/> Reject</Button>
                  </div>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </div>
      ) : (
        <Card><CardContent className="pt-8 pb-8 text-center"><CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400"/><p className="font-display text-xl text-[#0F1419]">All clear!</p><p className="text-sm text-[#64748B] mt-1">No workshops pending review.</p></CardContent></Card>
      )}
      <div>
        <h2 className="font-display text-xl mb-4">All Workshops</h2>
        <div className="space-y-3">
          {others.map(w => (
            <Card key={w.id}><CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">{sb(w.status)}<div><p className="text-sm font-medium text-[#0F1419]">{w.title}</p><p className="text-xs text-[#64748B]">{w.professor.name}</p></div></div>
                <p className="text-xs text-[#64748B] shrink-0">{new Date(w.date).toLocaleDateString('en-GB')}</p>
              </div>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function UsersView({ users }: { users: AdminUser[] }) {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between"><h1 className="font-display text-3xl text-[#0F1419]">User Management</h1><Badge variant="info">{users.length} users</Badge></div>
      <Card><div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="border-b border-[rgba(15,20,25,0.06)]">{['Name','Email','Role','Department','Joined'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-[rgba(15,20,25,0.04)]">
          {users.map((u,i) => (
            <tr key={i} className="hover:bg-[#FAFBFC] transition-colors">
              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white text-xs font-semibold">{u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><span className="text-sm font-medium text-[#0F1419]">{u.name}</span></div></td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{u.email}</td>
              <td className="px-6 py-4"><Badge variant={u.role==='professor'?'info':u.role==='admin'?'warning':'default'} className="capitalize">{u.role}</Badge></td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{u.department ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{u.joined ? new Date(u.joined).toLocaleDateString('en-GB') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table></div></Card>
    </div>
  )
}

const COLORS = ['#0A5F7F','#06B6D4','#F59E0B','#10B981','#8B5CF6']

function AnalyticsView({ stats, analytics }: { stats: AdminStats | null; analytics: AdminAnalytics | null }) {
  const workshopsByDepartment = analytics?.workshopsByDepartment ?? []
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-[#0F1419]">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.totalStudents ?? 0} icon={<Users className="w-5 h-5"/>} color="blue"/>
        <StatCard label="Total Professors" value={stats?.totalProfessors ?? 0} icon={<Users className="w-5 h-5"/>} color="cyan"/>
        <StatCard label="Total Workshops" value={stats?.totalWorkshops ?? 0} icon={<BookOpen className="w-5 h-5"/>} color="green"/>
        <StatCard label="Certificates" value={stats?.certificatesIssued ?? 0} icon={<Award className="w-5 h-5"/>} color="amber"/>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6">
          <h2 className="font-display text-xl text-[#0F1419] mb-6">Monthly Enrollments</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics?.monthlyEnrollments ?? MONTHLY_ENROLLMENTS}>
              <XAxis dataKey="month" tick={{fontSize:12,fill:'#64748B'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12,fill:'#64748B'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',fontSize:13}}/>
              <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0A5F7F"/><stop offset="100%" stopColor="#06B6D4"/></linearGradient></defs>
              <Bar dataKey="enrollments" fill="url(#bg)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <h2 className="font-display text-xl text-[#0F1419] mb-6">Workshops by Department</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={workshopsByDepartment} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={80}>
                {workshopsByDepartment.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>) }
              </Pie>
              <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {workshopsByDepartment.map((d,i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="w-2.5 h-2.5 rounded-full" style={{background:COLORS[i%COLORS.length]}}/>
                {d.department.split(' ')[0]}
              </span>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}

function MessagesView({ reports, contactMessages, selectedReportId, selectedContactId, onSelectReport, onSelectContact, onMarkResolved, onMarkRead, busyId, markingReadId }: { reports: AdminReport[]; contactMessages: ContactMessage[]; selectedReportId: string | null; selectedContactId: string | null; onSelectReport: (reportId: string) => void; onSelectContact: (contactId: string) => void; onMarkResolved: (reportId: string) => void; onMarkRead: (contactId: string) => void; busyId: string | null; markingReadId: string | null }) {
  const [activeTab, setActiveTab] = useState<'reports' | 'contacts'>('contacts')
  const selectedReport = reports.find((report) => report.id === selectedReportId) ?? null
  const selectedContact = contactMessages.find((msg) => msg.id === selectedContactId) ?? null
  const unreadReports = reports.filter((report) => !report.read).length
  const unreadContacts = contactMessages.filter((msg) => msg.status === 'New').length
  
  if (reports.length === 0 && contactMessages.length === 0) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between"><h1 className="font-display text-3xl text-[#0F1419]">Inbox</h1><Badge variant="outline">0 unread</Badge></div>
        <Card><CardContent className="pt-16 pb-16 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-[#64748B]/20"/>
          <p className="font-display text-xl text-[#0F1419] mb-2">No messages yet</p>
          <p className="text-sm text-[#64748B]">Messages from users will appear here.</p>
        </CardContent></Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-[#0F1419]">Inbox</h1>
        <Badge variant={(unreadReports + unreadContacts) > 0 ? 'danger' : 'outline'}>{unreadReports + unreadContacts} unread</Badge>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'contacts' ? 'bg-[#0A5F7F] text-white' : 'bg-white text-[#64748B] hover:bg-[#F0F4F8]'}`}
        >
          Contact Messages {unreadContacts > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadContacts}</span>}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-[#0A5F7F] text-white' : 'bg-white text-[#64748B] hover:bg-[#F0F4F8]'}`}
        >
          Reports {unreadReports > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadReports}</span>}
        </button>
      </div>

      {activeTab === 'contacts' ? (
        <ContactMessagesView messages={contactMessages} selectedId={selectedContactId} onSelect={onSelectContact} onMarkRead={onMarkRead} busyId={markingReadId} />
      ) : (
        <ReportsView reports={reports} selectedId={selectedReportId} onSelect={onSelectReport} onMarkResolved={onMarkResolved} busyId={busyId} />
      )}
    </div>
  )
}

function ContactMessagesView({ messages, selectedId, onSelect, onMarkRead, busyId }: { messages: ContactMessage[]; selectedId: string | null; onSelect: (id: string) => void; onMarkRead: (id: string) => void; busyId: string | null }) {
  const selected = messages.find((msg) => msg.id === selectedId) ?? null
  const unread = messages.filter((msg) => msg.status === 'New').length
  
  if (messages.length === 0) {
    return (
      <Card><CardContent className="pt-16 pb-16 text-center">
        <Mail className="w-16 h-16 mx-auto mb-4 text-[#64748B]/20"/>
        <p className="font-display text-xl text-[#0F1419] mb-2">No contact messages yet</p>
        <p className="text-sm text-[#64748B]">Messages from the contact form will appear here.</p>
      </CardContent></Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {messages.map(msg => (
            <button key={msg.id} onClick={() => onSelect(msg.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id===msg.id?'border-[#0A5F7F] bg-[#0A5F7F]/5 shadow-sm':msg.status==='New'?'border-[#0A5F7F]/20 bg-[#0A5F7F]/3':'border-[rgba(15,20,25,0.06)] bg-white hover:bg-[#FAFBFC] hover:border-[rgba(15,20,25,0.12)]'}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {msg.fullName.split(' ').map((name) => name[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-[#0F1419] truncate">{msg.fullName}</p>
                    {msg.status === 'New' && <div className="w-2 h-2 rounded-full bg-[#0A5F7F] shrink-0"/>}
                  </div>
                  <p className="text-sm text-[#0F1419] font-medium truncate mb-1">{msg.subject}</p>
                  <p className="text-xs text-[#64748B]">{msg.email}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-3 h-full">
        {selected ? (
          <Card className="h-full flex flex-col"><CardContent className="pt-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-start gap-4 mb-6 pb-5 border-b border-[rgba(15,20,25,0.06)] shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white text-lg font-semibold shrink-0">
                {selected.fullName.split(' ').map((name) => name[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0F1419] text-base">{selected.fullName}</p>
                <div className="flex items-center gap-2 text-sm text-[#64748B] mt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${selected.status === 'New' ? 'bg-red-500' : 'bg-emerald-500'}`}/>
                    {selected.status}
                  </span>
                  <span>·</span>
                  <span>{selected.email}</span>
                </div>
                <p className="font-display text-xl mt-3 text-[#0F1419]">{selected.subject}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3 mt-6 pt-5 border-t border-[rgba(15,20,25,0.06)] shrink-0">
              <Button size="md" loading={busyId === selected.id} onClick={() => onMarkRead(selected.id)} className="min-w-[140px]">
                Mark as Read
              </Button>
            </div>
          </CardContent></Card>
        ) : (
          <Card className="h-full flex items-center justify-center"><CardContent className="pt-12 pb-12 text-center">
            <Mail className="w-16 h-16 mx-auto mb-4 text-[#64748B]/20"/>
            <p className="text-[#64748B]">Select a message to read</p>
          </CardContent></Card>
        )}
      </div>
    </div>
  )
}

function ReportsView({ reports, selectedId, onSelect, onMarkResolved, busyId }: { reports: AdminReport[]; selectedId: string | null; onSelect: (id: string) => void; onMarkResolved: (id: string) => void; busyId: string | null }) {
  const selected = reports.find((report) => report.id === selectedId) ?? null
  const unread = reports.filter((report) => !report.read).length
  
  if (reports.length === 0) {
    return (
      <Card><CardContent className="pt-16 pb-16 text-center">
        <Mail className="w-16 h-16 mx-auto mb-4 text-[#64748B]/20"/>
        <p className="font-display text-xl text-[#0F1419] mb-2">No reports yet</p>
        <p className="text-sm text-[#64748B]">Reports from users will appear here.</p>
      </CardContent></Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {reports.map(report => (
            <button key={report.id} onClick={() => onSelect(report.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id===report.id?'border-[#0A5F7F] bg-[#0A5F7F]/5 shadow-sm':report.read?'border-[rgba(15,20,25,0.06)] bg-white hover:bg-[#FAFBFC] hover:border-[rgba(15,20,25,0.12)]':'border-[#0A5F7F]/20 bg-[#0A5F7F]/3'}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {report.senderName.split(' ').map((name) => name[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-[#0F1419] truncate">{report.senderName}</p>
                    {!report.read && <div className="w-2 h-2 rounded-full bg-[#0A5F7F] shrink-0"/>}
                  </div>
                  <p className="text-sm text-[#0F1419] font-medium truncate mb-1">{report.subject}</p>
                  <p className="text-xs text-[#64748B]">{report.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-3 h-full">
        {selected ? (
          <Card className="h-full flex flex-col"><CardContent className="pt-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-start gap-4 mb-6 pb-5 border-b border-[rgba(15,20,25,0.06)] shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white text-lg font-semibold shrink-0">
                {selected.senderName.split(' ').map((name) => name[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0F1419] text-base">{selected.senderName}</p>
                <div className="flex items-center gap-2 text-sm text-[#64748B] mt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${selected.priority === 'high' ? 'bg-red-500' : selected.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}/>
                    {selected.priority}
                  </span>
                  <span>·</span>
                  <span>{selected.date}</span>
                </div>
                <p className="font-display text-xl mt-3 text-[#0F1419]">{selected.subject}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex gap-3 mt-6 pt-5 border-t border-[rgba(15,20,25,0.06)] shrink-0">
              <Button size="md" loading={busyId === selected.id} onClick={() => onMarkResolved(selected.id)} className="min-w-[140px]">
                Mark Resolved
              </Button>
            </div>
          </CardContent></Card>
        ) : (
          <Card className="h-full flex items-center justify-center"><CardContent className="pt-12 pb-12 text-center">
            <Mail className="w-16 h-16 mx-auto mb-4 text-[#64748B]/20"/>
            <p className="text-[#64748B]">Select a message to read</p>
          </CardContent></Card>
        )}
      </div>
    </div>
  )
}

function CertificatesView({ workshops, onSendCertificates, busyId }: { workshops: AdminWorkshop[]; onSendCertificates: (workshopId: string) => void; busyId: string | null }) {
  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-[#0F1419]">Certificate Management</h1>
        <p className="text-[#64748B]">Generate and send certificates to participants</p>
      </div>

      {/* Certificate List Cards */}
      <div className="space-y-4">
        {workshops.map((workshop) => (
          <CertificateCard
            key={workshop.id}
            workshop={workshop}
            onSendCertificates={onSendCertificates}
            busyId={busyId}
          />
        ))}
        {workshops.length === 0 && (
          <Card>
            <CardContent className="pt-16 pb-16 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-[#64748B]/20"/>
              <p className="font-display text-xl text-[#0F1419] mb-2">No completed workshops</p>
              <p className="text-sm text-[#64748B]">Certificates will appear here when workshops are completed.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function CertificateCard({ workshop, onSendCertificates, busyId }: { workshop: AdminWorkshop; onSendCertificates: (workshopId: string) => void; busyId: string | null }) {
  const participantCount = workshop.registeredCount || 0
  const formattedDate = new Date(workshop.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <Card className="border border-[rgba(15,20,25,0.08)]">
      <CardContent className="pt-6 pb-6">
        {/* Header Row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-600" />
          </div>

          {/* Title Block */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-[#0F1419] mb-1">{workshop.title}</h3>
            <p className="text-sm text-[#64748B]">{formattedDate}</p>
          </div>
        </div>

        {/* Body Text */}
        <div className="mb-5">
          <p className="text-sm text-[#64748B]">
            {participantCount} participant{participantCount !== 1 ? 's' : ''} completed this workshop
          </p>
        </div>

        {/* Action Area */}
        <Button
          className="w-full sm:w-auto"
          loading={busyId === workshop.id}
          onClick={() => onSendCertificates(workshop.id)}
        >
          <Send className="w-4 h-4 mr-2" />
          Generate & Send Certificates
        </Button>
      </CardContent>
    </Card>
  )
}
