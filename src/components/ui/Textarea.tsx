import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const textareaVariants = cva(
  'flex w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-osc-navy-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y dark:bg-osc-navy-800 dark:text-osc-navy-100',
  {
    variants: {
      variant: {
        default: 'border-osc-navy-200 focus-visible:ring-osc-navy-600 dark:border-osc-navy-700',
        error: 'border-red-300 focus-visible:ring-red-500',
        success: 'border-osc-green-300 focus-visible:ring-osc-green-500'
      },
      size: {
        sm: 'min-h-[60px] px-2 py-1 text-xs',
        default: 'min-h-[80px]',
        lg: 'min-h-[120px] px-4 py-3 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  maxLength?: number
  showCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant,
    size,
    label,
    helperText,
    errorMessage,
    maxLength,
    showCount,
    value,
    id,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!errorMessage
    const finalVariant = hasError ? 'error' : variant

    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          className={cn(textareaVariants({ variant: finalVariant, size, className }))}
          maxLength={maxLength}
          value={value}
          ref={ref}
          {...props}
        />

        <div className="flex justify-between items-start">
          <div className="flex-1">
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

          {(showCount || maxLength) && (
            <p className="text-xs text-osc-navy-400 dark:text-osc-navy-500 ml-2 flex-shrink-0">
              {showCount && currentLength}
              {maxLength && (
                <>
                  {showCount ? ' / ' : ''}
                  {maxLength}
                </>
              )}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }