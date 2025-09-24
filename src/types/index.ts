// Core Application Types

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department: string
  title?: string
  avatar?: string
  preferences: UserPreferences
  permissions: Permission[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isActive: boolean
}

export type UserRole = 'admin' | 'manager' | 'form_builder' | 'form_viewer' | 'guest'

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  emailNotifications: boolean
  dashboardLayout: 'grid' | 'list'
  autoSave: boolean
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

// Form Builder Types
export interface Form {
  id: string
  title: string
  description?: string
  version: number
  status: FormStatus
  category: FormCategory
  tags: string[]
  fields: FormField[]
  settings: FormSettings
  analytics: FormAnalytics
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  archivedAt?: string
}

export type FormStatus = 'draft' | 'published' | 'archived' | 'under_review'
export type FormCategory = 'procurement' | 'hr' | 'finance' | 'general' | 'compliance' | 'audit'

export interface FormSettings {
  allowMultipleSubmissions: boolean
  requireAuthentication: boolean
  enableSaveProgress: boolean
  showProgressBar: boolean
  customTheme?: FormTheme
  notifications: NotificationSettings
  workflow: WorkflowSettings
  accessibility: AccessibilitySettings
  integration: IntegrationSettings
}

export interface FormTheme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: 'sm' | 'md' | 'lg'
  spacing: 'compact' | 'normal' | 'relaxed'
}

export interface NotificationSettings {
  sendToCreator: boolean
  sendToAdmins: boolean
  customRecipients: string[]
  emailTemplate?: string
}

export interface WorkflowSettings {
  approvalRequired: boolean
  approvers: string[]
  escalationRules: EscalationRule[]
}

export interface EscalationRule {
  condition: string
  action: 'notify' | 'reassign' | 'escalate'
  target: string
  delay: number
}

export interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
}

export interface IntegrationSettings {
  adobe: AdobeIntegration
  office365: Office365Integration
  sharepoint: SharePointIntegration
  customWebhooks: WebhookConfig[]
}

export interface AdobeIntegration {
  enabled: boolean
  apiKey?: string
  templateId?: string
  autoGenerate: boolean
}

export interface Office365Integration {
  enabled: boolean
  tenantId?: string
  saveToOneDrive: boolean
  shareWithTeams: boolean
}

export interface SharePointIntegration {
  enabled: boolean
  siteUrl?: string
  listId?: string
  folderPath?: string
}

export interface WebhookConfig {
  id: string
  url: string
  method: 'POST' | 'PUT' | 'PATCH'
  headers: Record<string, string>
  events: WebhookEvent[]
  isActive: boolean
}

export type WebhookEvent = 'form_submitted' | 'form_approved' | 'form_rejected' | 'form_updated'

// Form Field Types
export interface FormField {
  id: string
  type: FieldType
  label: string
  description?: string
  placeholder?: string
  required: boolean
  validation: FieldValidation
  conditionalLogic?: ConditionalLogic
  properties: FieldProperties
  position: FieldPosition
  styling: FieldStyling
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'time'
  | 'file'
  | 'signature'
  | 'matrix'
  | 'rating'
  | 'slider'
  | 'address'
  | 'section'
  | 'page_break'
  | 'calculated'

export interface FieldValidation {
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  pattern?: string
  customMessage?: string
  required: boolean
}

export interface ConditionalLogic {
  show: boolean
  conditions: LogicCondition[]
  operator: 'and' | 'or'
}

export interface LogicCondition {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
  value: any
}

export interface FieldProperties {
  options?: SelectOption[]
  multiple?: boolean
  searchable?: boolean
  allowCustom?: boolean
  fileTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  calculations?: CalculationConfig[]
}

export interface SelectOption {
  id: string
  label: string
  value: string
  disabled?: boolean
}

export interface CalculationConfig {
  formula: string
  dependencies: string[]
  format?: 'number' | 'currency' | 'percentage'
}

export interface FieldPosition {
  row: number
  column: number
  width: number
  height?: number
}

export interface FieldStyling {
  className?: string
  inline?: boolean
  hidden?: boolean
  readonly?: boolean
}

// Form Analytics Types
export interface FormAnalytics {
  views: number
  submissions: number
  completionRate: number
  averageTimeToComplete: number
  abandonmentPoints: AbandonmentPoint[]
  fieldAnalytics: FieldAnalytics[]
  conversionFunnel: ConversionStep[]
  demographics: DemographicData
  feedback: FormFeedback[]
}

export interface AbandonmentPoint {
  fieldId: string
  abandonmentRate: number
  averageTimeSpent: number
}

export interface FieldAnalytics {
  fieldId: string
  completionRate: number
  errorRate: number
  averageTimeSpent: number
  validationErrors: string[]
}

export interface ConversionStep {
  step: string
  visitors: number
  conversionRate: number
}

export interface DemographicData {
  deviceTypes: Record<string, number>
  browsers: Record<string, number>
  locations: Record<string, number>
  timeDistribution: Record<string, number>
}

export interface FormFeedback {
  id: string
  rating: number
  comment?: string
  submittedAt: string
  userId?: string
}

// Form Submission Types
export interface FormSubmission {
  id: string
  formId: string
  formVersion: number
  data: Record<string, any>
  status: SubmissionStatus
  submittedBy?: string
  submittedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  attachments: SubmissionAttachment[]
  workflow: SubmissionWorkflow
}

export type SubmissionStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'requires_changes'
  | 'archived'

export interface SubmissionAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedAt: string
}

