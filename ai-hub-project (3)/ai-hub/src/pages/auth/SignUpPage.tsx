import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, User } from 'lucide-react'
import { Button, Input, Select } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { departments } from '../../data/mockData'

export default function SignUpPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student', department:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(f => ({...f,[k]:e.target.value}))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success && result.role) navigate(`/${result.role}`)
    else setError('Registration failed. Please try again.')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#FAFBFC] via-white to-[#F0F4F8]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] rounded-2xl shadow-lg mb-4"><GraduationCap className="w-8 h-8 text-white"/></div>
          <h1 className="font-display text-3xl text-[#0F1419]">Create your account</h1>
          <p className="text-[#64748B] mt-1">Join the AI Hub community</p>
        </div>
        <div className="flex gap-2 mb-6 bg-[#F0F4F8] p-1.5 rounded-2xl">
          {(['student','professor'] as const).map(r => (
            <button key={r} onClick={() => setForm(f => ({...f,role:r}))}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${form.role===r?'bg-white text-[#0A5F7F] shadow-sm':'text-[#64748B] hover:text-[#0F1419]'}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(15,20,25,0.08)] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full Name" placeholder="Your full name" value={form.name} onChange={set('name')} leftIcon={<User className="w-4 h-4"/>}/>
            <Input label="Email" type="email" placeholder="you@univ-blida.dz" value={form.email} onChange={set('email')} leftIcon={<Mail className="w-4 h-4"/>}/>
            <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} leftIcon={<Lock className="w-4 h-4"/>}/>
            <Select label="Department" value={form.department} onChange={set('department')} options={[{value:'',label:'Select your department…'},...departments.map(d => ({value:d,label:d}))]}/>
            {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</div>}
            <Button type="submit" className="w-full" size="lg" loading={loading}>Create Account</Button>
          </form>
          <p className="text-center text-sm text-[#64748B] mt-6">Already have an account? <Link to="/login" className="text-[#0A5F7F] font-medium hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
