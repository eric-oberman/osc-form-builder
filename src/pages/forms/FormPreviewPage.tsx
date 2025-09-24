import { motion } from 'framer-motion'

export function FormPreviewPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Form Preview
          </h1>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            Preview your form before publishing
          </p>
        </div>

        <div className="card-gov p-8 text-center">
          <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-4">
            Form Preview Mode
          </h2>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            See how your form will appear to users before going live.
          </p>
        </div>
      </motion.div>
    </div>
  )
}