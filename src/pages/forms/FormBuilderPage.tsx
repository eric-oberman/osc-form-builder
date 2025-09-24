import React from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import {
  EyeIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline'

import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { Button } from '@/components/ui'
import { FieldPalette } from '@/components/form-builder/FieldPalette'
import { FormCanvas } from '@/components/form-builder/FormCanvas'
import { PropertyPanel } from '@/components/form-builder/PropertyPanel'

export function FormBuilderPage() {
  const { id } = useParams()
  const {
    currentForm,
    previewMode,
    zoom,
    isDirty,
    isLoading,
    createForm,
    loadForm,
    saveForm,
    togglePreview,
    setZoom
  } = useFormBuilderStore()

  React.useEffect(() => {
    if (id && id !== 'new') {
      loadForm(id)
    } else if (id === 'new' || !currentForm) {
      createForm('Untitled Form', 'New form description')
    }
  }, [id, loadForm, createForm, currentForm])

  const handleSave = async () => {
    await saveForm()
  }

  const handleZoomChange = (delta: number) => {
    setZoom(zoom + delta)
  }

  if (!currentForm && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            No Form Found
          </h2>
          <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-4">
            The requested form could not be found.
          </p>
          <Button onClick={() => createForm('New Form', 'Form description')}>
            Create New Form
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-osc-navy-950">
      {/* Toolbar */}
      <div className="bg-white dark:bg-osc-navy-900 border-b border-osc-navy-200 dark:border-osc-navy-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                {currentForm?.title || 'Loading...'}
              </h1>
              {isDirty && (
                <span className="text-xs px-2 py-1 bg-osc-gold-100 text-osc-gold-800 dark:bg-osc-gold-900 dark:text-osc-gold-200 rounded-full">
                  Unsaved
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoomChange(-0.1)}
                disabled={zoom <= 0.5}
              >
                <MagnifyingGlassMinusIcon className="w-4 h-4" />
              </Button>
              <span className="text-sm text-osc-navy-600 dark:text-osc-navy-400 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoomChange(0.1)}
                disabled={zoom >= 2}
              >
                <MagnifyingGlassPlusIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-osc-navy-200 dark:bg-osc-navy-700" />

            {/* Form Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreview}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              loading={isLoading}
              disabled={!isDirty}
            >
              Save Form
            </Button>

            <Button size="sm" className="bg-osc-navy-900 hover:bg-osc-navy-800 text-white">
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Field Palette */}
        {!previewMode && <FieldPalette />}

        {/* Center - Form Canvas */}
        <FormCanvas />

        {/* Right Panel - Properties */}
        {!previewMode && <PropertyPanel />}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-osc-navy-900 rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-osc-blue-600"></div>
              <span className="text-osc-navy-900 dark:text-osc-navy-100">
                Loading form...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}