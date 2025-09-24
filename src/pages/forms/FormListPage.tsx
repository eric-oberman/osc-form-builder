import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

import { useFormLibraryStore } from '@/stores/formLibraryStore'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Select } from '@/components/ui'

export function FormListPage() {
  const {
    getForms,
    getSubmissionStats,
    searchForms,
    updateForm,
    deleteForm,
    duplicateForm
  } = useFormLibraryStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [sortBy, setSortBy] = useState('updated')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const forms = getForms()

  const filteredAndSortedForms = useMemo(() => {
    let filteredForms = searchQuery ? searchForms(searchQuery) : forms

    // Apply status filter
    if (statusFilter) {
      filteredForms = filteredForms.filter(form => form.status === statusFilter)
    }

    // Apply department filter
    if (departmentFilter) {
      filteredForms = filteredForms.filter(form => form.department === departmentFilter)
    }

    // Apply sorting
    filteredForms.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'responses':
          aValue = a.metadata.submissions_count
          bValue = b.metadata.submissions_count
          break
        case 'created':
          aValue = new Date(a.metadata.created_at)
          bValue = new Date(b.metadata.created_at)
          break
        case 'updated':
        default:
          aValue = new Date(a.metadata.updated_at)
          bValue = new Date(b.metadata.updated_at)
          break
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filteredForms
  }, [forms, searchQuery, statusFilter, departmentFilter, sortBy, sortDirection, searchForms])

  const handleDuplicateForm = (formId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    duplicateForm(formId)
  }

  const handleDeleteForm = (formId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this form?')) {
      deleteForm(formId)
    }
  }

  const handleStatusChange = (formId: string, newStatus: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    updateForm(formId, { status: newStatus as any })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'archived': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDepartmentFromForm = (form: any) => {
    const deptField = form.fields.find((field: any) => field.name === 'department')
    return deptField?.options?.[0]?.label || 'General'
  }

  const getAvailableDepartments = () => {
    const departments = new Set<string>()
    forms.forEach(form => {
      departments.add(form.department)
    })
    return Array.from(departments).sort()
  }

  const handleExportForms = () => {
    const csvHeaders = ['Title', 'Department', 'Status', 'Owner', 'Responses', 'Created', 'Updated']
    const csvData = filteredAndSortedForms.map(form => [
      form.title,
      form.department,
      form.status,
      form.metadata.created_by || 'System',
      form.metadata.submissions_count || 0,
      formatDate(form.metadata.created_at),
      formatDate(form.metadata.updated_at)
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `forms-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
              Forms
            </h1>
            <p className="text-osc-navy-600 dark:text-osc-navy-400">
              Manage and organize all forms you have access to ({forms.length} forms)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleExportForms}
              disabled={filteredAndSortedForms.length === 0}
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export ({filteredAndSortedForms.length})
            </Button>
            <Link to="/forms/new">
              <Button className="btn-gov-primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Form
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-gov p-6"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-osc-blue-100 dark:bg-osc-blue-900 rounded-lg flex items-center justify-center mr-4">
                <DocumentDuplicateIcon className="w-5 h-5 text-osc-blue-600 dark:text-osc-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Total Forms</p>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">{forms.length}</p>
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
                <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Published</p>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {forms.filter(f => f.status === 'published').length}
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
                <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Draft</p>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {forms.filter(f => f.status === 'draft').length}
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
                <UserGroupIcon className="w-5 h-5 text-osc-blue-600 dark:text-osc-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Total Responses</p>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {forms.reduce((sum, form) => sum + form.metadata.submissions_count, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Forms Management</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-osc-navy-400" />
                  <Input
                    placeholder="Search forms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'published', label: 'Published' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'archived', label: 'Archived' }
                  ]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-40"
                />
                <Select
                  options={[
                    { value: '', label: 'All Departments' },
                    ...getAvailableDepartments().map(dept => ({
                      value: dept,
                      label: dept
                    }))
                  ]}
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-48"
                />
                <Select
                  options={[
                    { value: 'updated', label: 'Last Updated' },
                    { value: 'title', label: 'Title' },
                    { value: 'responses', label: 'Response Count' },
                    { value: 'created', label: 'Date Created' }
                  ]}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-osc-navy-200 dark:border-osc-navy-700">
                    <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Form</th>
                    <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Owner</th>
                    <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Responses</th>
                    <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Last Updated</th>
                    <th className="text-right py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedForms.map((form, index) => {
                    const stats = getSubmissionStats(form.id)
                    return (
                      <motion.tr
                        key={form.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-osc-navy-100 dark:border-osc-navy-800 hover:bg-osc-navy-25 dark:hover:bg-osc-navy-800/50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <Link
                              to={`/forms/${form.id}`}
                              className="font-medium text-osc-navy-900 dark:text-osc-navy-100 hover:text-osc-blue-600 dark:hover:text-osc-blue-400"
                            >
                              {form.title}
                            </Link>
                            <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400 mt-1">
                              {form.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-osc-navy-700 dark:text-osc-navy-300">
                          {getDepartmentFromForm(form)}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getStatusColor(form.status)} className="capitalize">
                            {form.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="w-4 h-4 text-osc-navy-400" />
                            <span className="text-sm text-osc-navy-700 dark:text-osc-navy-300">
                              {form.metadata.created_by || 'System'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                              {stats.total}
                            </span>
                            {stats.completionRate > 0 && (
                              <span className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                                ({stats.completionRate.toFixed(1)}% complete)
                              </span>
                            )}
                          </div>
                          {stats.lastSubmission && (
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 mt-1">
                              Last: {formatDate(stats.lastSubmission)}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-osc-navy-500 dark:text-osc-navy-400">
                          {formatDate(form.metadata.updated_at)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to={`/analytics`}>
                              <Button variant="ghost" size="sm" title="View Analytics">
                                <ChartBarIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link to={`/forms/${form.id}/preview`}>
                              <Button variant="ghost" size="sm" title="Preview Form">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link to={`/forms/${form.id}`}>
                              <Button variant="ghost" size="sm" title="Edit Form">
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDuplicateForm(form.id, e)}
                              title="Duplicate Form"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteForm(form.id, e)}
                              title="Delete Form"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredAndSortedForms.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-osc-navy-100 dark:bg-osc-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DocumentDuplicateIcon className="w-6 h-6 text-osc-navy-600 dark:text-osc-navy-400" />
                  </div>
                  <h3 className="text-lg font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                    No forms found
                  </h3>
                  <p className="text-sm text-osc-navy-500 dark:text-osc-navy-400 mb-4">
                    {searchQuery || statusFilter || departmentFilter
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first form'
                    }
                  </p>
                  {!searchQuery && !statusFilter && (
                    <Link to="/forms/new">
                      <Button className="btn-gov-primary">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Create New Form
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}