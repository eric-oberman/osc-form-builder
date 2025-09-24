import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Form, FormField, FormSubmission, FormFieldType } from '@/types/forms'

interface FormLibraryState {
  forms: Form[]
  submissions: FormSubmission[]
  isLoading: boolean
  error: string | null
}

interface FormLibraryActions {
  // Form Management
  getForms: () => Form[]
  getFormById: (id: string) => Form | undefined
  getFormsByDepartment: (department: string) => Form[]
  searchForms: (query: string) => Form[]
  updateForm: (formId: string, updates: Partial<Form>) => void
  deleteForm: (formId: string) => void
  duplicateForm: (formId: string) => string

  // Submissions Management
  getSubmissions: (formId?: string) => FormSubmission[]
  getSubmissionStats: (formId: string) => {
    total: number
    completed: number
    partial: number
    abandoned: number
    averageTime: number
    completionRate: number
    lastSubmission?: string
  }

  // Analytics
  getFormAnalytics: (formId: string) => {
    responses: Record<string, any>
    charts: Array<{
      fieldId: string
      fieldLabel: string
      type: 'bar' | 'pie' | 'line'
      data: Array<{ label: string; value: number }>
    }>
  }

  // Utility
  initializeWithTemplates: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type FormLibraryStore = FormLibraryState & FormLibraryActions

const generateId = () => Math.random().toString(36).substr(2, 9)

// OSC Template Forms with realistic data
const createOSCTemplateForms = (): Form[] => {
  const now = new Date().toISOString()

  return [
    // 1. Employee Information Form
    {
      id: 'form-employee-info',
      title: 'Employee Information Update',
      description: 'Update your personal and professional information in the OSC system',
      status: 'published',
      fields: [
        {
          id: 'emp-name',
          type: 'text',
          name: 'full_name',
          label: 'Full Name',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 0, page: 0 }
        },
        {
          id: 'emp-employee-id',
          type: 'text',
          name: 'employee_id',
          label: 'Employee ID',
          validation: { required: true, pattern: '^EMP[0-9]{6}$' },
          metadata: { created_at: now, updated_at: now, order: 1, page: 0 }
        },
        {
          id: 'emp-email',
          type: 'email',
          name: 'work_email',
          label: 'Work Email Address',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 2, page: 0 }
        },
        {
          id: 'emp-department',
          type: 'select',
          name: 'department',
          label: 'Department',
          options: [
            { id: 'audit', label: 'State and Local Government Audit', value: 'audit' },
            { id: 'legal', label: 'Legal Affairs', value: 'legal' },
            { id: 'it', label: 'Information Technology', value: 'it' },
            { id: 'hr', label: 'Human Resources', value: 'hr' },
            { id: 'finance', label: 'Finance and Budget', value: 'finance' },
            { id: 'operations', label: 'Operations', value: 'operations' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 3, page: 0 }
        },
        {
          id: 'emp-phone',
          type: 'phone',
          name: 'office_phone',
          label: 'Office Phone',
          metadata: { created_at: now, updated_at: now, order: 4, page: 0 }
        },
        {
          id: 'emp-position',
          type: 'textarea',
          name: 'position_description',
          label: 'Position Description',
          settings: { rows: 3 },
          metadata: { created_at: now, updated_at: now, order: 5, page: 0 }
        }
      ],
      metadata: {
        created_at: now,
        updated_at: now,
        created_by: 'system',
        submissions_count: 89,
        last_submission_at: '2024-01-15T14:30:00Z',
        version: 1
      }
    },

    // 2. Vendor Registration
    {
      id: 'form-vendor-registration',
      title: 'Vendor Registration',
      description: 'Register your business as a New York State vendor',
      status: 'published',
      fields: [
        {
          id: 'vendor-company',
          type: 'text',
          name: 'company_name',
          label: 'Company/Organization Name',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 0, page: 0 }
        },
        {
          id: 'vendor-type',
          type: 'radio',
          name: 'business_type',
          label: 'Business Type',
          options: [
            { id: 'corp', label: 'Corporation', value: 'corporation' },
            { id: 'llc', label: 'Limited Liability Company (LLC)', value: 'llc' },
            { id: 'part', label: 'Partnership', value: 'partnership' },
            { id: 'sole', label: 'Sole Proprietorship', value: 'sole_proprietorship' },
            { id: 'nonprofit', label: 'Non-Profit Organization', value: 'nonprofit' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 1, page: 0 }
        },
        {
          id: 'vendor-ein',
          type: 'text',
          name: 'employer_id',
          label: 'Federal Employer Identification Number (EIN)',
          validation: { required: true, pattern: '^[0-9]{2}-[0-9]{7}$' },
          metadata: { created_at: now, updated_at: now, order: 2, page: 0 }
        },
        {
          id: 'vendor-address',
          type: 'address',
          name: 'business_address',
          label: 'Business Address',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 3, page: 0 }
        },
        {
          id: 'vendor-services',
          type: 'checkboxgroup',
          name: 'services_offered',
          label: 'Services Offered',
          options: [
            { id: 'consulting', label: 'Consulting Services', value: 'consulting' },
            { id: 'it', label: 'IT Services', value: 'it_services' },
            { id: 'construction', label: 'Construction', value: 'construction' },
            { id: 'maintenance', label: 'Maintenance & Repair', value: 'maintenance' },
            { id: 'supplies', label: 'Office Supplies', value: 'supplies' },
            { id: 'professional', label: 'Professional Services', value: 'professional' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 4, page: 0 }
        }
      ],
      metadata: {
        created_at: now,
        updated_at: now,
        created_by: 'system',
        submissions_count: 156,
        last_submission_at: '2024-01-14T16:45:00Z',
        version: 1
      }
    },

    // 3. Public Records Request
    {
      id: 'form-public-records',
      title: 'Public Records Request',
      description: 'Submit a Freedom of Information Law (FOIL) request for public records',
      status: 'published',
      fields: [
        {
          id: 'foil-requester-name',
          type: 'text',
          name: 'requester_name',
          label: 'Full Name',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 0, page: 0 }
        },
        {
          id: 'foil-contact-method',
          type: 'radio',
          name: 'preferred_contact',
          label: 'Preferred Contact Method',
          options: [
            { id: 'email', label: 'Email', value: 'email' },
            { id: 'mail', label: 'US Mail', value: 'mail' },
            { id: 'phone', label: 'Phone', value: 'phone' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 1, page: 0 }
        },
        {
          id: 'foil-email',
          type: 'email',
          name: 'contact_email',
          label: 'Email Address',
          conditions: [{
            id: 'show-email',
            field: 'foil-contact-method',
            operator: 'equals',
            value: 'email',
            action: 'show'
          }],
          metadata: { created_at: now, updated_at: now, order: 2, page: 0 }
        },
        {
          id: 'foil-records-desc',
          type: 'textarea',
          name: 'records_description',
          label: 'Description of Records Requested',
          description: 'Please be as specific as possible about the records you are seeking',
          settings: { rows: 5 },
          validation: { required: true, minLength: 50 },
          metadata: { created_at: now, updated_at: now, order: 3, page: 0 }
        },
        {
          id: 'foil-date-range',
          type: 'date',
          name: 'date_range_start',
          label: 'Date Range (Start)',
          metadata: { created_at: now, updated_at: now, order: 4, page: 0 }
        },
        {
          id: 'foil-format',
          type: 'select',
          name: 'preferred_format',
          label: 'Preferred Format',
          options: [
            { id: 'digital', label: 'Digital/Electronic Copy', value: 'digital' },
            { id: 'paper', label: 'Paper Copy', value: 'paper' },
            { id: 'inspection', label: 'Inspection Only', value: 'inspection' }
          ],
          metadata: { created_at: now, updated_at: now, order: 5, page: 0 }
        }
      ],
      metadata: {
        created_at: now,
        updated_at: now,
        created_by: 'system',
        submissions_count: 73,
        last_submission_at: '2024-01-12T11:20:00Z',
        version: 1
      }
    },

    // 4. IT Support Request
    {
      id: 'form-it-support',
      title: 'IT Support Request',
      description: 'Submit a technology support ticket for assistance',
      status: 'published',
      fields: [
        {
          id: 'it-requester',
          type: 'text',
          name: 'requester_name',
          label: 'Your Name',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 0, page: 0 }
        },
        {
          id: 'it-priority',
          type: 'radio',
          name: 'priority',
          label: 'Priority Level',
          options: [
            { id: 'low', label: 'Low - General questions or minor issues', value: 'low' },
            { id: 'medium', label: 'Medium - Impacting productivity', value: 'medium' },
            { id: 'high', label: 'High - System down or critical issue', value: 'high' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 1, page: 0 }
        },
        {
          id: 'it-category',
          type: 'select',
          name: 'issue_category',
          label: 'Issue Category',
          options: [
            { id: 'hardware', label: 'Hardware Problems', value: 'hardware' },
            { id: 'software', label: 'Software Issues', value: 'software' },
            { id: 'network', label: 'Network/Internet Connectivity', value: 'network' },
            { id: 'email', label: 'Email Problems', value: 'email' },
            { id: 'password', label: 'Password Reset', value: 'password' },
            { id: 'access', label: 'System Access Request', value: 'access' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 2, page: 0 }
        },
        {
          id: 'it-description',
          type: 'textarea',
          name: 'issue_description',
          label: 'Detailed Description',
          description: 'Please describe the issue in detail, including any error messages',
          settings: { rows: 4 },
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 3, page: 0 }
        },
        {
          id: 'it-screenshot',
          type: 'file',
          name: 'screenshot',
          label: 'Screenshot (Optional)',
          settings: { accept: '.jpg,.jpeg,.png,.gif', multiple: true },
          metadata: { created_at: now, updated_at: now, order: 4, page: 0 }
        }
      ],
      metadata: {
        created_at: now,
        updated_at: now,
        created_by: 'system',
        submissions_count: 234,
        last_submission_at: '2024-01-16T09:15:00Z',
        version: 1
      }
    },

    // 5. Travel Authorization
    {
      id: 'form-travel-auth',
      title: 'Travel Authorization Request',
      description: 'Request approval for official state travel',
      status: 'published',
      fields: [
        {
          id: 'travel-employee',
          type: 'text',
          name: 'traveler_name',
          label: 'Traveler Name',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 0, page: 0 }
        },
        {
          id: 'travel-destination',
          type: 'text',
          name: 'destination',
          label: 'Destination (City, State)',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 1, page: 0 }
        },
        {
          id: 'travel-purpose',
          type: 'select',
          name: 'travel_purpose',
          label: 'Purpose of Travel',
          options: [
            { id: 'training', label: 'Training/Conference', value: 'training' },
            { id: 'meeting', label: 'Official Meeting', value: 'meeting' },
            { id: 'audit', label: 'Audit Activities', value: 'audit' },
            { id: 'inspection', label: 'Site Inspection', value: 'inspection' },
            { id: 'other', label: 'Other Official Business', value: 'other' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 2, page: 0 }
        },
        {
          id: 'travel-dates',
          type: 'date',
          name: 'departure_date',
          label: 'Departure Date',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 3, page: 0 }
        },
        {
          id: 'travel-return',
          type: 'date',
          name: 'return_date',
          label: 'Return Date',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 4, page: 0 }
        },
        {
          id: 'travel-estimated-cost',
          type: 'currency',
          name: 'estimated_cost',
          label: 'Estimated Total Cost',
          settings: { currency: 'USD' },
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 5, page: 0 }
        }
      ],
      metadata: {
        created_at: now,
        updated_at: now,
        created_by: 'system',
        submissions_count: 67,
        last_submission_at: '2024-01-13T13:22:00Z',
        version: 1
      }
    },

    // Continue with remaining forms...
    // 6. Meeting Room Reservation
    {
      id: 'form-room-reservation',
      title: 'Meeting Room Reservation',
      description: 'Reserve conference rooms and meeting spaces',
      status: 'published',
      fields: [
        {
          id: 'room-organizer',
          type: 'text',
          name: 'organizer_name',
          label: 'Meeting Organizer',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 0, page: 0 }
        },
        {
          id: 'room-selection',
          type: 'select',
          name: 'room_id',
          label: 'Room Selection',
          options: [
            { id: 'conf-a', label: 'Conference Room A (12 people)', value: 'conf_room_a' },
            { id: 'conf-b', label: 'Conference Room B (8 people)', value: 'conf_room_b' },
            { id: 'board', label: 'Boardroom (20 people)', value: 'boardroom' },
            { id: 'training', label: 'Training Room (30 people)', value: 'training_room' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 1, page: 0 }
        },
        {
          id: 'room-date',
          type: 'date',
          name: 'meeting_date',
          label: 'Meeting Date',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 2, page: 0 }
        },
        {
          id: 'room-start-time',
          type: 'time',
          name: 'start_time',
          label: 'Start Time',
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 3, page: 0 }
        },
        {
          id: 'room-duration',
          type: 'select',
          name: 'duration',
          label: 'Duration',
          options: [
            { id: '30min', label: '30 minutes', value: '30' },
            { id: '1hr', label: '1 hour', value: '60' },
            { id: '1.5hr', label: '1.5 hours', value: '90' },
            { id: '2hr', label: '2 hours', value: '120' },
            { id: '3hr', label: '3 hours', value: '180' },
            { id: '4hr', label: '4+ hours', value: '240' }
          ],
          validation: { required: true },
          metadata: { created_at: now, updated_at: now, order: 4, page: 0 }
        }
      ],
      metadata: {
        created_at: now,
        updated_at: now,
        created_by: 'system',
        submissions_count: 145,
        last_submission_at: '2024-01-16T15:30:00Z',
        version: 1
      }
    }
  ]
}

