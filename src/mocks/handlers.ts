import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

import type {
  User,
  Form,
  FormSubmission,
  FormTemplate,
  AIRecommendation,
  DashboardWidget,
  FormAnalytics
} from '@/types'

// Mock data generators
const generateMockUser = (): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: faker.helpers.arrayElement(['admin', 'manager', 'form_builder', 'form_viewer']),
  department: faker.helpers.arrayElement([
    'Office of State Comptroller',
    'Department of Finance',
    'Human Resources',
    'Information Technology',
    'Legal Department'
  ]),
  title: faker.person.jobTitle(),
  avatar: faker.image.avatar(),
  preferences: {
    theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
    language: 'en',
    timezone: 'America/New_York',
    emailNotifications: faker.datatype.boolean(),
    dashboardLayout: faker.helpers.arrayElement(['grid', 'list']),
    autoSave: faker.datatype.boolean()
  },
  permissions: [
    {
      id: faker.string.uuid(),
      name: 'Form Management',
      resource: 'forms',
      action: 'manage'
    }
  ],
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  lastLoginAt: faker.date.recent().toISOString(),
  isActive: true
})

const generateMockForm = (): Form => ({
  id: faker.string.uuid(),
  title: faker.helpers.arrayElement([
    'Employee Onboarding Form',
    'Travel Request Application',
    'Expense Reimbursement Form',
    'Performance Review Template',
    'IT Support Request',
    'Office Supply Request',
    'Leave Request Form',
    'Budget Proposal Template'
  ]),
  description: faker.lorem.paragraph(),
  version: faker.number.int({ min: 1, max: 10 }),
  status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
  category: faker.helpers.arrayElement(['procurement', 'hr', 'finance', 'general', 'compliance']),
  tags: faker.helpers.arrayElements(['urgent', 'quarterly', 'annual', 'department', 'public'], { min: 1, max: 3 }),
  fields: [], // Will be populated separately if needed
  settings: {
    allowMultipleSubmissions: faker.datatype.boolean(),
    requireAuthentication: faker.datatype.boolean(),
    enableSaveProgress: faker.datatype.boolean(),
    showProgressBar: faker.datatype.boolean(),
    notifications: {
      sendToCreator: faker.datatype.boolean(),
      sendToAdmins: faker.datatype.boolean(),
      customRecipients: [],
    },
    workflow: {
      approvalRequired: faker.datatype.boolean(),
      approvers: [],
      escalationRules: []
    },
    accessibility: {
      highContrast: faker.datatype.boolean(),
      largeText: faker.datatype.boolean(),
      screenReaderOptimized: faker.datatype.boolean(),
      keyboardNavigation: faker.datatype.boolean()
    },
    integration: {
      adobe: { enabled: faker.datatype.boolean(), autoGenerate: faker.datatype.boolean() },
      office365: { enabled: faker.datatype.boolean(), saveToOneDrive: faker.datatype.boolean(), shareWithTeams: faker.datatype.boolean() },
      sharepoint: { enabled: faker.datatype.boolean() },
      customWebhooks: []
    }
  },
  analytics: {
    views: faker.number.int({ min: 0, max: 10000 }),
    submissions: faker.number.int({ min: 0, max: 1000 }),
    completionRate: faker.number.float({ min: 0.3, max: 1.0, fractionDigits: 2 }),
    averageTimeToComplete: faker.number.int({ min: 120, max: 3600 }),
    abandonmentPoints: [],
    fieldAnalytics: [],
    conversionFunnel: [],
    demographics: {
      deviceTypes: { desktop: 60, mobile: 35, tablet: 5 },
      browsers: { chrome: 50, firefox: 25, safari: 15, edge: 10 },
      locations: { 'New York': 40, 'Albany': 30, 'Buffalo': 20, 'Other': 10 },
      timeDistribution: { morning: 25, afternoon: 45, evening: 20, night: 10 }
    },
    feedback: []
  },
  createdBy: faker.string.uuid(),
  updatedBy: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  publishedAt: faker.date.recent().toISOString()
})

