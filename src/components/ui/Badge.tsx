import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-osc-navy-100 text-osc-navy-800 dark:bg-osc-navy-800 dark:text-osc-navy-200',
        secondary: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        success: 'border-transparent bg-osc-green-100 text-osc-green-800 dark:bg-osc-green-900 dark:text-osc-green-200',
        warning: 'border-transparent bg-osc-gold-100 text-osc-gold-800 dark:bg-osc-gold-900 dark:text-osc-gold-200',
        info: 'border-transparent bg-osc-blue-100 text-osc-blue-800 dark:bg-osc-blue-900 dark:text-osc-blue-200',
        outline: 'text-osc-navy-600 border-osc-navy-200 dark:text-osc-navy-400 dark:border-osc-navy-700',
        government: 'border-transparent bg-gradient-gov text-white shadow-sm'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }