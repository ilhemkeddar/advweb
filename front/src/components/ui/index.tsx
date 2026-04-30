import { ButtonHTMLAttributes, forwardRef, ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none'
    const v = { primary:'bg-[#0A5F7F] text-white hover:bg-[#084f6a] shadow-md shadow-[#0A5F7F]/20 hover:shadow-lg focus:ring-[#0A5F7F] hover:-translate-y-0.5', outline:'border border-[rgba(15,20,25,0.15)] text-[#0F1419] bg-white hover:bg-[#F0F4F8] focus:ring-[#0A5F7F]', ghost:'text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0F1419] focus:ring-[#0A5F7F]', danger:'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:-translate-y-0.5', success:'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 hover:-translate-y-0.5' }
    const s = { sm:'text-sm px-3 py-1.5', md:'text-sm px-4 py-2.5', lg:'text-base px-6 py-3' }
    return (
      <button ref={ref} className={cn(base, v[variant], s[size], className)} disabled={disabled || loading} {...props}>
        {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Card
export function Card({ className, children, hover = false }: { className?: string; children: ReactNode; hover?: boolean }) {
  return <div className={cn('bg-white rounded-2xl border border-[rgba(15,20,25,0.08)] shadow-sm', hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#0A5F7F]/20', className)}>{children}</div>
}
export function CardHeader({ className, children }: { className?: string; children: ReactNode }) { return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div> }
export function CardContent({ className, children }: { className?: string; children: ReactNode }) { return <div className={cn('px-6 pb-6', className)}>{children}</div> }
export function CardTitle({ className, children }: { className?: string; children: ReactNode }) { return <h3 className={cn('font-display text-xl text-[#0F1419]', className)}>{children}</h3> }

// Badge
type BV = 'default'|'success'|'warning'|'danger'|'info'|'outline'
export function Badge({ variant = 'default', children, className }: { variant?: BV; children: ReactNode; className?: string }) {
  const v: Record<BV,string> = { default:'bg-[#F0F4F8] text-[#0F1419]', success:'bg-emerald-50 text-emerald-700 border border-emerald-200', warning:'bg-amber-50 text-amber-700 border border-amber-200', danger:'bg-red-50 text-red-700 border border-red-200', info:'bg-blue-50 text-blue-700 border border-blue-200', outline:'border border-[rgba(15,20,25,0.15)] text-[#64748B]' }
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', v[variant], className)}>{children}</span>
}

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; leftIcon?: ReactNode }
export function Input({ label, error, leftIcon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#0F1419]">{label}</label>}
      <div className="relative">
        {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">{leftIcon}</span>}
        <input className={cn('w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 text-sm text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all', leftIcon && 'pl-10', error && 'border-red-400', className)} {...props}/>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[] }
export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#0F1419]">{label}</label>}
      <select className={cn('w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-2.5 text-sm text-[#0F1419] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all appearance-none cursor-pointer', className)} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// Textarea
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string }
export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#0F1419]">{label}</label>}
      <textarea className={cn('w-full rounded-xl border border-[rgba(15,20,25,0.15)] bg-white px-4 py-3 text-sm text-[#0F1419] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F] transition-all resize-none', className)} {...props}/>
    </div>
  )
}

// StatCard
export function StatCard({ label, value, icon, color = 'blue', sub }: { label: string; value: string|number; icon: ReactNode; color?: 'blue'|'cyan'|'amber'|'green'|'purple'; sub?: string }) {
  const c = { blue:'from-[#0A5F7F] to-[#0A5F7F]/70', cyan:'from-[#06B6D4] to-[#06B6D4]/70', amber:'from-[#F59E0B] to-[#F59E0B]/70', green:'from-emerald-500 to-emerald-500/70', purple:'from-purple-500 to-purple-500/70' }
  return (
    <Card><CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div><p className="text-sm text-[#64748B] mb-1">{label}</p><p className="font-display text-3xl text-[#0F1419]">{value}</p>{sub && <p className="text-xs text-[#64748B] mt-1">{sub}</p>}</div>
        <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg', c[color])}>{icon}</div>
      </div>
    </CardContent></Card>
  )
}
