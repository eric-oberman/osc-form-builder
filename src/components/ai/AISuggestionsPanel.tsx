import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  LightBulbIcon,
  CheckIcon,
  XMarkIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

import { useAIAssistantStore } from '@/stores/aiAssistantStore'
import { cn } from '@/utils/cn'
import type { SmartSuggestion } from '@/types'

interface AISuggestionsPanelProps {
  context: 'form-builder' | 'analytics' | 'dashboard' | 'preferences'
  formId?: string
  className?: string
  compact?: boolean
  showHeader?: boolean
  autoGenerate?: boolean
}

export function AISuggestionsPanel({
  context,
  formId,
  className,
  compact = false,
  showHeader = true,
  autoGenerate = true
}: AISuggestionsPanelProps) {
  const {
    activeSuggestions,
    generateSuggestions,
    acceptSuggestion,
    rejectSuggestion,
    dismissSuggestion,
    setContext,
    aiMetrics
  } = useAIAssistantStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // Set context for AI suggestions
  useEffect(() => {
    setContext({
      pageContext: context,
      formId: formId
    })
  }, [context, formId, setContext])

  // Auto-generate suggestions when component mounts
  useEffect(() => {
    if (autoGenerate && activeSuggestions.length === 0) {
      handleGenerateSuggestions()
    }
  }, [autoGenerate, activeSuggestions.length])

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true)
    try {
      await generateSuggestions({
        pageContext: context,
        formId: formId
      })
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const contextualSuggestions = activeSuggestions.filter(suggestion =>
    suggestion.context.toLowerCase().includes(context) ||
    (context === 'form-builder' && suggestion.context.includes('Builder')) ||
    (context === 'analytics' && suggestion.context.includes('Analytics')) ||
    (context === 'dashboard' && suggestion.context.includes('Performance'))
  )

  const displaySuggestions = showAll ? contextualSuggestions : contextualSuggestions.slice(0, compact ? 2 : 3)

  if (contextualSuggestions.length === 0 && !isGenerating) {
    return (
      <div className={cn(
        'bg-white dark:bg-osc-navy-900 border border-osc-navy-200 dark:border-osc-navy-800 rounded-lg p-4',
        className
      )}>
        {showHeader && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-gov-secondary" />
              <h3 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                AI Suggestions
              </h3>
            </div>
            <button
              onClick={handleGenerateSuggestions}
              disabled={isGenerating}
              className="p-1 text-osc-navy-400 hover:text-gov-secondary disabled:opacity-50"
              title="Generate suggestions"
            >
              <ArrowPathIcon className={cn('h-4 w-4', isGenerating && 'animate-spin')} />
            </button>
          </div>
        )}

        <div className="text-center py-6">
          <LightBulbIcon className="h-8 w-8 text-osc-navy-300 dark:text-osc-navy-600 mx-auto mb-3" />
          <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400 mb-3">
            No suggestions available yet
          </p>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isGenerating}
            className="px-4 py-2 bg-gov-secondary text-white text-sm rounded hover:bg-gov-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Get AI Suggestions'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white dark:bg-osc-navy-900 border border-osc-navy-200 dark:border-osc-navy-800 rounded-lg',
      compact ? 'p-3' : 'p-4',
      className
    )}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-gov-secondary" />
            <h3 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
              AI Suggestions
            </h3>
            {contextualSuggestions.length > 0 && (
              <span className="px-2 py-0.5 bg-gov-secondary text-white text-xs rounded-full">
                {contextualSuggestions.length}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
              {aiMetrics.suggestionsAccepted}/{aiMetrics.suggestionsGenerated} accepted
            </div>
            <button
              onClick={handleGenerateSuggestions}
              disabled={isGenerating}
              className="p-1 text-osc-navy-400 hover:text-gov-secondary disabled:opacity-50"
              title="Generate new suggestions"
            >
              <ArrowPathIcon className={cn('h-4 w-4', isGenerating && 'animate-spin')} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displaySuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAccept={acceptSuggestion}
              onReject={rejectSuggestion}
              onDismiss={dismissSuggestion}
              compact={compact}
            />
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center py-4"
          >
            <div className="flex items-center space-x-2 text-osc-navy-600 dark:text-osc-navy-400">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating AI suggestions...</span>
            </div>
          </motion.div>
        )}

        {contextualSuggestions.length > (compact ? 2 : 3) && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full flex items-center justify-center py-2 text-sm text-gov-secondary hover:text-gov-secondary/80 font-medium"
          >
            Show {contextualSuggestions.length - (compact ? 2 : 3)} more suggestions
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        )}

        {showAll && contextualSuggestions.length > (compact ? 2 : 3) && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full flex items-center justify-center py-2 text-sm text-osc-navy-600 dark:text-osc-navy-400 hover:text-osc-navy-800 dark:hover:text-osc-navy-200"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  )
}

