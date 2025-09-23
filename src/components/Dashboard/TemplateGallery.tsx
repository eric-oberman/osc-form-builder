import { useState } from 'react';
import { Search, Eye, Plus, FileText, Filter } from 'lucide-react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';
import { demoTemplates } from '../../data/demoForms';
import type { FormTemplate, Form } from '../../types';

const TemplateGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { setCurrentForm, setCurrentPage } = useFormBuilderStore();

  const categories = ['All', 'HR', 'Legal', 'Procurement', 'IT', 'Facilities'];

  const filteredTemplates = demoTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const createFormFromTemplate = (template: FormTemplate) => {
    const newForm: Form = {
      id: `form-${Date.now()}`,
      title: template.name,
      description: template.description,
      fields: template.fields.map(field => ({
        ...field,
        id: `${field.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })),
      settings: {
        allowSaveProgress: true,
        requireLogin: false,
        enablePDF: true,
        branding: {
          primaryColor: '#1e3a8a',
          secondaryColor: '#f59e0b',
          organizationName: 'New York State Office of the State Comptroller',
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Demo User',
    };

    setCurrentForm(newForm);
    setCurrentPage('builder');
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-2">Form Templates</h2>
            <p className="text-subtitle">Start with professionally designed templates</p>
          </div>
          <div className="flex items-center space-x-2 text-caption">
            <Filter className="h-4 w-4" />
            <span>{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-osc-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="card hover:scale-[1.02] transition-transform border border-gray-100"
              >
                <div className="p-6">
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="heading-3 text-base">{template.name}</h3>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{template.fields.length}</div>
                      <div className="text-caption">fields</div>
                    </div>
                  </div>

                  {/* Template Description */}
                  <p className="text-body mb-6 line-clamp-3">
                    {template.description}
                  </p>

                  {/* Template Actions */}
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => createFormFromTemplate(template)}
                      className="btn-primary !text-sm !px-4 !py-2 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="heading-3 mb-2">No templates found</h3>
            <p className="text-body max-w-sm mx-auto">
              Try adjusting your search criteria or browse all templates to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="btn-secondary mt-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;