// Generate realistic submission data
const generateSubmissionsForForms = (forms: Form[]): FormSubmission[] => {
  const submissions: FormSubmission[] = []

  forms.forEach(form => {
    const submissionCount = form.metadata.submissions_count

    for (let i = 0; i < Math.min(submissionCount, 50); i++) {
      const submissionDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()

      const submissionData: Record<string, any> = {}

      form.fields.forEach(field => {
        // Generate realistic data based on field type
        switch (field.type) {
          case 'text':
            if (field.name.includes('name')) {
              submissionData[field.name] = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim'][Math.floor(Math.random() * 5)]
            } else if (field.name.includes('employee_id')) {
              submissionData[field.name] = `EMP${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`
            } else {
              submissionData[field.name] = 'Sample text value'
            }
            break
          case 'email':
            submissionData[field.name] = 'user@osc.ny.gov'
            break
          case 'select':
          case 'radio':
            if (field.options && field.options.length > 0) {
              submissionData[field.name] = field.options[Math.floor(Math.random() * field.options.length)].value
            }
            break
          case 'checkboxgroup':
            if (field.options) {
              const selected = field.options.filter(() => Math.random() > 0.6).map(opt => opt.value)
              submissionData[field.name] = selected
            }
            break
          case 'number':
          case 'currency':
            submissionData[field.name] = Math.floor(Math.random() * 1000) + 100
            break
          case 'textarea':
            submissionData[field.name] = 'This is a longer text response with multiple sentences providing detailed information.'
            break
          default:
            submissionData[field.name] = 'Sample value'
        }
      })

      submissions.push({
        id: `sub-${generateId()}`,
        form_id: form.id,
        data: submissionData,
        metadata: {
          submitted_at: submissionDate,
          ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          completion_time: Math.floor(Math.random() * 300) + 60 // 1-5 minutes
        },
        status: Math.random() > 0.1 ? 'complete' : (Math.random() > 0.5 ? 'partial' : 'abandoned')
      })
    }
  })

  return submissions
}

