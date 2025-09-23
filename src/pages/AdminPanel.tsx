import { useState } from 'react';
import { Users, BarChart3, Shield, Settings, UserCheck, UserX, Search, ArrowLeft } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';

const AdminPanel = () => {
  const { analytics, setCurrentPage } = useFormBuilderStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security' | 'settings'>('overview');

  // Mock user data
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@osc.ny.gov', role: 'admin', status: 'active', lastActive: '2 minutes ago' },
    { id: '2', name: 'John Smith', email: 'john.smith@osc.ny.gov', role: 'creator', status: 'active', lastActive: '15 minutes ago' },
    { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@osc.ny.gov', role: 'creator', status: 'active', lastActive: '1 hour ago' },
    { id: '4', name: 'Michael Brown', email: 'michael.brown@osc.ny.gov', role: 'user', status: 'active', lastActive: '2 hours ago' },
    { id: '5', name: 'Emily Davis', email: 'emily.davis@osc.ny.gov', role: 'user', status: 'inactive', lastActive: '3 days ago' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid-cards">
        <div className="stat-card">
          <div className="stat-label">Total Forms</div>
          <div className="stat-number">{analytics.totalForms}</div>
          <div className="stat-change text-green-600">+12% from last month</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-number">18</div>
          <div className="stat-change text-gray-500">of 25 licensed</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completion Rate</div>
          <div className="stat-number">{analytics.completionRate}%</div>
          <div className="stat-change text-green-600">+3.2% from last month</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg. Time</div>
          <div className="stat-number">{analytics.averageTime}</div>
          <div className="stat-change text-red-600">+15s from last month</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Forms */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-3">Top Performing Forms</h3>
          <p className="text-subtitle">Forms with highest completion rates</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {analytics.topForms.map((form, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-osc-navy to-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{form.name}</h4>
                    <p className="text-caption">{form.submissions} submissions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{form.rate}%</div>
                  <div className="text-caption">completion</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="heading-3">User Management</h3>
          <p className="text-subtitle">Manage user accounts and permissions</p>
        </div>
        <button className="btn-primary">Add New User</button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="form-input pl-10 w-full"
        />
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
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
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Disable</button>
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
        {/* Compliance Status */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">HIPAA Compliance</h4>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Data Encryption</span>
                <span className="text-green-600 font-medium">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Access Controls</span>
                <span className="text-green-600 font-medium">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Audit Logging</span>
                <span className="text-green-600 font-medium">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Data Backup</span>
                <span className="text-green-600 font-medium">✓ Daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Events */}
        <div className="card">
          <div className="card-header">
            <h4 className="heading-3 text-base">Recent Security Events</h4>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Successful login</span>
                  <span className="text-gray-500">2 min ago</span>
                </div>
                <div className="text-gray-500">admin@osc.ny.gov</div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Password changed</span>
                  <span className="text-gray-500">1 hour ago</span>
                </div>
                <div className="text-gray-500">john.smith@osc.ny.gov</div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Form created</span>
                  <span className="text-gray-500">3 hours ago</span>
                </div>
                <div className="text-gray-500">sarah.johnson@osc.ny.gov</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="heading-3">System Settings</h3>
        <p className="text-subtitle">Configure system-wide settings and preferences</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value="New York State Office of the State Comptroller"
                className="form-input w-full max-w-md"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Form Settings
              </label>
              <div className="space-y-2">
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
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Page Header */}
        <div className="section-spacing">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back</span>
              </button>

              <div className="h-6 w-px bg-gray-300"></div>

              <div>
                <h1 className="heading-1">Administration</h1>
                <p className="text-subtitle">Manage users, security, and system settings</p>
              </div>
            </div>
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminPanel;