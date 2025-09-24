import { useState } from 'react';
import { Plus, X, Settings, ArrowRight } from 'lucide-react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';
import type { FormField, ConditionalRule } from '../../types';

interface ConditionalLogicBuilderProps {
  field: FormField;
  onUpdate: (rules: ConditionalRule[]) => void;
}

const ConditionalLogicBuilder = ({ field, onUpdate }: ConditionalLogicBuilderProps) => {
  const { currentForm } = useFormBuilderStore();
  const [rules, setRules] = useState<ConditionalRule[]>(field.conditionalLogic || []);

  // Get all fields that can be triggers (fields before this one)
  const availableTriggerFields = currentForm?.fields.filter(
    f => f.id !== field.id && f.type !== 'section' && f.type !== 'file'
  ) || [];

  const conditionOptions = [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
    { value: 'contains', label: 'contains' },
    { value: 'greater_than', label: 'is greater than' },
    { value: 'less_than', label: 'is less than' },
  ];

  const actionOptions = [
    { value: 'show', label: 'Show this field' },
    { value: 'hide', label: 'Hide this field' },
    { value: 'require', label: 'Make this field required' },
  ];

  const addRule = () => {
    const newRule: ConditionalRule = {
      trigger: '',
      condition: 'equals',
      value: '',
      action: 'show',
      target: field.id,
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onUpdate(updatedRules);
  };

  const updateRule = (index: number, updates: Partial<ConditionalRule>) => {
    const updatedRules = rules.map((rule, i) =>
      i === index ? { ...rule, ...updates } : rule
    );
    setRules(updatedRules);
    onUpdate(updatedRules);
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    onUpdate(updatedRules);
  };

  const getTriggerFieldOptions = (triggerFieldId: string) => {
    const triggerField = availableTriggerFields.find(f => f.id === triggerFieldId);
    if (!triggerField) return [];

    if (['select', 'radio', 'checkbox'].includes(triggerField.type)) {
      return triggerField.options || [];
    }

    return [];
  };

  if (availableTriggerFields.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
        <Settings className="h-6 w-6 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600 mb-1">No Conditional Logic Available</p>
        <p className="text-xs text-slate-500">
          Add fields before this one to create conditional rules
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-osc-navy text-sm">Conditional Logic</h4>
          <p className="text-xs text-slate-600">
            Show or hide this field based on other field values
          </p>
        </div>
        <button
          onClick={addRule}
          className="p-2 text-osc-blue hover:text-osc-navy hover:bg-osc-blue hover:bg-opacity-10 rounded-lg transition-all duration-200"
          title="Add conditional rule"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="p-3 border-2 border-dashed border-slate-200 rounded-lg text-center">
          <p className="text-sm text-slate-500">No conditional rules set</p>
          <button
            onClick={addRule}
            className="text-xs text-osc-blue hover:text-osc-navy font-medium mt-1"
          >
            + Add Rule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div key={index} className="p-3 border border-slate-200 rounded-lg bg-white space-y-3">
              {/* Rule Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Rule {index + 1}
                </span>
                <button
                  onClick={() => removeRule(index)}
                  className="p-1 text-slate-400 hover:text-osc-red hover:bg-osc-red hover:bg-opacity-10 rounded transition-all duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Rule Configuration */}
              <div className="grid grid-cols-1 gap-3">
                {/* Trigger Field */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    When field
                  </label>
                  <select
                    value={rule.trigger}
                    onChange={(e) => updateRule(index, { trigger: e.target.value })}
                    className="form-input text-sm w-full"
                  >
                    <option value="">Select field...</option>
                    {availableTriggerFields.map((triggerField) => (
                      <option key={triggerField.id} value={triggerField.id}>
                        {triggerField.question || triggerField.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={rule.condition}
                      onChange={(e) => updateRule(index, { condition: e.target.value as any })}
                      className="form-input text-sm w-full"
                    >
                      {conditionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Value
                    </label>
                    {rule.trigger && getTriggerFieldOptions(rule.trigger).length > 0 ? (
                      <select
                        value={rule.value}
                        onChange={(e) => updateRule(index, { value: e.target.value })}
                        className="form-input text-sm w-full"
                      >
                        <option value="">Select value...</option>
                        {getTriggerFieldOptions(rule.trigger).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => updateRule(index, { value: e.target.value })}
                        className="form-input text-sm w-full"
                        placeholder="Enter value..."
                      />
                    )}
                  </div>
                </div>

                {/* Action */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Then
                  </label>
                  <select
                    value={rule.action}
                    onChange={(e) => updateRule(index, { action: e.target.value as any })}
                    className="form-input text-sm w-full"
                  >
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rule Preview */}
              {rule.trigger && rule.value && (
                <div className="p-2 bg-slate-50 rounded text-xs text-slate-600 flex items-center space-x-1">
                  <span>If</span>
                  <span className="font-medium">
                    {availableTriggerFields.find(f => f.id === rule.trigger)?.question ||
                     availableTriggerFields.find(f => f.id === rule.trigger)?.label}
                  </span>
                  <span>{conditionOptions.find(o => o.value === rule.condition)?.label}</span>
                  <span className="font-medium">"{rule.value}"</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>{actionOptions.find(o => o.value === rule.action)?.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionalLogicBuilder;