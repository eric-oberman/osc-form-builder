import React from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  EnvelopeIcon,
  LockClosedIcon,
  HashtagIcon,
  PhoneIcon,
  LinkIcon,
  ChatBubbleBottomCenterTextIcon,
  ListBulletIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  PhotoIcon,
  PencilSquareIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  IdentificationIcon,
  DocumentChartBarIcon,
  TableCellsIcon,
  CalculatorIcon,
  CodeBracketIcon,
  RectangleStackIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  DocumentDuplicateIcon,
  FolderIcon
} from '@heroicons/react/24/outline'

import type { FormFieldType } from '@/types/forms'
import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { useFormLibraryStore } from '@/stores/formLibraryStore'

interface FieldPaletteItem {
  type: FormFieldType
  label: string
  icon: React.ComponentType<{ className?: string }>
  category: 'basic' | 'advanced' | 'layout' | 'specialized'
  description: string
}

const fieldTypes: FieldPaletteItem[] = [
  // Basic Fields
  { type: 'text', label: 'Text Input', icon: DocumentTextIcon, category: 'basic', description: 'Single line text input' },
  { type: 'email', label: 'Email', icon: EnvelopeIcon, category: 'basic', description: 'Email address input with validation' },
  { type: 'password', label: 'Password', icon: LockClosedIcon, category: 'basic', description: 'Password input field' },
  { type: 'number', label: 'Number', icon: HashtagIcon, category: 'basic', description: 'Numeric input with validation' },
  { type: 'tel', label: 'Phone', icon: PhoneIcon, category: 'basic', description: 'Phone number input' },
  { type: 'url', label: 'Website URL', icon: LinkIcon, category: 'basic', description: 'URL input with validation' },
  { type: 'textarea', label: 'Long Text', icon: ChatBubbleBottomCenterTextIcon, category: 'basic', description: 'Multi-line text area' },

  // Selection Fields
  { type: 'select', label: 'Dropdown', icon: ListBulletIcon, category: 'basic', description: 'Single selection dropdown' },
  { type: 'multiselect', label: 'Multi-Select', icon: ListBulletIcon, category: 'basic', description: 'Multiple selection dropdown' },
  { type: 'radio', label: 'Radio Buttons', icon: CheckCircleIcon, category: 'basic', description: 'Single choice from options' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckCircleIcon, category: 'basic', description: 'Single checkbox field' },
  { type: 'checkboxgroup', label: 'Checkbox Group', icon: CheckCircleIcon, category: 'basic', description: 'Multiple checkboxes' },

  // Date & Time
  { type: 'date', label: 'Date', icon: CalendarDaysIcon, category: 'basic', description: 'Date picker' },
  { type: 'datetime-local', label: 'Date & Time', icon: CalendarDaysIcon, category: 'basic', description: 'Date and time picker' },
  { type: 'time', label: 'Time', icon: ClockIcon, category: 'basic', description: 'Time picker' },

  // File Fields
  { type: 'file', label: 'File Upload', icon: DocumentArrowUpIcon, category: 'advanced', description: 'File upload field' },
  { type: 'image', label: 'Image Upload', icon: PhotoIcon, category: 'advanced', description: 'Image upload with preview' },

  // Advanced Fields
  { type: 'signature', label: 'Signature', icon: PencilSquareIcon, category: 'advanced', description: 'Digital signature pad' },
  { type: 'rating', label: 'Rating', icon: StarIcon, category: 'advanced', description: 'Star rating field' },
  { type: 'slider', label: 'Range Slider', icon: AdjustmentsHorizontalIcon, category: 'advanced', description: 'Numeric range slider' },
  { type: 'richtext', label: 'Rich Text', icon: DocumentTextIcon, category: 'advanced', description: 'WYSIWYG text editor' },

  // Specialized Fields
  { type: 'address', label: 'Address', icon: MapPinIcon, category: 'specialized', description: 'Complete address input' },
  { type: 'phone', label: 'Phone Advanced', icon: PhoneIcon, category: 'specialized', description: 'International phone input' },
  { type: 'ssn', label: 'SSN', icon: IdentificationIcon, category: 'specialized', description: 'Social Security Number' },
  { type: 'currency', label: 'Currency', icon: CurrencyDollarIcon, category: 'specialized', description: 'Currency input field' },

  // Layout & Structure
  { type: 'section', label: 'Section Header', icon: RectangleStackIcon, category: 'layout', description: 'Section divider with title' },
  { type: 'page-break', label: 'Page Break', icon: DocumentChartBarIcon, category: 'layout', description: 'Multi-page form break' },
  { type: 'divider', label: 'Divider', icon: MinusIcon, category: 'layout', description: 'Visual separator line' },
  { type: 'html', label: 'HTML Block', icon: CodeBracketIcon, category: 'layout', description: 'Custom HTML content' },

  // Data Fields
  { type: 'matrix', label: 'Matrix/Grid', icon: TableCellsIcon, category: 'advanced', description: 'Matrix question grid' },
  { type: 'table', label: 'Data Table', icon: TableCellsIcon, category: 'advanced', description: 'Editable data table' },
  { type: 'calculation', label: 'Calculation', icon: CalculatorIcon, category: 'advanced', description: 'Auto-calculated field' }
]

