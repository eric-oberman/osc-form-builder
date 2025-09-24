import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, LockOpenIcon, ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline'

import { useFormBuilderStore } from '@/stores/formBuilderStore'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import type { FormField, FormFieldCondition } from '@/types/forms'

interface LogicNode {
  id: string
  type: 'field' | 'condition' | 'action'
  field?: FormField
  condition?: FormFieldCondition
  position: { x: number; y: number }
  connections: string[]
}

export function LogicFlowDiagram() {
  const { currentForm } = useFormBuilderStore()
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null)

  const nodes = React.useMemo((): LogicNode[] => {
    if (!currentForm?.fields) return []

    const nodes: LogicNode[] = []
    let yOffset = 0

    // Create field nodes and their condition/action nodes
    currentForm.fields.forEach((field, fieldIndex) => {
      if (!field.conditions || field.conditions.length === 0) return

      // Field node (target)
      const fieldNode: LogicNode = {
        id: `field-${field.id}`,
        type: 'field',
        field,
        position: { x: 600, y: yOffset },
        connections: []
      }
      nodes.push(fieldNode)

      // Condition and action nodes
      field.conditions.forEach((condition, conditionIndex) => {
        const conditionY = yOffset + (conditionIndex * 120)

        // Source field node
        const sourceField = currentForm.fields.find(f => f.id === condition.field)
        if (sourceField) {
          const sourceNodeId = `source-${condition.id}`
          const sourceNode: LogicNode = {
            id: sourceNodeId,
            type: 'field',
            field: sourceField,
            position: { x: 0, y: conditionY },
            connections: [`condition-${condition.id}`]
          }
          nodes.push(sourceNode)
        }

        // Condition node
        const conditionNode: LogicNode = {
          id: `condition-${condition.id}`,
          type: 'condition',
          condition,
          position: { x: 300, y: conditionY },
          connections: [`action-${condition.id}`]
        }
        nodes.push(conditionNode)

        // Action node
        const actionNode: LogicNode = {
          id: `action-${condition.id}`,
          type: 'action',
          condition,
          position: { x: 450, y: conditionY },
          connections: [fieldNode.id]
        }
        nodes.push(actionNode)

        fieldNode.connections.push(`action-${condition.id}`)
      })

      yOffset += Math.max(120, field.conditions.length * 120 + 60)
    })

    return nodes
  }, [currentForm])

  const getActionIcon = (action: string) => {
    const iconMap = {
      show: EyeIcon,
      hide: EyeSlashIcon,
      enable: LockOpenIcon,
      disable: LockClosedIcon,
      require: ExclamationTriangleIcon,
      'not-require': CheckIcon
    }
    return iconMap[action as keyof typeof iconMap] || EyeIcon
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

  const renderNode = (node: LogicNode) => {
    const isSelected = selectedNode === node.id

    switch (node.type) {
      case 'field':
        return (
          <motion.div
            key={node.id}
            className={`absolute cursor-pointer ${isSelected ? 'z-10' : 'z-0'}`}
            style={{ left: node.position.x, top: node.position.y }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedNode(isSelected ? null : node.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className={`p-3 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-osc-blue-500 bg-osc-blue-50 dark:bg-osc-blue-950'
                : 'border-osc-navy-200 dark:border-osc-navy-700 bg-white dark:bg-osc-navy-900 hover:border-osc-navy-300'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-osc-navy-400 dark:bg-osc-navy-600" />
                <div className="max-w-32">
                  <div className="text-xs font-medium text-osc-navy-900 dark:text-osc-navy-100 truncate">
                    {node.field?.label}
                  </div>
                  <div className="text-xs text-osc-navy-500 dark:text-osc-navy-400 capitalize">
                    {node.field?.type.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'condition':
        return (
          <motion.div
            key={node.id}
            className={`absolute cursor-pointer ${isSelected ? 'z-10' : 'z-0'}`}
            style={{ left: node.position.x, top: node.position.y }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedNode(isSelected ? null : node.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`p-3 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-osc-gold-500 bg-osc-gold-50 dark:bg-osc-gold-950'
                : 'border-osc-gold-200 dark:border-osc-gold-700 bg-osc-gold-25 dark:bg-osc-gold-900 hover:border-osc-gold-300'
            }`}>
              <div className="max-w-32">
                <div className="text-xs font-medium text-osc-gold-900 dark:text-osc-gold-100">
                  {node.condition?.operator.replace('-', ' ')}
                </div>
                {!['is-empty', 'is-not-empty'].includes(node.condition?.operator || '') && (
                  <div className="text-xs text-osc-gold-700 dark:text-osc-gold-300 truncate">
                    "{node.condition?.value}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 'action':
        const IconComponent = getActionIcon(node.condition?.action || '')
        return (
          <motion.div
            key={node.id}
            className={`absolute cursor-pointer ${isSelected ? 'z-10' : 'z-0'}`}
            style={{ left: node.position.x, top: node.position.y }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedNode(isSelected ? null : node.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`p-3 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-osc-green-500 bg-osc-green-50 dark:bg-osc-green-950'
                : 'border-osc-green-200 dark:border-osc-green-700 bg-osc-green-25 dark:bg-osc-green-900 hover:border-osc-green-300'
            }`}>
              <div className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4 text-osc-green-700 dark:text-osc-green-300" />
                <div className="max-w-24">
                  <div className="text-xs font-medium text-osc-green-900 dark:text-osc-green-100">
                    {node.condition?.action.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const renderConnections = () => {
    return nodes.map((node) =>
      node.connections.map((targetId) => {
        const targetNode = nodes.find(n => n.id === targetId)
        if (!targetNode) return null

        const startX = node.position.x + (node.type === 'field' ? 150 : 120)
        const startY = node.position.y + 30
        const endX = targetNode.position.x
        const endY = targetNode.position.y + 30

        const pathData = `M ${startX} ${startY} Q ${startX + (endX - startX) / 2} ${startY}, ${endX} ${endY}`

        return (
          <motion.path
            key={`${node.id}-${targetId}`}
            d={pathData}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            className="pointer-events-none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            markerEnd="url(#arrowhead)"
          />
        )
      })
    )
  }

  if (nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Logic Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-osc-navy-100 dark:bg-osc-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightIcon className="w-6 h-6 text-osc-navy-600 dark:text-osc-navy-400" />
            </div>
            <h4 className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
              No Conditional Logic
            </h4>
            <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
              Add conditional rules to fields to see the logic flow diagram
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxX = Math.max(...nodes.map(n => n.position.x)) + 200
  const maxY = Math.max(...nodes.map(n => n.position.y)) + 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Logic Flow Diagram</span>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {nodes.filter(n => n.type === 'condition').length} Rules
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-auto max-h-96 border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg bg-gray-50 dark:bg-osc-navy-950 p-4">
          <svg
            className="absolute inset-0 pointer-events-none"
            width={maxX}
            height={maxY}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#94a3b8"
                />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          <div className="relative" style={{ width: maxX, height: maxY }}>
            {nodes.map(renderNode)}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-osc-navy-50 dark:bg-osc-navy-900 rounded-lg">
          <div className="text-xs font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Legend
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border-2 border-osc-navy-300 bg-white dark:bg-osc-navy-900" />
              <span className="text-osc-navy-700 dark:text-osc-navy-300">Fields</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border-2 border-osc-gold-300 bg-osc-gold-25 dark:bg-osc-gold-900" />
              <span className="text-osc-navy-700 dark:text-osc-navy-300">Conditions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border-2 border-osc-green-300 bg-osc-green-25 dark:bg-osc-green-900" />
              <span className="text-osc-navy-700 dark:text-osc-navy-300">Actions</span>
            </div>
          </div>
        </div>

        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-osc-blue-50 dark:bg-osc-blue-950 rounded-lg"
          >
            <div className="text-xs font-medium text-osc-blue-900 dark:text-osc-blue-100 mb-1">
              Selected Node
            </div>
            <div className="text-xs text-osc-blue-700 dark:text-osc-blue-200">
              Click on nodes to see details • Click elsewhere to deselect
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}