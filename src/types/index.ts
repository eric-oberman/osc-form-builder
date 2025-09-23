export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  question?: string; // The main question text (more conversational)
  description?: string; // Additional context or instructions
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  conditionalLogic?: ConditionalRule[];
  styling?: FieldStyling;
  options?: string[];
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'signature'
  | 'date'
  | 'number'
  | 'email'
  | 'phone'
  | 'address'
  | 'section'
  | 'page-break'
  | 'calculation';

export interface ConditionalRule {
  trigger: string;
  condition: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals';
  value: any;
  action: 'show' | 'hide' | 'require' | 'populate';
  target: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min_length' | 'max_length' | 'pattern';
  value?: any;
  message: string;
}

export interface FieldStyling {
  width: 'full' | 'half' | 'third';
  color?: string;
  backgroundColor?: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FormSettings {
  allowSaveProgress: boolean;
  requireLogin: boolean;
  enablePDF: boolean;
  branding: BrandingSettings;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  organizationName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'user';
  status: 'active' | 'inactive';
  lastActive: Date;
}

export interface AnalyticsData {
  totalForms: number;
  totalSubmissions: number;
  completionRate: number;
  averageTime: string;
  topForms: {
    name: string;
    submissions: number;
    rate: number;
  }[];
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: FormField[];
  previewImage?: string;
}