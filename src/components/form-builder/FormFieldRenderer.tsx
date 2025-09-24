import React from 'react'
import { StarIcon, CalendarDaysIcon, ClockIcon, DocumentArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

import { Input, Textarea, Select, Checkbox, RadioGroup, Button, Badge } from '@/components/ui'
import type { FormField } from '@/types/forms'

interface FormFieldRendererProps {
  field: FormField
  isSelected: boolean
  isPreview: boolean
  value?: any
  onChange?: (value: any) => void
}

export function FormFieldRenderer({ field, isSelected, isPreview, value, onChange }: FormFieldRendererProps) {
  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  const renderField = () => {
    const commonProps = {
      label: field.label,
      helperText: field.description,
      placeholder: field.placeholder,
      required: field.validation?.required,
      disabled: !isPreview
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'tel':
        return (
          <Input
            {...commonProps}
            type={field.type}
            value={value || field.defaultValue || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            min={field.validation?.min}
            max={field.validation?.max}
            value={value || field.defaultValue || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={field.settings?.rows || 4}
            maxLength={field.validation?.maxLength}
            showCount={!!field.validation?.maxLength}
            value={value || field.defaultValue || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )

      case 'select':
        return (
          <Select
            {...commonProps}
            options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            value={value || field.defaultValue || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )

      case 'radio':
        return (
          <RadioGroup
            {...commonProps}
            name={field.name}
            options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            value={value || field.defaultValue || ''}
            onChange={handleChange}
          />
        )

      case 'checkbox':
        return (
          <Checkbox
            {...commonProps}
            checked={value !== undefined ? value : field.defaultValue}
            onChange={(e) => handleChange(e.target.checked)}
          />
        )

      case 'checkboxgroup':
        return (
          <div className="space-y-3">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-2">
              {field.options?.map(option => (
                <Checkbox
                  key={option.id}
                  label={option.label}
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = value || []
                    if (e.target.checked) {
                      handleChange([...currentValues, option.value])
                    } else {
                      handleChange(currentValues.filter((v: any) => v !== option.value))
                    }
                  }}
                />
              ))}
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'date':
        return (
          <div className="space-y-2">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="relative">
              <Input
                type="date"
                value={value || field.defaultValue || ''}
                onChange={(e) => handleChange(e.target.value)}
                className="pl-10"
              />
              <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-osc-navy-400" />
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'time':
        return (
          <div className="space-y-2">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="relative">
              <Input
                type="time"
                value={value || field.defaultValue || ''}
                onChange={(e) => handleChange(e.target.value)}
                className="pl-10"
              />
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-osc-navy-400" />
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'datetime-local':
        return (
          <Input
            {...commonProps}
            type="datetime-local"
            value={value || field.defaultValue || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        )

      case 'file':
        return (
          <div className="space-y-2">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="border-2 border-dashed border-osc-navy-300 dark:border-osc-navy-600 rounded-lg p-6 text-center hover:border-osc-navy-400 dark:hover:border-osc-navy-500 transition-colors">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-osc-navy-400 mb-4" />
              <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                <Button variant="secondary" size="sm" className="mb-2">
                  Choose File
                </Button>
                <p>or drag and drop</p>
              </div>
              {field.settings?.accept && (
                <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 mt-2">
                  Accepted formats: {field.settings.accept}
                </p>
              )}
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'image':
        return (
          <div className="space-y-2">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="border-2 border-dashed border-osc-navy-300 dark:border-osc-navy-600 rounded-lg p-6 text-center hover:border-osc-navy-400 dark:hover:border-osc-navy-500 transition-colors">
              <PhotoIcon className="mx-auto h-12 w-12 text-osc-navy-400 mb-4" />
              <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                <Button variant="secondary" size="sm" className="mb-2">
                  Upload Image
                </Button>
                <p>or drag and drop</p>
                <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'rating':
        const maxRating = field.settings?.max || 5
        const currentRating = value || field.defaultValue || 0

        return (
          <div className="space-y-2">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="flex items-center space-x-1">
              {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1
                const isFilled = starValue <= currentRating
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleChange(starValue)}
                    className="focus:outline-none focus:ring-2 focus:ring-osc-blue-500 rounded"
                    disabled={!isPreview}
                  >
                    {isFilled ? (
                      <StarSolid className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                )
              })}
              {currentRating > 0 && (
                <span className="ml-2 text-sm text-osc-navy-600 dark:text-osc-navy-400">
                  {currentRating} / {maxRating}
                </span>
              )}
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'slider':
        const min = field.settings?.min || 0
        const max = field.settings?.max || 100
        const step = field.settings?.step || 1

        return (
          <div className="space-y-2">
            {commonProps.label && (
              <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {commonProps.label}
                {commonProps.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-3">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value || field.defaultValue || min}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={!isPreview}
              />
              <div className="flex justify-between text-sm text-osc-navy-500 dark:text-osc-navy-400">
                <span>{min}</span>
                <span className="font-medium text-osc-navy-700 dark:text-osc-navy-300">
                  {value || field.defaultValue || min}
                </span>
                <span>{max}</span>
              </div>
            </div>
            {commonProps.helperText && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                {commonProps.helperText}
              </p>
            )}
          </div>
        )

      case 'section':
        return (
          <div className="border-b border-osc-navy-200 dark:border-osc-navy-700 pb-4 mb-6">
            <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
              {field.settings?.section_title || field.label}
            </h3>
            {field.description && (
              <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400 mt-1">
                {field.description}
              </p>
            )}
          </div>
        )

      case 'divider':
        return (
          <div className="my-6">
            <hr className="border-osc-navy-200 dark:border-osc-navy-700" />
          </div>
        )

      case 'html':
        return (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: field.settings?.html_content || field.label }}
          />
        )

      default:
        return (
          <div className="p-4 border border-dashed border-osc-navy-300 dark:border-osc-navy-600 rounded-lg text-center">
            <Badge variant="outline" className="mb-2">
              {field.type}
            </Badge>
            <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
              {field.label}
            </p>
            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 mt-1">
              Field type not yet implemented
            </p>
          </div>
        )
    }
  }

  return (
    <div className={`${isSelected ? 'ring-2 ring-osc-blue-500 ring-offset-2 rounded-lg p-2' : ''}`}>
      {renderField()}
    </div>
  )
}