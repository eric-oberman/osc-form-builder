import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronRightIcon, ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

const tutorialSteps = [
  {
    title: "Welcome to OSC Form Builder",
    content: "Learn how to create professional government forms with our powerful form building platform.",
    image: "/tutorial/welcome.png", // These would be actual tutorial images
    tips: [
      "Start with a clear understanding of your form's purpose",
      "Gather all required information before building",
      "Consider your users' needs and technical abilities"
    ]
  },
  {
    title: "Creating Your First Form",
    content: "Navigate to Forms > Create New Form to begin building. Choose from templates or start from scratch.",
    image: "/tutorial/create-form.png",
    tips: [
      "Use templates for common government forms",
      "Give your form a descriptive title",
      "Add a clear description of the form's purpose"
    ]
  },
  {
    title: "Adding Form Fields",
    content: "Drag and drop fields from the sidebar to build your form. Choose from 20+ field types.",
    image: "/tutorial/add-fields.png",
    tips: [
      "Use appropriate field types for better user experience",
      "Mark required fields clearly",
      "Add helpful descriptions to complex fields"
    ]
  },
  {
    title: "Field Validation",
    content: "Set up validation rules to ensure data quality and prevent errors before submission.",
    image: "/tutorial/validation.png",
    tips: [
      "Use built-in validation for common patterns",
      "Provide clear error messages",
      "Test validation rules thoroughly"
    ]
  },
  {
    title: "Accessibility Features",
    content: "Ensure your forms meet WCAG 2.1 AA standards with our built-in accessibility tools.",
    image: "/tutorial/accessibility.png",
    tips: [
      "All fields must have proper labels",
      "Use high contrast colors",
      "Test with screen readers"
    ]
  },
  {
    title: "Publishing Your Form",
    content: "Preview, test, and publish your form when ready. Monitor responses and analytics.",
    image: "/tutorial/publish.png",
    tips: [
      "Always preview before publishing",
      "Test on multiple devices",
      "Set up response notifications"
    ]
  }
]

export function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)

  if (!showTutorial) {
    return (
      <div className="min-h-screen bg-gradient-gov text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto p-8"
        >
          <div className="h-24 w-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-bold text-4xl">OSC</span>
          </div>

          <h1 className="text-6xl font-bold mb-6">
            Form Builder Tutorial
          </h1>

          <p className="text-2xl text-white/90 mb-8">
            OSC Electronic Form Builder
          </p>

          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Learn how to create professional government forms with advanced features,
            AI-powered optimization, and built-in accessibility compliance.
          </p>

          <button
            onClick={() => setShowTutorial(true)}
            className="bg-white text-osc-navy-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/90 transition-colors"
          >
            Start Tutorial
          </button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-2">6 Steps</h3>
              <p className="text-white/80">Interactive Tutorial</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-2">20+</h3>
              <p className="text-white/80">Field Types</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-2">WCAG</h3>
              <p className="text-white/80">2.1 AA Compliant</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentTutorialStep = tutorialSteps[currentStep]

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const closeTutorial = () => {
    setShowTutorial(false)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gradient-gov text-white">
      {/* Tutorial Modal */}
      <div className="relative z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-gov text-white px-8 py-6 relative">
              <button
                onClick={closeTutorial}
                className="absolute top-6 right-6 text-white hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentTutorialStep.title}</h2>
                  <p className="text-white/80 mt-1">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-48">
                  <div className="bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-gray-900">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Tutorial Image Placeholder */}
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gradient-gov rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">OSC</span>
                    </div>
                    <p className="text-sm">Tutorial Step {currentStep + 1}</p>
                    <p className="text-xs text-gray-400 mt-1">Interactive Demo</p>
                  </div>
                </div>

                {/* Tutorial Content */}
                <div>
                  <p className="text-lg text-gray-700 mb-6">
                    {currentTutorialStep.content}
                  </p>

                  {/* Tips */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">💡 Pro Tips:</h4>
                    <ul className="space-y-2">
                      {currentTutorialStep.tips.map((tip, index) => (
                        <li key={index} className="text-blue-800 text-sm flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 px-8 py-6 flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Previous
              </button>

              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? 'bg-osc-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep === tutorialSteps.length - 1 ? (
                <button
                  onClick={closeTutorial}
                  className="bg-gradient-gov text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Finish Tutorial
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 bg-osc-blue-600 text-white rounded-lg hover:bg-osc-blue-700"
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5 ml-1" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}