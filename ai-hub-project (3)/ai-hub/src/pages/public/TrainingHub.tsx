import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen } from 'lucide-react'
import { Card, CardContent, Badge, Input, Select } from '../../components/ui'
import { mockWorkshops, departments } from '../../data/mockData'
import { cn } from '../../utils/cn'

export default function TrainingHub() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [dept, setDept] = useState('all')

  const filtered = mockWorkshops.filter(w => {
    if (w.status === 'pending') return false
    const q = search.toLowerCase()
    const matchSearch = !q || w.title.toLowerCase().includes(q) || w.professor.name.toLowerCase().includes(q) || w.topic.toLowerCase().includes(q)
    const matchStatus = status === 'all' || w.status === status
    const matchType = type === 'all' || w.type === type
    const matchDept = dept === 'all' || w.department === dept
    return matchSearch && matchStatus && matchType && matchDept
  })

  const sb = (s: string) => {
    if (s === 'upcoming') return <Badge variant="success">Upcoming</Badge>
    if (s === 'past') return <Badge variant="outline">Past</Badge>
    if (s === 'approved') return <Badge variant="info">Approved</Badge>
    return <Badge>{s}</Badge>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <p className="text-sm text-[#0A5F7F] font-medium uppercase tracking-wider mb-1">All Workshops</p>
        <h1 className="font-display text-4xl text-[#0F1419] mb-2">Training Hub</h1>
        <p className="text-[#64748B]">Browse all AI workshops offered at Saad Dahleb University</p>
      </div>

      <div className="bg-white rounded-2xl border border-[rgba(15,20,25,0.08)] p-5 mb-8 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="Search workshops, professors, topics…" value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4"/>}/>
          </div>
          <div className="w-36">
            <Select value={status} onChange={e => setStatus(e.target.value)} options={[{value:'all',label:'All Status'},{value:'upcoming',label:'Upcoming'},{value:'past',label:'Past'}]}/>
          </div>
          <div className="w-36">
            <Select value={type} onChange={e => setType(e.target.value)} options={[{value:'all',label:'All Types'},{value:'in-person',label:'In-Person'},{value:'webinar',label:'Webinar'}]}/>
          </div>
          <div className="w-44">
            <Select value={dept} onChange={e => setDept(e.target.value)} options={[{value:'all',label:'All Departments'},...departments.map(d => ({value:d,label:d}))]}/>
          </div>
          <button onClick={() => {setSearch('');setStatus('all');setType('all');setDept('all')}} className="text-sm text-[#64748B] hover:text-[#0F1419] px-3 py-2.5 rounded-xl hover:bg-[#F0F4F8] transition-colors">Clear</button>
        </div>
      </div>

      <p className="text-sm text-[#64748B] mb-5"><span className="font-medium text-[#0F1419]">{filtered.length}</span> workshop{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-[#64748B]">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30"/>
          <p className="text-lg font-display">No workshops match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(w => (
            <Card key={w.id} hover className="flex flex-col">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4 gap-2">
                  {sb(w.status)}
                  <Badge variant="outline" className="shrink-0">{w.type === 'webinar' ? '🖥 Webinar' : '📍 In-Person'}</Badge>
                </div>
                <h3 className="font-display text-xl mb-2 text-[#0F1419] leading-snug">{w.title}</h3>
                <p className="text-sm text-[#64748B] mb-4 line-clamp-2 leading-relaxed flex-1">{w.description}</p>
                {w.tags && w.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {w.tags.slice(0,3).map(t => <span key={t} className="text-[11px] px-2 py-0.5 bg-[#F0F4F8] text-[#64748B] rounded-md">{t}</span>)}
                  </div>
                )}
                <div className="space-y-1 text-sm text-[#64748B] mb-5 border-t border-[rgba(15,20,25,0.06)] pt-4">
                  <div><span className="font-medium text-[#0F1419]">Date:</span> {new Date(w.date).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</div>
                  <div><span className="font-medium text-[#0F1419]">By:</span> {w.professor.name}</div>
                  <div><span className="font-medium text-[#0F1419]">Dept:</span> {w.department}</div>
                  {w.status === 'upcoming' && (
                    <div>
                      <span className="font-medium text-[#0F1419]">Seats:</span> {w.enrolled}/{w.capacity}
                      <div className="w-full h-1.5 bg-[#F0F4F8] rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#0A5F7F] to-[#06B6D4]" style={{width:`${Math.min(100,(w.enrolled/w.capacity)*100)}%`}}/>
                      </div>
                    </div>
                  )}
                </div>
                <Link to={`/workshop/${w.id}`} className="block w-full text-center py-2.5 border border-[rgba(15,20,25,0.15)] rounded-xl text-sm font-medium hover:bg-[#F0F4F8] transition-colors">View Details</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
