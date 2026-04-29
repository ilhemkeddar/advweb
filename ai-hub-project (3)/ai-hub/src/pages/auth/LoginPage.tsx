import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const hints = [
    {label:'Student',email:'student@univ-blida.dz'},
    {label:'Professor',email:'prof.meriem@univ-blida.dz'},
    {label:'Admin',email:'admin@univ-blida.dz'},
  ]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success && result.role) navigate(`/${result.role}`)
    else setError('Invalid credentials. Please try again.')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#FAFBFC] via-white to-[#F0F4F8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] rounded-2xl shadow-lg mb-4"><GraduationCap className="w-8 h-8 text-white"/></div>
          <h1 className="font-display text-3xl text-[#0F1419]">Welcome back</h1>
          <p className="text-[#64748B] mt-1">Sign in to AI Hub</p>
        </div>
        <div className="bg-[#F0F4F8] rounded-2xl p-4 mb-6">
          <p className="text-xs text-[#64748B] font-medium mb-3 uppercase tracking-wider">Demo quick-login</p>
          <div className="grid grid-cols-3 gap-2">
            {hints.map(h => (
              <button key={h.label} onClick={() => { setEmail(h.email); setPassword('password123') }}
                className="text-xs bg-white rounded-xl py-2 px-3 font-medium text-[#0A5F7F] hover:bg-[#0A5F7F] hover:text-white transition-all border border-[rgba(15,20,25,0.08)] shadow-sm">
                {h.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(15,20,25,0.08)] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="you@univ-blida.dz" value={email} onChange={e => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>
            <div className="relative">
              <Input label="Password" type={showPw?'text':'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4"/>}/>
              <button type="button" className="absolute right-3 top-[2.1rem] text-[#64748B] hover:text-[#0F1419]" onClick={() => setShowPw(v => !v)}>
                {showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
              </button>
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</div>}
            <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
          </form>
          <p className="text-center text-sm text-[#64748B] mt-6">Don't have an account? <Link to="/signup" className="text-[#0A5F7F] font-medium hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}
