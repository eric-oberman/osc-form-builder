import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  TrashIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Select } from '@/components/ui'

export function UserManagementPage() {
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-osc-navy-900 dark:text-osc-navy-100 mb-2">
            User Management
          </h1>
          <p className="text-osc-navy-700 dark:text-osc-navy-300">
            Manage user accounts, roles, and permissions across the OSC Form Builder platform
          </p>
        </div>

        {/* User Management Table */}
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
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Last Login</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
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
                          <div className="text-sm text-gray-600 dark:text-gray-400">
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
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
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

            {/* Access Level Descriptions */}
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
      </motion.div>
    </div>
  )
}