interface SuggestionCardProps {
  suggestion: SmartSuggestion
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onDismiss: (id: string) => void
  compact?: boolean
}

function SuggestionCard({
  suggestion,
  onAccept,
  onReject,
  onDismiss,
  compact = false
}: SuggestionCardProps) {
  const getContextIcon = (context: string) => {
    if (context.includes('Accessibility') || context.includes('WCAG')) {
      return <ShieldCheckIcon className="h-4 w-4 text-gov-accent" />
    } else if (context.includes('Analytics') || context.includes('Performance')) {
      return <ChartBarIcon className="h-4 w-4 text-gov-secondary" />
    } else if (context.includes('Builder') || context.includes('Field')) {
      return <CogIcon className="h-4 w-4 text-osc-navy-500 dark:text-osc-navy-400" />
    } else if (context.includes('Validation') || context.includes('Error')) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-osc-yellow-500" />
    }
    return <LightBulbIcon className="h-4 w-4 text-osc-green-500" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
    if (confidence >= 0.6) return 'text-osc-yellow-600 dark:text-osc-yellow-400 bg-osc-yellow-50 dark:bg-osc-yellow-900/20'
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={cn(
        'border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg bg-gray-50 dark:bg-osc-navy-800',
        compact ? 'p-3' : 'p-4'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {getContextIcon(suggestion.context)}
          <span className={cn(
            'text-xs font-medium text-osc-navy-600 dark:text-osc-navy-400 truncate',
            compact && 'text-xs'
          )}>
            {suggestion.context}
          </span>
        </div>

        <div className="flex items-center space-x-2 ml-2">
          <span className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full',
            getConfidenceColor(suggestion.confidence)
          )}>
            {getConfidenceText(suggestion.confidence)}
          </span>
          <button
            onClick={() => onDismiss(suggestion.id)}
            className="text-osc-navy-400 hover:text-osc-navy-600 dark:hover:text-osc-navy-200 flex-shrink-0"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h4 className={cn(
          'font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-1',
          compact ? 'text-sm' : 'text-sm'
        )}>
          {suggestion.suggestion}
        </h4>
        <p className={cn(
          'text-osc-navy-600 dark:text-osc-navy-400',
          compact ? 'text-xs' : 'text-xs',
          compact && 'line-clamp-2'
        )}>
          {suggestion.reasoning}
        </p>
      </div>

      {/* Stats */}
      {!compact && (
        <div className="flex items-center space-x-4 mb-3 text-xs text-osc-navy-500 dark:text-osc-navy-400">
          <div className="flex items-center space-x-1">
            <CheckIcon className="h-3 w-3 text-green-600" />
            <span>{suggestion.acceptedCount} accepted</span>
          </div>
          <div className="flex items-center space-x-1">
            <XMarkIcon className="h-3 w-3 text-red-600" />
            <span>{suggestion.rejectedCount} rejected</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onAccept(suggestion.id)}
          className={cn(
            'flex-1 bg-gov-secondary text-white font-medium rounded hover:bg-gov-secondary/90 transition-colors duration-200 flex items-center justify-center',
            compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
          )}
        >
          <CheckIcon className={cn(compact ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1')} />
          Apply
        </button>
        <button
          onClick={() => onReject(suggestion.id)}
          className={cn(
            'flex-1 border border-osc-navy-200 dark:border-osc-navy-600 text-osc-navy-700 dark:text-osc-navy-300 font-medium rounded hover:bg-osc-navy-50 dark:hover:bg-osc-navy-700 transition-colors duration-200 flex items-center justify-center',
            compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
          )}
        >
          <XMarkIcon className={cn(compact ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1')} />
          Dismiss
        </button>
      </div>
    </motion.div>
  )
}