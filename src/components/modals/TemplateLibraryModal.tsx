import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'

import { Button, Input, Card, Badge } from '@/components/ui'
import { useFormLibraryStore } from '@/stores/formLibraryStore'
import { useFormBuilderStore } from '@/stores/formBuilderStore'

interface TemplateLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onLoadTemplate: (templateId: string) => void
}

export function TemplateLibraryModal({
  isOpen,
  onClose,
  onLoadTemplate
}: TemplateLibraryModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { getTemplates } = useFormLibraryStore()
  const { clearForm, updateFormSettings } = useFormBuilderStore()

  const templates = getTemplates()

  if (!isOpen) return null

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.templateCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'basic', label: 'Basic Forms' },
    { value: 'advanced', label: 'Advanced Forms' },
    { value: 'government', label: 'Government Forms' },
    { value: 'custom', label: 'Custom Templates' }
  ]

  const handleLoadTemplate = (templateId: string) => {
    try {
      const { loadFromTemplate } = useFormLibraryStore.getState()
      const newForm = loadFromTemplate(templateId)

      // Clear current form and load the template
      clearForm()
      setTimeout(() => {
        updateFormSettings(newForm)
        onLoadTemplate(templateId)
        onClose()
      }, 0)
    } catch (error) {
      console.error('Failed to load template:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-osc-navy-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-osc-navy-200 dark:border-osc-navy-700">
          <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100">
            Template Library
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="overflow-y-auto max-h-96">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-12 h-12 mx-auto text-osc-navy-400 mb-4" />
                <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                  No templates found
                </h3>
                <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Save your first template to get started'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-osc-navy-900 dark:text-osc-navy-100 group-hover:text-osc-blue-600">
                            {template.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {template.templateCategory}
                          </Badge>
                        </div>

                        {template.description && (
                          <p className="text-sm text-osc-navy-600 dark:text-osc-navy-300 mb-3 line-clamp-2">
                            {template.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-osc-navy-500 dark:text-osc-navy-400 mb-4">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(template.metadata.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TagIcon className="w-4 h-4" />
                            <span>{template.fields.length} fields</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleLoadTemplate(template.id)}
                          className="w-full"
                          size="sm"
                        >
                          Load Template
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-osc-navy-200 dark:border-osc-navy-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}