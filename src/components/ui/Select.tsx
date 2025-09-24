import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const selectVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-osc-navy-800 dark:text-osc-navy-100',
  {
    variants: {
      variant: {
        default: 'border-osc-navy-200 focus:ring-osc-navy-600 dark:border-osc-navy-700',
        error: 'border-red-300 focus:ring-red-500',
        success: 'border-osc-green-300 focus:ring-osc-green-500'
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10',
        lg: 'h-12 px-4 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    variant,
    size,
    label,
    helperText,
    errorMessage,
    options,
    placeholder,
    id,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!errorMessage
    const finalVariant = hasError ? 'error' : variant

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            className={cn(
              selectVariants({ variant: finalVariant, size, className }),
              'appearance-none bg-transparent pr-8'
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-osc-navy-400 pointer-events-none" />
        </div>

        {errorMessage ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select, selectVariants }