import { useState } from 'react';
import { Settings, Copy, Trash2, Plus, X } from 'lucide-react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';
import type { FormField } from '../../types';
import ConditionalLogicBuilder from './ConditionalLogicBuilder';

const FieldPropertiesPanel = () => {
  const {
    currentForm,
    selectedFieldId,
    updateField,
    duplicateField,
    removeField,
    selectField
  } = useFormBuilderStore();

  const selectedField = currentForm?.fields.find(f => f.id === selectedFieldId);
  const [newOption, setNewOption] = useState('');

  if (!selectedField) {
    return (
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-center">
          <Settings className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <h4 className="font-semibold text-osc-navy mb-2 text-base">Field Properties</h4>
          <p className="text-sm text-slate-600">
            Click on a field in the canvas to edit its properties here.
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateField = (updates: Partial<FormField>) => {
    updateField(selectedField.id, updates);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const currentOptions = selectedField.options || [];
    handleUpdateField({
      options: [...currentOptions, newOption.trim()]
    });
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = selectedField.options || [];
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    handleUpdateField({ options: updatedOptions });
  };

  const handleDuplicate = () => {
    duplicateField(selectedField.id);
    selectField(null);
  };

  const handleDelete = () => {
    removeField(selectedField.id);
    selectField(null);
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(selectedField.type);

  return (
    <div className="space-y-6">
      {/* Field Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-osc-navy text-base">Field Properties</h4>
          <p className="text-sm text-slate-600 capitalize">{selectedField.type} field</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDuplicate}
            className="p-2 text-slate-500 hover:text-osc-blue hover:bg-osc-blue hover:bg-opacity-10 rounded-lg transition-all duration-200"
            title="Duplicate field"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-slate-500 hover:text-osc-red hover:bg-osc-red hover:bg-opacity-10 rounded-lg transition-all duration-200"
            title="Delete field"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Basic Properties */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-osc-navy mb-2">
            Question Text
          </label>
          <input
            type="text"
            value={selectedField.question || selectedField.label || ''}
            onChange={(e) => handleUpdateField({
              question: e.target.value,
              label: e.target.value
            })}
            className="form-input w-full"
            placeholder="What would you like to ask?"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-osc-navy mb-2">
            Description (Optional)
          </label>
          <textarea
            value={selectedField.description || ''}
            onChange={(e) => handleUpdateField({ description: e.target.value })}
            rows={2}
            className="form-input w-full resize-none"
            placeholder="Provide additional context or instructions..."
          />
        </div>

        {!['section', 'signature', 'file'].includes(selectedField.type) && (
          <div>
            <label className="block text-sm font-semibold text-osc-navy mb-2">
              Placeholder Text
            </label>
            <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => handleUpdateField({ placeholder: e.target.value })}
              className="form-input w-full"
              placeholder="Enter placeholder text..."
            />
          </div>
        )}
      </div>

      {/* Options for Select, Radio, Checkbox */}
      {needsOptions && (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-osc-navy">
            Answer Options
          </label>

          <div className="space-y-2">
            {(selectedField.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...(selectedField.options || [])];
                    updatedOptions[index] = e.target.value;
                    handleUpdateField({ options: updatedOptions });
                  }}
                  className="form-input flex-1"
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 text-slate-400 hover:text-osc-red hover:bg-osc-red hover:bg-opacity-10 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
              className="form-input flex-1"
              placeholder="Add new option..."
            />
            <button
              onClick={handleAddOption}
              className="p-2 text-slate-500 hover:text-osc-blue hover:bg-osc-blue hover:bg-opacity-10 rounded-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Field Settings */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-osc-navy">
          Field Settings
        </label>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedField.required || false}
              onChange={(e) => handleUpdateField({ required: e.target.checked })}
              className="rounded border-slate-300 text-osc-navy focus:ring-osc-navy focus:border-osc-navy transition-colors"
            />
            <span className="ml-3 text-sm text-slate-700 font-medium">
              Required field
            </span>
          </label>

          {selectedField.styling?.width && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Field Width
              </label>
              <select
                value={selectedField.styling.width}
                onChange={(e) => handleUpdateField({
                  styling: {
                    ...selectedField.styling,
                    width: e.target.value as 'full' | 'half' | 'third'
                  }
                })}
                className="form-input w-full"
              >
                <option value="full">Full Width</option>
                <option value="half">Half Width</option>
                <option value="third">Third Width</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Logic */}
      <ConditionalLogicBuilder
        field={selectedField}
        onUpdate={(rules) => handleUpdateField({ conditionalLogic: rules })}
      />
    </div>
  );
};

export default FieldPropertiesPanel;