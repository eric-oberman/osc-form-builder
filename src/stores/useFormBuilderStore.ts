import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Form, FormField, User, AnalyticsData, FormTemplate } from '../types';

interface FormBuilderState {
  // Current form being edited
  currentForm: Form | null;

  // Available templates
  templates: FormTemplate[];

  // User management
  users: User[];
  currentUser: User | null;

  // Analytics data
  analytics: AnalyticsData;

  // App state
  currentPage: 'login' | 'home' | 'forms' | 'responses' | 'settings' | 'builder' | 'preview' | 'fill-form';
  isAuthenticated: boolean;

  // Actions
  setCurrentForm: (form: Form | null) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  addField: (field: FormField) => void;
  removeField: (fieldId: string) => void;
  setCurrentPage: (page: FormBuilderState['currentPage']) => void;
  login: (user: User) => void;
  logout: () => void;
  updateAnalytics: (analytics: AnalyticsData) => void;
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      currentForm: null,
      templates: [],
      users: [],
      currentUser: null,
      analytics: {
        totalForms: 47,
        totalSubmissions: 1284,
        completionRate: 87.3,
        averageTime: '4m 32s',
        topForms: [
          { name: 'Vendor Registration', submissions: 234, rate: 94.1 },
          { name: 'Travel Authorization', submissions: 189, rate: 91.7 },
          { name: 'IT Support Request', submissions: 156, rate: 88.2 },
        ],
      },
      currentPage: 'login',
      isAuthenticated: false,

      setCurrentForm: (form) => set({ currentForm: form }),

      updateField: (fieldId, updates) => {
        const { currentForm } = get();
        if (!currentForm) return;

        const updatedFields = currentForm.fields.map(field =>
          field.id === fieldId ? { ...field, ...updates } : field
        );

        set({
          currentForm: {
            ...currentForm,
            fields: updatedFields,
            updatedAt: new Date(),
          },
        });
      },

      addField: (field) => {
        const { currentForm } = get();
        if (!currentForm) return;

        set({
          currentForm: {
            ...currentForm,
            fields: [...currentForm.fields, field],
            updatedAt: new Date(),
          },
        });
      },

      removeField: (fieldId) => {
        const { currentForm } = get();
        if (!currentForm) return;

        const updatedFields = currentForm.fields.filter(field => field.id !== fieldId);

        set({
          currentForm: {
            ...currentForm,
            fields: updatedFields,
            updatedAt: new Date(),
          },
        });
      },

      setCurrentPage: (page) => set({ currentPage: page }),

      login: (user) => set({ currentUser: user, isAuthenticated: true, currentPage: 'home' }),

      logout: () => set({ currentUser: null, isAuthenticated: false, currentPage: 'login', currentForm: null }),

      updateAnalytics: (analytics) => set({ analytics }),
    }),
    {
      name: 'osc-form-builder-storage',
      version: 2, // Increment version to clear old cache
    }
  )
);