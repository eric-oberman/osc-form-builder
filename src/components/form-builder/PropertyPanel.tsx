import React from 'react'
import { TrashIcon, DocumentDuplicateIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { Input, Textarea, Select, Checkbox, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ConditionalLogic } from './ConditionalLogic'

export function PropertyPanel() {
  const {
    currentForm,
    selectedField,
    updateField,
    deleteField,
    duplicateField
  } = useFormBuilderStore()

  const field = React.useMemo(() => {
    if (!currentForm || !selectedField) return null
    return currentForm.fields.find(f => f.id === selectedField) || null
  }, [currentForm, selectedField])

  const handleFieldUpdate = (updates: any) => {
    if (field) {
      updateField(field.id, updates)
    }
  }

  const handleAddOption = () => {
    if (field && ['select', 'radio', 'checkboxgroup', 'multiselect'].includes(field.type)) {
      const currentOptions = field.options || []
      const newOption = {
        id: `opt_${Date.now()}`,
        label: `Option ${currentOptions.length + 1}`,
        value: `option_${currentOptions.length + 1}`
      }
      handleFieldUpdate({
        options: [...currentOptions, newOption]
      })
    }
  }

  const handleUpdateOption = (optionId: string, updates: any) => {
    if (field?.options) {
      const updatedOptions = field.options.map(opt =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      )
      handleFieldUpdate({ options: updatedOptions })
    }
  }

  const handleDeleteOption = (optionId: string) => {
    if (field?.options) {
      const updatedOptions = field.options.filter(opt => opt.id !== optionId)
      handleFieldUpdate({ options: updatedOptions })
    }
  }

  if (!field) {
    return (
      <div className="w-80 bg-white dark:bg-osc-navy-900 border-l border-osc-navy-200 dark:border-osc-navy-700 p-6">
        <div className="text-center py-12">
          <Cog6ToothIcon className="w-12 h-12 text-osc-navy-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            No Field Selected
          </h3>
          <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
            Select a field from the form to edit its properties
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-osc-navy-900 border-l border-osc-navy-200 dark:border-osc-navy-700 flex flex-col h-full">
      <div className="p-4 border-b border-osc-navy-200 dark:border-osc-navy-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
            Field Properties
          </h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicateField(field.id)}
              title="Duplicate Field"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteField(field.id)}
              title="Delete Field"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400 capitalize">
          {field.type.replace('-', ' ')} Field
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Label"
              value={field.label}
              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
              placeholder="Field label"
            />

            <Input
              label="Field Name"
              value={field.name}
              onChange={(e) => handleFieldUpdate({ name: e.target.value })}
              placeholder="field_name"
              helperText="Used for form data and API"
            />

            <Textarea
              label="Description"
              value={field.description || ''}
              onChange={(e) => handleFieldUpdate({ description: e.target.value })}
              placeholder="Help text for this field"
              rows={2}
            />

            {['text', 'email', 'password', 'textarea', 'number'].includes(field.type) && (
              <Input
                label="Placeholder"
                value={field.placeholder || ''}
                onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            )}
          </CardContent>
        </Card>

        {/* Validation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Checkbox
              label="Required Field"
              checked={field.validation?.required || false}
              onChange={(e) => handleFieldUpdate({
                validation: { ...field.validation, required: e.target.checked }
              })}
            />

            {['text', 'textarea', 'email', 'password'].includes(field.type) && (
              <>
                <Input
                  label="Minimum Length"
                  type="number"
                  value={field.validation?.minLength || ''}
                  onChange={(e) => handleFieldUpdate({
                    validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                  })}
                />
                <Input
                  label="Maximum Length"
                  type="number"
                  value={field.validation?.maxLength || ''}
                  onChange={(e) => handleFieldUpdate({
                    validation: { ...field.validation, maxLength: parseInt(e.target.value) || undefined }
                  })}
                />
              </>
            )}

            {field.type === 'number' && (
              <>
                <Input
                  label="Minimum Value"
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={(e) => handleFieldUpdate({
                    validation: { ...field.validation, min: parseFloat(e.target.value) || undefined }
                  })}
                />
                <Input
                  label="Maximum Value"
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={(e) => handleFieldUpdate({
                    validation: { ...field.validation, max: parseFloat(e.target.value) || undefined }
                  })}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Options for select, radio, checkbox groups */}
        {['select', 'radio', 'checkboxgroup', 'multiselect'].includes(field.type) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Options
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(field.options || []).map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Input
                      value={option.label}
                      onChange={(e) => handleUpdateOption(option.id, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      placeholder={`Option ${index + 1}`}
                      size="sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOption(option.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(!field.options || field.options.length === 0) && (
                  <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400 text-center py-4">
                    No options yet. Click "Add Option" to get started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Field-specific settings */}
        {field.type === 'textarea' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Textarea Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Rows"
                type="number"
                value={field.settings?.rows || 4}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, rows: parseInt(e.target.value) || 4 }
                })}
                min="2"
                max="20"
              />
            </CardContent>
          </Card>
        )}

        {field.type === 'file' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">File Upload Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Accepted File Types"
                value={field.settings?.accept || ''}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, accept: e.target.value }
                })}
                placeholder=".pdf,.doc,.docx"
                helperText="Comma-separated file extensions"
              />
              <Checkbox
                label="Allow Multiple Files"
                checked={field.settings?.multiple || false}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, multiple: e.target.checked }
                })}
              />
            </CardContent>
          </Card>
        )}

        {['rating', 'slider'].includes(field.type) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Range Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Minimum"
                type="number"
                value={field.settings?.min || (field.type === 'rating' ? 1 : 0)}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, min: parseInt(e.target.value) || 0 }
                })}
              />
              <Input
                label="Maximum"
                type="number"
                value={field.settings?.max || (field.type === 'rating' ? 5 : 100)}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, max: parseInt(e.target.value) || 100 }
                })}
              />
              {field.type === 'slider' && (
                <Input
                  label="Step"
                  type="number"
                  value={field.settings?.step || 1}
                  onChange={(e) => handleFieldUpdate({
                    settings: { ...field.settings, step: parseInt(e.target.value) || 1 }
                  })}
                />
              )}
            </CardContent>
          </Card>
        )}

        {field.type === 'section' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Section Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Section Title"
                value={field.settings?.section_title || field.label}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, section_title: e.target.value }
                })}
                placeholder="Section title"
              />
            </CardContent>
          </Card>
        )}

        {field.type === 'html' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">HTML Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                label="HTML Code"
                value={field.settings?.html_content || ''}
                onChange={(e) => handleFieldUpdate({
                  settings: { ...field.settings, html_content: e.target.value }
                })}
                placeholder="<p>Your HTML content here</p>"
                rows={6}
              />
            </CardContent>
          </Card>
        )}

        {/* Conditional Logic */}
        {!['section', 'divider', 'html', 'page-break'].includes(field.type) && (
          <ConditionalLogic fieldId={field.id} />
        )}
      </div>
    </div>
  )
}