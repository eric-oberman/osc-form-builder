import React from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
  EyeIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  FolderPlusIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline'

import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { Button } from '@/components/ui'
import { FieldPalette } from '@/components/form-builder/FieldPalette'
import { FormCanvas } from '@/components/form-builder/FormCanvas'
import { PropertyPanel } from '@/components/form-builder/PropertyPanel'
import { FormSharingSettings } from '@/components/form-builder/FormSharingSettings'
import { PublishFormModal, type PublishOptions } from '@/components/modals/PublishFormModal'
import { SaveAsTemplateModal } from '@/components/modals/SaveAsTemplateModal'
import { TemplateLibraryModal } from '@/components/modals/TemplateLibraryModal'

export function FormBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showFormSettings, setShowFormSettings] = React.useState(false)
  const [showPublishModal, setShowPublishModal] = React.useState(false)
  const [showSaveAsTemplateModal, setShowSaveAsTemplateModal] = React.useState(false)
  const [showTemplateLibraryModal, setShowTemplateLibraryModal] = React.useState(false)
  const {
    currentForm,
    previewMode,
    zoom,
    isDirty,
    isLoading,
    createForm,
    loadForm,
    saveForm,
    saveAsTemplate,
    togglePreview,
    setZoom,
    updateFormSettings,
    clearForm
  } = useFormBuilderStore()

  React.useEffect(() => {
    console.log('🔄 FormBuilderPage useEffect - id:', id, 'currentForm:', currentForm?.id)

    if (id && id !== 'new') {
      // Loading existing form - only load if we don't have a form or if the form ID doesn't match
      if (!currentForm || currentForm.id !== id) {
        console.log('📋 Loading form:', id)
        loadForm(id)
      } else {
        console.log('✅ Form already loaded:', currentForm.id)
      }
    } else if (id === 'new') {
      // Creating new form - clear any existing form first, then create new one
      if (!currentForm || currentForm.id !== 'new-temp-id') {
        console.log('🆕 Creating new form')
        clearForm()
        // Use setTimeout to ensure clearForm completes before creating new form
        setTimeout(() => {
          createForm('Untitled Form', 'New form description')
        }, 0)
      } else {
        console.log('✅ New form already created')
      }
    }
  }, [id, currentForm, loadForm, createForm, clearForm])

  const handleSave = async () => {
    await saveForm()
  }

  const handleZoomChange = (delta: number) => {
    setZoom(zoom + delta)
  }

  const handleNewForm = () => {
    // Check if there are unsaved changes
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to start a new form? Your changes will be lost.'
      )
      if (!confirmed) return
    }

    // Clear current form and create new one
    clearForm()
    setTimeout(() => {
      createForm('Untitled Form', 'New form description')
      navigate('/forms/new')
    }, 0)
  }

  const handleSaveAsTemplate = async (templateName: string, category: string, description?: string) => {
    if (!currentForm) return

    try {
      await saveAsTemplate(templateName, category, description)
      setShowSaveAsTemplateModal(false)
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  const handleLoadTemplate = () => {
    // Check if there are unsaved changes
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to load a template? Your changes will be lost.'
      )
      if (!confirmed) return
    }

    setShowTemplateLibraryModal(true)
  }

  const handleTemplateLoaded = (templateId: string) => {
    // Template is already loaded by the modal, just navigate to new form
    navigate('/forms/new')
  }

  const handlePublish = async (options: PublishOptions) => {
    if (!currentForm) return

    try {
      // Update form status to published
      updateFormSettings({ status: 'published', publishedAt: new Date().toISOString() })

      // Save the form
      await saveForm()

      // In a real app, this would handle:
      // - Publishing to external systems
      // - Generating actual PDFs
      // - Creating shareable URLs in database
      // - Setting up form endpoints

      console.log('Publishing form with options:', options)
    } catch (error) {
      console.error('Failed to publish form:', error)
      throw error
    }
  }

  if (!currentForm && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            No Form Found
          </h2>
          <p className="text-osc-navy-900 dark:text-osc-navy-100 mb-4">
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
              onClick={() => {
                // Clear form state when navigating back
                clearForm()
                window.history.back()
              }}
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
              <span className="text-sm text-osc-navy-900 dark:text-osc-navy-100 min-w-[3rem] text-center">
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
              variant="outline"
              size="sm"
              onClick={handleNewForm}
              title="Start new form"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Form
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadTemplate}
              title="Load from template"
            >
              <FolderOpenIcon className="w-4 h-4 mr-2" />
              Templates
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreview}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFormSettings(true)}
            >
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Settings
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSaveAsTemplateModal(true)}
              title="Save as template"
              disabled={!currentForm}
            >
              <FolderPlusIcon className="w-4 h-4 mr-2" />
              Save as Template
            </Button>

            <Button
              size="sm"
              className="bg-osc-navy-900 hover:bg-osc-navy-800 text-white"
              onClick={() => setShowPublishModal(true)}
            >
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

      {/* Form Settings Modal */}
      {showFormSettings && currentForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFormSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-osc-navy-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-osc-navy-200 dark:border-osc-navy-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                  Form Settings
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFormSettings(false)}
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <FormSharingSettings
                sharing={currentForm.sharing}
                onChange={(sharing) => {
                  updateFormSettings({ sharing })
                }}
              />
            </div>

            <div className="p-6 border-t border-osc-navy-200 dark:border-osc-navy-700 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFormSettings(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowFormSettings(false)
                  handleSave()
                }}
              >
                Save Settings
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Save as Template Modal */}
      <SaveAsTemplateModal
        isOpen={showSaveAsTemplateModal}
        onClose={() => setShowSaveAsTemplateModal(false)}
        onSave={handleSaveAsTemplate}
        formTitle={currentForm?.title}
      />

      {/* Template Library Modal */}
      <TemplateLibraryModal
        isOpen={showTemplateLibraryModal}
        onClose={() => setShowTemplateLibraryModal(false)}
        onLoadTemplate={handleTemplateLoaded}
      />

      {/* Publish Modal */}
      {currentForm && (
        <PublishFormModal
          form={currentForm}
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          onPublish={handlePublish}
        />
      )}

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