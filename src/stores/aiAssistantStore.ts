import { create } from 'zustand'
import React from 'react'
import type { SmartSuggestion, AIOptimization } from '@/types'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  suggestions?: SmartSuggestion[]
  metadata?: Record<string, any>
}

interface AIAssistantState {
  // Chat Interface
  messages: Message[]
  isTyping: boolean
  currentConversationId: string | null

  // Smart Suggestions
  suggestions: SmartSuggestion[]
  activeSuggestions: SmartSuggestion[]
  suggestionHistory: SmartSuggestion[]

  // AI Optimizations
  optimizations: AIOptimization[]
  activeOptimizations: AIOptimization[]

  // Context & Analysis
  currentContext: {
    formId?: string
    fieldId?: string
    pageContext: 'form-builder' | 'dashboard' | 'analytics' | 'preferences' | 'general'
    userIntent?: string
  }

  // Analytics & Performance
  aiMetrics: {
    suggestionsGenerated: number
    suggestionsAccepted: number
    suggestionsRejected: number
    averageConfidence: number
    conversationsStarted: number
    helpfulResponses: number
  }
}

interface AIAssistantActions {
  // Chat Actions
  sendMessage: (content: string) => Promise<void>
  clearConversation: () => void
  startNewConversation: () => string

  // Suggestion Actions
  generateSuggestions: (context?: Partial<AIAssistantState['currentContext']>) => Promise<SmartSuggestion[]>
  acceptSuggestion: (suggestionId: string) => void
  rejectSuggestion: (suggestionId: string) => void
  dismissSuggestion: (suggestionId: string) => void

  // Optimization Actions
  analyzeForm: (formId: string) => Promise<AIOptimization[]>
  applyOptimization: (optimizationId: string) => void

  // Context Management
  setContext: (context: Partial<AIAssistantState['currentContext']>) => void
  updateMetrics: (metrics: Partial<AIAssistantState['aiMetrics']>) => void
}

type AIAssistantStore = AIAssistantState & AIAssistantActions

// Mock AI API Service
class MockAIService {
  private static instance: MockAIService

  static getInstance(): MockAIService {
    if (!MockAIService.instance) {
      MockAIService.instance = new MockAIService()
    }
    return MockAIService.instance
  }

