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
  currentPage: 'login' | 'home' | 'forms' | 'responses' | 'settings' | 'builder' | 'preview' | 'fill-form' | 'dashboard' | 'admin';
  isAuthenticated: boolean;

  // Form Builder state
  selectedFieldId: string | null;
  isInlineEditing: boolean;

  // Actions
  setCurrentForm: (form: Form | null) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  addField: (field: FormField) => void;
  removeField: (fieldId: string) => void;
  setCurrentPage: (page: FormBuilderState['currentPage']) => void;
  login: (user: User) => void;
  logout: () => void;
  updateAnalytics: (analytics: AnalyticsData) => void;

  // Form Builder actions
  selectField: (fieldId: string | null) => void;
  setInlineEditing: (editing: boolean) => void;
  duplicateField: (fieldId: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  updateFormTitle: (title: string) => void;
  updateFormDescription: (description: string) => void;
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

      // Form Builder state
      selectedFieldId: null,
      isInlineEditing: false,

      setCurrentForm: (form) => set({ currentForm: form, selectedFieldId: null }),

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

      logout: () => set({ currentUser: null, isAuthenticated: false, currentPage: 'login', currentForm: null, selectedFieldId: null }),

      updateAnalytics: (analytics) => set({ analytics }),

      // Form Builder actions
      selectField: (fieldId) => set({ selectedFieldId: fieldId, isInlineEditing: false }),

      setInlineEditing: (editing) => set({ isInlineEditing: editing }),

      duplicateField: (fieldId) => {
        const { currentForm } = get();
        if (!currentForm) return;

        const fieldToDuplicate = currentForm.fields.find(f => f.id === fieldId);
        if (!fieldToDuplicate) return;

        const duplicatedField = {
          ...fieldToDuplicate,
          id: `${fieldToDuplicate.id}-copy-${Date.now()}`,
          label: `${fieldToDuplicate.label} (Copy)`,
          question: fieldToDuplicate.question ? `${fieldToDuplicate.question} (Copy)` : undefined,
        };

        const fieldIndex = currentForm.fields.findIndex(f => f.id === fieldId);
        const updatedFields = [
          ...currentForm.fields.slice(0, fieldIndex + 1),
          duplicatedField,
          ...currentForm.fields.slice(fieldIndex + 1),
        ];

        set({
          currentForm: {
            ...currentForm,
            fields: updatedFields,
            updatedAt: new Date(),
          },
        });
      },

      reorderFields: (activeId, overId) => {
        const { currentForm } = get();
        if (!currentForm) return;

        const activeIndex = currentForm.fields.findIndex(f => f.id === activeId);
        const overIndex = currentForm.fields.findIndex(f => f.id === overId);

        if (activeIndex === -1 || overIndex === -1) return;

        const reorderedFields = [...currentForm.fields];
        const [movedField] = reorderedFields.splice(activeIndex, 1);
        reorderedFields.splice(overIndex, 0, movedField);

        set({
          currentForm: {
            ...currentForm,
            fields: reorderedFields,
            updatedAt: new Date(),
          },
        });
      },

      updateFormTitle: (title) => {
        const { currentForm } = get();
        if (!currentForm) return;

        set({
          currentForm: {
            ...currentForm,
            title,
            updatedAt: new Date(),
          },
        });
      },

      updateFormDescription: (description) => {
        const { currentForm } = get();
        if (!currentForm) return;

        set({
          currentForm: {
            ...currentForm,
            description,
            updatedAt: new Date(),
          },
        });
      },
    }),
    {
      name: 'osc-form-builder-storage',
      version: 2, // Increment version to clear old cache
    }
  )
);