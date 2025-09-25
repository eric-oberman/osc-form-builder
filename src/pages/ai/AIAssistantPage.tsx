import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  SparklesIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

import { useAIAssistantStore } from '@/stores/aiAssistantStore'
import { cn } from '@/utils/cn'
import type { SmartSuggestion } from '@/types'

export function AIAssistantPage() {
  const {
    messages,
    isTyping,
    activeSuggestions,
    sendMessage,
    clearConversation,
    generateSuggestions,
    acceptSuggestion,
    rejectSuggestion,
    dismissSuggestion,
    aiMetrics,
    setContext
  } = useAIAssistantStore()

  const [inputMessage, setInputMessage] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Set AI context for this page
  useEffect(() => {
    setContext({ pageContext: 'general' })
  }, [setContext])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Auto-generate initial suggestions
  useEffect(() => {
    if (activeSuggestions.length === 0) {
      generateSuggestions()
    }
  }, [activeSuggestions.length, generateSuggestions])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    await sendMessage(inputMessage.trim())
    setInputMessage('')
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-osc-navy-950">
      {/* Header */}
      <div className="bg-white dark:bg-osc-navy-900 border-b border-osc-navy-200 dark:border-osc-navy-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-gov rounded-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                AI Form Assistant
              </h1>
              <p className="text-sm text-osc-navy-800 dark:text-osc-navy-200">
                Smart suggestions and optimization powered by AI
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                {aiMetrics.suggestionsAccepted}/{aiMetrics.suggestionsGenerated} suggestions accepted
              </div>
              <div className="text-xs text-osc-navy-800 dark:text-osc-navy-200">
                {aiMetrics.conversationsStarted} conversations started
              </div>
            </div>

            <button
              onClick={clearConversation}
              className="p-2 text-osc-navy-600 hover:text-osc-navy-900 hover:bg-osc-navy-100 dark:hover:bg-osc-navy-800 rounded-lg transition-colors duration-200"
              title="Start new conversation"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-2xl rounded-lg px-4 py-3',
                    message.type === 'user'
                      ? 'bg-gov-secondary text-white'
                      : message.type === 'system'
                      ? 'bg-osc-navy-100 dark:bg-osc-navy-800 text-osc-navy-800 dark:text-osc-navy-200 border border-osc-navy-200 dark:border-osc-navy-700'
                      : 'bg-white dark:bg-osc-navy-900 text-osc-navy-900 dark:text-osc-navy-100 border border-osc-navy-200 dark:border-osc-navy-800 shadow-sm'
                  )}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Message timestamp */}
                  <div className={cn(
                    'text-xs mt-2 opacity-70',
                    message.type === 'user' ? 'text-right' : 'text-left'
                  )}>
                    {formatTimestamp(message.timestamp)}
                  </div>

                  {/* Suggestions from AI response */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion) => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onAccept={acceptSuggestion}
                          onReject={rejectSuggestion}
                          onDismiss={dismissSuggestion}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-osc-navy-900 border border-osc-navy-200 dark:border-osc-navy-800 rounded-lg px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2 text-osc-navy-800 dark:text-osc-navy-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-osc-navy-200 dark:border-osc-navy-800 bg-white dark:bg-osc-navy-900 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about form optimization, accessibility, or best practices..."
                  disabled={isTyping}
                  className="w-full px-4 py-3 border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg focus:ring-2 focus:ring-gov-secondary focus:border-transparent dark:bg-osc-navy-800 dark:text-osc-navy-100 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-3 bg-gov-secondary text-white rounded-lg hover:bg-gov-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        {showSuggestions && activeSuggestions.length > 0 && (
          <div className="w-80 bg-white dark:bg-osc-navy-900 border-l border-osc-navy-200 dark:border-osc-navy-800">
            <div className="p-4 border-b border-osc-navy-200 dark:border-osc-navy-800">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                  Smart Suggestions
                </h2>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 text-osc-navy-700 hover:text-osc-navy-900 dark:text-osc-navy-300 dark:hover:text-osc-navy-100"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-osc-navy-800 dark:text-osc-navy-200 mt-1">
                AI-powered recommendations for your forms
              </p>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {activeSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onAccept={acceptSuggestion}
                  onReject={rejectSuggestion}
                  onDismiss={dismissSuggestion}
                  compact
                />
              ))}
            </div>
          </div>
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
    if (context.includes('Accessibility')) {
      return <ShieldCheckIcon className="h-4 w-4 text-gov-accent" />
    } else if (context.includes('Analytics') || context.includes('Performance')) {
      return <ChartBarIcon className="h-4 w-4 text-gov-secondary" />
    } else if (context.includes('Builder') || context.includes('Field')) {
      return <CogIcon className="h-4 w-4 text-osc-navy-700" />
    }
    return <LightBulbIcon className="h-4 w-4 text-osc-yellow-600" />
  }

  const confidenceColor = suggestion.confidence >= 0.8
    ? 'text-green-600 dark:text-green-400'
    : suggestion.confidence >= 0.6
    ? 'text-osc-yellow-600 dark:text-osc-yellow-400'
    : 'text-red-600 dark:text-red-400'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg p-3',
        compact ? 'bg-gray-50 dark:bg-osc-navy-800' : 'bg-white dark:bg-osc-navy-900'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getContextIcon(suggestion.context)}
          <span className={cn(
            'text-xs font-medium',
            compact ? 'text-osc-navy-800 dark:text-osc-navy-200' : 'text-osc-navy-800 dark:text-osc-navy-200'
          )}>
            {suggestion.context}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={cn('text-xs font-medium', confidenceColor)}>
            {Math.round(suggestion.confidence * 100)}%
          </span>
          <button
            onClick={() => onDismiss(suggestion.id)}
            className="text-osc-navy-700 hover:text-osc-navy-900 dark:text-osc-navy-300 dark:hover:text-osc-navy-100"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className={cn(
          'font-medium mb-1',
          compact ? 'text-sm' : 'text-sm',
          'text-osc-navy-900 dark:text-osc-navy-100'
        )}>
          {suggestion.suggestion}
        </p>
        <p className={cn(
          compact ? 'text-xs' : 'text-xs',
          'text-osc-navy-800 dark:text-osc-navy-200'
        )}>
          {suggestion.reasoning}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <CheckIcon className="h-3 w-3 text-green-600" />
            <span className="text-xs text-osc-navy-800 dark:text-osc-navy-200">
              {suggestion.acceptedCount}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <XMarkIcon className="h-3 w-3 text-red-600" />
            <span className="text-xs text-osc-navy-800 dark:text-osc-navy-200">
              {suggestion.rejectedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onAccept(suggestion.id)}
          className="flex-1 px-3 py-1.5 bg-gov-secondary text-white text-xs font-medium rounded hover:bg-gov-secondary/90 transition-colors duration-200"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(suggestion.id)}
          className="flex-1 px-3 py-1.5 border border-osc-navy-200 dark:border-osc-navy-600 text-osc-navy-800 dark:text-osc-navy-200 text-xs font-medium rounded hover:bg-osc-navy-50 dark:hover:bg-osc-navy-800 transition-colors duration-200"
        >
          Not now
        </button>
      </div>
    </motion.div>
  )
}