export const useFormLibraryStore = create<FormLibraryStore>()(
  persist(
    (set, get) => ({
      // Initial State
      forms: [],
      submissions: [],
      isLoading: false,
      error: null,

      // Form Management
      getForms: () => get().forms,

      getFormById: (id: string) => get().forms.find(form => form.id === id),

      getFormsByDepartment: (department: string) =>
        get().forms.filter(form =>
          form.fields.some(field =>
            field.name === 'department' &&
            field.options?.some(opt => opt.value === department)
          )
        ),

      searchForms: (query: string) => {
        const forms = get().forms
        const lowercaseQuery = query.toLowerCase()
        return forms.filter(form =>
          form.title.toLowerCase().includes(lowercaseQuery) ||
          form.description?.toLowerCase().includes(lowercaseQuery) ||
          form.fields.some(field => field.label.toLowerCase().includes(lowercaseQuery))
        )
      },

      updateForm: (formId: string, updates: Partial<Form>) => {
        set(state => ({
          forms: state.forms.map(form =>
            form.id === formId
              ? {
                  ...form,
                  ...updates,
                  metadata: {
                    ...form.metadata,
                    updated_at: new Date().toISOString(),
                    version: form.metadata.version + 1
                  }
                }
              : form
          )
        }))
      },

      deleteForm: (formId: string) => {
        set(state => ({
          forms: state.forms.filter(form => form.id !== formId),
          submissions: state.submissions.filter(sub => sub.form_id !== formId)
        }))
      },

      duplicateForm: (formId: string) => {
        const form = get().getFormById(formId)
        if (!form) return ''

        const newId = `form-${generateId()}`
        const duplicatedForm: Form = {
          ...form,
          id: newId,
          title: `${form.title} (Copy)`,
          status: 'draft',
          metadata: {
            ...form.metadata,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            submissions_count: 0,
            version: 1,
            last_submission_at: undefined
          }
        }

        set(state => ({
          forms: [...state.forms, duplicatedForm]
        }))

        return newId
      },

      // Submissions Management
      getSubmissions: (formId?: string) => {
        const submissions = get().submissions
        return formId
          ? submissions.filter(sub => sub.form_id === formId)
          : submissions
      },

      getSubmissionStats: (formId: string) => {
        const submissions = get().getSubmissions(formId)
        const completed = submissions.filter(sub => sub.status === 'complete')
        const partial = submissions.filter(sub => sub.status === 'partial')
        const abandoned = submissions.filter(sub => sub.status === 'abandoned')

        const totalTime = completed.reduce((sum, sub) => sum + (sub.metadata.completion_time || 0), 0)
        const averageTime = completed.length > 0 ? totalTime / completed.length : 0
        const completionRate = submissions.length > 0 ? (completed.length / submissions.length) * 100 : 0

        const lastSubmission = submissions
          .sort((a, b) => new Date(b.metadata.submitted_at).getTime() - new Date(a.metadata.submitted_at).getTime())[0]

        return {
          total: submissions.length,
          completed: completed.length,
          partial: partial.length,
          abandoned: abandoned.length,
          averageTime,
          completionRate,
          lastSubmission: lastSubmission?.metadata.submitted_at
        }
      },

      // Analytics
      getFormAnalytics: (formId: string) => {
        const form = get().getFormById(formId)
        const submissions = get().getSubmissions(formId).filter(sub => sub.status === 'complete')

        if (!form || submissions.length === 0) {
          return { responses: {}, charts: [] }
        }

        const responses: Record<string, any> = {}
        const charts: Array<{
          fieldId: string
          fieldLabel: string
          type: 'bar' | 'pie' | 'line'
          data: Array<{ label: string; value: number }>
        }> = []

        form.fields.forEach(field => {
          const fieldResponses = submissions
            .map(sub => sub.data[field.name])
            .filter(value => value !== undefined && value !== null && value !== '')

          responses[field.id] = fieldResponses

          // Create charts for select/radio/checkbox fields
          if (['select', 'radio', 'checkboxgroup'].includes(field.type) && field.options) {
            const chartData: Record<string, number> = {}

            fieldResponses.forEach(response => {
              if (Array.isArray(response)) {
                // Handle checkbox groups
                response.forEach(value => {
                  chartData[value] = (chartData[value] || 0) + 1
                })
              } else {
                chartData[response] = (chartData[response] || 0) + 1
              }
            })

            const chartDataArray = Object.entries(chartData).map(([value, count]) => {
              const option = field.options?.find(opt => opt.value === value)
              return {
                label: option?.label || value,
                value: count
              }
            })

            if (chartDataArray.length > 0) {
              charts.push({
                fieldId: field.id,
                fieldLabel: field.label,
                type: field.type === 'checkboxgroup' ? 'bar' : 'pie',
                data: chartDataArray
              })
            }
          }
        })

        return { responses, charts }
      },

      // Utility
      initializeWithTemplates: () => {
        const templateForms = createOSCTemplateForms()
        const templateSubmissions = generateSubmissionsForForms(templateForms)

        set({
          forms: templateForms,
          submissions: templateSubmissions,
          isLoading: false,
          error: null
        })
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error })
    }),
    {
      name: 'osc-form-library-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        forms: state.forms,
        submissions: state.submissions
      })
    }
  )
)

// Initialize with template data if empty
const store = useFormLibraryStore.getState()
if (store.forms.length === 0) {
  store.initializeWithTemplates()
}