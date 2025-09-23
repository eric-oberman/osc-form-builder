import type { FormField } from '../../types';

interface FieldRendererProps {
  field: FormField;
  isPreview?: boolean;
}

const FieldRenderer = ({ field, isPreview = false }: FieldRendererProps) => {
  const getQuestionNumber = () => {
    // In a real app, this would be calculated based on field order
    return Math.floor(Math.random() * 20) + 1;
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder || 'Type your answer here...'}
            className="form-input w-full"
            disabled={!isPreview}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || 'Type your answer here...'}
            rows={4}
            className="form-input w-full resize-none"
            disabled={!isPreview}
          />
        );

      case 'select':
        return (
          <select className="form-input w-full" disabled={!isPreview}>
            <option value="">Select your answer...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="text-osc-navy focus:ring-osc-navy"
                  disabled={!isPreview}
                />
                <span className="text-sm text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  className="rounded border-gray-300 text-osc-navy focus:ring-osc-navy"
                  disabled={!isPreview}
                />
                <span className="text-sm text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
            <div className="text-gray-500">
              <svg className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, or image files</p>
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="border border-gray-300 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700">Digital signature required</p>
              <p className="text-xs text-gray-500">Click in the box below to sign</p>
            </div>
            <div className="h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Signature area</span>
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className="form-input w-full"
            disabled={!isPreview}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder || 'Enter a number...'}
            className="form-input w-full"
            disabled={!isPreview}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            placeholder={field.placeholder || 'Enter your email address...'}
            className="form-input w-full"
            disabled={!isPreview}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            placeholder={field.placeholder || '(555) 123-4567'}
            className="form-input w-full"
            disabled={!isPreview}
          />
        );

      case 'address':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Street Address"
              className="form-input w-full"
              disabled={!isPreview}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                className="form-input w-full"
                disabled={!isPreview}
              />
              <input
                type="text"
                placeholder="State"
                className="form-input w-full"
                disabled={!isPreview}
              />
            </div>
            <input
              type="text"
              placeholder="ZIP Code"
              className="form-input w-full"
              disabled={!isPreview}
            />
          </div>
        );

      case 'section':
        return (
          <div className="border-l-4 border-osc-navy pl-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{field.question || field.label}</h3>
            {field.description && (
              <p className="text-gray-600">{field.description}</p>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded text-center text-gray-500">
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  // Don't render question format for section headers
  if (field.type === 'section') {
    return renderField();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {field.question || field.label}
              {field.required && <span className="text-red-500 ml-2">*</span>}
            </h3>
          </div>
          <div className="ml-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Q{getQuestionNumber()}
            </span>
          </div>
        </div>

        {field.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{field.description}</p>
        )}
      </div>

      {/* Response Area */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-3">Your Response:</div>
        {renderField()}
      </div>

      {/* Required Indicator */}
      {field.required && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-500">Required field</span>
        </div>
      )}
    </div>
  );
};

export default FieldRenderer;