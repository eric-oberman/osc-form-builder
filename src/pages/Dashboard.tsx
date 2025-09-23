import { FileText, BarChart3, Plus, Eye, Edit, Copy, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';
import TemplateGallery from '../components/Dashboard/TemplateGallery';

const Dashboard = () => {
  const { analytics, setCurrentPage } = useFormBuilderStore();

  const recentForms = [
    { id: '1', name: 'Employee Information Form', submissions: 45, lastModified: '2 hours ago', status: 'Active' },
    { id: '2', name: 'Public Records Request', submissions: 32, lastModified: '1 day ago', status: 'Active' },
    { id: '3', name: 'Vendor Registration', submissions: 28, lastModified: '3 days ago', status: 'Draft' },
    { id: '4', name: 'IT Support Request', submissions: 67, lastModified: '1 week ago', status: 'Active' },
  ];

  const quickActions = [
    {
      title: 'Create New Form',
      description: 'Start building a form from scratch',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => setCurrentPage('builder'),
    },
    {
      title: 'Use Template',
      description: 'Start with a pre-built template',
      icon: FileText,
      color: 'bg-green-500',
      action: () => {
        document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      title: 'View Analytics',
      description: 'See detailed form performance',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => setCurrentPage('admin'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Page Header */}
        <div className="section-spacing">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-1">Dashboard</h1>
              <p className="text-subtitle">Monitor your forms and manage your content</p>
            </div>
            <button
              onClick={() => setCurrentPage('builder')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Form</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="section-spacing">
          <div className="grid-cards">
            <div className="stat-card">
              <div className="stat-label">Total Forms</div>
              <div className="stat-number">{analytics.totalForms}</div>
              <div className="stat-change text-green-600">+12% from last month</div>
              <div className="mt-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Submissions</div>
              <div className="stat-number">{analytics.totalSubmissions.toLocaleString()}</div>
              <div className="stat-change text-green-600">+8.2% from last month</div>
              <div className="mt-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Completion Rate</div>
              <div className="stat-number">{analytics.completionRate}%</div>
              <div className="stat-change text-green-600">+3.2% from last month</div>
              <div className="mt-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Average Time</div>
              <div className="stat-number">{analytics.averageTime}</div>
              <div className="stat-change text-red-600">+15s from last month</div>
              <div className="mt-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-spacing">
          <h2 className="heading-2 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="card card-body text-left hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3">{action.title}</h3>
                      <p className="text-body">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Forms & Analytics */}
        <div className="section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Forms */}
            <div className="card">
              <div className="card-header">
                <h2 className="heading-2">Recent Forms</h2>
                <p className="text-subtitle">Your most recently updated forms</p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentForms.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="text-body font-medium text-gray-900">{form.name}</h3>
                        <div className="flex items-center space-x-4 text-caption">
                          <span>{form.submissions} submissions</span>
                          <span>{form.lastModified}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            form.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {form.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setCurrentPage('builder')}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all forms →
                  </button>
                </div>
              </div>
            </div>

            {/* Top Performing Forms */}
            <div className="card">
              <div className="card-header">
                <h2 className="heading-2">Top Performing Forms</h2>
                <p className="text-subtitle">Forms with highest completion rates</p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {analytics.topForms.map((form, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-osc-navy to-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-body font-medium text-gray-900">{form.name}</h4>
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
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View detailed analytics →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Gallery */}
        <div id="templates-section" className="section-spacing">
          <TemplateGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;