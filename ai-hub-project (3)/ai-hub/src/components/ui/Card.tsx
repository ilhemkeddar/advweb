import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
}

export function Card({ children, className, hover = false, glass = false }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-[rgba(15,20,25,0.08)] shadow-sm',
      glass ? 'bg-white/80 backdrop-blur-sm' : 'bg-white',
      hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#0A5F7F]/20',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>
}
