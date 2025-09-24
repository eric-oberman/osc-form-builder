import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-gov text-white shadow hover:bg-osc-navy-800 focus-visible:ring-osc-navy-600',
        secondary: 'bg-osc-navy-100 text-osc-navy-900 shadow-sm hover:bg-osc-navy-200 focus-visible:ring-osc-navy-500 dark:bg-osc-navy-800 dark:text-osc-navy-100 dark:hover:bg-osc-navy-700',
        outline: 'border border-osc-navy-300 bg-transparent text-osc-navy-900 shadow-sm hover:bg-osc-navy-50 focus-visible:ring-osc-navy-500 dark:border-osc-navy-600 dark:text-osc-navy-100 dark:hover:bg-osc-navy-800',
        ghost: 'text-osc-navy-900 hover:bg-osc-navy-100 focus-visible:ring-osc-navy-500 dark:text-osc-navy-100 dark:hover:bg-osc-navy-800',
        destructive: 'bg-red-600 text-white shadow hover:bg-red-700 focus-visible:ring-red-500',
        success: 'bg-osc-green-600 text-white shadow hover:bg-osc-green-700 focus-visible:ring-osc-green-500',
        warning: 'bg-osc-gold-600 text-white shadow hover:bg-osc-gold-700 focus-visible:ring-osc-gold-500'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }