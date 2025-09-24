import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UsersIcon,
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Select } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'

// Mock admin data - in real app would come from API
const adminData = {
  users: [
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@osc.ny.gov', role: 'Admin', department: 'IT', status: 'active', lastLogin: '2 hours ago', formsCreated: 12, permissions: ['create', 'edit', 'delete', 'manage_users'] },
    { id: 2, name: 'Mike Johnson', email: 'mike.johnson@osc.ny.gov', role: 'Form Creator', department: 'HR', status: 'active', lastLogin: '1 day ago', formsCreated: 8, permissions: ['create', 'edit'] },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@osc.ny.gov', role: 'Viewer', department: 'Finance', status: 'active', lastLogin: '3 hours ago', formsCreated: 0, permissions: ['view'] },
    { id: 4, name: 'David Kim', email: 'david.kim@osc.ny.gov', role: 'Form Creator', department: 'Operations', status: 'inactive', lastLogin: '1 week ago', formsCreated: 15, permissions: ['create', 'edit'] },
    { id: 5, name: 'Lisa Wang', email: 'lisa.wang@osc.ny.gov', role: 'Admin', department: 'IT', status: 'active', lastLogin: '30 minutes ago', formsCreated: 23, permissions: ['create', 'edit', 'delete', 'manage_users'] }
  ],
  systemStats: {
    totalUsers: 156,
    activeUsers: 142,
    inactiveUsers: 14,
    adminUsers: 8,
    totalPermissions: 24,
    securityAlerts: 3
  },
  permissions: {
    roles: [
      { id: 'admin', name: 'Administrator', description: 'Full system access with user management', userCount: 8, permissions: ['create', 'edit', 'delete', 'publish', 'manage_users', 'system_settings', 'view_analytics'] },
      { id: 'form_creator', name: 'Form Creator', description: 'Create and edit forms, view submissions', userCount: 89, permissions: ['create', 'edit', 'view', 'view_submissions'] },
      { id: 'moderator', name: 'Content Moderator', description: 'Review and approve form submissions', userCount: 34, permissions: ['view', 'moderate', 'approve', 'reject'] },
      { id: 'viewer', name: 'Viewer Only', description: 'Read-only access to forms and submissions', userCount: 25, permissions: ['view'] }
    ],
    permissions: [
      { id: 'create', name: 'Create Forms', description: 'Ability to create new forms and templates', category: 'Forms' },
      { id: 'edit', name: 'Edit Forms', description: 'Modify existing forms and their settings', category: 'Forms' },
      { id: 'delete', name: 'Delete Forms', description: 'Remove forms from the system', category: 'Forms' },
      { id: 'publish', name: 'Publish Forms', description: 'Make forms available to users', category: 'Forms' },
      { id: 'view', name: 'View Forms', description: 'Read-only access to forms', category: 'Forms' },
      { id: 'view_submissions', name: 'View Submissions', description: 'Access form submission data', category: 'Data' },
      { id: 'moderate', name: 'Moderate Content', description: 'Review user-generated content', category: 'Content' },
      { id: 'approve', name: 'Approve Submissions', description: 'Approve pending form submissions', category: 'Content' },
      { id: 'reject', name: 'Reject Submissions', description: 'Reject invalid form submissions', category: 'Content' },
      { id: 'manage_users', name: 'User Management', description: 'Add, edit, and remove users', category: 'Administration' },
      { id: 'system_settings', name: 'System Settings', description: 'Configure system-wide settings', category: 'Administration' },
      { id: 'view_analytics', name: 'View Analytics', description: 'Access system analytics and reports', category: 'Analytics' }
    ]
  },
  systemSettings: {
    general: {
      system_name: 'OSC Electronic Form Builder',
      organization: 'New York State Office of State Comptroller',
      default_timezone: 'America/New_York',
      maintenance_mode: false,
      user_registration: false,
      auto_backup: true,
      session_timeout: 8
    },
    security: {
      password_complexity: true,
      two_factor_auth: true,
      login_attempts: 5,
      lockout_duration: 30,
      password_expiry: 90,
      session_encryption: true,
      audit_logging: true,
      ip_whitelist: ['192.168.1.0/24', '10.0.0.0/8']
    },
    notifications: {
      email_notifications: true,
      admin_alerts: true,
      submission_notifications: true,
      security_alerts: true,
      backup_notifications: true,
      smtp_server: 'smtp.osc.ny.gov',
      sender_email: 'noreply@osc.ny.gov'
    },
    integrations: {
      active_directory: true,
      single_sign_on: true,
      api_enabled: true,
      webhook_enabled: true,
      export_formats: ['PDF', 'Excel', 'CSV', 'JSON'],
      max_file_size: 50
    }
  },
  recentActivity: [
    { id: 1, action: 'User Created', details: 'New user John Doe added to HR department', user: 'Sarah Chen', time: '5 minutes ago', type: 'user_created' },
    { id: 2, action: 'Permission Modified', details: 'Edit permissions granted to Emily Rodriguez', user: 'Mike Johnson', time: '1 hour ago', type: 'permission_changed' },
    { id: 3, action: 'User Deactivated', details: 'David Kim account temporarily disabled', user: 'Sarah Chen', time: '2 hours ago', type: 'user_deactivated' },
    { id: 4, action: 'Security Alert', details: 'Multiple failed login attempts detected', user: 'System', time: '3 hours ago', type: 'security_alert' }
  ]
}