// Generate mock data
const mockUsers = Array.from({ length: 25 }, generateMockUser)
const mockForms = Array.from({ length: 15 }, generateMockForm)

// API Handlers
export const handlers = [
  // Authentication
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock authentication logic
    if (email && password) {
      const user = mockUsers.find(u => u.email === email) || mockUsers[0]
      return HttpResponse.json({
        success: true,
        data: {
          user,
          token: `mock_token_${Date.now()}`,
          expiresIn: 86400
        }
      })
    }

    return HttpResponse.json({
      success: false,
      errors: [{ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }]
    }, { status: 401 })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return HttpResponse.json({
        success: false,
        errors: [{ code: 'UNAUTHORIZED', message: 'Authentication required' }]
      }, { status: 401 })
    }

    return HttpResponse.json({
      success: true,
      data: mockUsers[0]
    })
  }),

  // Users
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search')

    let filteredUsers = mockUsers
    if (search) {
      filteredUsers = mockUsers.filter(user =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return HttpResponse.json({
      success: true,
      data: paginatedUsers,
      meta: {
        total: filteredUsers.length,
        page,
        limit,
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1
      }
    })
  }),

  // Forms
  http.get('/api/forms', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')

    let filteredForms = mockForms

    if (status) {
      filteredForms = filteredForms.filter(form => form.status === status)
    }

    if (category) {
      filteredForms = filteredForms.filter(form => form.category === category)
    }

    if (search) {
      filteredForms = filteredForms.filter(form =>
        form.title.toLowerCase().includes(search.toLowerCase()) ||
        form.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedForms = filteredForms.slice(startIndex, endIndex)

    return HttpResponse.json({
      success: true,
      data: paginatedForms,
      meta: {
        total: filteredForms.length,
        page,
        limit,
        hasNext: endIndex < filteredForms.length,
        hasPrev: page > 1
      }
    })
  }),

  http.get('/api/forms/:id', ({ params }) => {
    const form = mockForms.find(f => f.id === params.id)
    if (!form) {
      return HttpResponse.json({
        success: false,
        errors: [{ code: 'NOT_FOUND', message: 'Form not found' }]
      }, { status: 404 })
    }

    return HttpResponse.json({
      success: true,
      data: form
    })
  }),

  http.post('/api/forms', async ({ request }) => {
    const formData = await request.json() as Partial<Form>

    const newForm: Form = {
      id: faker.string.uuid(),
      title: formData.title || 'New Form',
      description: formData.description,
      version: 1,
      status: 'draft',
      category: formData.category || 'general',
      tags: formData.tags || [],
      fields: formData.fields || [],
      settings: {
        allowMultipleSubmissions: false,
        requireAuthentication: true,
        enableSaveProgress: true,
        showProgressBar: true,
        notifications: { sendToCreator: true, sendToAdmins: false, customRecipients: [] },
        workflow: { approvalRequired: false, approvers: [], escalationRules: [] },
        accessibility: {
          highContrast: false,
          largeText: false,
          screenReaderOptimized: true,
          keyboardNavigation: true
        },
        integration: {
          adobe: { enabled: false, autoGenerate: false },
          office365: { enabled: false, saveToOneDrive: false, shareWithTeams: false },
          sharepoint: { enabled: false },
          customWebhooks: []
        }
      },
      analytics: {
        views: 0,
        submissions: 0,
        completionRate: 0,
        averageTimeToComplete: 0,
        abandonmentPoints: [],
        fieldAnalytics: [],
        conversionFunnel: [],
        demographics: {
          deviceTypes: {},
          browsers: {},
          locations: {},
          timeDistribution: {}
        },
        feedback: []
      },
      createdBy: mockUsers[0].id,
      updatedBy: mockUsers[0].id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockForms.unshift(newForm)

    return HttpResponse.json({
      success: true,
      data: newForm
    }, { status: 201 })
  }),

  // Analytics
  http.get('/api/analytics/dashboard', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalForms: mockForms.length,
        totalSubmissions: faker.number.int({ min: 1000, max: 10000 }),
        activeUsers: faker.number.int({ min: 50, max: 200 }),
        completionRate: faker.number.float({ min: 0.7, max: 0.95, fractionDigits: 2 }),
        recentActivity: Array.from({ length: 10 }, () => ({
          id: faker.string.uuid(),
          type: faker.helpers.arrayElement(['form_created', 'form_submitted', 'user_login']),
          description: faker.lorem.sentence(),
          timestamp: faker.date.recent().toISOString(),
          user: faker.person.fullName()
        })),
        chartData: {
          submissions: Array.from({ length: 30 }, (_, i) => ({
            date: faker.date.past({ days: 30 - i }).toISOString().split('T')[0],
            count: faker.number.int({ min: 10, max: 100 })
          })),
          formsByCategory: [
            { category: 'HR', count: faker.number.int({ min: 5, max: 20 }) },
            { category: 'Finance', count: faker.number.int({ min: 3, max: 15 }) },
            { category: 'IT', count: faker.number.int({ min: 2, max: 10 }) },
            { category: 'General', count: faker.number.int({ min: 5, max: 25 }) }
          ]
        }
      }
    })
  }),

  // AI Recommendations
  http.get('/api/ai/recommendations', () => {
    const recommendations: AIRecommendation[] = [
      {
        type: 'field_suggestion',
        confidence: 0.89,
        title: 'Add Email Validation',
        description: 'Consider adding email validation to improve data quality',
        implementation: 'Add pattern validation to email fields',
        impact: 'medium',
        category: 'validation'
      },
      {
        type: 'layout_optimization',
        confidence: 0.76,
        title: 'Optimize Form Layout',
        description: 'Reorganize fields to improve completion rate',
        implementation: 'Move required fields to the top of the form',
        impact: 'high',
        category: 'user_experience'
      },
      {
        type: 'accessibility_enhancement',
        confidence: 0.92,
        title: 'Improve Screen Reader Support',
        description: 'Add ARIA labels to form elements',
        implementation: 'Include descriptive labels and help text',
        impact: 'high',
        category: 'accessibility'
      }
    ]

    return HttpResponse.json({
      success: true,
      data: recommendations
    })
  }),

  // Templates
  http.get('/api/templates', () => {
    const templates: FormTemplate[] = Array.from({ length: 8 }, () => ({
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        'Employee Information Form',
        'Event Registration',
        'Customer Feedback Survey',
        'Meeting Request Form',
        'Vacation Request',
        'Expense Report',
        'Project Proposal',
        'Contact Information Update'
      ]),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement(['hr', 'finance', 'general', 'compliance']),
      tags: faker.helpers.arrayElements(['popular', 'recommended', 'new', 'updated'], { min: 1, max: 2 }),
      fields: [],
      settings: {
        allowMultipleSubmissions: faker.datatype.boolean(),
        requireAuthentication: faker.datatype.boolean(),
        enableSaveProgress: true,
        showProgressBar: true,
        notifications: { sendToCreator: true, sendToAdmins: false, customRecipients: [] },
        workflow: { approvalRequired: false, approvers: [], escalationRules: [] },
        accessibility: {
          highContrast: false,
          largeText: false,
          screenReaderOptimized: true,
          keyboardNavigation: true
        },
        integration: {
          adobe: { enabled: false, autoGenerate: false },
          office365: { enabled: false, saveToOneDrive: false, shareWithTeams: false },
          sharepoint: { enabled: false },
          customWebhooks: []
        }
      },
      usageCount: faker.number.int({ min: 0, max: 500 }),
      rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
      createdBy: faker.string.uuid(),
      createdAt: faker.date.past().toISOString(),
      isPublic: true
    }))

    return HttpResponse.json({
      success: true,
      data: templates
    })
  })
]