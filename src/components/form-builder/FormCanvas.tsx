import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/outline'

import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { FormFieldRenderer } from './FormFieldRenderer'
import { EmptyState } from './EmptyState'
import type { FormFieldType } from '@/types/forms'

export function FormCanvas() {
  const {
    currentForm,
    activePage,
    selectedField,
    previewMode,
    zoom,
    addField,
    selectField,
    moveField
  } = useFormBuilderStore()

  const [dragOver, setDragOver] = React.useState<number | null>(null)
  const canvasRef = React.useRef<HTMLDivElement>(null)

  // Get fields for current page
  const currentPageFields = React.useMemo(() => {
    if (!currentForm?.fields || !currentForm?.pages?.[activePage]) {
      return []
    }

    const pageFieldIds = currentForm.pages[activePage].fields
    return currentForm.fields
      .filter(field => pageFieldIds.includes(field.id))
      .sort((a, b) => a.metadata.order - b.metadata.order)
  }, [currentForm, activePage])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const y = e.clientY - rect.top

      // Calculate drop position based on mouse position
      const fieldElements = canvasRef.current.querySelectorAll('[data-field-id]')
      let insertIndex = currentPageFields.length

      for (let i = 0; i < fieldElements.length; i++) {
        const fieldRect = fieldElements[i].getBoundingClientRect()
        const fieldY = fieldRect.top + fieldRect.height / 2 - rect.top

        if (y < fieldY) {
          insertIndex = i
          break
        }
      }

      setDragOver(insertIndex)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(null)

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.fieldType) {
        const insertPosition = dragOver !== null ? dragOver : currentPageFields.length
        addField(data.fieldType as FormFieldType, insertPosition)
      } else if (data.fieldId) {
        // Handle reordering existing field
        const newPosition = dragOver !== null ? dragOver : currentPageFields.length
        moveField(data.fieldId, newPosition)
      }
    } catch (error) {
      console.error('Invalid drag data:', error)
    }
  }

  const handleFieldClick = (fieldId: string, e: React.MouseEvent) => {
    if (!previewMode) {
      e.stopPropagation()
      selectField(fieldId)
    }
  }

  const handleCanvasClick = () => {
    if (!previewMode) {
      selectField(null)
    }
  }

  if (!currentForm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-osc-navy-950">
        <div className="text-center text-osc-navy-500 dark:text-osc-navy-400">
          No form loaded
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-osc-navy-950">
      {/* Canvas Header */}
      <div className="bg-white dark:bg-osc-navy-900 border-b border-osc-navy-200 dark:border-osc-navy-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
              {currentForm.title}
            </h2>
            {currentForm.description && (
              <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400 mt-1">
                {currentForm.description}
              </p>
            )}
          </div>

          {/* Page Navigation */}
          {currentForm.pages && currentForm.pages.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                Page {activePage + 1} of {currentForm.pages.length}
              </span>
              <div className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">
                {currentForm.pages[activePage]?.title}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div
            ref={canvasRef}
            className="bg-white dark:bg-osc-navy-900 rounded-xl shadow-sm border border-osc-navy-200 dark:border-osc-navy-700 min-h-[600px] relative"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            {currentPageFields.length === 0 ? (
              <EmptyState onAddField={addField} />
            ) : (
              <div className="p-8 space-y-6">
                <AnimatePresence>
                  {currentPageFields.map((field, index) => (
                    <React.Fragment key={field.id}>
                      {/* Drop Zone Indicator */}
                      {dragOver === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 4 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-osc-blue-500 rounded-full mx-4"
                        />
                      )}

                      {/* Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        data-field-id={field.id}
                        className={`group relative ${
                          !previewMode ? 'cursor-pointer' : ''
                        } ${
                          selectedField === field.id && !previewMode
                            ? 'ring-2 ring-osc-blue-500 ring-offset-2 rounded-lg'
                            : ''
                        }`}
                        onClick={(e) => handleFieldClick(field.id, e)}
                      >
                        <FormFieldRenderer
                          field={field}
                          isSelected={selectedField === field.id}
                          isPreview={previewMode}
                        />

                        {/* Field Actions (Builder Mode Only) */}
                        {!previewMode && (
                          <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Handle duplicate
                                }}
                                className="p-1 bg-white dark:bg-osc-navy-800 border border-osc-navy-200 dark:border-osc-navy-700 rounded shadow-sm hover:shadow-md transition-shadow"
                                title="Duplicate Field"
                              >
                                <PlusIcon className="w-4 h-4 text-osc-navy-600 dark:text-osc-navy-400" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </React.Fragment>
                  ))}

                  {/* Final Drop Zone */}
                  {dragOver === currentPageFields.length && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 4 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-osc-blue-500 rounded-full mx-4"
                    />
                  )}
                </AnimatePresence>

                {/* Add Field Button */}
                {!previewMode && currentPageFields.length > 0 && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => addField('text')}
                      className="inline-flex items-center px-4 py-2 border border-dashed border-osc-navy-300 dark:border-osc-navy-600 rounded-lg text-sm text-osc-navy-600 dark:text-osc-navy-400 hover:border-osc-navy-400 dark:hover:border-osc-navy-500 hover:text-osc-navy-700 dark:hover:text-osc-navy-300 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Field
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Canvas Overlay for Drag State */}
            {dragOver !== null && (
              <div className="absolute inset-0 bg-osc-blue-50 dark:bg-osc-blue-950 bg-opacity-50 pointer-events-none border-2 border-dashed border-osc-blue-300 dark:border-osc-blue-600 rounded-xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}