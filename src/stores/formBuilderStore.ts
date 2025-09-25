import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { Form, FormField, FormFieldType, FormPage } from '@/types/forms'

interface FormBuilderState {
  currentForm: Form | null
  selectedField: string | null
  draggedField: FormField | null
  previewMode: boolean
  activePage: number
  zoom: number
  isDirty: boolean
  isLoading: boolean
  error: string | null
}

interface FormBuilderActions {
  // Form Management
  createForm: (title: string, description?: string) => void
  loadForm: (formId: string) => Promise<void>
  saveForm: () => Promise<void>
  updateFormSettings: (settings: Partial<Form>) => void

  // Field Management
  addField: (fieldType: FormFieldType, position?: number) => void
  updateField: (fieldId: string, updates: Partial<FormField>) => void
  deleteField: (fieldId: string) => void
  duplicateField: (fieldId: string) => void
  moveField: (fieldId: string, newPosition: number) => void
  selectField: (fieldId: string | null) => void

  // Drag and Drop
  setDraggedField: (field: FormField | null) => void

  // Page Management
  addPage: (title: string, description?: string) => void
  updatePage: (pageId: string, updates: Partial<FormPage>) => void
  deletePage: (pageId: string) => void
  setActivePage: (pageIndex: number) => void

  // View Controls
  togglePreview: () => void
  setZoom: (zoom: number) => void

  // Utility
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type FormBuilderStore = FormBuilderState & FormBuilderActions

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useFormBuilderStore = create<FormBuilderStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentForm: null,
      selectedField: null,
      draggedField: null,
      previewMode: false,
      activePage: 0,
      zoom: 1,
      isDirty: false,
      isLoading: false,
      error: null,

      // Form Management
      createForm: (title: string, description?: string) => {
        console.log('🔨 Creating new form:', title)
        const now = new Date().toISOString()
        const newForm: Form = {
          id: generateId(),
          title,
          description,
          status: 'draft',
          fields: [],
          pages: [{
            id: generateId(),
            title: 'Page 1',
            description: 'Main form page',
            order: 0,
            fields: []
          }],
          settings: {
            multipage: false,
            progress_bar: true,
            save_progress: false,
            require_login: false
          },
          sharing: {
            sharingLevel: 'private',
            allowedUsers: [],
            departmentAccess: [],
            inheritFromCreator: false
          },
          metadata: {
            created_at: now,
            updated_at: now,
            created_by: 'current-user',
            submissions_count: 0,
            version: 1
          }
        }

        console.log('📝 Setting new form state:', newForm)
        set({
          currentForm: newForm,
          selectedField: null,
          activePage: 0,
          isDirty: false
        })
        console.log('✅ Form creation completed')
      },