export interface SubmissionWorkflow {
  currentStep: string
  steps: WorkflowStep[]
  history: WorkflowHistory[]
}

export interface WorkflowStep {
  id: string
  name: string
  assignee: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  dueDate?: string
  completedAt?: string
}

export interface WorkflowHistory {
  action: string
  performedBy: string
  performedAt: string
  notes?: string
  previousStatus: SubmissionStatus
  newStatus: SubmissionStatus
}

// Dashboard and Analytics Types
export interface DashboardConfig {
  layout: DashboardLayout
  widgets: DashboardWidget[]
  filters: DashboardFilter[]
  refreshInterval: number
  exportSettings: ExportSettings
}

export interface DashboardLayout {
  columns: number
  rows: number
  gridSize: 'sm' | 'md' | 'lg'
}

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  position: WidgetPosition
  size: WidgetSize
  config: WidgetConfig
  dataSource: string
  refreshRate: number
}

export type WidgetType =
  | 'chart'
  | 'metric'
  | 'table'
  | 'list'
  | 'progress'
  | 'calendar'
  | 'map'
  | 'activity_feed'

export interface WidgetPosition {
  x: number
  y: number
}

export interface WidgetSize {
  width: number
  height: number
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  timeRange?: string
  filters?: Record<string, any>
  groupBy?: string
  sortBy?: string
  limit?: number
}

export interface DashboardFilter {
  id: string
  type: 'date' | 'select' | 'multiselect' | 'text'
  label: string
  options?: FilterOption[]
  defaultValue?: any
}

export interface FilterOption {
  label: string
  value: any
}

export interface ExportSettings {
  formats: ExportFormat[]
  schedules: ExportSchedule[]
  recipients: string[]
}

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json'

export interface ExportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  time: string
  recipients: string[]
}

// Template and AI Types
export interface FormTemplate {
  id: string
  name: string
  description: string
  category: FormCategory
  tags: string[]
  fields: FormField[]
  settings: FormSettings
  previewImage?: string
  usageCount: number
  rating: number
  createdBy: string
  createdAt: string
  isPublic: boolean
}

export interface AIRecommendation {
  type: 'field_suggestion' | 'layout_optimization' | 'validation_improvement' | 'accessibility_enhancement'
  confidence: number
  title: string
  description: string
  implementation: string
  impact: 'low' | 'medium' | 'high'
  category: string
}

export interface SmartSuggestion {
  id: string
  context: string
  suggestion: string
  reasoning: string
  confidence: number
  acceptedCount: number
  rejectedCount: number
}

// API Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: APIError[]
  meta?: ResponseMeta
}

export interface APIError {
  code: string
  message: string
  field?: string
}

export interface ResponseMeta {
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
}

// Presentation and Tour Types
export interface TourStep {
  id: string
  target: string
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
  spotlight: boolean
  backdrop: boolean
  nextButton?: string
  prevButton?: string
  skipButton?: string
}

export interface PresentationSlide {
  id: string
  title: string
  subtitle?: string
  content: string
  component?: string
  background?: string
  animation?: string
  duration?: number
  autoAdvance?: boolean
}

export interface GuidedTour {
  id: string
  name: string
  description: string
  steps: TourStep[]
  triggers: TourTrigger[]
  targeting: TourTargeting
  settings: TourSettings
}

export interface TourTrigger {
  event: 'page_load' | 'first_visit' | 'feature_access' | 'time_based' | 'action_based'
  condition?: string
  delay?: number
}

export interface TourTargeting {
  userRoles: UserRole[]
  newUsersOnly: boolean
  repeatForExistingUsers: boolean
  maxTimesShown: number
}

export interface TourSettings {
  showProgress: boolean
  allowSkip: boolean
  keyboard: boolean
  overlay: boolean
  animation: boolean
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys]

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// Event Types
export interface AppEvent {
  type: string
  payload?: any
  timestamp: Date
  source: string
}

export type EventHandler<T = any> = (event: AppEvent & { payload: T }) => void