import { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  color?: 'blue' | 'cyan' | 'amber' | 'emerald' | 'purple'
  className?: string
}

const colorMap = {
  blue: 'from-[#0A5F7F] to-[#0A5F7F]/80',
  cyan: 'from-[#06B6D4] to-[#06B6D4]/80',
  amber: 'from-[#F59E0B] to-[#F59E0B]/80',
  emerald: 'from-[#10B981] to-[#10B981]/80',
  purple: 'from-purple-600 to-purple-600/80',
}

export function StatCard({ label, value, icon: Icon, trend, color = 'blue', className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl p-6 border border-[rgba(15,20,25,0.08)] shadow-sm hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#64748B] mb-1">{label}</p>
          <p className="font-display text-3xl text-[#0F1419]">{value}</p>
          {trend && <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', colorMap[color])}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}
