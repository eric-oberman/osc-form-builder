import { useState } from 'react';
import { Plus, Search, Eye, Edit, Copy, Trash2, Filter, Folder, Clock } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';
import TemplateGallery from '../components/Dashboard/TemplateGallery';

const Forms = () => {
  const { setCurrentPage, setCurrentForm } = useFormBuilderStore();
  const [activeTab, setActiveTab] = useState<'my-forms' | 'templates'>('my-forms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock forms data
  const myForms = [
    {
      id: '1',
      name: 'Employee Information Form',
      submissions: 45,
      lastModified: '2 hours ago',
      status: 'Active',
      category: 'HR',
      created: '2024-01-15'
    },
    {
      id: '2',
      name: 'Public Records Request',
      submissions: 32,
      lastModified: '1 day ago',
      status: 'Active',
      category: 'Legal',
      created: '2024-01-12'
    },
    {
      id: '3',
      name: 'Vendor Registration',
      submissions: 28,
      lastModified: '3 days ago',
      status: 'Draft',
      category: 'Procurement',
      created: '2024-01-10'
    },
    {
      id: '4',
      name: 'IT Support Request',
      submissions: 67,
      lastModified: '1 week ago',
      status: 'Active',
      category: 'IT',
      created: '2024-01-08'
    },
    {
      id: '5',
      name: 'Meeting Room Reservation',
      submissions: 89,
      lastModified: '2 weeks ago',
      status: 'Active',
      category: 'Facilities',
      created: '2024-01-05'
    },
  ];

  const categories = ['All', 'HR', 'Legal', 'Procurement', 'IT', 'Facilities'];

  const filteredForms = myForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    setCurrentPage('builder');
  };

  const handleEditForm = (formId: string) => {
    // In a real app, load the form by ID
    setCurrentPage('builder');
  };

  const tabs = [
    { id: 'my-forms', label: 'My Forms', count: myForms.length },
    { id: 'templates', label: 'Templates', count: 13 },
  ];

  const renderMyForms = () => (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input min-w-32"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateNew}
          className="btn-primary flex items-center space-x-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>New Form</span>
        </button>
      </div>

      {/* Forms Grid */}
      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div key={form.id} className="card hover:shadow-soft-lg transition-all duration-300 animate-scale-in group">
              <div className="p-6">
                {/* Form Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-osc-blue to-osc-blue-light rounded-xl flex items-center justify-center shadow-soft">
                      <Folder className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="heading-3 text-base text-osc-navy truncate">{form.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          form.status === 'Active'
                            ? 'bg-osc-green bg-opacity-10 text-osc-green'
                            : 'bg-osc-gold bg-opacity-10 text-osc-gold'
                        }`}>
                          {form.status}
                        </span>
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-osc-blue bg-opacity-10 text-osc-blue">
                          {form.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Submissions</span>
                    <span className="font-semibold text-osc-navy">{form.submissions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Last Modified</span>
                    <span className="text-slate-500 font-medium">{form.lastModified}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Created</span>
                    <span className="text-slate-500 font-medium">{form.created}</span>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-osc-blue hover:bg-osc-blue hover:bg-opacity-10 rounded-lg transition-all duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditForm(form.id)}
                      className="p-2 text-slate-400 hover:text-osc-blue hover:bg-osc-blue hover:bg-opacity-10 rounded-lg transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all duration-200">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-osc-red hover:bg-osc-red hover:bg-opacity-10 rounded-lg transition-all duration-200">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in">
            <Folder className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="heading-2 text-osc-navy mb-3">No forms found</h3>
          <p className="text-body-large text-slate-600 max-w-sm mx-auto mb-8">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search criteria or browse all forms.'
              : 'Create your first form to get started building professional forms.'
            }
          </p>
          <button
            onClick={handleCreateNew}
            className="btn-primary flex items-center space-x-2 mx-auto animate-scale-in"
            style={{animationDelay: '0.2s'}}
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First Form</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-max py-10">
        {/* Page Header */}
        <div className="section-spacing">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display text-osc-navy">Forms</h1>
              <p className="text-body-large text-slate-600 mt-2">Create, manage, and organize your forms and templates</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Form</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
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
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'my-forms' && renderMyForms()}
        {activeTab === 'templates' && <TemplateGallery />}
      </div>
    </div>
  );
};

export default Forms;