import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

import { FormRenderer } from '@/components/forms/FormRenderer'
import { useFormLibraryStore } from '@/stores/formLibraryStore'
import type { Form } from '@/types'

interface PublicFormPageProps {}

export function PublicFormPage({}: PublicFormPageProps) {
  const { id, token } = useParams<{ id: string; token: string }>()
  const [form, setForm] = useState<Form | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { getForms } = useFormLibraryStore()

  useEffect(() => {
    const loadForm = async () => {
      if (!id) {
        setError('Form ID is required')
        setIsLoading(false)
        return
      }

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // In a real app, this would validate the token and fetch from API
        // For now, we'll use the form library store
        const forms = getForms()
        const foundForm = forms.find(f => f.id === id)

        if (!foundForm) {
          setError('Form not found')
          setIsLoading(false)
          return
        }

        // Check if form is published
        if (foundForm.status !== 'published') {
          setError('This form is not currently available')
          setIsLoading(false)
          return
        }

        // For demo purposes, we'll create a mock form with the found form's title
        const mockPublicForm: Form = {
          id: foundForm.id,
          title: foundForm.title,
          description: foundForm.description || 'Complete this form to submit your information.',
          version: 1,
          status: 'published',
          category: foundForm.category || 'general',
          tags: foundForm.tags || [],
          fields: [
            {
              id: 'field-1',
              type: 'text',
              name: 'firstName',
              label: 'First Name',
              placeholder: 'Enter your first name',
              validation: { required: true },
              metadata: {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                order: 0,
                page: 0
              }
            },
            {
              id: 'field-2',
              type: 'text',
              name: 'lastName',
              label: 'Last Name',
              placeholder: 'Enter your last name',
              validation: { required: true },
              metadata: {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                order: 1,
                page: 0
              }
            },
            {
              id: 'field-3',
              type: 'email',
              name: 'email',
              label: 'Email Address',
              placeholder: 'Enter your email address',
              validation: { required: true },
              metadata: {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                order: 2,
                page: 0
              }
            },
            {
              id: 'field-4',
              type: 'select',
              name: 'department',
              label: 'Department',
              placeholder: 'Select your department',
              options: [
                { id: 'opt1', label: 'Information Technology', value: 'it' },
                { id: 'opt2', label: 'Human Resources', value: 'hr' },
                { id: 'opt3', label: 'Finance', value: 'finance' },
                { id: 'opt4', label: 'Legal', value: 'legal' }
              ],
              validation: { required: true },
              metadata: {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                order: 3,
                page: 0
              }
            },
            {
              id: 'field-5',
              type: 'textarea',
              name: 'comments',
              label: 'Additional Comments',
              placeholder: 'Enter any additional comments or information',
              rows: 4,
              validation: { required: false },
              metadata: {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                order: 4,
                page: 0
              }
            }
          ],
          settings: {
            allowMultipleSubmissions: false,
            requireAuthentication: false,
            enableSaveProgress: true,
            showProgressBar: true,
            notifications: {
              sendToCreator: true,
              sendToAdmins: false,
              customRecipients: []
            },
            workflow: {
              requireApproval: false,
              approvers: [],
              autoApprove: true
            },
            accessibility: {
              highContrast: false,
              largeText: false,
              screenReaderOptimized: true
            },
            integration: {
              webhookUrl: '',
              apiEndpoint: '',
              sendToDatabase: true
            }
          },
          sharing: {
            sharingLevel: 'organization',
            allowedUsers: [],
            departmentAccess: [],
            inheritFromCreator: false
          },
          analytics: {
            totalViews: 0,
            uniqueViews: 0,
            submissions: 0,
            completionRate: 0,
            averageCompletionTime: 0,
            dropoffPoints: [],
            conversionFunnel: [],
            responsesByField: {},
            demographics: {
              deviceTypes: {},
              browsers: {},
              locations: {}
            }
          },
          createdBy: 'system',
          updatedBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          metadata: {
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'system',
            submissions_count: 0,
            version: 1
          }
        }

        setForm(mockPublicForm)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load form')
        setIsLoading(false)
      }
    }

    loadForm()
  }, [id, token, getForms])

  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true)

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Form submitted:', {
        formId: id,
        token,
        data: formData,
        timestamp: new Date().toISOString()
      })

      // In a real app, this would:
      // - Validate the submission
      // - Store in database
      // - Send notifications
      // - Update analytics

      setShowSuccess(true)
    } catch (error) {
      console.error('Form submission failed:', error)
      // Handle error (show error message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-osc-blue-600 mx-auto mb-4"></div>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">Loading form...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Form Not Available
          </h2>
          <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-6">
            {error || 'The requested form could not be found.'}
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <LockClosedIcon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                This form may be private, unpublished, or the link may have expired.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-osc-navy-950">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <FormRenderer
          form={form}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          showSuccess={showSuccess}
        />
      </div>
    </div>
  )
}