import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, LogIn, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import { useState } from 'react'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/training', label: 'Training Hub' },
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[rgba(15,20,25,0.08)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display text-base leading-tight text-[#0F1419]">AI Hub</div>
              <div className="text-[10px] text-[#64748B] leading-tight">Saad Dahleb University</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={cn('px-4 py-2 rounded-lg text-sm transition-colors',
                  location.pathname === link.path ? 'bg-[#0A5F7F]/10 text-[#0A5F7F] font-medium' : 'text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0F1419]')}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to={`/${user?.role}`} className="text-sm text-[#0A5F7F] font-medium hover:underline px-3 py-2">Dashboard</Link>
                <button onClick={logout} className="text-sm px-4 py-2 rounded-xl border border-[rgba(15,20,25,0.15)] text-[#0F1419] hover:bg-[#F0F4F8] transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-sm text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0F1419] px-4 py-2 rounded-lg transition-colors">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/signup" className="text-sm bg-[#0A5F7F] text-white px-4 py-2 rounded-xl hover:bg-[#084f6a] transition-colors shadow-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg text-[#64748B]" onClick={() => setOpen(o => !o)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 pt-3 border-t border-[rgba(15,20,25,0.06)] space-y-1">
            {navLinks.map(l => <Link key={l.path} to={l.path} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-[#64748B] hover:bg-[#F0F4F8] rounded-lg">{l.label}</Link>)}
            <div className="pt-2 flex gap-2 px-2">
              {isAuthenticated ? (
                <>
                  <Link to={`/${user?.role}`} onClick={() => setOpen(false)} className="flex-1 text-center py-2 bg-[#0A5F7F] text-white text-sm rounded-xl">Dashboard</Link>
                  <button onClick={() => { logout(); setOpen(false) }} className="flex-1 py-2 border border-[rgba(15,20,25,0.15)] text-sm rounded-xl">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 border border-[rgba(15,20,25,0.15)] text-sm rounded-xl">Login</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 text-center py-2 bg-[#0A5F7F] text-white text-sm rounded-xl">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
