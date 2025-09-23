import { FileText, BarChart3, Plus, Eye, TrendingUp, Clock, CheckCircle, Users, Calendar } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';

const Home = () => {
  const { analytics, setCurrentPage } = useFormBuilderStore();

  const quickActions = [
    {
      title: 'Create New Form',
      description: 'Start building a form from scratch',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => setCurrentPage('forms'),
    },
    {
      title: 'View All Forms',
      description: 'Manage your existing forms',
      icon: FileText,
      color: 'bg-green-500',
      action: () => setCurrentPage('forms'),
    },
    {
      title: 'View Responses',
      description: 'Analyze form submissions',
      icon: BarChart3,
      color: 'bg-purple-500',
      action: () => setCurrentPage('responses'),
    },
    {
      title: 'Manage Users',
      description: 'User and permission settings',
      icon: Users,
      color: 'bg-orange-500',
      action: () => setCurrentPage('settings'),
    },
  ];

  const recentActivity = [
    {
      type: 'form_created',
      message: 'New form "IT Support Request" created',
      time: '2 hours ago',
      user: 'John Smith'
    },
    {
      type: 'submission',
      message: 'Form submission received for "Employee Info"',
      time: '4 hours ago',
      user: 'Sarah Johnson'
    },
    {
      type: 'user_added',
      message: 'New user added to the system',
      time: '1 day ago',
      user: 'Admin'
    },
    {
      type: 'form_published',
      message: 'Form "Vendor Registration" published',
      time: '2 days ago',
      user: 'Michael Brown'
    },
  ];

  const upcomingTasks = [
    {
      title: 'Review pending form submissions',
      dueDate: 'Today',
      priority: 'High',
      count: 5
    },
    {
      title: 'Update user permissions',
      dueDate: 'Tomorrow',
      priority: 'Medium',
      count: 3
    },
    {
      title: 'Monthly analytics report',
      dueDate: 'This week',
      priority: 'Medium',
      count: 1
    },
    {
      title: 'Form template review',
      dueDate: 'Next week',
      priority: 'Low',
      count: 8
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-max py-10">
        {/* Welcome Header */}
        <div className="section-spacing">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-osc-navy">Welcome back!</h1>
              <p className="text-body-large text-slate-600 mt-2">Here's what's happening with your forms and data</p>
            </div>
            <button
              onClick={() => setCurrentPage('forms')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Form</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="section-spacing">
          <h2 className="heading-1 text-osc-navy mb-8">Overview</h2>
          <div className="grid-cards">
            <div className="stat-card animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-osc-blue to-osc-blue-light rounded-xl flex items-center justify-center shadow-soft">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="stat-change text-osc-green font-medium">+12%</div>
              </div>
              <div className="stat-number text-osc-navy">{analytics.totalForms}</div>
              <div className="stat-label">Total Forms</div>
            </div>

            <div className="stat-card animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-osc-green to-osc-green-light rounded-xl flex items-center justify-center shadow-soft">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="stat-change text-osc-green font-medium">+8.2%</div>
              </div>
              <div className="stat-number text-osc-navy">{analytics.totalSubmissions.toLocaleString()}</div>
              <div className="stat-label">Total Submissions</div>
            </div>

            <div className="stat-card animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-soft">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div className="stat-change text-osc-green font-medium">+3.2%</div>
              </div>
              <div className="stat-number text-osc-navy">{analytics.completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>

            <div className="stat-card animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-osc-gold to-yellow-500 rounded-xl flex items-center justify-center shadow-soft">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="stat-change text-osc-red font-medium">+15s</div>
              </div>
              <div className="stat-number text-osc-navy">{analytics.averageTime}</div>
              <div className="stat-label">Average Time</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-spacing">
          <h2 className="heading-1 text-osc-navy mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="card card-body text-left hover:scale-[1.02] transition-all duration-300 animate-scale-in"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-soft-md`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3 text-base text-osc-navy">{action.title}</h3>
                      <p className="text-body text-sm text-slate-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Performing Forms */}
            <div className="lg:col-span-1">
              <div className="card animate-slide-up">
                <div className="card-header">
                  <h2 className="heading-2 text-osc-navy">Top Performing Forms</h2>
                  <p className="text-subtitle text-slate-600">Highest completion rates</p>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {analytics.topForms.map((form, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-osc-navy to-osc-navy-light text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-soft">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-body font-semibold text-osc-navy">{form.name}</h4>
                            <p className="text-caption">{form.submissions} submissions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-osc-green">{form.rate}%</div>
                          <div className="text-caption">completion</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setCurrentPage('responses')}
                      className="text-sm text-osc-blue hover:text-osc-navy font-semibold transition-colors duration-200"
                    >
                      View detailed analytics →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="card animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="card-header">
                  <h2 className="heading-2 text-osc-navy">Recent Activity</h2>
                  <p className="text-subtitle text-slate-600">Latest system activities</p>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-osc-blue bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {activity.type === 'form_created' && <Plus className="h-4 w-4 text-osc-blue" />}
                          {activity.type === 'submission' && <FileText className="h-4 w-4 text-osc-blue" />}
                          {activity.type === 'user_added' && <Users className="h-4 w-4 text-osc-blue" />}
                          {activity.type === 'form_published' && <Eye className="h-4 w-4 text-osc-blue" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-osc-navy font-medium">{activity.message}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-gray-500">{activity.user}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="text-sm text-osc-blue hover:text-osc-navy font-semibold transition-colors duration-200">
                      View all activity →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="lg:col-span-1">
              <div className="card animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="card-header">
                  <h2 className="heading-2 text-osc-navy">Upcoming Tasks</h2>
                  <p className="text-subtitle text-slate-600">Items requiring attention</p>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-osc-navy">{task.title}</h4>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{task.dueDate}</span>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-osc-blue">{task.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="text-sm text-osc-blue hover:text-osc-navy font-semibold transition-colors duration-200">
                      View all tasks →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;