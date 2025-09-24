import { motion } from 'framer-motion'

export function UserManagementPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            User Management
          </h1>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            Manage user accounts and permissions
          </p>
        </div>

        <div className="card-gov p-8 text-center">
          <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-4">
            User Administration
          </h2>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            Add, edit, and manage user accounts and their permissions.
          </p>
        </div>
      </motion.div>
    </div>
  )
}