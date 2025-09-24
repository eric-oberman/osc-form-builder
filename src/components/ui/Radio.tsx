import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const radioVariants = cva(
  'aspect-square h-4 w-4 rounded-full border border-osc-navy-300 text-osc-navy-900 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-osc-navy-600 dark:text-osc-navy-100',
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

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof radioVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  options: RadioOption[]
  name: string
  value?: string
  onChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({
    className,
    variant,
    size,
    label,
    helperText,
    errorMessage,
    options,
    name,
    value,
    onChange,
    ...props
  }, ref) => {
    const hasError = !!errorMessage
    const finalVariant = hasError ? 'error' : variant

    return (
      <div className="space-y-3">
        {label && (
          <fieldset>
            <legend className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
              {label}
            </legend>
          </fieldset>
        )}

        <div className="space-y-2">
          {options.map((option, index) => {
            const radioId = `${name}-${option.value}`
            const isChecked = value === option.value

            return (
              <div key={option.value} className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <input
                    ref={index === 0 ? ref : undefined}
                    type="radio"
                    id={radioId}
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    disabled={option.disabled}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={cn(radioVariants({ variant: finalVariant, size, className }), 'sr-only')}
                    {...props}
                  />

                  <div
                    className={cn(
                      radioVariants({ variant: finalVariant, size }),
                      'cursor-pointer transition-colors bg-white dark:bg-osc-navy-800',
                      isChecked && 'border-osc-navy-900 dark:border-osc-navy-100',
                      option.disabled && 'cursor-not-allowed opacity-50'
                    )}
                    onClick={() => {
                      if (!option.disabled) {
                        const input = document.getElementById(radioId) as HTMLInputElement
                        input?.click()
                      }
                    }}
                  >
                    {isChecked && (
                      <div
                        className={cn(
                          'rounded-full bg-osc-navy-900 dark:bg-osc-navy-100',
                          size === 'sm' && 'h-1.5 w-1.5',
                          size === 'default' && 'h-2 w-2',
                          size === 'lg' && 'h-2.5 w-2.5'
                        )}
                      />
                    )}
                  </div>
                </div>

                <label
                  htmlFor={radioId}
                  className={cn(
                    'text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 cursor-pointer',
                    option.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {option.label}
                </label>
              </div>
            )
          })}
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

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup, radioVariants }