import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

import { FormRenderer } from '@/components/forms/FormRenderer'
import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { Button } from '@/components/ui'
import type { Form } from '@/types'

export function FormPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const [previewForm, setPreviewForm] = useState<Form | null>(null)
  const { currentForm, loadForm } = useFormBuilderStore()

  useEffect(() => {
    if (id && id !== 'new') {
      // If we don't have the form loaded, load it
      if (!currentForm || currentForm.id !== id) {
        loadForm(id)
      } else {
        setPreviewForm(currentForm)
      }
    }
  }, [id, currentForm, loadForm])

  useEffect(() => {
    if (currentForm && currentForm.id === id) {
      setPreviewForm(currentForm)
    }
  }, [currentForm, id])

  const handlePreviewSubmit = (data: Record<string, any>) => {
    // Just log the data in preview mode
    console.log('Preview form submission:', data)
    alert('This is a preview - form data would be submitted in the live version.')
  }

  if (!previewForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8 text-center"
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Form Not Found
          </h2>
          <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-6">
            The form you're trying to preview could not be found.
          </p>
          <Link to="/forms">
            <Button variant="outline">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Forms
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950">
      {/* Header */}
      <div className="bg-white dark:bg-osc-navy-900 border-b border-osc-navy-200 dark:border-osc-navy-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link to={`/forms/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
              Preview Mode
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full text-xs font-medium text-blue-800 dark:text-blue-200">
            This is a preview - submissions won't be saved
          </div>
        </div>
      </div>

      {/* Form Preview */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <FormRenderer
          form={previewForm}
          onSubmit={handlePreviewSubmit}
          isSubmitting={false}
          showSuccess={false}
        />
      </div>
    </div>
  )
}