import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  DocumentPlusIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export function WelcomePage() {
  const features = [
    {
      icon: DocumentPlusIcon,
      title: 'Advanced Form Builder',
      description: 'Create sophisticated forms with 20+ field types, conditional logic, and drag-and-drop interface.'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description: 'Monitor form performance with comprehensive analytics and executive-level reporting.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Government-Grade Security',
      description: 'Built with WCAG 2.1 AA compliance and enterprise-level security standards.'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Optimization',
      description: 'Smart suggestions and automated optimization to improve form completion rates.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-osc-navy-900 via-osc-navy-800 to-osc-blue-900 text-white py-20">
        <div className="container-gov">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Electronic Form Builder
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 text-pretty">
              Government-grade form creation platform designed for the
              New York State Office of State Comptroller
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="btn-gov-primary text-lg px-8 py-4"
              >
                Get Started
              </Link>
              <Link
                to="/tutorial"
                className="btn-gov-secondary text-lg px-8 py-4 bg-white/20 border-white/50 hover:bg-white/30 text-white"
              >
                View Tutorial
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-white dark:bg-osc-navy-900">
        <div className="container-gov">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-4">
              Professional Form Management
            </h2>
            <p className="text-xl text-osc-navy-700 dark:text-osc-navy-300">
              Everything you need to create, manage, and optimize electronic forms
              for government operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-gov p-8 hover:shadow-gov-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-gov rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-osc-navy-700 dark:text-osc-navy-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-gov text-white">
        <div className="container-gov text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Forms?
            </h2>
            <p className="text-xl text-white mb-8">
              Join the OSC Electronic Form Builder and experience the future of
              government form management.
            </p>
            <Link
              to="/login"
              className="btn-gov-secondary bg-white text-osc-navy-900 hover:bg-white/90 text-lg px-8 py-4"
            >
              Start Building Forms
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}