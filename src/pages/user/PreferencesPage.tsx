import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  BellIcon,
  EyeIcon,
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckIcon,
  PencilIcon,
  KeyIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  TrashIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Select, Checkbox } from '@/components/ui'

export function PreferencesPage() {
  const { user } = useAuthStore()
  const { theme, setTheme } = useThemeStore()

  const [activeSection, setActiveSection] = useState('profile')
  const [formData, setFormData] = useState({
    // Profile Settings
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@osc.ny.gov',
    department: 'IT',
    title: 'Senior Analyst',
    phone: '(518) 555-0123',

    // Notification Preferences
    emailNotifications: true,
    formSubmissionAlerts: true,
    weeklyDigest: true,
    securityAlerts: true,
    maintenanceNotifications: false,
    marketingEmails: false,

    // Accessibility Settings
    fontSize: 'medium',
    contrastMode: 'normal',
    motionReduced: false,
    screenReaderOptimized: false,

    // System Preferences
    language: 'en-US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US',

    // Security Settings
    twoFactorEnabled: true,
    sessionTimeout: 8,
    passwordExpiryDays: 90,

    // Form Builder Preferences
    defaultFieldWidth: 'full',
    autoSave: true,
    templateSuggestions: true,
    dragDropEnabled: true
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving preferences:', formData)
    // Show success message
  }

  // Mock user data for admin user management
  const [users, setUsers] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@osc.ny.gov',
      role: 'admin' as const,
      department: 'IT',
      isActive: true,
      lastLogin: '2024-09-20'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@osc.ny.gov',
      role: 'form_builder' as const,
      department: 'HR',
      isActive: true,
      lastLogin: '2024-09-21'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@osc.ny.gov',
      role: 'form_viewer' as const,
      department: 'Finance',
      isActive: true,
      lastLogin: '2024-09-19'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@osc.ny.gov',
      role: 'manager' as const,
      department: 'Legal',
      isActive: false,
      lastLogin: '2024-09-15'
    }
  ])

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: newRole as any } : user
      )
    )
  }

  const handleUserToggle = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    )
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'form_builder': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'form_viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'accessibility', label: 'Accessibility', icon: EyeIcon },
    { id: 'system', label: 'System', icon: CogIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'formbuilder', label: 'Form Builder', icon: DocumentTextIcon },
    ...(user?.role === 'admin' ? [{ id: 'usermanagement', label: 'User Management', icon: UserGroupIcon }] : [])
  ]

  const ProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Department"
              options={[
                { value: 'IT', label: 'Information Technology' },
                { value: 'HR', label: 'Human Resources' },
                { value: 'Finance', label: 'Finance and Budget' },
                { value: 'Legal', label: 'Legal Affairs' },
                { value: 'Audit', label: 'State and Local Government Audit' },
                { value: 'Operations', label: 'Operations' }
              ]}
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
            />
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg">
              <div>
                <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">Account Status</h4>
                <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Your account is active and verified</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg">
              <div>
                <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">Member Since</h4>
                <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">January 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const NotificationsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Checkbox
            label="Email Notifications"
            checked={formData.emailNotifications}
            onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
            helperText="Receive notifications via email"
          />
          <Checkbox
            label="Form Submission Alerts"
            checked={formData.formSubmissionAlerts}
            onChange={(e) => handleInputChange('formSubmissionAlerts', e.target.checked)}
            helperText="Get notified when forms receive new submissions"
          />
          <Checkbox
            label="Weekly Activity Digest"
            checked={formData.weeklyDigest}
            onChange={(e) => handleInputChange('weeklyDigest', e.target.checked)}
            helperText="Weekly summary of your forms and submissions"
          />
          <Checkbox
            label="Security Alerts"
            checked={formData.securityAlerts}
            onChange={(e) => handleInputChange('securityAlerts', e.target.checked)}
            helperText="Important security notifications and account changes"
          />
          <Checkbox
            label="Maintenance Notifications"
            checked={formData.maintenanceNotifications}
            onChange={(e) => handleInputChange('maintenanceNotifications', e.target.checked)}
            helperText="System maintenance and update notifications"
          />
        </CardContent>
      </Card>
    </div>
  )

  const AccessibilitySection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <PaintBrushIcon className="w-5 h-5 mr-2" />
            Visual Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-osc-navy-700 dark:text-osc-navy-300 mb-2">
              Theme Preference
            </label>
            <div className="flex space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex items-center"
              >
                <SunIcon className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex items-center"
              >
                <MoonIcon className="w-4 h-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex items-center"
              >
                <ComputerDesktopIcon className="w-4 h-4 mr-2" />
                System
              </Button>
            </div>
          </div>

          <Select
            label="Font Size"
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium (Default)' },
              { value: 'large', label: 'Large' },
              { value: 'extra-large', label: 'Extra Large' }
            ]}
            value={formData.fontSize}
            onChange={(e) => handleInputChange('fontSize', e.target.value)}
          />

          <Select
            label="Contrast Mode"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High Contrast' },
              { value: 'extra-high', label: 'Extra High Contrast' }
            ]}
            value={formData.contrastMode}
            onChange={(e) => handleInputChange('contrastMode', e.target.value)}
          />

          <Checkbox
            label="Reduce Motion"
            checked={formData.motionReduced}
            onChange={(e) => handleInputChange('motionReduced', e.target.checked)}
            helperText="Minimize animations and transitions"
          />

          <Checkbox
            label="Screen Reader Optimized"
            checked={formData.screenReaderOptimized}
            onChange={(e) => handleInputChange('screenReaderOptimized', e.target.checked)}
            helperText="Optimize interface for screen readers"
          />
        </CardContent>
      </Card>
    </div>
  )

  const SystemSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Language"
            options={[
              { value: 'en-US', label: 'English (US)' },
              { value: 'es-ES', label: 'Español' },
              { value: 'fr-FR', label: 'Français' }
            ]}
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
          />

          <Select
            label="Timezone"
            options={[
              { value: 'America/New_York', label: 'Eastern Time (US)' },
              { value: 'America/Chicago', label: 'Central Time (US)' },
              { value: 'America/Denver', label: 'Mountain Time (US)' },
              { value: 'America/Los_Angeles', label: 'Pacific Time (US)' }
            ]}
            value={formData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
          />

          <Select
            label="Date Format"
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/25/2024)' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (25/12/2024)' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-25)' }
            ]}
            value={formData.dateFormat}
            onChange={(e) => handleInputChange('dateFormat', e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  )

  const SecuritySection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg">
            <div>
              <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">Two-Factor Authentication</h4>
              <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">
                {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <KeyIcon className="w-4 h-4 mr-2" />
              {formData.twoFactorEnabled ? 'Manage' : 'Enable'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-osc-navy-25 dark:bg-osc-navy-800 rounded-lg">
            <div>
              <h4 className="font-medium text-osc-navy-900 dark:text-osc-navy-100">Password</h4>
              <p className="text-sm text-osc-navy-600 dark:text-osc-navy-400">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm">
              <PencilIcon className="w-4 h-4 mr-2" />
              Change
            </Button>
          </div>

          <Select
            label="Session Timeout"
            options={[
              { value: 2, label: '2 hours' },
              { value: 4, label: '4 hours' },
              { value: 8, label: '8 hours (Default)' },
              { value: 24, label: '24 hours' }
            ]}
            value={formData.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
          />
        </CardContent>
      </Card>
    </div>
  )

  const FormBuilderSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Form Builder Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Default Field Width"
            options={[
              { value: 'full', label: 'Full Width' },
              { value: 'half', label: 'Half Width' },
              { value: 'third', label: 'One Third' },
              { value: 'quarter', label: 'One Quarter' }
            ]}
            value={formData.defaultFieldWidth}
            onChange={(e) => handleInputChange('defaultFieldWidth', e.target.value)}
          />

          <Checkbox
            label="Auto-Save"
            checked={formData.autoSave}
            onChange={(e) => handleInputChange('autoSave', e.target.checked)}
            helperText="Automatically save form changes"
          />

          <Checkbox
            label="Template Suggestions"
            checked={formData.templateSuggestions}
            onChange={(e) => handleInputChange('templateSuggestions', e.target.checked)}
            helperText="Show suggested templates when creating forms"
          />

          <Checkbox
            label="Drag & Drop Interface"
            checked={formData.dragDropEnabled}
            onChange={(e) => handleInputChange('dragDropEnabled', e.target.checked)}
            helperText="Enable drag and drop for field ordering"
          />
        </CardContent>
      </Card>
    </div>
  )

  const UserManagementSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              User Management
            </CardTitle>
            <Button className="flex items-center gap-2" size="sm">
              <UserPlusIcon className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-osc-navy-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Last Login</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-osc-navy-800 hover:bg-gray-50 dark:hover:bg-osc-navy-800">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Select
                        options={[
                          { value: 'admin', label: 'Administrator' },
                          { value: 'manager', label: 'Manager' },
                          { value: 'form_builder', label: 'Form Creator' },
                          { value: 'form_viewer', label: 'Form Viewer' }
                        ]}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-36"
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {user.department}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserToggle(user.id)}
                          className="text-xs"
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Access Level Descriptions</h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div><strong>Administrator:</strong> Full system access including user management and system settings</div>
              <div><strong>Manager:</strong> Can manage forms and view analytics for their department</div>
              <div><strong>Form Creator:</strong> Can create, edit, and publish forms</div>
              <div><strong>Form Viewer:</strong> Can view forms and their responses but cannot edit</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />
      case 'notifications': return <NotificationsSection />
      case 'accessibility': return <AccessibilitySection />
      case 'system': return <SystemSection />
      case 'security': return <SecuritySection />
      case 'formbuilder': return <FormBuilderSection />
      case 'usermanagement': return <UserManagementSection />
      default: return <ProfileSection />
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
              {user?.role === 'admin' ? 'User Management' : 'User Preferences'}
            </h1>
            <p className="text-osc-navy-600 dark:text-osc-navy-400">
              {user?.role === 'admin'
                ? 'Manage users and their access levels in the OSC Form Builder system'
                : 'Customize your OSC Form Builder experience'
              }
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reset
            </Button>
            <Button className="btn-gov-primary" onClick={handleSave}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            <Card>
              <CardContent className="p-3">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          activeSection === section.id
                            ? 'bg-osc-blue-100 dark:bg-osc-blue-900 text-osc-blue-900 dark:text-osc-blue-100'
                            : 'text-osc-navy-600 dark:text-osc-navy-400 hover:bg-osc-navy-50 dark:hover:bg-osc-navy-800 hover:text-osc-navy-900 dark:hover:text-osc-navy-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {section.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}