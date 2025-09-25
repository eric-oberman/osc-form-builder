import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

import { Button, Input, Textarea, Select, Checkbox } from '@/components/ui'
import type { Form, FormField } from '@/types'

interface FormRendererProps {
  form: Form
  onSubmit?: (data: Record<string, any>) => void
  isSubmitting?: boolean
  showSuccess?: boolean
  className?: string
}

interface FormData {
  [fieldName: string]: any
}

interface FormErrors {
  [fieldName: string]: string
}

export function FormRenderer({
  form,
  onSubmit,
  isSubmitting = false,
  showSuccess = false,
  className = ''
}: FormRendererProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [currentPage, setCurrentPage] = useState(0)

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const validateField = (field: FormField, value: any): string => {
    if (field.validation?.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    if (field.validation?.minLength && value && value.length < field.validation.minLength) {
      return `${field.label} must be at least ${field.validation.minLength} characters`
    }

    if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
      return `${field.label} must not exceed ${field.validation.maxLength} characters`
    }

    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let hasErrors = false

    form.fields.forEach(field => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit?.(formData)
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            key={field.id}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.validation?.required}
            errorMessage={error}
            className="mb-4"
          />
        )

      case 'textarea':
        return (
          <div key={field.id} className="mb-4">
            <Textarea
              label={field.label}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.validation?.required}
              rows={field.rows || 3}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="mb-4">
            <Select
              label={field.label}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.validation?.required}
              options={[
                ...(field.placeholder ? [{ value: '', label: field.placeholder }] : []),
                ...(field.options?.map(opt => ({ value: opt.value, label: opt.label })) || [])
              ]}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )

      case 'radio':
        return (
          <div key={field.id} className="mb-4">
            <fieldset>
              <legend className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-2">
                {field.label}
                {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
              </legend>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={value === option.value}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-4 h-4 text-osc-blue-600 border-gray-300 focus:ring-osc-blue-500"
                    />
                    <span className="text-sm text-osc-navy-700 dark:text-osc-navy-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="mb-4">
            <Checkbox
              label={field.label}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )

      case 'checkboxgroup':
        return (
          <div key={field.id} className="mb-4">
            <fieldset>
              <legend className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-2">
                {field.label}
                {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
              </legend>
              <div className="space-y-2">
                {field.options?.map((option) => {
                  const selectedValues = Array.isArray(value) ? value : []
                  return (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedValues.includes(option.value)}
                        onChange={(e) => {
                          const newValues = e.target.checked
                            ? [...selectedValues, option.value]
                            : selectedValues.filter(v => v !== option.value)
                          handleFieldChange(field.name, newValues)
                        }}
                        className="w-4 h-4 text-osc-blue-600 border-gray-300 rounded focus:ring-osc-blue-500"
                      />
                      <span className="text-sm text-osc-navy-700 dark:text-osc-navy-300">
                        {option.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )

      case 'number':
        return (
          <Input
            key={field.id}
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.validation?.required}
            errorMessage={error}
            className="mb-4"
          />
        )

      case 'date':
        return (
          <Input
            key={field.id}
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.validation?.required}
            errorMessage={error}
            className="mb-4"
          />
        )

      case 'file':
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-2">
              {field.label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              onChange={(e) => handleFieldChange(field.name, e.target.files?.[0] || null)}
              className="block w-full text-sm text-osc-navy-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-osc-blue-50 file:text-osc-blue-700 hover:file:bg-osc-blue-100"
              accept={field.accept}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-2xl mx-auto p-8 ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Thank you for your submission!
          </h2>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            Your response has been successfully recorded.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-2xl mx-auto ${className}`}
    >
      {/* Form Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
          {form.title}
        </h1>
        {form.description && (
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            {form.description}
          </p>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-osc-navy-900 rounded-lg shadow-sm border border-osc-navy-200 dark:border-osc-navy-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {form.fields.map(renderField)}

          {/* Submit Button */}
          <div className="pt-4 border-t border-osc-navy-200 dark:border-osc-navy-700">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-osc-blue-600 hover:bg-osc-blue-700"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Submit Form
            </Button>
          </div>
        </form>
      </div>

      {/* Form Footer */}
      <div className="mt-6 text-center text-xs text-osc-navy-500 dark:text-osc-navy-400">
        Powered by OSC Form Builder
      </div>
    </motion.div>
  )
}