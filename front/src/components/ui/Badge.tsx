import { cn } from '../../utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'secondary'
  className?: string
}

const variants = {
  default: 'bg-[#0A5F7F]/10 text-[#0A5F7F]',
  outline: 'border border-current text-[#64748B]',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  secondary: 'bg-[#E5E9ED] text-[#0F1419]',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
