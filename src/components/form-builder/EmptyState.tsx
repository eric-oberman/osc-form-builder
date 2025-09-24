import React from 'react'
import { motion } from 'framer-motion'
import { PlusCircleIcon, DocumentTextIcon, ListBulletIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

import type { FormFieldType } from '@/types/forms'

interface EmptyStateProps {
  onAddField: (fieldType: FormFieldType) => void
}

export function EmptyState({ onAddField }: EmptyStateProps) {
  const quickFields = [
    { type: 'text' as FormFieldType, label: 'Text Input', icon: DocumentTextIcon },
    { type: 'email' as FormFieldType, label: 'Email', icon: DocumentTextIcon },
    { type: 'select' as FormFieldType, label: 'Dropdown', icon: ListBulletIcon },
    { type: 'date' as FormFieldType, label: 'Date', icon: CalendarDaysIcon }
  ]

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-osc-navy-100 dark:bg-osc-navy-800 rounded-full flex items-center justify-center">
          <PlusCircleIcon className="w-10 h-10 text-osc-navy-600 dark:text-osc-navy-400" />
        </div>

        <h3 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
          Start Building Your Form
        </h3>

        <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-8">
          Drag fields from the palette or click on a quick field below to get started.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {quickFields.map(field => {
            const IconComponent = field.icon
            return (
              <motion.button
                key={field.type}
                onClick={() => onAddField(field.type)}
                className="p-4 border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg hover:border-osc-navy-300 dark:hover:border-osc-navy-600 hover:bg-osc-navy-25 dark:hover:bg-osc-navy-800 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent className="w-6 h-6 text-osc-navy-600 dark:text-osc-navy-400 mx-auto mb-2 group-hover:text-osc-navy-700 dark:group-hover:text-osc-navy-300" />
                <div className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 group-hover:text-osc-navy-800 dark:group-hover:text-osc-navy-200">
                  {field.label}
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-osc-navy-200 dark:border-osc-navy-700">
          <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
            Pro tip: You can also drag and drop fields from the left panel
          </p>
        </div>
      </motion.div>
    </div>
  )
}