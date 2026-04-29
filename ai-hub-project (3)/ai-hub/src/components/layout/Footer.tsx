import { Link } from 'react-router-dom'
import { GraduationCap, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0A5F7F] to-[#06B6D4] rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl">AI Hub</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Empowering the next generation through AI education at Saad Dahleb University — Blida, Algeria.
            </p>
          </div>

          <div>
            <h4 className="font-display text-base mb-4 text-white/90">Platform</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link to="/training" className="hover:text-white transition-colors">Training Hub</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base mb-4 text-white/90">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" />Blida, Algeria</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" />ai-hub@univ-blida.dz</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center text-xs text-white/40">
          © 2026 AI Hub – Saad Dahleb University. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
