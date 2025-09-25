import React from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  UsersIcon,
  DocumentIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { useFormLibraryStore } from '@/stores/formLibraryStore'

// Analytics data using real form counts
const getAnalyticsData = (formsCount: number) => ({
  overview: {
    totalForms: { value: formsCount, change: 2, trend: 'up' },
    activeSubmissions: { value: 1247, change: -3, trend: 'down' },
    completionRate: { value: 94.2, change: 2.1, trend: 'up' },
    avgResponseTime: { value: 3.4, change: -0.7, trend: 'down', unit: 'min' }
  },
  recentActivity: [
    { id: 1, type: 'form_created', description: 'New Employee Onboarding Form created', time: '2 hours ago', user: 'Sarah Chen', status: 'success' },
    { id: 2, type: 'submission', description: '47 new submissions received', time: '4 hours ago', user: 'System', status: 'info' },
    { id: 3, type: 'form_published', description: 'Vendor Registration Form published', time: '6 hours ago', user: 'Mike Johnson', status: 'success' },
    { id: 4, type: 'alert', description: 'Form validation error spike detected', time: '8 hours ago', user: 'System', status: 'warning' }
  ],
  topPerformingForms: [
    { id: 1, name: 'Employee Onboarding', submissions: 156, completion: 97.3, trend: 'up' },
    { id: 2, name: 'Vendor Registration', submissions: 89, completion: 92.1, trend: 'up' },
    { id: 3, name: 'IT Support Request', submissions: 234, completion: 88.7, trend: 'down' },
    { id: 4, name: 'Leave Application', submissions: 67, completion: 94.5, trend: 'up' }
  ],
  alerts: [
    { id: 1, type: 'warning', message: 'Form submission rate dropped 15% this week', time: '1 hour ago' },
    { id: 2, type: 'info', message: 'Monthly compliance report ready for review', time: '3 hours ago' },
    { id: 3, type: 'success', message: 'All systems operating normally', time: '1 day ago' }
  ]
})

