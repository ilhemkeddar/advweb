import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-[#0F1419] mb-1.5">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border text-sm transition-colors',
          'bg-white border-[rgba(15,20,25,0.15)] text-[#0F1419] placeholder:text-[#64748B]',
          'focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F]',
          error && 'border-red-500 focus:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-[#0F1419] mb-1.5">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border text-sm transition-colors appearance-none',
          'bg-white border-[rgba(15,20,25,0.15)] text-[#0F1419]',
          'focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F]',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
)
Select.displayName = 'Select'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-[#0F1419] mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border text-sm transition-colors resize-none',
          'bg-white border-[rgba(15,20,25,0.15)] text-[#0F1419] placeholder:text-[#64748B]',
          'focus:outline-none focus:ring-2 focus:ring-[#0A5F7F]/30 focus:border-[#0A5F7F]',
          className
        )}
        {...props}
      />
    </div>
  )
)
Textarea.displayName = 'Textarea'
