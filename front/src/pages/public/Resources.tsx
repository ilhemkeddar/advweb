import { useState, useEffect } from 'react'
import { Search, Download, FileText, Video, Code, SlidersHorizontal, BookOpen } from 'lucide-react'
import { Card, CardContent, Badge } from '../../components/ui'
import resourceService, { Resource } from '../../services/resourceService'

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

const RESOURCE_TYPES = [
  'Slides',
  'Code',
  'Videos',
  'PDF Documents',
]

const typeIcon = (type: string) => {
  if (type === 'Slides') return <SlidersHorizontal className="w-4 h-4"/>
  if (type === 'Code') return <Code className="w-4 h-4"/>
  if (type === 'Videos') return <Video className="w-4 h-4"/>
  if (type === 'PDF Documents') return <FileText className="w-4 h-4"/>
  return <FileText className="w-4 h-4"/>
}

const typeBadge = (type: string) => {
  if (type === 'Slides') return <Badge variant="info">Slides</Badge>
  if (type === 'Code') return <Badge variant="success">Code</Badge>
  if (type === 'Videos') return <Badge variant="warning">Videos</Badge>
  if (type === 'PDF Documents') return <Badge variant="default">PDF</Badge>
  return <Badge variant="default">{type}</Badge>
}

const getFileExtension = (type: string) => {
  if (type === 'Slides') return '.pptx'
  if (type === 'Code') return '.zip'
  if (type === 'Videos') return '.mp4'
  if (type === 'PDF Documents') return '.pdf'
  return '.pdf'
}

const getDownloadUrl = (link: string) => {
  if (!link) return ''
  
  // If it's already a full URL, return as is
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link
  }
  
  // If it starts with /uploads, it's already a relative path
  if (link.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${link}`
  }
  
  // Otherwise, assume it's a filename in the uploads directory
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${link}`
}

const fakeResources: Resource[] = [
  {
    _id: '1',
    title: 'Introduction to Machine Learning',
    workshopName: 'Machine Learning Fundamentals',
    department: 'Computer Science',
    type: 'Slides',
    link: 'ml-intro-slides.pptx',
    date: 'Mar 2026',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15'
  },
  {
    _id: '2',
    title: 'Neural Networks Implementation',
    workshopName: 'Deep Learning Workshop',
    department: 'Computer Science',
    type: 'Code',
    link: 'neural-networks-code.zip',
    date: 'Mar 2026',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15'
  },
  {
    _id: '3',
    title: 'Data Visualization Techniques',
    workshopName: 'Data Science Bootcamp',
    department: 'Mathematics',
    type: 'Videos',
    link: 'data-visualization.mp4',
    date: 'Feb 2026',
    createdAt: '2026-02-20',
    updatedAt: '2026-02-20'
  },
  {
    _id: '4',
    title: 'Quantum Computing Basics',
    workshopName: 'Quantum Physics Seminar',
    department: 'Physics',
    type: 'PDF Documents',
    link: 'quantum-computing.pdf',
    date: 'Feb 2026',
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18'
  },
  {
    _id: '5',
    title: 'React Hooks Tutorial',
    workshopName: 'Web Development Workshop',
    department: 'Computer Science',
    type: 'Code',
    link: 'react-hooks-tutorial.zip',
    date: 'Jan 2026',
    createdAt: '2026-01-25',
    updatedAt: '2026-01-25'
  },
  {
    _id: '6',
    title: 'Statistical Analysis Methods',
    workshopName: 'Statistics for Research',
    department: 'Mathematics',
    type: 'Slides',
    link: 'statistical-analysis.pptx',
    date: 'Jan 2026',
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20'
  }
]

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [dept, setDept] = useState('all')

  useEffect(() => {
    loadResources()
  }, [type, dept])

  async function loadResources() {
    try {
      setLoading(true)
      const filters: any = {}
      if (type !== 'all') filters.type = type
      if (dept !== 'all') filters.department = dept
      
      const data = await resourceService.getAllResources(filters)
      console.log('Resources loaded:', data)
      setResources(data as Resource[])
      setError('')
    } catch (err: any) {
      console.error('Error loading resources:', err)
      setError(err.response?.data?.message || 'Failed to load resources')
      setResources(fakeResources)
    } finally {
      setLoading(false)
    }
  }

  const filtered = resources.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || 
      r.title.toLowerCase().includes(q) || 
      r.workshopName.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    return matchSearch
  })

  return (
    <div className="min-h-screen">
      {/* Top Section with Gradient Background */}
      <div className="bg-gradient-to-br from-[#0A5F7F] via-[#0A5F7F] to-[#06B6D4] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-[#06B6D4]/80 font-medium uppercase tracking-wider mb-2">Learning Materials</p>
          <h1 className="font-display text-5xl text-white mb-4">Resource Library</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Access comprehensive learning materials from past workshops, including slides, code examples, and video recordings.
          </p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl border border-[rgba(15,20,25,0.08)] px-6 py-5 shadow-lg">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-4 h-4"/>
                <input 
                  placeholder="Search resources…" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 pl-10 text-sm text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all"
                />
              </div>
            </div>
            <div className="w-44">
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 text-sm text-[#0F1419] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
            <button onClick={() => {setSearch('');setType('all');setDept('all')}} className="text-sm text-[#64748B] hover:text-[#0F1419] px-3 py-2.5 rounded-xl hover:bg-[#F0F4F8] transition-colors">Clear</button>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 border-2 border-[#0A5F7F] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
            <p className="text-[#64748B]">Loading resources…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-[#64748B]">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30"/>
            <p className="text-lg font-display">No resources found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#64748B] mb-6"><span className="font-medium text-[#0F1419]">{filtered.length}</span> resource{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(r => (
                <Card key={r._id} hover={true} className="flex flex-col">
                  <CardContent className="pt-6 pb-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      {typeBadge(r.type)}
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        {typeIcon(r.type)}
                      </div>
                    </div>
                    
                    <h3 className="font-display text-lg text-[#0F1419] mb-3 leading-snug">{r.title}</h3>
                    
                    <div className="space-y-2 text-sm text-[#64748B] mb-4 flex-1">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-[#0F1419] shrink-0">Source:</span>
                        <div className="flex-1">
                          <div className="text-[#0F1419]">{r.workshopName}</div>
                          <div className="text-xs">{r.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0F1419]">Date:</span>
                        <span>{r.date}</span>
                      </div>
                    </div>

                    <a 
                      href={getDownloadUrl(r.link)} 
                      download={r.title.replace(/[^a-z0-9]/gi, '_') + getFileExtension(r.type)}
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-[#0A5F7F] text-white rounded-xl text-sm font-medium hover:bg-[#084f6a] transition-colors shadow-sm"
                      onClick={(e) => {
                        const downloadUrl = getDownloadUrl(r.link)
                        console.log('Download clicked:', { title: r.title, originalLink: r.link, downloadUrl })
                        if (!downloadUrl) {
                          e.preventDefault()
                          alert('Download link is not available. Please contact support.')
                        }
                      }}
                    >
                      <Download className="w-4 h-4"/> Download
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
