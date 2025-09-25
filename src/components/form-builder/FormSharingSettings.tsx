import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge } from '@/components/ui'
import type { FormSharingSettings as FormSharingSettingsType, FormUserPermission, FormSharingLevel } from '@/types'

interface FormSharingSettingsProps {
  sharing: FormSharingSettingsType
  onChange: (sharing: FormSharingSettingsType) => void
}

// Mock users for demo - in real app this would come from API
const MOCK_USERS = [
  { id: '1', email: 'john.doe@osc.ny.gov', name: 'John Doe', department: 'IT' },
  { id: '2', email: 'sarah.johnson@osc.ny.gov', name: 'Sarah Johnson', department: 'HR' },
  { id: '3', email: 'michael.chen@osc.ny.gov', name: 'Michael Chen', department: 'Finance' },
  { id: '4', email: 'emily.rodriguez@osc.ny.gov', name: 'Emily Rodriguez', department: 'Legal' },
  { id: '5', email: 'david.wilson@osc.ny.gov', name: 'David Wilson', department: 'Audit' }
]

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Legal', 'Audit', 'Operations']

export function FormSharingSettings({ sharing, onChange }: FormSharingSettingsProps) {
  // Ensure sharing object has proper defaults
  const safeSharing = {
    sharingLevel: 'private' as const,
    allowedUsers: [],
    departmentAccess: [],
    inheritFromCreator: false,
    ...sharing
  }

  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [showUserSelector, setShowUserSelector] = useState(false)

  const handleSharingLevelChange = (level: FormSharingLevel) => {
    onChange({
      ...safeSharing,
      sharingLevel: level,
      // Clear specific users if switching away from specific_users
      ...(level !== 'specific_users' ? { allowedUsers: [] } : {}),
      // Clear department access if switching away from department
      ...(level !== 'department' ? { departmentAccess: [] } : {})
    })
  }

  const handleAddUser = (user: typeof MOCK_USERS[0]) => {
    if (!safeSharing.allowedUsers.find(u => u.userId === user.id)) {
      const newUser: FormUserPermission = {
        userId: user.id,
        email: user.email,
        name: user.name,
        permission: 'view'
      }
      onChange({
        ...safeSharing,
        allowedUsers: [...safeSharing.allowedUsers, newUser]
      })
    }
    setShowUserSelector(false)
    setUserSearchQuery('')
  }

  const handleRemoveUser = (userId: string) => {
    onChange({
      ...safeSharing,
      allowedUsers: safeSharing.allowedUsers.filter(u => u.userId !== userId)
    })
  }

  const handleUserPermissionChange = (userId: string, permission: 'view' | 'edit' | 'admin') => {
    onChange({
      ...safeSharing,
      allowedUsers: safeSharing.allowedUsers.map(u =>
        u.userId === userId ? { ...u, permission } : u
      )
    })
  }

  const handleDepartmentToggle = (department: string) => {
    const isSelected = safeSharing.departmentAccess.includes(department)
    onChange({
      ...safeSharing,
      departmentAccess: isSelected
        ? safeSharing.departmentAccess.filter(d => d !== department)
        : [...safeSharing.departmentAccess, department]
    })
  }

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  ).filter(user => !safeSharing.allowedUsers.find(u => u.userId === user.id))

  const getSharingLevelIcon = (level: FormSharingLevel) => {
    switch (level) {
      case 'private': return <LockClosedIcon className="w-5 h-5" />
      case 'department': return <BuildingOfficeIcon className="w-5 h-5" />
      case 'organization': return <GlobeAltIcon className="w-5 h-5" />
      case 'specific_users': return <UserGroupIcon className="w-5 h-5" />
      default: return <LockClosedIcon className="w-5 h-5" />
    }
  }

  const getSharingLevelDescription = (level: FormSharingLevel) => {
    switch (level) {
      case 'private': return 'Only you can access this form'
      case 'department': return 'Anyone in selected departments can access this form'
      case 'organization': return 'Anyone in your organization can access this form'
      case 'specific_users': return 'Only specified users can access this form'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Form Sharing & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sharing Level Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-osc-navy-800 dark:text-osc-navy-200">
              Who can access this form?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(['private', 'department', 'organization', 'specific_users'] as FormSharingLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleSharingLevelChange(level)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    safeSharing.sharingLevel === level
                      ? 'border-osc-blue-500 bg-osc-blue-50 dark:bg-osc-blue-900/20'
                      : 'border-osc-navy-200 hover:border-osc-navy-300 dark:border-osc-navy-700 dark:hover:border-osc-navy-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 ${
                      safeSharing.sharingLevel === level ? 'text-osc-blue-600' : 'text-osc-navy-500'
                    }`}>
                      {getSharingLevelIcon(level)}
                    </div>
                    <div>
                      <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100 capitalize">
                        {level.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                        {getSharingLevelDescription(level)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Department Selection */}
          {safeSharing.sharingLevel === 'department' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-medium text-osc-navy-800 dark:text-osc-navy-200">
                Select Departments
              </h4>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentToggle(dept)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      safeSharing.departmentAccess.includes(dept)
                        ? 'bg-osc-blue-100 text-osc-blue-800 border border-osc-blue-300'
                        : 'bg-osc-navy-100 text-osc-navy-700 border border-osc-navy-200 hover:bg-osc-navy-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Specific Users Selection */}
          {safeSharing.sharingLevel === 'specific_users' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-osc-navy-800 dark:text-osc-navy-200">
                  Specific Users ({safeSharing.allowedUsers.length})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUserSelector(true)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add User
                </Button>
              </div>

              {/* Current Users */}
              {safeSharing.allowedUsers.length > 0 && (
                <div className="space-y-2">
                  {safeSharing.allowedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-3 bg-osc-navy-50 dark:bg-osc-navy-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                            {user.name}
                          </div>
                          <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          options={[
                            { value: 'view', label: 'View' },
                            { value: 'edit', label: 'Edit' },
                            { value: 'admin', label: 'Admin' }
                          ]}
                          value={user.permission}
                          onChange={(e) => handleUserPermissionChange(user.userId, e.target.value as any)}
                          className="w-20"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.userId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* User Selector Modal */}
              {showUserSelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg bg-white dark:bg-osc-navy-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                      Add Users
                    </h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserSelector(false)}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <Input
                    placeholder="Search by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                    className="mb-3"
                  />

                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleAddUser(user)}
                        className="w-full p-2 text-left hover:bg-osc-navy-100 dark:hover:bg-osc-navy-700 rounded-md transition-colors duration-200"
                      >
                        <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                          {user.name}
                        </div>
                        <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                          {user.email} • {user.department}
                        </div>
                      </button>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-sm text-osc-navy-600 dark:text-osc-navy-400 text-center py-4">
                        No users found
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Inherit from Creator Option */}
          <div className="border-t border-osc-navy-200 dark:border-osc-navy-700 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={safeSharing.inheritFromCreator}
                onChange={(e) => onChange({ ...safeSharing, inheritFromCreator: e.target.checked })}
                className="w-4 h-4 text-osc-blue-600 border-gray-300 rounded focus:ring-osc-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                  Inherit permissions from form creator
                </div>
                <div className="text-xs text-osc-navy-600 dark:text-osc-navy-400">
                  Users with access to the creator's forms will also have access to this form
                </div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}