import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  EyeIcon,
  FunnelIcon,
  ChartPieIcon,
  TableCellsIcon,
  UserIcon
} from '@heroicons/react/24/outline'

import { useFormLibraryStore } from '@/stores/formLibraryStore'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Select } from '@/components/ui'

export function AnalyticsPage() {
  const {
    getForms,
    getFormById,
    getSubmissions,
    getSubmissionStats,
    getFormAnalytics
  } = useFormLibraryStore()

  const [selectedFormId, setSelectedFormId] = useState('')
  const [viewMode, setViewMode] = useState<'overview' | 'responses' | 'charts'>('overview')
  const [responseView, setResponseView] = useState<'by-question' | 'by-respondent'>('by-question')

  const forms = getForms()
  const selectedForm = selectedFormId ? getFormById(selectedFormId) : null
  const submissions = selectedFormId ? getSubmissions(selectedFormId) : []
  const stats = selectedFormId ? getSubmissionStats(selectedFormId) : null
  const analytics = selectedFormId ? getFormAnalytics(selectedFormId) : null

  // Auto-select first form if none selected
  React.useEffect(() => {
    if (!selectedFormId && forms.length > 0) {
      setSelectedFormId(forms[0].id)
    }
  }, [forms, selectedFormId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleExportCSV = () => {
    if (!selectedForm || !submissions.length) return

    const completedSubmissions = submissions.filter(sub => sub.status === 'complete')
    if (!completedSubmissions.length) {
      alert('No completed responses to export')
      return
    }

    // Create CSV headers
    const headers = [
      'Submission ID',
      'Submitted At',
      'Completion Time',
      ...selectedForm.fields.map(field => field.label)
    ]

    // Create CSV rows
    const rows = completedSubmissions.map(submission => {
      const row = [
        submission.id.substr(-8).toUpperCase(),
        formatDate(submission.metadata.submitted_at),
        submission.metadata.completion_time
          ? formatDuration(submission.metadata.completion_time)
          : 'N/A'
      ]

      // Add response for each field
      selectedForm.fields.forEach(field => {
        const response = submission.data[field.name]
        if (response === undefined || response === null) {
          row.push('')
        } else if (Array.isArray(response)) {
          row.push(response.join('; '))
        } else {
          row.push(String(response))
        }
      })

      return row
    })

    // Convert to CSV format
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedForm.title.replace(/[^a-zA-Z0-9]/g, '_')}_responses.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const ResponseByQuestionView = () => {
    if (!selectedForm || !analytics) return null

    return (
      <div className="space-y-6">
        {selectedForm.fields.map((field) => {
          const responses = analytics.responses[field.id] || []
          const hasResponses = responses.length > 0

          return (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{field.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {responses.length} responses
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasResponses ? (
                  <div className="space-y-2">
                    {field.type === 'textarea' ? (
                      // Show first few responses for text areas
                      responses.slice(0, 5).map((response, idx) => (
                        <div key={idx} className="p-3 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg">
                          <p className="text-sm text-osc-navy-700 dark:text-osc-navy-300">
                            {response.length > 150 ? `${response.substring(0, 150)}...` : response}
                          </p>
                        </div>
                      ))
                    ) : ['select', 'radio', 'checkboxgroup'].includes(field.type) ? (
                      // Show response distribution for choice fields
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(
                          responses.reduce((acc: Record<string, number>, response) => {
                            if (Array.isArray(response)) {
                              response.forEach(val => {
                                acc[val] = (acc[val] || 0) + 1
                              })
                            } else {
                              acc[response] = (acc[response] || 0) + 1
                            }
                            return acc
                          }, {})
                        ).map(([value, count]) => (
                          <div key={value} className="p-2 bg-osc-navy-25 dark:bg-osc-navy-800 rounded">
                            <div className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                              {field.options?.find(opt => opt.value === value)?.label || value}
                            </div>
                            <div className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                              {count} responses
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Show raw responses for other field types
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {responses.slice(0, 8).map((response, idx) => (
                          <div key={idx} className="p-2 bg-osc-navy-25 dark:bg-osc-navy-800 rounded text-sm text-osc-navy-700 dark:text-osc-navy-300">
                            {response}
                          </div>
                        ))}
                        {responses.length > 8 && (
                          <div className="p-2 bg-osc-navy-100 dark:bg-osc-navy-700 rounded text-sm text-osc-navy-500 dark:text-osc-navy-400">
                            +{responses.length - 8} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                    No responses for this field yet
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const ResponseByRespondentView = () => {
    const completedSubmissions = submissions.filter(sub => sub.status === 'complete')

    if (!selectedForm || !completedSubmissions.length) {
      return (
        <div className="text-center py-12">
          <TableCellsIcon className="w-12 h-12 text-osc-navy-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            No Completed Responses
          </h3>
          <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
            Completed form responses will appear here in table format
          </p>
        </div>
      )
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TableCellsIcon className="w-5 h-5 mr-2" />
              Response Data Table
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {completedSubmissions.length} responses
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="border-gov-secondary text-gov-secondary hover:bg-gov-secondary hover:text-white"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Export Table
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-osc-navy-200 dark:border-osc-navy-700">
                  <th className="text-left py-3 px-3 font-medium text-osc-navy-600 dark:text-osc-navy-400 bg-osc-navy-25 dark:bg-osc-navy-800 sticky left-0">
                    Response ID
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-osc-navy-600 dark:text-osc-navy-400 bg-osc-navy-25 dark:bg-osc-navy-800">
                    Date
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-osc-navy-600 dark:text-osc-navy-400 bg-osc-navy-25 dark:bg-osc-navy-800">
                    Duration
                  </th>
                  {selectedForm.fields.map((field) => (
                    <th
                      key={field.id}
                      className="text-left py-3 px-3 font-medium text-osc-navy-600 dark:text-osc-navy-400 bg-osc-navy-25 dark:bg-osc-navy-800 min-w-32"
                      title={field.label}
                    >
                      <div className="max-w-32 truncate">
                        {field.label}
                      </div>
                      <div className="text-xs font-normal text-osc-navy-400 dark:text-osc-navy-500">
                        {field.type}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completedSubmissions.slice(0, 50).map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-osc-navy-100 dark:border-osc-navy-800 hover:bg-osc-navy-25 dark:hover:bg-osc-navy-800/50"
                  >
                    <td className="py-3 px-3 font-medium text-osc-navy-900 dark:text-osc-navy-100 bg-white dark:bg-osc-navy-900 sticky left-0 border-r border-osc-navy-200 dark:border-osc-navy-700">
                      {submission.id.substr(-8).toUpperCase()}
                    </td>
                    <td className="py-3 px-3 text-sm text-osc-navy-500 dark:text-osc-navy-400">
                      {new Date(submission.metadata.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-sm text-osc-navy-500 dark:text-osc-navy-400">
                      {submission.metadata.completion_time
                        ? formatDuration(submission.metadata.completion_time)
                        : 'N/A'
                      }
                    </td>
                    {selectedForm.fields.map((field) => {
                      const response = submission.data[field.name]
                      return (
                        <td key={field.id} className="py-3 px-3 text-sm text-osc-navy-700 dark:text-osc-navy-300">
                          <div className="max-w-32 overflow-hidden">
                            {response === undefined || response === null ? (
                              <span className="text-osc-navy-400 dark:text-osc-navy-500 italic">—</span>
                            ) : Array.isArray(response) ? (
                              <div className="space-y-1">
                                {response.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="inline-block bg-osc-navy-100 dark:bg-osc-navy-700 px-2 py-1 rounded text-xs mr-1 mb-1"
                                  >
                                    {String(item)}
                                  </div>
                                ))}
                              </div>
                            ) : field.type === 'textarea' ? (
                              <div
                                className="truncate max-w-32"
                                title={String(response)}
                              >
                                {String(response).substring(0, 50)}
                                {String(response).length > 50 && '...'}
                              </div>
                            ) : (
                              <div
                                className="truncate max-w-32"
                                title={String(response)}
                              >
                                {String(response)}
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {completedSubmissions.length > 50 && (
            <div className="mt-4 p-4 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg text-center">
              <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                Showing first 50 responses. Export CSV to view all {completedSubmissions.length} responses.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const ChartsView = () => {
    if (!analytics || !analytics.charts.length) {
      return (
        <div className="text-center py-12">
          <ChartPieIcon className="w-12 h-12 text-osc-navy-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            No Charts Available
          </h3>
          <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
            Charts will appear here for forms with select, radio, or checkbox fields
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.charts.map((chart) => (
          <Card key={chart.fieldId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                {chart.type === 'bar' ? <ChartBarIcon className="w-4 h-4 mr-2" /> : <ChartPieIcon className="w-4 h-4 mr-2" />}
                {chart.fieldLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chart.data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-osc-navy-700 dark:text-osc-navy-300">
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-osc-navy-200 dark:bg-osc-navy-700 rounded-full h-2">
                        <div
                          className="bg-osc-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(item.value / Math.max(...chart.data.map(d => d.value))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 w-8">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            Form Responses
          </h1>
          <p className="text-osc-navy-600 dark:text-osc-navy-400 mb-6">
            Detailed analytics and response data for your forms
          </p>

          {/* Prominent Form Selector */}
          <Card className="mb-6 border-2 border-gov-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FunnelIcon className="w-6 h-6 text-gov-secondary" />
                  <div>
                    <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                      Select Form to Analyze
                    </h3>
                    <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                      Choose a form to view detailed response data and analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    options={[
                      { value: '', label: 'Select a form...' },
                      ...forms.map(form => ({
                        value: form.id,
                        label: form.title
                      }))
                    ]}
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                    className="w-80"
                  />
                  {selectedFormId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      className="border-gov-secondary text-gov-secondary hover:bg-gov-secondary hover:text-white"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedForm && stats ? (
          <>
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-gov p-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-osc-blue-100 dark:bg-osc-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <DocumentTextIcon className="w-5 h-5 text-osc-blue-600 dark:text-osc-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Total Responses</p>
                    <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">{stats.total}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-gov p-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-osc-green-100 dark:bg-osc-green-900 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircleIcon className="w-5 h-5 text-osc-green-600 dark:text-osc-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                      {stats.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-gov p-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-osc-gold-100 dark:bg-osc-gold-900 rounded-lg flex items-center justify-center mr-4">
                    <ClockIcon className="w-5 h-5 text-osc-gold-600 dark:text-osc-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Avg. Time</p>
                    <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                      {formatDuration(Math.round(stats.averageTime))}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-gov p-6"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-osc-blue-100 dark:bg-osc-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <CalendarIcon className="w-5 h-5 text-osc-blue-600 dark:text-osc-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Last Response</p>
                    <p className="text-sm font-bold text-osc-navy-900 dark:text-osc-navy-100">
                      {stats.lastSubmission ? new Date(stats.lastSubmission).toLocaleDateString() : 'None'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* View Mode Tabs */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1 bg-osc-navy-100 dark:bg-osc-navy-800 p-1 rounded-lg">
                    {[
                      { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                      { id: 'responses', label: 'Responses', icon: TableCellsIcon },
                      { id: 'charts', label: 'Charts', icon: ChartPieIcon }
                    ].map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setViewMode(tab.id as any)}
                          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            viewMode === tab.id
                              ? 'bg-white dark:bg-osc-navy-700 text-osc-navy-900 dark:text-osc-navy-100 shadow-sm'
                              : 'text-osc-navy-600 dark:text-osc-navy-400 hover:text-osc-navy-900 dark:hover:text-osc-navy-200'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>

                  {viewMode === 'responses' && (
                    <Select
                      options={[
                        { value: 'by-question', label: 'Group by Question' },
                        { value: 'by-respondent', label: 'Group by Respondent' }
                      ]}
                      value={responseView}
                      onChange={(e) => setResponseView(e.target.value as any)}
                      className="w-48"
                    />
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Content Views */}
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'overview' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Form Overview: {selectedForm.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-4">Form Details</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Form ID:</dt>
                            <dd className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">{selectedForm.id.substr(-8).toUpperCase()}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Status:</dt>
                            <dd>
                              <Badge variant={selectedForm.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                                {selectedForm.status}
                              </Badge>
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Fields:</dt>
                            <dd className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">{selectedForm.fields.length}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Created:</dt>
                            <dd className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                              {new Date(selectedForm.metadata.created_at).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-4">Response Statistics</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Completed:</dt>
                            <dd className="text-sm font-medium text-osc-green-600 dark:text-osc-green-400">{stats.completed}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Partial:</dt>
                            <dd className="text-sm font-medium text-osc-gold-600 dark:text-osc-gold-400">{stats.partial}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Abandoned:</dt>
                            <dd className="text-sm font-medium text-osc-red-600 dark:text-osc-red-400">{stats.abandoned}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {viewMode === 'responses' && responseView === 'by-question' && <ResponseByQuestionView />}
              {viewMode === 'responses' && responseView === 'by-respondent' && <ResponseByRespondentView />}
              {viewMode === 'charts' && <ChartsView />}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-osc-navy-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
              Select a Form to View Analytics
            </h3>
            <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
              Choose a form from the dropdown above to view detailed response data and analytics
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}