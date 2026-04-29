import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle, XCircle, Users, BookOpen, Award, Clock, Mail, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, Badge, Button, StatCard } from '../../components/ui'
import { mockWorkshops, mockMessages, analyticsData, mockCertificates } from '../../data/mockData'
import { useAuth } from '../../context/AuthContext'

const sb = (s: string) => {
  if (s==='pending')                       return <Badge variant="warning">Pending</Badge>
  if (s==='approved'||s==='upcoming')      return <Badge variant="success">Approved</Badge>
  if (s==='rejected')                      return <Badge variant="danger">Rejected</Badge>
  if (s==='past')                          return <Badge variant="outline">Past</Badge>
  return <Badge>{s}</Badge>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const path = location.pathname
  const [workshops, setWorkshops] = useState(mockWorkshops)
  const [messages,  setMessages]  = useState(mockMessages)

  const approve  = (id: string) => setWorkshops(ws => ws.map(w => w.id===id ? {...w,status:'approved' as const} : w))
  const reject   = (id: string) => setWorkshops(ws => ws.map(w => w.id===id ? {...w,status:'rejected' as const} : w))
  const markRead = (id: string) => setMessages(ms => ms.map(m => m.id===id ? {...m,read:true} : m))

  if (path.includes('validation'))   return <ValidationView workshops={workshops} approve={approve} reject={reject}/>
  if (path.includes('users'))        return <UsersView/>
  if (path.includes('analytics'))    return <AnalyticsView/>
  if (path.includes('messages'))     return <MessagesView messages={messages} markRead={markRead}/>
  if (path.includes('certificates')) return <CertificatesView/>

  const pending = workshops.filter(w => w.status==='pending').length
  const unread  = messages.filter(m => !m.read).length

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl text-[#0F1419]">Admin Dashboard</h1>
        <p className="text-[#64748B] mt-1">Platform overview — {user?.name}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students"  value={analyticsData.totalStudents}    icon={<Users className="w-5 h-5"/>}   color="blue"/>
        <StatCard label="Professors"      value={analyticsData.totalProfessors}  icon={<Users className="w-5 h-5"/>}   color="cyan"/>
        <StatCard label="Workshops"       value={analyticsData.totalWorkshops}   icon={<BookOpen className="w-5 h-5"/>} color="green"/>
        <StatCard label="Certificates"    value={analyticsData.certificatesIssued} icon={<Award className="w-5 h-5"/>} color="amber"/>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl">Pending Validation</h2><Badge variant="warning">{pending} pending</Badge></div>
          <div className="space-y-3">
            {workshops.filter(w => w.status==='pending').slice(0,3).map(w => (
              <div key={w.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAFBFC] border border-[rgba(15,20,25,0.06)]">
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#0F1419] truncate">{w.title}</p><p className="text-xs text-[#64748B]">{w.professor.name}</p></div>
                <div className="flex gap-1.5">
                  <button onClick={() => approve(w.id)} className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors"><CheckCircle className="w-4 h-4"/></button>
                  <button onClick={() => reject(w.id)}  className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"><XCircle className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
            {pending===0 && <p className="text-sm text-[#64748B] text-center py-4">All caught up! No pending workshops.</p>}
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl">Inbox</h2><Badge variant={unread>0?'danger':'outline'}>{unread} unread</Badge></div>
          <div className="space-y-3">
            {messages.slice(0,3).map(m => (
              <div key={m.id} className={`p-3 rounded-xl border transition-all ${m.read?'border-[rgba(15,20,25,0.06)] bg-white':'border-[#0A5F7F]/20 bg-[#0A5F7F]/3'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div><p className="text-sm font-medium text-[#0F1419]">{m.subject}</p><p className="text-xs text-[#64748B]">{m.from} · {m.fromRole}</p></div>
                  {!m.read && <div className="w-2 h-2 rounded-full bg-[#0A5F7F] shrink-0 mt-1.5"/>}
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </div>
  )
}

function ValidationView({ workshops, approve, reject }: { workshops: typeof mockWorkshops; approve: (id:string)=>void; reject: (id:string)=>void }) {
  const pending = workshops.filter(w => w.status==='pending')
  const others  = workshops.filter(w => w.status!=='pending')
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
                    <Button size="sm" variant="success" onClick={() => approve(w.id)}><CheckCircle className="w-4 h-4"/> Approve</Button>
                    <Button size="sm" variant="danger"  onClick={() => reject(w.id)}><XCircle className="w-4 h-4"/> Reject</Button>
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

function UsersView() {
  const users = [
    {name:'Amine Bensaid',email:'amine@univ-blida.dz',role:'student',dept:'Computer Science',joined:'2026-01-15'},
    {name:'Lina Khelil',email:'lina@univ-blida.dz',role:'student',dept:'Engineering',joined:'2026-02-03'},
    {name:'Dr. Meriem Hadj',email:'meriem@univ-blida.dz',role:'professor',dept:'Computer Science',joined:'2025-09-01'},
    {name:'Dr. Karim Saadi',email:'karim@univ-blida.dz',role:'professor',dept:'Computer Science',joined:'2025-09-01'},
    {name:'Sofiane Benhamed',email:'sofiane@univ-blida.dz',role:'student',dept:'Mathematics',joined:'2026-01-20'},
    {name:'Dr. Faiza Benali',email:'faiza@univ-blida.dz',role:'professor',dept:'Engineering',joined:'2025-09-15'},
  ]
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
              <td className="px-6 py-4"><Badge variant={u.role==='professor'?'info':'default'} className="capitalize">{u.role}</Badge></td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{u.dept}</td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{new Date(u.joined).toLocaleDateString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table></div></Card>
    </div>
  )
}

const COLORS = ['#0A5F7F','#06B6D4','#F59E0B','#10B981','#8B5CF6']

function AnalyticsView() {
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-[#0F1419]">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students"    value={analyticsData.totalStudents}    icon={<Users className="w-5 h-5"/>}    color="blue"/>
        <StatCard label="Total Professors"  value={analyticsData.totalProfessors}  icon={<Users className="w-5 h-5"/>}    color="cyan"/>
        <StatCard label="Total Workshops"   value={analyticsData.totalWorkshops}   icon={<BookOpen className="w-5 h-5"/>}  color="green"/>
        <StatCard label="Certificates"      value={analyticsData.certificatesIssued} icon={<Award className="w-5 h-5"/>} color="amber"/>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6">
          <h2 className="font-display text-xl text-[#0F1419] mb-6">Monthly Enrollments</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.monthlyEnrollments}>
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
              <Pie data={analyticsData.workshopsByDepartment} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={80}>
                {analyticsData.workshopsByDepartment.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {analyticsData.workshopsByDepartment.map((d,i) => (
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

function MessagesView({ messages, markRead }: { messages: typeof mockMessages; markRead: (id:string)=>void }) {
  const [selected, setSelected] = useState<typeof mockMessages[number]|null>(null)
  const unread = messages.filter(m => !m.read).length
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between"><h1 className="font-display text-3xl text-[#0F1419]">Inbox</h1><Badge variant={unread>0?'danger':'outline'}>{unread} unread</Badge></div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {messages.map(m => (
            <button key={m.id} onClick={() => { setSelected(m); markRead(m.id) }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id===m.id?'border-[#0A5F7F] bg-[#0A5F7F]/5':m.read?'border-[rgba(15,20,25,0.06)] bg-white hover:bg-[#FAFBFC]':'border-[#0A5F7F]/20 bg-[#0A5F7F]/3'}`}>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {m.from.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1"><p className="text-sm font-medium text-[#0F1419] truncate">{m.from}</p>{!m.read && <div className="w-2 h-2 rounded-full bg-[#0A5F7F] shrink-0"/>}</div>
                  <p className="text-xs text-[#64748B] truncate">{m.subject}</p>
                  <p className="text-xs text-[#64748B]/60 mt-0.5">{m.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3">
          {selected ? (
            <Card><CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-6 pb-5 border-b border-[rgba(15,20,25,0.06)]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white font-semibold shrink-0">
                  {selected.from.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div><p className="font-medium text-[#0F1419]">{selected.from}</p><p className="text-sm text-[#64748B]">{selected.fromRole} · {selected.date}</p><p className="font-display text-lg mt-2">{selected.subject}</p></div>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">{selected.body}</p>
              <div className="flex gap-2 mt-6"><Button size="sm">Reply</Button><Button size="sm" variant="outline">Mark Resolved</Button></div>
            </CardContent></Card>
          ) : (
            <Card><CardContent className="pt-12 pb-12 text-center"><Mail className="w-10 h-10 mx-auto mb-3 text-[#64748B]/30"/><p className="text-[#64748B]">Select a message to read</p></CardContent></Card>
          )}
        </div>
      </div>
    </div>
  )
}

function CertificatesView() {
  const certs = [
    ...mockCertificates,
    {id:'cert3',workshopId:'5',workshopTitle:'Data Science & ML Pipeline',studentId:'stu2',studentName:'Lina Khelil',issuedAt:'2026-04-13',grade:'Good'},
    {id:'cert4',workshopId:'6',workshopTitle:'Reinforcement Learning',studentId:'stu3',studentName:'Sofiane Benhamed',issuedAt:'2026-04-06',grade:'Excellent'},
  ]
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between"><h1 className="font-display text-3xl text-[#0F1419]">Certificates</h1><Button size="sm">Issue Certificate</Button></div>
      <Card><div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="border-b border-[rgba(15,20,25,0.06)]">{['Student','Workshop','Date Issued','Grade','Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-[rgba(15,20,25,0.04)]">
          {certs.map(c => (
            <tr key={c.id} className="hover:bg-[#FAFBFC] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-[#0F1419]">{c.studentName}</td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{c.workshopTitle}</td>
              <td className="px-6 py-4 text-sm text-[#64748B]">{new Date(c.issuedAt).toLocaleDateString('en-GB')}</td>
              <td className="px-6 py-4"><Badge variant={c.grade==='Excellent'?'success':c.grade==='Very Good'?'info':'default'}>{c.grade}</Badge></td>
              <td className="px-6 py-4"><button className="text-sm text-[#0A5F7F] hover:underline flex items-center gap-1"><Eye className="w-3.5 h-3.5"/> View</button></td>
            </tr>
          ))}
        </tbody>
      </table></div></Card>
    </div>
  )
}
