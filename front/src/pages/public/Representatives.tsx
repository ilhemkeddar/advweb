import { useState, useEffect } from 'react'
import { Search, Mail, ExternalLink, BookOpen } from 'lucide-react'
import { Card, CardContent, Badge, Input, Select } from '../../components/ui'
import representativeService, { Representative } from '../../services/representativeService'

const DEPARTMENTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Engineering',
  'Biology',
  'Chemistry',
  'Economics',
  'Medicine',
]

export default function Representatives() {
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [dept, setDept] = useState('all')
  const [count, setCount] = useState(0)

  useEffect(() => {
    loadRepresentatives()
  }, [status, dept])

  async function loadRepresentatives() {
    try {
      setLoading(true)
      const filters: any = {}
      if (status !== 'all') filters.status = status
      if (dept !== 'all') filters.department = dept
      
      const response = await representativeService.getAllRepresentatives(filters)
      setRepresentatives(response.data)
      setCount(response.count)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load representatives')
      setRepresentatives([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = representatives.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.specialties.some(s => s.toLowerCase().includes(q))
    return matchSearch
  })

  const statusBadge = (s: string) => {
    if (s === 'Certified') return <Badge variant="success">Certified</Badge>
    if (s === 'In Training') return <Badge variant="warning">In Training</Badge>
    return <Badge variant="default">{s}</Badge>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <p className="text-sm text-[#0A5F7F] font-medium uppercase tracking-wider mb-1">Our Team</p>
        <h1 className="font-display text-4xl text-[#0F1419] mb-2">AI Representatives</h1>
        <p className="text-[#64748B]">Meet our certified AI experts and trainers at Saad Dahleb University</p>
      </div>

      <div className="bg-white rounded-2xl border border-[rgba(15,20,25,0.08)] px-6 py-5 mb-8 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4"/>
              <input 
                placeholder="Search by name, role, or specialty…" 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 pl-10 text-sm text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all"
              />
            </div>
          </div>
          <div className="w-44">
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 text-sm text-[#0F1419] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Certified">Certified</option>
              <option value="In Training">In Training</option>
            </select>
          </div>
          <div className="w-44">
            <select 
              value={dept} 
              onChange={e => setDept(e.target.value)}
              className="w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 text-sm text-[#0F1419] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={() => {setSearch('');setStatus('all');setDept('all')}} className="text-sm text-[#64748B] hover:text-[#0F1419] px-3 py-2.5 rounded-xl hover:bg-[#F0F4F8] transition-colors">Clear</button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-2 border-[#0A5F7F] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-[#64748B]">Loading representatives…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-[#64748B]">
          <p className="text-lg font-display">No representatives found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#64748B] mb-5"><span className="font-medium text-[#0F1419]">{filtered.length}</span> representative{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(r => (
              <Card key={r._id} hover={true} className="flex flex-col">
                <CardContent className="px-6 pt-6 pb-6 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0A5F7F]/10 to-[#06B6D4]/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {r.image && r.image !== 'default.png' ? (
                        <img src={r.image} alt={r.name} className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4]">
                          <span className="text-white text-2xl font-semibold">{r.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg text-[#0F1419] leading-tight mb-1">{r.name}</h3>
                      <p className="text-sm text-[#64748B] mb-2">{r.role}</p>
                      {statusBadge(r.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-[#64748B] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#0F1419]">Department:</span>
                      <span>{r.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#0A5F7F]"/>
                      <span className="font-medium text-[#0F1419]">{r.workshopsCount}</span>
                      <span>workshops led</span>
                    </div>
                  </div>

                  {r.specialties && r.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {r.specialties.slice(0, 3).map((s, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                      {r.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{r.specialties.length - 3}</Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-[rgba(15,20,25,0.06)] flex gap-2">
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-[#0A5F7F] hover:bg-[#0A5F7F]/10 px-3 py-2 rounded-lg transition-colors">
                        <Mail className="w-4 h-4"/> Email
                      </a>
                    )}
                    {r.bioLink && (
                      <a href={r.bioLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-sm text-[#0A5F7F] hover:bg-[#0A5F7F]/10 px-3 py-2 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4"/> Bio
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
