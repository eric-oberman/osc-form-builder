import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-osc-navy-50 via-white to-osc-blue-50 dark:from-osc-navy-950 dark:via-osc-navy-900 dark:to-osc-navy-800">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-gov opacity-95"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">OSC</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Electronic Form Builder</h1>
                  <p className="text-white">New York State Office of State Comptroller</p>
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Government-Grade Form Creation Platform
              </h2>

              <p className="text-xl text-white mb-8 leading-relaxed">
                Build, manage, and deploy secure electronic forms with advanced analytics,
                AI-powered optimization, and seamless integration capabilities.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <span className="text-white">WCAG 2.1 AA Accessibility Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <span className="text-white">Advanced Security & Data Protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <span className="text-white">AI-Powered Smart Suggestions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <span className="text-white">Real-time Analytics & Reporting</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/4 -left-12 h-24 w-24 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 h-16 w-16 bg-white/10 rounded-full"></div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile header for branding */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-osc-navy-900/95 backdrop-blur-sm border-b border-osc-navy-200 dark:border-osc-navy-800">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-gov rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OSC</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                Form Builder
              </h1>
              <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                New York State Comptroller
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}