const categories = [
  { key: 'basic', label: 'Basic Fields', color: 'bg-osc-blue-100 text-osc-blue-800' },
  { key: 'advanced', label: 'Advanced', color: 'bg-osc-green-100 text-osc-green-800' },
  { key: 'specialized', label: 'Specialized', color: 'bg-osc-gold-100 text-osc-gold-800' },
  { key: 'layout', label: 'Layout', color: 'bg-osc-navy-100 text-osc-navy-800' }
] as const

export function FieldPalette() {
  const { addField, loadForm, updateFormSettings } = useFormBuilderStore()
  const { getForms } = useFormLibraryStore()
  const [activeCategory, setActiveCategory] = React.useState<string>('basic')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showTemplates, setShowTemplates] = React.useState(false)

  const templates = getForms().filter(form => form.id !== 'new')

  const handleDragStart = (e: React.DragEvent, fieldType: FormFieldType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ fieldType }))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const filteredFields = fieldTypes.filter(field => {
    const matchesCategory = field.category === activeCategory
    const matchesSearch = searchTerm === '' ||
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="w-80 bg-white dark:bg-osc-navy-900 border-r border-osc-navy-200 dark:border-osc-navy-700 flex flex-col h-full">
      <div className="p-4 border-b border-osc-navy-200 dark:border-osc-navy-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
            {showTemplates ? 'Form Templates' : 'Field Palette'}
          </h3>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="p-1.5 text-osc-navy-600 hover:text-osc-navy-900 hover:bg-osc-navy-100 dark:hover:bg-osc-navy-800 rounded-lg transition-colors"
            title={showTemplates ? 'Show Fields' : 'Show Templates'}
          >
            {showTemplates ? <DocumentDuplicateIcon className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />}
          </button>
        </div>

        {!showTemplates && (
          <>
            {/* Search Input */}
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-osc-navy-400" />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg focus:ring-2 focus:ring-gov-secondary focus:border-transparent bg-white dark:bg-osc-navy-800 text-osc-navy-900 dark:text-osc-navy-100 placeholder-osc-navy-400"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === category.key
                      ? category.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-osc-navy-800 dark:text-osc-navy-400 dark:hover:bg-osc-navy-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showTemplates ? (
          <div className="space-y-3">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div
                  onClick={async () => {
                    if (confirm(`Load the "${template.title}" template? This will replace the current form.`)) {
                      try {
                        await loadForm(template.id)
                        // Update the form title to indicate it's from a template
                        updateFormSettings({
                          title: `${template.title} (Copy)`,
                          description: `Based on ${template.title} template`
                        })
                      } catch (error) {
                        console.error('Failed to load template:', error)
                      }
                    }
                  }}
                  className="group cursor-pointer p-3 rounded-lg border border-osc-navy-200 dark:border-osc-navy-700 hover:border-gov-secondary dark:hover:border-gov-secondary hover:shadow-sm transition-all bg-white dark:bg-osc-navy-800 hover:bg-gov-secondary/5"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-gov-secondary/10 flex items-center justify-center group-hover:bg-gov-secondary/20 transition-colors">
                        <FolderIcon className="w-4 h-4 text-gov-secondary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 group-hover:text-osc-navy-700 dark:group-hover:text-osc-navy-200">
                        {template.title}
                      </p>
                      <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 mt-1">
                        {template.description}
                      </p>
                      <p className="text-xs text-osc-navy-400 dark:text-osc-navy-500 mt-1">
                        {template.fields.length} fields • {template.department}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {templates.length === 0 && (
              <div className="text-center py-6">
                <FolderIcon className="w-12 h-12 text-osc-navy-300 dark:text-osc-navy-600 mx-auto mb-3" />
                <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                  No templates available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFields.map(field => {
              const IconComponent = field.icon
              return (
                <motion.div
                  key={field.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.type)}
                    onClick={() => addField(field.type)}
                    className="group cursor-pointer p-3 rounded-lg border border-osc-navy-200 dark:border-osc-navy-700 hover:border-osc-navy-300 dark:hover:border-osc-navy-600 hover:shadow-sm transition-all bg-white dark:bg-osc-navy-800 hover:bg-osc-navy-25 dark:hover:bg-osc-navy-750"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-osc-navy-100 dark:bg-osc-navy-700 flex items-center justify-center group-hover:bg-osc-navy-200 dark:group-hover:bg-osc-navy-600 transition-colors">
                          <IconComponent className="w-4 h-4 text-osc-navy-600 dark:text-osc-navy-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 group-hover:text-osc-navy-700 dark:group-hover:text-osc-navy-200">
                          {field.label}
                        </p>
                        <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 mt-1">
                          {field.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            {filteredFields.length === 0 && searchTerm && (
              <div className="text-center py-6">
                <MagnifyingGlassIcon className="w-12 h-12 text-osc-navy-300 dark:text-osc-navy-600 mx-auto mb-3" />
                <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                  No fields found for "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-osc-navy-200 dark:border-osc-navy-700">
        <div className="text-xs text-osc-navy-500 dark:text-osc-navy-400 text-center">
          {showTemplates
            ? 'Click a template to load it into the form builder'
            : 'Drag fields to the form or click to add at the end'
          }
        </div>
      </div>
    </div>
  )
}