import { useState } from 'react';
import { Users, Shield, Settings as SettingsIcon, Search, UserCheck, UserX, Plus, Edit, Trash2 } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'security' | 'system'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const users = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@osc.ny.gov',
      role: 'admin',
      status: 'active',
      lastActive: '2 minutes ago',
      department: 'IT',
      created: '2023-01-15'
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john.smith@osc.ny.gov',
      role: 'creator',
      status: 'active',
      lastActive: '15 minutes ago',
      department: 'Audit',
      created: '2023-03-20'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@osc.ny.gov',
      role: 'creator',
      status: 'active',
      lastActive: '1 hour ago',
      department: 'Legal',
      created: '2023-05-10'
    },
    {
      id: '4',
      name: 'Michael Brown',
      email: 'michael.brown@osc.ny.gov',
      role: 'user',
      status: 'active',
      lastActive: '2 hours ago',
      department: 'HR',
      created: '2023-07-25'
    },
    {
      id: '5',
      name: 'Emily Davis',
      email: 'emily.davis@osc.ny.gov',
      role: 'user',
      status: 'inactive',
      lastActive: '3 days ago',
      department: 'Finance',
      created: '2023-09-12'
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security & Compliance', icon: Shield },
    { id: 'system', label: 'System Settings', icon: SettingsIcon },
  ];

  const renderUsers = () => (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="heading-3">User Management</h3>
          <p className="text-subtitle">Manage user accounts, roles, and permissions</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10 w-full"
        />
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-number">{users.length}</div>
          <div className="stat-change text-gray-500">5 departments</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-number">{users.filter(u => u.status === 'active').length}</div>
          <div className="stat-change text-green-600">+2 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Administrators</div>
          <div className="stat-number">{users.filter(u => u.role === 'admin').length}</div>
          <div className="stat-change text-blue-600">Full access</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Form Creators</div>
          <div className="stat-number">{users.filter(u => u.role === 'creator').length}</div>
          <div className="stat-change text-purple-600">Can build forms</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'creator'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.status === 'active' ? (
                      <UserCheck className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <UserX className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      user.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="heading-3">Security & Compliance</h3>
        <p className="text-subtitle">Monitor security settings and compliance status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HIPAA Compliance */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">HIPAA Compliance</h4>
            <p className="text-caption">Healthcare data protection standards</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Data Encryption</span>
                <span className="text-green-700 font-semibold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Access Controls</span>
                <span className="text-green-700 font-semibold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Audit Logging</span>
                <span className="text-green-700 font-semibold">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Data Backup</span>
                <span className="text-green-700 font-semibold">✓ Daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Events */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Recent Security Events</h4>
            <p className="text-caption">Latest security activities and alerts</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-700">Successful login</span>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">admin@osc.ny.gov</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-700">Password changed</span>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">john.smith@osc.ny.gov</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-700">User created</span>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">new.user@osc.ny.gov</div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Permissions */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Access Permissions</h4>
            <p className="text-caption">Role-based access control settings</p>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Administrator</div>
                  <div className="text-xs text-gray-500">Full system access</div>
                </div>
                <button className="btn-secondary !text-xs !px-2 !py-1">Configure</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Form Creator</div>
                  <div className="text-xs text-gray-500">Create and manage forms</div>
                </div>
                <button className="btn-secondary !text-xs !px-2 !py-1">Configure</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">User</div>
                  <div className="text-xs text-gray-500">Fill out forms only</div>
                </div>
                <button className="btn-secondary !text-xs !px-2 !py-1">Configure</button>
              </div>
            </div>
          </div>
        </div>

        {/* Backup & Recovery */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Backup & Recovery</h4>
            <p className="text-caption">Data protection and recovery options</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Last Backup</span>
                <span className="text-blue-700 font-semibold">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Backup Status</span>
                <span className="text-green-700 font-semibold">✓ Healthy</span>
              </div>
              <button className="btn-primary w-full">Run Manual Backup</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <div>
        <h3 className="heading-3">System Settings</h3>
        <p className="text-subtitle">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Settings */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Organization Settings</h4>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value="New York State Office of the State Comptroller"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value="support@osc.ny.gov"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value="#1e3a8a"
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value="#1e3a8a"
                  className="form-input w-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Default Form Settings */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Default Form Settings</h4>
          </div>
          <div className="card-body space-y-4">
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-osc-navy" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Enable PDF generation by default</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-osc-navy" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Allow save progress by default</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-osc-navy" />
                <span className="ml-2 text-sm text-gray-700">Require login by default</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-osc-navy" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Enable analytics tracking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Email Settings</h4>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Server
              </label>
              <input
                type="text"
                value="mail.osc.ny.gov"
                className="form-input w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value="587"
                  className="form-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption
                </label>
                <select className="form-input w-full">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Storage Settings</h4>
          </div>
          <div className="card-body space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Storage Used</span>
                <span className="text-gray-900 font-semibold">2.4 GB / 100 GB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">File Uploads</span>
                <span className="text-gray-900 font-semibold">1,247 files</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Max File Size</span>
                <span className="text-gray-900 font-semibold">50 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button className="btn-primary">Save All Settings</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Page Header */}
        <div className="section-spacing">
          <div>
            <h1 className="heading-1">Settings</h1>
            <p className="text-subtitle">Manage users, security, and system configuration</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-osc-navy text-osc-navy'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'system' && renderSystem()}
      </div>
    </div>
  );
};

export default Settings;