const roleOptions = [
  { value: 'Admin', label: 'Administrator' },
  { value: 'Form Creator', label: 'Form Creator' },
  { value: 'Viewer', label: 'Viewer Only' },
  { value: 'Moderator', label: 'Content Moderator' }
]

const departmentOptions = [
  { value: 'IT', label: 'Information Technology' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Legal', label: 'Legal Affairs' },
  { value: 'Executive', label: 'Executive Office' }
]

export function AdminPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'system' | 'activity'>('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  const filteredUsers = adminData.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || user.role === filterRole
    const matchesStatus = !filterStatus || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const tabs = [
    { id: 'users', label: 'User Management', icon: UsersIcon, count: adminData.systemStats.totalUsers },
    { id: 'permissions', label: 'Permissions', icon: ShieldCheckIcon, count: adminData.systemStats.totalPermissions },
    { id: 'system', label: 'System Settings', icon: CogIcon, count: null },
    { id: 'activity', label: 'Activity Log', icon: DocumentTextIcon, count: adminData.recentActivity.length }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
                Administrative Console
              </h1>
              <p className="text-osc-navy-600 dark:text-osc-navy-400">
                Manage users, permissions, and system settings for OSC Form Builder
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Sync Directory
              </Button>
              <Button className="btn-gov-primary">
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-gov p-6"
          >
            <div className="flex items-center">
              <UsersIcon className="w-8 h-8 text-osc-blue-600 dark:text-osc-blue-400 mr-4" />
              <div>
                <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Total Users</h3>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {adminData.systemStats.totalUsers}
                </p>
                <p className="text-xs text-osc-green-600 dark:text-osc-green-400">
                  {adminData.systemStats.activeUsers} active
                </p>
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
              <ShieldCheckIcon className="w-8 h-8 text-osc-green-600 dark:text-osc-green-400 mr-4" />
              <div>
                <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Admin Users</h3>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {adminData.systemStats.adminUsers}
                </p>
                <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                  Full access level
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
              <LockClosedIcon className="w-8 h-8 text-osc-gold-600 dark:text-osc-gold-400 mr-4" />
              <div>
                <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Permissions</h3>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {adminData.systemStats.totalPermissions}
                </p>
                <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                  Active roles
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
              <ExclamationTriangleIcon className="w-8 h-8 text-osc-red-600 dark:text-osc-red-400 mr-4" />
              <div>
                <h3 className="text-sm font-medium text-osc-navy-600 dark:text-osc-navy-400">Security Alerts</h3>
                <p className="text-2xl font-bold text-osc-navy-900 dark:text-osc-navy-100">
                  {adminData.systemStats.securityAlerts}
                </p>
                <p className="text-xs text-osc-red-600 dark:text-osc-red-400">
                  Requires attention
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 bg-osc-navy-100 dark:bg-osc-navy-800 p-1 rounded-lg">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-osc-navy-700 text-osc-navy-900 dark:text-osc-navy-100 shadow-sm'
                          : 'text-osc-navy-600 dark:text-osc-navy-400 hover:text-osc-navy-900 dark:hover:text-osc-navy-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                      {tab.count && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {tab.count}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* User Management Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                      User Management
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <MagnifyingGlassIcon className="w-4 h-4 text-osc-navy-400" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64"
                        />
                      </div>
                      <Select
                        options={[{ value: '', label: 'All Roles' }, ...roleOptions]}
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="w-40"
                      />
                      <Select
                        options={[
                          { value: '', label: 'All Status' },
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' }
                        ]}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-osc-navy-200 dark:border-osc-navy-700">
                          <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">User</th>
                          <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Department</th>
                          <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Last Login</th>
                          <th className="text-left py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Forms</th>
                          <th className="text-right py-3 px-4 font-medium text-osc-navy-600 dark:text-osc-navy-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-osc-navy-100 dark:border-osc-navy-800 hover:bg-osc-navy-25 dark:hover:bg-osc-navy-800/50"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                                  {user.name}
                                </div>
                                <div className="text-sm text-osc-navy-500 dark:text-osc-navy-400">
                                  {user.email}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant={user.role === 'Admin' ? 'destructive' : user.role === 'Form Creator' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-osc-navy-700 dark:text-osc-navy-300">
                              {user.department}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                {user.status === 'active' ? (
                                  <CheckCircleIcon className="w-4 h-4 text-osc-green-500 mr-2" />
                                ) : (
                                  <XCircleIcon className="w-4 h-4 text-osc-red-500 mr-2" />
                                )}
                                <span className={`text-sm font-medium ${
                                  user.status === 'active' ? 'text-osc-green-600' : 'text-osc-red-600'
                                }`}>
                                  {user.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-osc-navy-500 dark:text-osc-navy-400">
                              {user.lastLogin}
                            </td>
                            <td className="py-4 px-4 text-osc-navy-700 dark:text-osc-navy-300">
                              {user.formsCreated}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm">
                                  <EyeIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'permissions' && (
                <motion.div
                  key="permissions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                    Permission Management
                  </h3>

                  {/* Roles Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        User Roles
                        <Button variant="outline" size="sm">
                          <UserPlusIcon className="w-4 h-4 mr-2" />
                          Create Role
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {adminData.permissions.roles.map((role) => (
                          <motion.div
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 border border-osc-navy-200 dark:border-osc-navy-700 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">
                                {role.name}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {role.userCount} users
                              </Badge>
                            </div>
                            <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400 mb-3">
                              {role.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {role.permissions.slice(0, 3).map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {role.permissions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Permissions Matrix */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Permission Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {['Forms', 'Data', 'Content', 'Administration', 'Analytics'].map((category) => {
                          const categoryPerms = adminData.permissions.permissions.filter(p => p.category === category)
                          return (
                            <div key={category}>
                              <h5 className="font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-3">
                                {category}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categoryPerms.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="p-3 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg"
                                  >
                                    <h6 className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100 mb-1">
                                      {permission.name}
                                    </h6>
                                    <p className="text-xs text-osc-navy-600 dark:text-osc-navy-400">
                                      {permission.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                    System Settings
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">General Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">System Name</label>
                          <Input value={adminData.systemSettings.general.system_name} className="mt-1" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Organization</label>
                          <Input value={adminData.systemSettings.general.organization} className="mt-1" readOnly />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Maintenance Mode</label>
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">Enable for system updates</p>
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                            adminData.systemSettings.general.maintenance_mode ? 'bg-osc-red-500' : 'bg-osc-navy-300'
                          }`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              adminData.systemSettings.general.maintenance_mode ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Auto Backup</label>
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">Daily automated backups</p>
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                            adminData.systemSettings.general.auto_backup ? 'bg-osc-green-500' : 'bg-osc-navy-300'
                          }`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              adminData.systemSettings.general.auto_backup ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />
                          Security Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Two-Factor Authentication</label>
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">Required for admin users</p>
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                            adminData.systemSettings.security.two_factor_auth ? 'bg-osc-green-500' : 'bg-osc-navy-300'
                          }`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              adminData.systemSettings.security.two_factor_auth ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Login Attempts</label>
                          <Input value={adminData.systemSettings.security.login_attempts} className="mt-1" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Session Timeout (hours)</label>
                          <Input value={adminData.systemSettings.general.session_timeout} className="mt-1" readOnly />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Audit Logging</label>
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">Track all user actions</p>
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                            adminData.systemSettings.security.audit_logging ? 'bg-osc-green-500' : 'bg-osc-navy-300'
                          }`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              adminData.systemSettings.security.audit_logging ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Integration Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Integrations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Active Directory</label>
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">LDAP authentication</p>
                          </div>
                          <Badge variant={adminData.systemSettings.integrations.active_directory ? 'default' : 'secondary'}>
                            {adminData.systemSettings.integrations.active_directory ? 'Connected' : 'Disabled'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Single Sign-On</label>
                            <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400">SAML 2.0 integration</p>
                          </div>
                          <Badge variant={adminData.systemSettings.integrations.single_sign_on ? 'default' : 'secondary'}>
                            {adminData.systemSettings.integrations.single_sign_on ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Export Formats</label>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {adminData.systemSettings.integrations.export_formats.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Max File Size</label>
                          <Input value={`${adminData.systemSettings.integrations.max_file_size} MB`} className="mt-1" readOnly />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">SMTP Server</label>
                          <Input value={adminData.systemSettings.notifications.smtp_server} className="mt-1" readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300">Sender Email</label>
                          <Input value={adminData.systemSettings.notifications.sender_email} className="mt-1" readOnly />
                        </div>
                        <div className="space-y-2">
                          {[
                            { key: 'email_notifications', label: 'Email Notifications' },
                            { key: 'admin_alerts', label: 'Admin Alerts' },
                            { key: 'security_alerts', label: 'Security Alerts' },
                            { key: 'backup_notifications', label: 'Backup Notifications' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                              <label className="text-sm text-osc-navy-700 dark:text-osc-navy-300">{item.label}</label>
                              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                                adminData.systemSettings.notifications[item.key as keyof typeof adminData.systemSettings.notifications] ? 'bg-osc-green-500' : 'bg-osc-navy-300'
                              }`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  adminData.systemSettings.notifications[item.key as keyof typeof adminData.systemSettings.notifications] ? 'translate-x-4' : 'translate-x-0'
                                }`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-osc-navy-900 dark:text-osc-navy-100">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {adminData.recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'security_alert' ? 'bg-osc-red-500' :
                          activity.type === 'user_created' ? 'bg-osc-green-500' :
                          activity.type === 'permission_changed' ? 'bg-osc-gold-500' :
                          'bg-osc-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-osc-navy-900 dark:text-osc-navy-100">
                              {activity.action}
                            </p>
                            <span className="text-xs text-osc-navy-500 dark:text-osc-navy-400">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400 mt-1">
                            {activity.details}
                          </p>
                          <p className="text-xs text-osc-navy-500 dark:text-osc-navy-400 mt-1">
                            by {activity.user}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}