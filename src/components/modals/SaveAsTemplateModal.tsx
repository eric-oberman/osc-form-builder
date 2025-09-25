import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button, Input, Select, Card } from '@/components/ui'

interface SaveAsTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateName: string, category: string, description?: string) => void
  formTitle?: string
}

const templateCategories = [
  { value: 'basic', label: 'Basic Forms' },
  { value: 'advanced', label: 'Advanced Forms' },
  { value: 'government', label: 'Government Forms' },
  { value: 'custom', label: 'Custom Templates' }
]

export function SaveAsTemplateModal({
  isOpen,
  onClose,
  onSave,
  formTitle = 'Untitled Form'
}: SaveAsTemplateModalProps) {
  const [templateName, setTemplateName] = useState(formTitle + ' Template')
  const [category, setCategory] = useState('custom')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    if (!templateName.trim()) return
    onSave(templateName.trim(), category, description.trim() || undefined)
    // Reset form
    setTemplateName(formTitle + ' Template')
    setCategory('custom')
    setDescription('')
  }

  const handleClose = () => {
    onClose()
    // Reset form
    setTemplateName(formTitle + ' Template')
    setCategory('custom')
    setDescription('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-osc-navy-900 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Card>
          <div className="flex items-center justify-between p-6 border-b border-osc-navy-200 dark:border-osc-navy-700">
            <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100">
              Save as Template
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            <Input
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              required
            />

            <div>
              <label className="text-sm font-medium text-osc-navy-900 dark:text-white mb-2 block">
                Category
              </label>
              <Select
                options={templateCategories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <Input
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              rows={3}
              as="textarea"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-osc-navy-200 dark:border-osc-navy-700">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!templateName.trim()}
              className="bg-osc-navy-900 hover:bg-osc-navy-800 text-white"
            >
              Save Template
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}