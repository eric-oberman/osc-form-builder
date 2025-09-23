import { useState } from 'react';
import { Download, Filter, Search, Eye, FileText, Calendar, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';

const Responses = () => {
  const { analytics } = useFormBuilderStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState('All Forms');

  // Mock responses data
  const submissions = [
    {
      id: '1',
      formName: 'Employee Information Form',
      submittedBy: 'John Smith',
      submittedAt: '2024-01-20 10:30 AM',
      status: 'Completed',
      category: 'HR'
    },
    {
      id: '2',
      formName: 'Public Records Request',
      submittedBy: 'Sarah Johnson',
      submittedAt: '2024-01-20 09:15 AM',
      status: 'Under Review',
      category: 'Legal'
    },
    {
      id: '3',
      formName: 'Vendor Registration',
      submittedBy: 'Tech Solutions Inc.',
      submittedAt: '2024-01-19 04:45 PM',
      status: 'Approved',
      category: 'Procurement'
    },
    {
      id: '4',
      formName: 'IT Support Request',
      submittedBy: 'Michael Brown',
      submittedAt: '2024-01-19 02:20 PM',
      status: 'In Progress',
      category: 'IT'
    },
    {
      id: '5',
      formName: 'Meeting Room Reservation',
      submittedBy: 'Emily Davis',
      submittedAt: '2024-01-19 11:30 AM',
      status: 'Completed',
      category: 'Facilities'
    },
  ];

  const formNames = ['All Forms', ...Array.from(new Set(submissions.map(s => s.formName)))];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForm = selectedForm === 'All Forms' || submission.formName === selectedForm;
    return matchesSearch && matchesForm;
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'submissions', label: 'Submissions', count: submissions.length },
    { id: 'analytics', label: 'Analytics' },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid-cards">
        <div className="stat-card">
          <div className="stat-label">Total Submissions</div>
          <div className="stat-number">{analytics.totalSubmissions.toLocaleString()}</div>
          <div className="stat-change text-green-600">+8.2% from last month</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completion Rate</div>
          <div className="stat-number">{analytics.completionRate}%</div>
          <div className="stat-change text-green-600">+3.2% from last month</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-blue-600" />
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

        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-number">342</div>
          <div className="stat-change text-green-600">+12 new this week</div>
          <div className="mt-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h2 className="heading-2">Most Submitted Forms</h2>
            <p className="text-subtitle">Forms with highest submission counts</p>
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
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="heading-2">Recent Activity</h2>
            <p className="text-subtitle">Latest form submissions</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {submissions.slice(0, 5).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{submission.formName}</h4>
                      <p className="text-xs text-gray-500">by {submission.submittedBy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{submission.submittedAt.split(' ')[1]}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      submission.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      submission.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="form-input min-w-48"
          >
            {formNames.map((form) => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-secondary flex items-center space-x-2 whitespace-nowrap">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Submissions Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{submission.formName}</div>
                    <div className="text-sm text-gray-500">{submission.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {submission.submittedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {submission.submittedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    submission.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    submission.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                    submission.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h3 className="heading-3">Submission Trends</h3>
            <p className="text-subtitle">Form submissions over time</p>
          </div>
          <div className="card-body">
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Chart visualization would go here</p>
                <p className="text-sm text-gray-500">Showing submission trends over the last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="heading-3">Form Performance</h3>
            <p className="text-subtitle">Completion rates by form</p>
          </div>
          <div className="card-body">
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Performance metrics would go here</p>
                <p className="text-sm text-gray-500">Form completion and abandonment rates</p>
              </div>
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
            <div>
              <h1 className="heading-1">Responses</h1>
              <p className="text-subtitle">View and analyze form submissions and data</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-osc-navy text-osc-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'submissions' && renderSubmissions()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default Responses;