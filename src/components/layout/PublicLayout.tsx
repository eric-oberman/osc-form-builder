import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950">
      {/* Header */}
      <header className="bg-white dark:bg-osc-navy-900 border-b border-osc-navy-200 dark:border-osc-navy-800 shadow-gov-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-gov rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">OSC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  Electronic Form Builder
                </h1>
                <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                  New York State Office of State Comptroller
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="https://www.osc.state.ny.us"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-osc-navy-600 hover:text-osc-navy-900 dark:text-osc-navy-400 dark:hover:text-osc-navy-200 transition-colors duration-200"
              >
                Visit OSC.ny.gov
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-osc-navy-900 border-t border-osc-navy-200 dark:border-osc-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-gov rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OSC</span>
                </div>
                <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                  OSC Form Builder
                </h3>
              </div>
              <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-4 max-w-md">
                Government-grade electronic form creation and management platform designed
                for the New York State Office of State Comptroller.
              </p>
              <div className="flex space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-osc-green-100 text-osc-green-800 dark:bg-osc-green-900 dark:text-osc-green-200">
                  WCAG 2.1 AA
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-osc-blue-100 text-osc-blue-800 dark:bg-osc-blue-900 dark:text-osc-blue-200">
                  Government Grade
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-osc-navy-900 dark:text-osc-navy-100 uppercase tracking-wide mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-osc-navy-600 hover:text-osc-navy-900 dark:text-osc-navy-400 dark:hover:text-osc-navy-200 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-osc-navy-600 hover:text-osc-navy-900 dark:text-osc-navy-400 dark:hover:text-osc-navy-200 transition-colors duration-200"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-osc-navy-600 hover:text-osc-navy-900 dark:text-osc-navy-400 dark:hover:text-osc-navy-200 transition-colors duration-200"
                  >
                    Support Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-osc-navy-900 dark:text-osc-navy-100 uppercase tracking-wide mb-4">
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:forms@osc.ny.gov"
                    className="text-osc-navy-600 hover:text-osc-navy-900 dark:text-osc-navy-400 dark:hover:text-osc-navy-200 transition-colors duration-200"
                  >
                    forms@osc.ny.gov
                  </a>
                </li>
                <li>
                  <span className="text-osc-navy-600 dark:text-osc-navy-400">
                    (518) 474-4044
                  </span>
                </li>
                <li>
                  <span className="text-osc-navy-600 dark:text-osc-navy-400">
                    110 State Street<br />
                    Albany, NY 12236
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-osc-navy-200 dark:border-osc-navy-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-osc-navy-500 dark:text-osc-navy-400 text-sm">
                © 2024 New York State Office of State Comptroller. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-osc-navy-500 hover:text-osc-navy-600 dark:text-osc-navy-400 dark:hover:text-osc-navy-300 text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-osc-navy-500 hover:text-osc-navy-600 dark:text-osc-navy-400 dark:hover:text-osc-navy-300 text-sm transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-osc-navy-500 hover:text-osc-navy-600 dark:text-osc-navy-400 dark:hover:text-osc-navy-300 text-sm transition-colors duration-200"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}