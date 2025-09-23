import { useState } from 'react';
import { ArrowLeft, Download, Save, Send } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';

const FillForm = () => {
  const { currentForm, setCurrentPage } = useFormBuilderStore();
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert('Form submitted successfully! In a real application, this would be saved to the database.');
    setIsSubmitting(false);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    alert('Draft saved successfully!');
  };

  const generatePDF = () => {
    alert('PDF generation would be implemented here using React-PDF or similar library.');
  };

  const renderFormField = (field: any) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="form-input w-full"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="form-input w-full resize-none"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="form-input w-full"
            required={field.required}
          >
            <option value="">Choose an option...</option>
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => updateFieldValue(field.id, e.target.value)}
                  className="text-osc-navy"
                  required={field.required}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={(value as string[] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value as string[] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    updateFieldValue(field.id, newValues);
                  }}
                  className="rounded border-gray-300 text-osc-navy"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            className="form-input w-full"
            required={field.required}
          />
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-osc-navy transition-colors">
            <input
              type="file"
              onChange={(e) => updateFieldValue(field.id, e.target.files?.[0])}
              className="hidden"
              id={`file-${field.id}`}
              required={field.required}
            />
            <label htmlFor={`file-${field.id}`} className="cursor-pointer">
              <div className="text-gray-500">
                <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm">
                  {value ? value.name || 'File selected' : 'Click to upload or drag and drop'}
                </p>
              </div>
            </label>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              value={value.street || ''}
              onChange={(e) => updateFieldValue(field.id, { ...value, street: e.target.value })}
              className="form-input w-full"
              required={field.required}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={value.city || ''}
                onChange={(e) => updateFieldValue(field.id, { ...value, city: e.target.value })}
                className="form-input w-full"
                required={field.required}
              />
              <input
                type="text"
                placeholder="State"
                value={value.state || ''}
                onChange={(e) => updateFieldValue(field.id, { ...value, state: e.target.value })}
                className="form-input w-full"
                required={field.required}
              />
            </div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={value.zip || ''}
              onChange={(e) => updateFieldValue(field.id, { ...value, zip: e.target.value })}
              className="form-input w-full"
              required={field.required}
            />
          </div>
        );

      case 'signature':
        return (
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
            <p className="text-gray-500 text-sm mb-2">Digital signature pad</p>
            <div className="h-32 bg-white border border-gray-200 rounded flex items-center justify-center">
              {value ? (
                <span className="text-green-600 text-sm">Signature captured</span>
              ) : (
                <button
                  type="button"
                  onClick={() => updateFieldValue(field.id, 'signature-captured')}
                  className="text-osc-navy hover:text-blue-700 text-sm"
                >
                  Click to sign
                </button>
              )}
            </div>
          </div>
        );

      case 'section':
        return (
          <div className="border-b border-gray-300 pb-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{field.label}</h3>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Form Selected</h1>
          <p className="text-gray-600 mb-8">Please select a form to fill out.</p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentForm.title}</h1>
            {currentForm.description && (
              <p className="text-gray-600">{currentForm.description}</p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {currentForm.fields.map((field) => (
                <div key={field.id}>
                  {field.type !== 'section' && (
                    <label className="block mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </label>
                  )}
                  {renderFormField(field)}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn-secondary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={generatePDF}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Your progress is automatically saved as you fill out this form.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FillForm;