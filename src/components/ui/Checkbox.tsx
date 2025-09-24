import React from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-osc-navy-300 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-osc-navy-900 data-[state=checked]:text-white dark:border-osc-navy-600 dark:data-[state=checked]:bg-osc-navy-100 dark:data-[state=checked]:text-osc-navy-900',
  {
    variants: {
      variant: {
        default: 'focus-visible:ring-osc-navy-600',
        error: 'border-red-300 focus-visible:ring-red-500',
        success: 'border-osc-green-300 focus-visible:ring-osc-green-500'
      },
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    variant,
    size,
    label,
    helperText,
    errorMessage,
    id,
    checked,
    ...props
  }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!errorMessage
    const finalVariant = hasError ? 'error' : variant

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              id={checkboxId}
              className={cn(
                checkboxVariants({ variant: finalVariant, size, className }),
                'sr-only'
              )}
              ref={ref}
              checked={checked}
              {...props}
            />

            <div
              className={cn(
                checkboxVariants({ variant: finalVariant, size }),
                'cursor-pointer transition-colors',
                checked
                  ? 'bg-osc-navy-900 border-osc-navy-900 dark:bg-osc-navy-100 dark:border-osc-navy-100'
                  : 'bg-white dark:bg-osc-navy-800'
              )}
              onClick={() => {
                const input = document.getElementById(checkboxId) as HTMLInputElement
                input?.click()
              }}
            >
              {checked && (
                <CheckIcon
                  className={cn(
                    'text-white dark:text-osc-navy-900',
                    size === 'sm' && 'h-2.5 w-2.5',
                    size === 'default' && 'h-3 w-3',
                    size === 'lg' && 'h-3.5 w-3.5'
                  )}
                />
              )}
            </div>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-600 dark:text-red-400 ml-7">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400 ml-7">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkboxVariants }