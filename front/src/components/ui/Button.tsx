import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  loading?: boolean
  children?: ReactNode
}

const variants = {
  primary: 'bg-[#0A5F7F] text-white hover:bg-[#0A5F7F]/90 shadow-sm',
  outline: 'border border-[rgba(15,20,25,0.15)] text-[#0F1419] hover:bg-[#F0F4F8]',
  ghost: 'text-[#64748B] hover:bg-[#F0F4F8] hover:text-[#0F1419]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}
const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
}

const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, loading, children, disabled, ...props }, ref) => {
    const classes = cn(baseClasses, variants[variant], sizes[size], className)
    if (asChild && children) {
      const child = children as React.ReactElement<{ className?: string }>
      return { ...child, props: { ...child.props, className: cn(classes, child.props?.className) } } as React.ReactElement
    }
    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