export function DashboardPage() {
  const { user } = useAuthStore()
  const { getForms } = useFormLibraryStore()
  const forms = getForms()
  const analyticsData = getAnalyticsData(forms.length)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-1">
                Dashboard
              </h1>
              <p className="text-osc-navy-600 dark:text-osc-navy-400">
                Welcome back, {user?.firstName || 'User'}. Here's your OSC Form Builder overview.
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center text-sm text-osc-navy-600 dark:text-osc-navy-400">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-gov p-6 h-32"
          >
            <div className="flex items-start space-x-4 h-full">
              <DocumentIcon className="w-10 h-10 text-osc-blue-600 dark:text-osc-blue-400 flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400 mb-1">Total Forms</h3>
                  <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                    {analyticsData.overview.totalForms.value.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center text-sm">
                  {analyticsData.overview.totalForms.trend === 'up' ? (
                    <ArrowUpIcon className="w-4 h-4 text-osc-green-600 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-osc-red-600 mr-1" />
                  )}
                  <span className={`font-medium mr-1 ${
                    analyticsData.overview.totalForms.trend === 'up' ? 'text-osc-green-600' : 'text-osc-red-600'
                  }`}>
                    {Math.abs(analyticsData.overview.totalForms.change)}%
                  </span>
                  <span className="text-osc-navy-500 dark:text-osc-navy-400">vs last month</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-gov p-6 h-32"
          >
            <div className="flex items-start space-x-4 h-full">
              <UsersIcon className="w-10 h-10 text-osc-green-600 dark:text-osc-green-400 flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400 mb-1">Active Submissions</h3>
                  <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                    {analyticsData.overview.activeSubmissions.value.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center text-sm">
                  {analyticsData.overview.activeSubmissions.trend === 'up' ? (
                    <ArrowUpIcon className="w-4 h-4 text-osc-green-600 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-osc-red-600 mr-1" />
                  )}
                  <span className={`font-medium mr-1 ${
                    analyticsData.overview.activeSubmissions.trend === 'up' ? 'text-osc-green-600' : 'text-osc-red-600'
                  }`}>
                    {Math.abs(analyticsData.overview.activeSubmissions.change)}%
                  </span>
                  <span className="text-osc-navy-500 dark:text-osc-navy-400">this week</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gov p-6 h-32"
          >
            <div className="flex items-start space-x-4 h-full">
              <CheckCircleIcon className="w-10 h-10 text-osc-gold-600 dark:text-osc-gold-400 flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400 mb-1">Completion Rate</h3>
                  <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                    {analyticsData.overview.completionRate.value}%
                  </p>
                </div>
                <div className="flex items-center text-sm">
                  {analyticsData.overview.completionRate.trend === 'up' ? (
                    <ArrowUpIcon className="w-4 h-4 text-osc-green-600 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-osc-red-600 mr-1" />
                  )}
                  <span className={`font-medium mr-1 ${
                    analyticsData.overview.completionRate.trend === 'up' ? 'text-osc-green-600' : 'text-osc-red-600'
                  }`}>
                    +{Math.abs(analyticsData.overview.completionRate.change)}%
                  </span>
                  <span className="text-osc-navy-500 dark:text-osc-navy-400">improvement</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-gov p-6 h-32"
          >
            <div className="flex items-start space-x-4 h-full">
              <ClockIcon className="w-10 h-10 text-osc-navy-600 dark:text-osc-navy-400 flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400 mb-1">Avg Response Time</h3>
                  <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                    {analyticsData.overview.avgResponseTime.value}{analyticsData.overview.avgResponseTime.unit}
                  </p>
                </div>
                <div className="flex items-center text-sm">
                  {analyticsData.overview.avgResponseTime.trend === 'down' ? (
                    <ArrowDownIcon className="w-4 h-4 text-osc-green-600 mr-1" />
                  ) : (
                    <ArrowUpIcon className="w-4 h-4 text-osc-red-600 mr-1" />
                  )}
                  <span className={`font-medium mr-1 ${
                    analyticsData.overview.avgResponseTime.trend === 'down' ? 'text-osc-green-600' : 'text-osc-red-600'
                  }`}>
                    {Math.abs(analyticsData.overview.avgResponseTime.change)}{analyticsData.overview.avgResponseTime.unit}
                  </span>
                  <span className="text-osc-navy-500 dark:text-osc-navy-400">faster</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Activity</span>
                  <Badge variant="secondary">{analyticsData.recentActivity.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.status === 'success' ? 'bg-osc-green-500' :
                        activity.status === 'warning' ? 'bg-osc-gold-500' :
                        'bg-osc-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                          {activity.description}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-osc-navy-500 dark:text-osc-navy-400">
                          <span>{activity.user}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                        activity.status === 'success' ? 'bg-osc-green-100 text-osc-green-800 dark:bg-osc-green-900 dark:text-osc-green-200' :
                        activity.status === 'warning' ? 'bg-osc-gold-100 text-osc-gold-800 dark:bg-osc-gold-900 dark:text-osc-gold-200' :
                        'bg-osc-blue-100 text-osc-blue-800 dark:bg-osc-blue-900 dark:text-osc-blue-200'
                      }`}>
                        {activity.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Forms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Top Performing Forms */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-osc-green-600" />
                  Top Performing Forms
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {analyticsData.topPerformingForms.map((form, index) => (
                    <div key={form.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-osc-navy-25 dark:hover:bg-osc-navy-800 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 truncate">
                          {form.name}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-osc-navy-500 dark:text-osc-navy-400">
                          <span>{form.submissions} submissions</span>
                          <span className="mx-2">•</span>
                          <span>{form.completion}% completion</span>
                        </div>
                      </div>
                      <div className="flex items-center ml-3 flex-shrink-0">
                        {form.trend === 'up' ? (
                          <ArrowUpIcon className="w-4 h-4 text-osc-green-500" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4 text-osc-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </motion.div>
    </div>
  )
}