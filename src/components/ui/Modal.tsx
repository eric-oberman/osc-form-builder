import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Button } from './Button'

const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center p-4',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full m-4'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

const modalContentVariants = cva(
  'relative bg-white dark:bg-osc-navy-900 rounded-xl shadow-xl border border-osc-navy-200 dark:border-osc-navy-700 w-full max-h-[90vh] overflow-hidden flex flex-col',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

export interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size,
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={modalVariants({ size })}>
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div className={modalContentVariants({ size })}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-osc-navy-200 dark:border-osc-navy-700">
            {title && (
              <h2 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

const ModalHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
)

const ModalTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn('text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100', className)}>
    {children}
  </h3>
)

const ModalDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={cn('text-sm text-osc-navy-600 dark:text-osc-navy-400', className)}>
    {children}
  </p>
)

const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('flex justify-end space-x-3 pt-4 border-t border-osc-navy-200 dark:border-osc-navy-700', className)}>
    {children}
  </div>
)

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter }