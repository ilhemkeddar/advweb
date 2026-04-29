import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen, Users, Award, ChevronRight, Zap, Shield, Globe } from 'lucide-react'
import { Button, Card, CardContent, Badge } from '../../components/ui'
import { mockWorkshops } from '../../data/mockData'

export default function HomePage() {
  const featured = mockWorkshops.filter(w => w.status === 'upcoming').slice(0, 3)
  const stats = [{ value:'350+', label:'Active Students' },{ value:'60+', label:'Workshops Held' },{ value:'18+', label:'Expert Professors' },{ value:'10', label:'Departments' }]
  const features = [
    { icon: Zap, title:'Cutting-Edge AI Topics', desc:'From neural networks to generative AI — curated by leading Algerian researchers.' },
    { icon: Shield, title:'Certified Learning', desc:'Earn recognized certificates to showcase your AI expertise and advance your career.' },
    { icon: Globe, title:'Interdisciplinary', desc:'AI workshops spanning Medicine, Engineering, Mathematics, and more.' },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#0A5F7F]/6 to-[#06B6D4]/4 rounded-full blur-3xl -z-10 pointer-events-none"/>
      <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#F59E0B]/4 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"/>

      {/* Hero */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#0A5F7F]/10 text-[#0A5F7F] px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Sparkles className="w-4 h-4"/>Welcome to AI Hub — Saad Dahleb University
              </div>
              <h1 className="font-display text-5xl lg:text-6xl mb-6 leading-tight text-[#0F1419]">
                Empowering Algeria's Future Through{' '}
                <span style={{background:'linear-gradient(135deg,#0A5F7F 0%,#06B6D4 60%,#F59E0B 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                  Artificial Intelligence
                </span>
              </h1>
              <p className="text-lg text-[#64748B] mb-8 leading-relaxed max-w-lg">
                Connect with expert faculty, attend cutting-edge workshops, and earn certificates that advance your career in AI.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/training" className="inline-flex items-center gap-2 bg-[#0A5F7F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#084f6a] transition-all hover:-translate-y-0.5 shadow-md shadow-[#0A5F7F]/20 text-base">
                  Explore Workshops <ArrowRight className="w-5 h-5"/>
                </Link>
                <Link to="/signup" className="inline-flex items-center gap-2 border border-[rgba(15,20,25,0.15)] text-[#0F1419] bg-white px-6 py-3 rounded-xl font-medium hover:bg-[#F0F4F8] transition-colors text-base">
                  Create Account
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-[#0A5F7F]/8 via-[#06B6D4]/5 to-[#F59E0B]/5 p-6 border border-[rgba(15,20,25,0.06)] shadow-xl backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s,i) => (
                    <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-[rgba(15,20,25,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div className="font-display text-4xl text-[#0A5F7F] mb-1">{s.value}</div>
                      <div className="text-xs text-[#64748B]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="py-16 bg-white border-y border-[rgba(15,20,25,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f,i) => { const Icon = f.icon; return (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center shrink-0 shadow-md"><Icon className="w-5 h-5 text-white"/></div>
                <div><h3 className="font-display text-lg mb-1 text-[#0F1419]">{f.title}</h3><p className="text-sm text-[#64748B] leading-relaxed">{f.desc}</p></div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm text-[#0A5F7F] font-medium mb-1 uppercase tracking-wider">Training Hub</p>
              <h2 className="font-display text-4xl text-[#0F1419]">Upcoming Workshops</h2>
              <p className="text-[#64748B] mt-1">Discover our latest AI training sessions</p>
            </div>
            <Link to="/training" className="hidden sm:inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F1419] hover:bg-[#F0F4F8] px-4 py-2 rounded-lg transition-colors">
              View All <ChevronRight className="w-4 h-4"/>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(w => (
              <Card key={w.id} hover className="flex flex-col">
                <CardContent className="pt-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="success">Upcoming</Badge>
                    <Badge variant="outline">{w.type === 'webinar' ? '🖥 Webinar' : '📍 In-Person'}</Badge>
                  </div>
                  <h3 className="font-display text-xl mb-2 text-[#0F1419]">{w.title}</h3>
                  <p className="text-sm text-[#64748B] mb-4 line-clamp-2 leading-relaxed flex-1">{w.description}</p>
                  <div className="space-y-1.5 text-sm text-[#64748B] mb-5">
                    <div><span className="font-medium text-[#0F1419]">Date:</span> {new Date(w.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</div>
                    <div><span className="font-medium text-[#0F1419]">By:</span> {w.professor.name}</div>
                    <div><span className="font-medium text-[#0F1419]">Seats:</span> {w.enrolled}/{w.capacity}</div>
                  </div>
                  <Link to={`/workshop/${w.id}`} className="block w-full text-center py-2.5 border border-[rgba(15,20,25,0.15)] rounded-xl text-sm font-medium hover:bg-[#F0F4F8] transition-colors">View Details</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#0A2540] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-white mb-3">How It Works</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Start your AI learning journey in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {icon:Users,step:'01',title:'Create Your Account',desc:'Sign up as a student or professor to access our full catalogue of AI workshops.'},
              {icon:BookOpen,step:'02',title:'Explore & Register',desc:'Browse curated workshops across departments and register with one click.'},
              {icon:Award,step:'03',title:'Learn & Earn Certificates',desc:'Attend sessions, complete assessments, and earn a certified digital badge.'},
            ].map((s,i) => { const Icon = s.icon; return (
              <div key={i} className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all">
                <div className="absolute top-6 right-6 font-display text-7xl text-white/5 select-none">{s.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center mb-6 shadow-lg"><Icon className="w-7 h-7 text-white"/></div>
                <h3 className="font-display text-xl text-white mb-3">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            )})}
          </div>
          <div className="text-center mt-12">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-[#0A5F7F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#084f6a] transition-all hover:-translate-y-0.5 shadow-md shadow-[#0A5F7F]/20 text-base">
              Get Started Today <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
