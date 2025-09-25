export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'checkboxgroup'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'file'
  | 'image'
  | 'signature'
  | 'rating'
  | 'slider'
  | 'richtext'
  | 'address'
  | 'phone'
  | 'ssn'
  | 'currency'
  | 'section'
  | 'page-break'
  | 'divider'
  | 'html'
  | 'text-block'
  | 'matrix'
  | 'table'
  | 'calculation'

export interface FormFieldOption {
  id: string
  label: string
  value: string
  selected?: boolean
}

export interface FormFieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  custom?: string
  message?: string
}

export interface FormFieldCondition {
  id: string
  field: string
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than' | 'is-empty' | 'is-not-empty'
  value: string | number | boolean
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'not-require'
}

export interface FormField {
  id: string
  type: FormFieldType
  name: string
  label: string
  description?: string
  placeholder?: string
  defaultValue?: any
  options?: FormFieldOption[]
  validation?: FormFieldValidation
  conditions?: FormFieldCondition[]
  settings?: {
    // Generic settings that apply to different field types
    width?: 'full' | 'half' | 'third' | 'quarter'
    columns?: number
    rows?: number
    multiple?: boolean
    accept?: string
    min?: number
    max?: number
    step?: number
    format?: string
    currency?: string
    prefix?: string
    suffix?: string
    rows_data?: any[]
    cols_data?: any[]
    calculation?: string
    html_content?: string
    text_content?: string
    section_title?: string
    break_type?: 'page' | 'section'
  }
  metadata?: {
    created_at: string
    updated_at: string
    order: number
    page: number
    section?: string
  }
}

export interface FormPage {
  id: string
  title: string
  description?: string
  order: number
  fields: string[]
}

export interface FormTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    field: string
    section: string
  }
}

export interface FormSettings {
  multipage?: boolean
  progress_bar?: boolean
  save_progress?: boolean
  require_login?: boolean
  one_submission_per_user?: boolean
  collect_email?: boolean
  send_confirmation?: boolean
  redirect_url?: string
  custom_css?: string
  notifications?: {
    email?: string[]
    webhook?: string
  }
}

export interface Form {
  id: string
  title: string
  description?: string
  status: 'draft' | 'published' | 'archived'
  fields: FormField[]
  pages?: FormPage[]
  theme?: FormTheme
  settings?: FormSettings
  isTemplate?: boolean
  templateCategory?: string
  metadata: {
    created_at: string
    updated_at: string
    created_by: string
    submissions_count: number
    last_submission_at?: string
    version: number
  }
}

export interface FormTemplate extends Omit<Form, 'status' | 'metadata'> {
  id: string
  title: string
  description?: string
  category: 'basic' | 'advanced' | 'government' | 'custom'
  tags?: string[]
  isPublic?: boolean
  usageCount?: number
  metadata: {
    created_at: string
    updated_at: string
    created_by: string
  }
}

export interface FormSubmission {
  id: string
  form_id: string
  data: Record<string, any>
  metadata: {
    submitted_at: string
    ip_address?: string
    user_agent?: string
    user_id?: string
    completion_time?: number
    referrer?: string
  }
  status: 'complete' | 'partial' | 'abandoned'
}