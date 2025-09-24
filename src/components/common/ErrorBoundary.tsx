import React, { Component, ReactNode } from 'react'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-osc-navy-900 rounded-lg shadow-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <h1 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                Something went wrong
              </h1>

              <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-6">
                The application encountered an unexpected error. This has been logged for investigation.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Development Error Details:
                  </h3>
                  <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gov-secondary text-white rounded-md hover:bg-gov-secondary/90 transition-colors duration-200"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </button>

                <button
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center px-4 py-2 bg-osc-navy-100 dark:bg-osc-navy-800 text-osc-navy-900 dark:text-osc-navy-100 rounded-md hover:bg-osc-navy-200 dark:hover:bg-osc-navy-700 transition-colors duration-200"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Reload Page
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center px-4 py-2 text-osc-navy-600 dark:text-osc-navy-400 hover:text-osc-navy-900 dark:hover:text-osc-navy-100 transition-colors duration-200"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Go to Home
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-osc-navy-200 dark:border-osc-navy-700">
                <p className="text-xs text-osc-navy-500 dark:text-osc-navy-500">
                  OSC Form Builder v1.0.0
                  <br />
                  If this problem persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    console.error('Error captured by useErrorBoundary:', error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}