  async generateResponse(userMessage: string, context: AIAssistantState['currentContext']): Promise<Message> {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const responses = this.getContextualResponses(userMessage, context)
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'assistant',
      content: selectedResponse.content,
      timestamp: new Date(),
      suggestions: selectedResponse.suggestions,
      metadata: {
        confidence: selectedResponse.confidence,
        responseType: selectedResponse.type
      }
    }
  }

  async generateSmartSuggestions(context: Partial<AIAssistantState['currentContext']>): Promise<SmartSuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    const suggestions: SmartSuggestion[] = []
    const suggestionTemplates = this.getSuggestionTemplates(context.pageContext || 'general')

    // Generate 2-4 contextual suggestions
    const numSuggestions = 2 + Math.floor(Math.random() * 3)
    const selectedTemplates = this.shuffleArray(suggestionTemplates).slice(0, numSuggestions)

    selectedTemplates.forEach((template, index) => {
      suggestions.push({
        id: `sug-${Date.now()}-${index}`,
        context: template.context,
        suggestion: template.suggestion,
        reasoning: template.reasoning,
        confidence: 0.7 + Math.random() * 0.3,
        acceptedCount: Math.floor(Math.random() * 50),
        rejectedCount: Math.floor(Math.random() * 10)
      })
    })

    return suggestions
  }

  async analyzeFormOptimizations(formId: string): Promise<AIOptimization[]> {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    const optimizations: AIOptimization[] = [
      {
        id: `opt-${Date.now()}-1`,
        type: 'field_suggestion',
        confidence: 0.85,
        title: 'Add Email Validation Pattern',
        description: 'Enhance email field validation to catch common formatting errors and improve data quality.',
        implementation: 'Add pattern="/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/" to email input fields',
        impact: 'medium',
        category: 'Data Quality'
      },
      {
        id: `opt-${Date.now()}-2`,
        type: 'layout_optimization',
        confidence: 0.92,
        title: 'Optimize Field Order',
        description: 'Reorder form fields to follow government best practices and improve completion rates.',
        implementation: 'Move required fields higher and group related fields together',
        impact: 'high',
        category: 'User Experience'
      },
      {
        id: `opt-${Date.now()}-3`,
        type: 'accessibility_enhancement',
        confidence: 0.78,
        title: 'Improve ARIA Labels',
        description: 'Add more descriptive ARIA labels to improve screen reader accessibility.',
        implementation: 'Add aria-describedby attributes linking to help text for complex fields',
        impact: 'medium',
        category: 'Accessibility'
      }
    ]

    return optimizations
  }

  private getContextualResponses(message: string, context: AIAssistantState['currentContext']) {
    const lowerMessage = message.toLowerCase()

    if (context.pageContext === 'form-builder') {
      return this.getFormBuilderResponses(lowerMessage)
    } else if (context.pageContext === 'analytics') {
      return this.getAnalyticsResponses(lowerMessage)
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return this.getHelpResponses(lowerMessage)
    } else {
      return this.getGeneralResponses(lowerMessage)
    }
  }

  private getFormBuilderResponses(message: string) {
    return [
      {
        type: 'form_builder_help',
        content: 'I can help you build more effective government forms! Based on your current form, I recommend adding required field indicators and improving the field layout for better completion rates.',
        confidence: 0.85,
        suggestions: [
          {
            id: `sug-${Date.now()}-1`,
            context: 'Form Builder - Field Organization',
            suggestion: 'Group related fields together using fieldsets',
            reasoning: 'Grouping improves form comprehension and reduces cognitive load for users',
            confidence: 0.88,
            acceptedCount: 124,
            rejectedCount: 8
          }
        ]
      },
      {
        type: 'field_optimization',
        content: 'I notice your form could benefit from better field validation and accessibility improvements. Government forms need to meet WCAG 2.1 AA standards.',
        confidence: 0.92,
        suggestions: []
      }
    ]
  }

  private getAnalyticsResponses(message: string) {
    return [
      {
        type: 'analytics_insight',
        content: 'Looking at your form analytics, I can help identify optimization opportunities. Your completion rate could be improved by 15-20% with some strategic adjustments.',
        confidence: 0.89,
        suggestions: [
          {
            id: `sug-${Date.now()}-1`,
            context: 'Analytics - Performance Optimization',
            suggestion: 'Reduce form fields from 12 to 8 essential fields',
            reasoning: 'Each additional field reduces completion rate by ~3-5% for government forms',
            confidence: 0.84,
            acceptedCount: 89,
            rejectedCount: 15
          }
        ]
      }
    ]
  }

  private getHelpResponses(message: string) {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('how to') || lowerMessage.includes('how do')) {
      if (lowerMessage.includes('create') || lowerMessage.includes('build')) {
        return [
          {
            type: 'help_creation',
            content: 'Creating effective government forms involves several key steps:\n\n1. **Plan your form structure** - Start with essential fields only\n2. **Choose appropriate field types** - Use dropdowns for long lists, radio buttons for short options\n3. **Add clear labels and descriptions** - Help users understand what information is needed\n4. **Set up validation rules** - Prevent errors before they happen\n5. **Test for accessibility** - Ensure compliance with WCAG 2.1 AA standards\n\nWould you like me to elaborate on any of these steps?',
            confidence: 0.93,
            suggestions: []
          }
        ]
      }

      if (lowerMessage.includes('improve') || lowerMessage.includes('optimize')) {
        return [
          {
            type: 'help_optimization',
            content: 'To optimize your government forms for better completion rates:\n\n• **Reduce field count** - Each additional field decreases completion by 3-5%\n• **Use progressive disclosure** - Show fields conditionally based on previous answers\n• **Add progress indicators** - Let users know how much is left\n• **Implement real-time validation** - Catch errors immediately\n• **Test on mobile devices** - Ensure responsive design\n\nI can analyze your specific forms and provide targeted recommendations!',
            confidence: 0.91,
            suggestions: []
          }
        ]
      }
    }

    if (lowerMessage.includes('what can you')) {
      return [
        {
          type: 'help_capabilities',
          content: 'I\'m your AI assistant specialized in government form optimization! Here\'s what I can help you with:\n\n**Form Building:**\n• Field type recommendations\n• Layout optimization\n• Validation setup\n\n**Compliance:**\n• WCAG 2.1 AA accessibility standards\n• Government regulation compliance\n• Section 508 requirements\n\n**Performance:**\n• Completion rate analysis\n• User experience improvements\n• Mobile optimization\n\n**Data Quality:**\n• Validation best practices\n• Error prevention strategies\n• Data collection optimization\n\nJust ask me about any of these areas!',
          confidence: 0.96,
          suggestions: []
        }
      ]
    }

    // Default help response
    return [
      {
        type: 'help_general',
        content: 'I\'m here to help you create better government forms! I can assist with:\n\n• **Form optimization** and completion rate improvement\n• **Accessibility compliance** (WCAG 2.1 AA)\n• **Government best practices** and regulations\n• **Field validation** and data quality\n• **User experience** improvements\n\nTry asking me specific questions like "How do I improve form completion rates?" or "What accessibility features should I add?"',
        confidence: 0.95,
        suggestions: [
          {
            id: `sug-${Date.now()}-1`,
            context: 'Help - Getting Started',
            suggestion: 'Start with a form accessibility audit',
            reasoning: 'Accessibility audits help identify compliance gaps and improvement opportunities early in the form development process',
            confidence: 0.88,
            acceptedCount: 67,
            rejectedCount: 8
          }
        ]
      }
    ]
  }

  private getGeneralResponses(message: string) {
    const lowerMessage = message.toLowerCase()

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return [
        {
          type: 'greeting',
          content: 'Hello! I\'m your AI assistant for the OSC Form Builder platform. I\'m ready to help you create better government forms. What can I help you with today?',
          confidence: 0.95,
          suggestions: []
        }
      ]
    }

    // Form-related questions
    if (lowerMessage.includes('form') || lowerMessage.includes('field')) {
      return [
        {
          type: 'form_guidance',
          content: 'I can help you with all aspects of form building! Whether you need assistance with field types, validation, accessibility compliance, or optimization strategies, I\'m here to guide you through the process.',
          confidence: 0.92,
          suggestions: [
            {
              id: `sug-${Date.now()}-1`,
              context: 'Form Building - Best Practices',
              suggestion: 'Start with a clear form title and description',
              reasoning: 'Clear titles improve form completion rates by up to 20%',
              confidence: 0.89,
              acceptedCount: 156,
              rejectedCount: 12
            }
          ]
        }
      ]
    }

    // Accessibility questions
    if (lowerMessage.includes('accessibility') || lowerMessage.includes('wcag') || lowerMessage.includes('screen reader')) {
      return [
        {
          type: 'accessibility_guidance',
          content: 'Accessibility is crucial for government forms! I can help ensure your forms meet WCAG 2.1 AA standards. This includes proper labeling, keyboard navigation, color contrast, and screen reader compatibility.',
          confidence: 0.94,
          suggestions: [
            {
              id: `sug-${Date.now()}-1`,
              context: 'Accessibility - WCAG Compliance',
              suggestion: 'Add descriptive labels to all form fields',
              reasoning: 'Proper labels are essential for screen readers and improve form usability for all users',
              confidence: 0.96,
              acceptedCount: 203,
              rejectedCount: 5
            }
          ]
        }
      ]
    }

    // Analytics/performance questions
    if (lowerMessage.includes('analytics') || lowerMessage.includes('performance') || lowerMessage.includes('completion') || lowerMessage.includes('rate')) {
      return [
        {
          type: 'analytics_guidance',
          content: 'I can help you analyze form performance and improve completion rates. Based on government form data, I can suggest optimizations that typically increase completion rates by 15-30%.',
          confidence: 0.90,
          suggestions: [
            {
              id: `sug-${Date.now()}-1`,
              context: 'Analytics - Performance',
              suggestion: 'Reduce form length to improve completion rates',
              reasoning: 'Each additional field can reduce completion rates by 3-5% for government forms',
              confidence: 0.87,
              acceptedCount: 98,
              rejectedCount: 23
            }
          ]
        }
      ]
    }

    // Specific technical questions
    if (lowerMessage.includes('validation') || lowerMessage.includes('error')) {
      return [
        {
          type: 'technical_guidance',
          content: 'Form validation is key to data quality! I can help you set up proper validation rules, error messages, and real-time feedback to improve user experience and reduce form errors.',
          confidence: 0.88,
          suggestions: []
        }
      ]
    }

    // Integration questions
    if (lowerMessage.includes('integration') || lowerMessage.includes('api') || lowerMessage.includes('export')) {
      return [
        {
          type: 'integration_guidance',
          content: 'I can help you with form integrations and data export options. The OSC Form Builder supports CSV exports, API integrations, and connections to various government systems.',
          confidence: 0.85,
          suggestions: []
        }
      ]
    }

    // Default response with more variety
    const defaultResponses = [
      {
        type: 'general_assistance',
        content: 'I\'m your AI assistant for the OSC Form Builder platform. I can help you optimize forms, improve accessibility, and ensure government compliance. What would you like to work on today?',
        confidence: 0.87,
        suggestions: []
      },
      {
        type: 'general_assistance',
        content: 'I\'m here to help you create effective government forms! I can assist with design best practices, accessibility compliance, performance optimization, and more. What specific area would you like help with?',
        confidence: 0.89,
        suggestions: []
      },
      {
        type: 'general_assistance',
        content: 'Welcome! I specialize in government form optimization and can help you improve completion rates, ensure compliance, and enhance user experience. How can I assist you today?',
        confidence: 0.86,
        suggestions: []
      }
    ]

    return [defaultResponses[Math.floor(Math.random() * defaultResponses.length)]]
  }

  private getSuggestionTemplates(pageContext: string) {
    const baseTemplates = [
      {
        context: 'Form Optimization - General',
        suggestion: 'Add progress indicators to multi-step forms',
        reasoning: 'Progress indicators reduce form abandonment by 23% on average for government forms'
      },
      {
        context: 'Accessibility - WCAG Compliance',
        suggestion: 'Ensure all form fields have associated labels',
        reasoning: 'Proper labeling is required for WCAG 2.1 AA compliance and improves screen reader navigation'
      },
      {
        context: 'Data Quality - Validation',
        suggestion: 'Implement real-time field validation',
        reasoning: 'Immediate feedback reduces form errors by 35% and improves user satisfaction'
      },
      {
        context: 'User Experience - Field Design',
        suggestion: 'Use single-column layout for better mobile experience',
        reasoning: 'Single-column forms have 15-20% higher completion rates on mobile devices'
      }
    ]

    if (pageContext === 'form-builder') {
      return [
        ...baseTemplates,
        {
          context: 'Form Builder - Field Types',
          suggestion: 'Consider using dropdown instead of radio buttons for 5+ options',
          reasoning: 'Dropdowns save space and reduce visual clutter for longer option lists'
        },
        {
          context: 'Form Builder - Required Fields',
          suggestion: 'Mark required fields with asterisks and color coding',
          reasoning: 'Clear required field indicators reduce form completion errors by 28%'
        }
      ]
    }

    return baseTemplates
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

export const useAIAssistantStore = create<AIAssistantStore>()((set, get) => ({
  // Initial State
  messages: [
    {
      id: 'welcome-msg',
      type: 'system',
      content: 'Welcome to your AI Form Building Assistant! I\'m here to help you create better government forms with smart suggestions and optimization recommendations.',
      timestamp: new Date(),
      metadata: { isWelcome: true }
    }
  ],
  isTyping: false,
  currentConversationId: null,

  suggestions: [],
  activeSuggestions: [],
  suggestionHistory: [],

  optimizations: [],
  activeOptimizations: [],

  currentContext: {
    pageContext: 'general'
  },

  aiMetrics: {
    suggestionsGenerated: 0,
    suggestionsAccepted: 0,
    suggestionsRejected: 0,
    averageConfidence: 0,
    conversationsStarted: 0,
    helpfulResponses: 0
  },

  // Actions
  sendMessage: async (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: 'user',
      content,
      timestamp: new Date()
    }

    set(state => ({
      messages: [...state.messages, userMessage],
      isTyping: true
    }))

    try {
      const aiService = MockAIService.getInstance()
      const aiResponse = await aiService.generateResponse(content, get().currentContext)

      set(state => ({
        messages: [...state.messages, aiResponse],
        isTyping: false,
        suggestions: aiResponse.suggestions ? [...state.suggestions, ...aiResponse.suggestions] : state.suggestions,
        activeSuggestions: aiResponse.suggestions ? [...state.activeSuggestions, ...aiResponse.suggestions] : state.activeSuggestions,
        aiMetrics: {
          ...state.aiMetrics,
          suggestionsGenerated: state.aiMetrics.suggestionsGenerated + (aiResponse.suggestions?.length || 0)
        }
      }))
    } catch (error) {
      console.error('AI Assistant error:', error)
      set(state => ({
        messages: [...state.messages, {
          id: `msg-${Date.now()}-error`,
          type: 'system',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
          metadata: { isError: true }
        }],
        isTyping: false
      }))
    }
  },

  clearConversation: () => {
    set({
      messages: [{
        id: 'welcome-msg-new',
        type: 'system',
        content: 'How can I help you optimize your forms today?',
        timestamp: new Date(),
        metadata: { isWelcome: true }
      }],
      currentConversationId: null
    })
  },

  startNewConversation: () => {
    const conversationId = `conv-${Date.now()}`
    set(state => ({
      currentConversationId: conversationId,
      aiMetrics: {
        ...state.aiMetrics,
        conversationsStarted: state.aiMetrics.conversationsStarted + 1
      }
    }))
    return conversationId
  },

  generateSuggestions: async (context = {}) => {
    const aiService = MockAIService.getInstance()
    const suggestions = await aiService.generateSmartSuggestions({
      ...get().currentContext,
      ...context
    })

    set(state => ({
      suggestions: [...state.suggestions, ...suggestions],
      activeSuggestions: [...state.activeSuggestions, ...suggestions],
      aiMetrics: {
        ...state.aiMetrics,
        suggestionsGenerated: state.aiMetrics.suggestionsGenerated + suggestions.length
      }
    }))

    return suggestions
  },

  acceptSuggestion: (suggestionId: string) => {
    set(state => {
      const suggestion = state.activeSuggestions.find(s => s.id === suggestionId)
      if (!suggestion) return state

      return {
        activeSuggestions: state.activeSuggestions.filter(s => s.id !== suggestionId),
        suggestionHistory: [...state.suggestionHistory, { ...suggestion, acceptedCount: suggestion.acceptedCount + 1 }],
        aiMetrics: {
          ...state.aiMetrics,
          suggestionsAccepted: state.aiMetrics.suggestionsAccepted + 1
        }
      }
    })
  },

  rejectSuggestion: (suggestionId: string) => {
    set(state => {
      const suggestion = state.activeSuggestions.find(s => s.id === suggestionId)
      if (!suggestion) return state

      return {
        activeSuggestions: state.activeSuggestions.filter(s => s.id !== suggestionId),
        suggestionHistory: [...state.suggestionHistory, { ...suggestion, rejectedCount: suggestion.rejectedCount + 1 }],
        aiMetrics: {
          ...state.aiMetrics,
          suggestionsRejected: state.aiMetrics.suggestionsRejected + 1
        }
      }
    })
  },

  dismissSuggestion: (suggestionId: string) => {
    set(state => ({
      activeSuggestions: state.activeSuggestions.filter(s => s.id !== suggestionId)
    }))
  },

  analyzeForm: async (formId: string) => {
    const aiService = MockAIService.getInstance()
    const optimizations = await aiService.analyzeFormOptimizations(formId)

    set(state => ({
      optimizations: [...state.optimizations, ...optimizations],
      activeOptimizations: [...state.activeOptimizations, ...optimizations]
    }))

    return optimizations
  },

  applyOptimization: (optimizationId: string) => {
    set(state => ({
      activeOptimizations: state.activeOptimizations.filter(o => o.id !== optimizationId)
    }))
  },

  setContext: (context: Partial<AIAssistantState['currentContext']>) => {
    set(state => ({
      currentContext: { ...state.currentContext, ...context }
    }))
  },

  updateMetrics: (metrics: Partial<AIAssistantState['aiMetrics']>) => {
    set(state => ({
      aiMetrics: { ...state.aiMetrics, ...metrics }
    }))
  }
}))

// Context hook for easy AI integration
export const useAIContext = (pageContext: AIAssistantState['currentContext']['pageContext']) => {
  const setContext = useAIAssistantStore(state => state.setContext)

  // Auto-update context when component mounts
  React.useEffect(() => {
    setContext({ pageContext })
  }, [pageContext, setContext])
}

export { MockAIService }