      loadForm: async (formId: string) => {
        set({
          isLoading: true,
          error: null
        })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))

          // Mock form data - in real app, this would come from API
          const mockForm: Form = {
            id: formId,
            title: 'Employee Onboarding Form',
            description: 'Complete form for new employee setup',
            version: 1,
            status: 'draft',
            category: 'hr',
            tags: ['onboarding', 'hr'],
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
                type: 'email',
                name: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email',
                validation: { required: true },
                metadata: {
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  order: 1,
                  page: 0
                }
              }
            ],
            pages: [{
              id: 'page-1',
              title: 'Personal Information',
              order: 0,
              fields: ['field-1', 'field-2']
            }],
            settings: {
              allowMultipleSubmissions: false,
              requireAuthentication: true,
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
                autoApprove: false
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
              sharingLevel: 'private',
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
            createdBy: 'current-user',
            updatedBy: 'current-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'current-user',
              submissions_count: 0,
              version: 1
            }
          }

          set({
            currentForm: mockForm,
            isLoading: false,
            isDirty: false
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load form'
          })
        }
      },

      saveForm: async () => {
        const { currentForm } = get()
        if (!currentForm) return

        set({
          isLoading: true,
          error: null
        })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          const updatedForm = {
            ...currentForm,
            metadata: {
              ...currentForm.metadata,
              updated_at: new Date().toISOString(),
              version: currentForm.metadata.version + 1
            }
          }

          set({
            currentForm: updatedForm,
            isDirty: false,
            isLoading: false
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to save form'
          })
        }
      },

      updateFormSettings: (settings: Partial<Form>) => {
        const { currentForm } = get()
        if (currentForm) {
          const updatedForm = {
            ...currentForm,
            ...settings,
            metadata: {
              ...currentForm.metadata,
              updated_at: new Date().toISOString()
            }
          }

          set({
            currentForm: updatedForm,
            isDirty: true
          })
        }
      },

      // Field Management
      addField: (fieldType: FormFieldType, position?: number) => {
        const { currentForm, activePage } = get()
        if (!currentForm) return

        const newField: FormField = {
          id: generateId(),
          type: fieldType,
          name: `field_${generateId()}`,
          label: `New ${fieldType} field`,
          metadata: {
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            order: position ?? currentForm.fields.length,
            page: activePage
          }
        }

        const updatedFields = [...currentForm.fields]
        if (position !== undefined) {
          updatedFields.splice(position, 0, newField)
        } else {
          updatedFields.push(newField)
        }

        const updatedPages = currentForm.pages ? [...currentForm.pages] : []
        if (updatedPages[activePage]) {
          updatedPages[activePage] = {
            ...updatedPages[activePage],
            fields: [...updatedPages[activePage].fields, newField.id]
          }
        }

        const updatedForm = {
          ...currentForm,
          fields: updatedFields,
          pages: updatedPages
        }

        set({
          currentForm: updatedForm,
          selectedField: newField.id,
          isDirty: true
        })
      },

      updateField: (fieldId: string, updates: Partial<FormField>) => {
        const { currentForm } = get()
        if (currentForm) {
          const fieldIndex = currentForm.fields.findIndex(f => f.id === fieldId)
          if (fieldIndex !== -1) {
            const updatedField = {
              ...currentForm.fields[fieldIndex],
              ...updates,
              metadata: {
                ...currentForm.fields[fieldIndex].metadata,
                updated_at: new Date().toISOString()
              }
            }

            const updatedFields = [...currentForm.fields]
            updatedFields[fieldIndex] = updatedField

            const updatedForm = {
              ...currentForm,
              fields: updatedFields
            }

            set({
              currentForm: updatedForm,
              isDirty: true
            })
          }
        }
      },

      deleteField: (fieldId: string) => {
        const { currentForm, selectedField } = get()
        if (currentForm) {
          const updatedFields = currentForm.fields.filter(f => f.id !== fieldId)

          const updatedPages = currentForm.pages ? currentForm.pages.map(page => ({
            ...page,
            fields: page.fields.filter(id => id !== fieldId)
          })) : []

          const updatedForm = {
            ...currentForm,
            fields: updatedFields,
            pages: updatedPages
          }

          set({
            currentForm: updatedForm,
            selectedField: selectedField === fieldId ? null : selectedField,
            isDirty: true
          })
        }
      },

      duplicateField: (fieldId: string) => {
        const { currentForm } = get()
        if (currentForm) {
          const field = currentForm.fields.find(f => f.id === fieldId)
          if (field) {
            const duplicatedField: FormField = {
              ...field,
              id: generateId(),
              name: `${field.name}_copy`,
              label: `${field.label} (Copy)`,
              metadata: {
                ...field.metadata,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                order: field.metadata.order + 1
              }
            }

            const index = currentForm.fields.findIndex(f => f.id === fieldId)
            const updatedFields = [...currentForm.fields]
            updatedFields.splice(index + 1, 0, duplicatedField)

            const updatedPages = currentForm.pages ? [...currentForm.pages] : []
            if (updatedPages[field.metadata.page]) {
              const pageFieldIndex = updatedPages[field.metadata.page].fields.indexOf(fieldId)
              const updatedPageFields = [...updatedPages[field.metadata.page].fields]
              updatedPageFields.splice(pageFieldIndex + 1, 0, duplicatedField.id)

              updatedPages[field.metadata.page] = {
                ...updatedPages[field.metadata.page],
                fields: updatedPageFields
              }
            }

            const updatedForm = {
              ...currentForm,
              fields: updatedFields,
              pages: updatedPages
            }

            set({
              currentForm: updatedForm,
              selectedField: duplicatedField.id,
              isDirty: true
            })
          }
        }
      },

      moveField: (fieldId: string, newPosition: number) => {
        const { currentForm } = get()
        if (currentForm) {
          const fieldIndex = currentForm.fields.findIndex(f => f.id === fieldId)
          if (fieldIndex !== -1) {
            const field = currentForm.fields[fieldIndex]
            const updatedFields = [...currentForm.fields]
            updatedFields.splice(fieldIndex, 1)
            updatedFields.splice(newPosition, 0, {
              ...field,
              metadata: {
                ...field.metadata,
                order: newPosition,
                updated_at: new Date().toISOString()
              }
            })

            const updatedForm = {
              ...currentForm,
              fields: updatedFields
            }

            set({
              currentForm: updatedForm,
              isDirty: true
            })
          }
        }
      },

      selectField: (fieldId: string | null) => {
        set({
          selectedField: fieldId
        })
      },

      // Drag and Drop
      setDraggedField: (field: FormField | null) => {
        set({
          draggedField: field
        })
      },

      // Page Management
      addPage: (title: string, description?: string) => {
        const { currentForm } = get()
        if (currentForm && currentForm.pages) {
          const newPage: FormPage = {
            id: generateId(),
            title,
            description,
            order: currentForm.pages.length,
            fields: []
          }

          const updatedForm = {
            ...currentForm,
            pages: [...currentForm.pages, newPage],
            settings: { ...currentForm.settings, multipage: true }
          }

          set({
            currentForm: updatedForm,
            isDirty: true
          })
        }
      },

      updatePage: (pageId: string, updates: Partial<FormPage>) => {
        const { currentForm } = get()
        if (currentForm && currentForm.pages) {
          const pageIndex = currentForm.pages.findIndex(p => p.id === pageId)
          if (pageIndex !== -1) {
            const updatedPages = [...currentForm.pages]
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], ...updates }

            const updatedForm = {
              ...currentForm,
              pages: updatedPages
            }

            set({
              currentForm: updatedForm,
              isDirty: true
            })
          }
        }
      },

      deletePage: (pageId: string) => {
        const { currentForm, activePage } = get()
        if (currentForm && currentForm.pages && currentForm.pages.length > 1) {
          const pageIndex = currentForm.pages.findIndex(p => p.id === pageId)
          if (pageIndex !== -1) {
            const page = currentForm.pages[pageIndex]
            const updatedPages = [...currentForm.pages]

            // Move fields to first page
            if (page.fields.length > 0 && updatedPages[0]) {
              updatedPages[0] = {
                ...updatedPages[0],
                fields: [...updatedPages[0].fields, ...page.fields]
              }
            }

            updatedPages.splice(pageIndex, 1)

            const newActivePage = activePage >= pageIndex && activePage > 0 ? activePage - 1 : activePage

            const updatedForm = {
              ...currentForm,
              pages: updatedPages
            }

            set({
              currentForm: updatedForm,
              activePage: newActivePage,
              isDirty: true
            })
          }
        }
      },

      setActivePage: (pageIndex: number) => {
        set({
          activePage: pageIndex,
          selectedField: null
        })
      },

      // View Controls
      togglePreview: () => {
        const { previewMode } = get()
        set({
          previewMode: !previewMode,
          selectedField: null
        })
      },

      setZoom: (zoom: number) => {
        set({
          zoom: Math.max(0.5, Math.min(2, zoom))
        })
      },

      // Utility
      clearError: () => {
        set({
          error: null
        })
      },

      setLoading: (loading: boolean) => {
        set({
          isLoading: loading
        })
      }
    }),
    {
      name: 'osc-form-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentForm: state.currentForm,
        activePage: state.activePage,
        zoom: state.zoom
      })
    }
  )
)