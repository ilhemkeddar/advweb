import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Calendar, Award, CheckCircle, Users,
  MessageSquare, BarChart3, LogOut, GraduationCap, PlusCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const studentLinks = [
  { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/learning', label: 'My Learning', icon: BookOpen },
  { path: '/student/certificates', label: 'Certificates', icon: Award },
]
const professorLinks = [
  { path: '/professor', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/professor/workshops', label: 'My Workshops', icon: BookOpen },
  { path: '/professor/submit', label: 'Submit Workshop', icon: PlusCircle },
  { path: '/professor/calendar', label: 'Calendar', icon: Calendar },
]
const adminLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/add-workshop', label: 'Add Workshop', icon: PlusCircle },
  { path: '/admin/validation', label: 'Validation', icon: CheckCircle },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/certificates', label: 'Certificates', icon: Award },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  if (!user) return null

  const links = user.role === 'admin' ? adminLinks : user.role === 'professor' ? professorLinks : studentLinks
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside className="w-64 min-h-screen bg-[#0A2540] text-[#F0F4F8] flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-display text-lg leading-none">AI Hub</div>
            <div className="text-[10px] text-white/50 mt-0.5">Saad Dahleb University</div>
          </div>
        </Link>
      </div>

      {/* User */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-white/50 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {links.map(({ path, label, icon: Icon }) => {
          const active = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-[#134E6B] text-white font-medium'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
