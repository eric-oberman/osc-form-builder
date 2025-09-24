import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

import { useAuthStore } from '@/stores/authStore'
import { Button, Input, Card } from '@/components/ui'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, isAuthenticated, user } = useAuthStore()

  console.log('🔍 LoginPage render - isAuthenticated:', isAuthenticated, 'user:', user?.email)

  if (isAuthenticated) {
    console.log('🎯 User is authenticated, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Login form submitted:', { email, password: '***' })

    try {
      console.log('📡 Calling login function...')
      await login(email, password)
      console.log('🎯 Login function completed successfully')
      // Don't show toast here - the redirect will happen automatically
      // toast.success('Successfully logged in!')
    } catch (error) {
      console.error('💥 Login error caught in component:', error)
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="lg:mt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="card-gov-executive p-8"
      >
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-gov rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">OSC</span>
          </div>
          <h1 className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Sign in to your account
          </h1>
          <p className="text-osc-navy-600 dark:text-osc-navy-400">
            Access the OSC Electronic Form Builder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-osc-navy-400 hover:text-osc-navy-600 dark:hover:text-osc-navy-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
            Demo credentials: any email/password
          </p>
        </div>
      </motion.div>
    </div>
  )
}