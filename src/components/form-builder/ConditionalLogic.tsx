import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { Button, Select, Input, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import type { FormFieldCondition, FormField } from '@/types/forms'

interface ConditionalLogicProps {
  fieldId: string
}

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'not-equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not-contains', label: 'Does not contain' },
  { value: 'greater-than', label: 'Greater than' },
  { value: 'less-than', label: 'Less than' },
  { value: 'is-empty', label: 'Is empty' },
  { value: 'is-not-empty', label: 'Is not empty' }
]

const actionOptions = [
  { value: 'show', label: 'Show field', icon: EyeIcon },
  { value: 'hide', label: 'Hide field', icon: EyeSlashIcon },
  { value: 'enable', label: 'Enable field', icon: LockOpenIcon },
  { value: 'disable', label: 'Disable field', icon: LockClosedIcon },
  { value: 'require', label: 'Make required', icon: ExclamationTriangleIcon },
  { value: 'not-require', label: 'Make optional', icon: CheckIcon }
]

export function ConditionalLogic({ fieldId }: ConditionalLogicProps) {
  const { currentForm, updateField } = useFormBuilderStore()

  const field = React.useMemo(() => {
    return currentForm?.fields.find(f => f.id === fieldId)
  }, [currentForm, fieldId])

  const availableFields = React.useMemo(() => {
    if (!currentForm?.fields) return []
    return currentForm.fields
      .filter(f => f.id !== fieldId && !['section', 'divider', 'html', 'page-break'].includes(f.type))
      .map(f => ({ value: f.id, label: f.label || f.name }))
  }, [currentForm, fieldId])

  const conditions = field?.conditions || []

  const handleAddCondition = () => {
    if (!field) return

    const newCondition: FormFieldCondition = {
      id: `condition_${Date.now()}`,
      field: availableFields[0]?.value || '',
      operator: 'equals',
      value: '',
      action: 'show'
    }

    updateField(fieldId, {
      conditions: [...conditions, newCondition]
    })
  }

  const handleUpdateCondition = (conditionId: string, updates: Partial<FormFieldCondition>) => {
    if (!field) return

    const updatedConditions = conditions.map(condition =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    )

    updateField(fieldId, {
      conditions: updatedConditions
    })
  }

  const handleDeleteCondition = (conditionId: string) => {
    if (!field) return

    const updatedConditions = conditions.filter(condition => condition.id !== conditionId)

    updateField(fieldId, {
      conditions: updatedConditions
    })
  }

  const getFieldOptions = (targetFieldId: string) => {
    const targetField = currentForm?.fields.find(f => f.id === targetFieldId)
    if (!targetField) return []

    if (['select', 'radio', 'checkboxgroup'].includes(targetField.type) && targetField.options) {
      return targetField.options.map(opt => ({ value: opt.value, label: opt.label }))
    }

    return []
  }

  const getActionIcon = (action: string) => {
    const actionConfig = actionOptions.find(opt => opt.value === action)
    const IconComponent = actionConfig?.icon || EyeIcon
    return <IconComponent className="w-4 h-4" />
  }

  const getActionColor = (action: string) => {
    const colorMap = {
      show: 'success',
      hide: 'secondary',
      enable: 'info',
      disable: 'warning',
      require: 'destructive',
      'not-require': 'success'
    } as const

    return colorMap[action as keyof typeof colorMap] || 'default'
  }

  if (!field) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Conditional Logic</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddCondition}
            disabled={availableFields.length === 0}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Rule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableFields.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
              Add more fields to the form to create conditional logic rules
            </p>
          </div>
        ) : conditions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-osc-navy-100 dark:bg-osc-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <EyeIcon className="w-6 h-6 text-osc-navy-600 dark:text-osc-navy-400" />
            </div>
            <h4 className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
              No Conditional Rules
            </h4>
            <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400 mb-4">
              Create rules to show, hide, or modify this field based on other field values
            </p>
            <Button variant="outline" size="sm" onClick={handleAddCondition}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {conditions.map((condition, index) => {
                const targetField = currentForm?.fields.find(f => f.id === condition.field)
                const fieldOptions = getFieldOptions(condition.field)

                return (
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg bg-osc-navy-25 dark:bg-osc-navy-800/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-osc-navy-600 dark:text-osc-navy-400">
                          Rule {index + 1}
                        </span>
                        <Badge variant={getActionColor(condition.action)} className="text-xs">
                          {getActionIcon(condition.action)}
                          <span className="ml-1">{actionOptions.find(opt => opt.value === condition.action)?.label}</span>
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCondition(condition.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* IF */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-1 block">
                            IF Field
                          </label>
                          <Select
                            options={availableFields}
                            value={condition.field}
                            onChange={(e) => handleUpdateCondition(condition.id, { field: e.target.value })}
                            size="sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-1 block">
                            Operator
                          </label>
                          <Select
                            options={operatorOptions}
                            value={condition.operator}
                            onChange={(e) => handleUpdateCondition(condition.id, { operator: e.target.value as any })}
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Value input (only if not "is-empty" or "is-not-empty") */}
                      {!['is-empty', 'is-not-empty'].includes(condition.operator) && (
                        <div>
                          <label className="text-xs font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-1 block">
                            Value
                          </label>
                          {fieldOptions.length > 0 ? (
                            <Select
                              options={fieldOptions}
                              value={condition.value.toString()}
                              onChange={(e) => handleUpdateCondition(condition.id, { value: e.target.value })}
                              size="sm"
                              placeholder="Select value..."
                            />
                          ) : (
                            <Input
                              value={condition.value.toString()}
                              onChange={(e) => handleUpdateCondition(condition.id, { value: e.target.value })}
                              placeholder="Enter value..."
                              size="sm"
                            />
                          )}
                        </div>
                      )}

                      {/* THEN */}
                      <div>
                        <label className="text-xs font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-1 block">
                          THEN Action
                        </label>
                        <Select
                          options={actionOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                          value={condition.action}
                          onChange={(e) => handleUpdateCondition(condition.id, { action: e.target.value as any })}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Rule Preview */}
                    <div className="mt-3 p-2 bg-white dark:bg-osc-navy-900 rounded text-xs">
                      <span className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                        Rule:
                      </span>
                      <span className="text-osc-navy-700 dark:text-osc-navy-300 ml-1">
                        If "{targetField?.label || 'Unknown Field'}"
                        {' ' + operatorOptions.find(opt => opt.value === condition.operator)?.label.toLowerCase() + ' '}
                        {!['is-empty', 'is-not-empty'].includes(condition.operator) && (
                          `"${condition.value}"`
                        )}
                        , then {actionOptions.find(opt => opt.value === condition.action)?.label.toLowerCase()} this field.
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Logic Explanation */}
            <div className="mt-6 p-3 bg-osc-blue-50 dark:bg-osc-blue-950 rounded-lg">
              <h5 className="text-sm font-medium text-osc-blue-900 dark:text-osc-blue-100 mb-2">
                Logic Summary
              </h5>
              <p className="text-xs text-osc-blue-700 dark:text-osc-blue-200">
                {conditions.length === 1 ? (
                  "This field has 1 conditional rule. The rule will be evaluated when users interact with the form."
                ) : (
                  `This field has ${conditions.length} conditional rules. Multiple rules work with AND logic - all conditions must be met for actions to trigger.`
                )}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}