import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white dark:bg-osc-navy-950 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-osc-navy-200 border-t-gov-secondary rounded-full animate-spin mx-auto`} />
        {message && (
          <p className="mt-3 text-sm text-osc-navy-600 dark:text-osc-navy-400">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}