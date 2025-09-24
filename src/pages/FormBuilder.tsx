import { useEffect, useState } from 'react';
import { Eye, Save, Settings, Smartphone, Monitor, ArrowLeft } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';
import { createEmptyForm } from '../data/demoForms';
import DragDropProvider from '../components/FormBuilder/DragDropProvider';
import ComponentPalette from '../components/FormBuilder/ComponentPalette';
import FormCanvas from '../components/FormBuilder/FormCanvas';
import FieldPropertiesPanel from '../components/FormBuilder/FieldPropertiesPanel';

const FormBuilder = () => {
  const { currentForm, setCurrentForm, setCurrentPage, updateFormTitle, updateFormDescription } = useFormBuilderStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!currentForm) {
      setCurrentForm(createEmptyForm());
    }
  }, [currentForm, setCurrentForm]);

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving form:', currentForm);
    alert('Form saved successfully!');
  };

  const handlePreview = () => {
    setCurrentPage('fill-form');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Modern Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-soft">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage('forms')}
                className="flex items-center space-x-2 text-slate-600 hover:text-osc-navy transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Forms</span>
              </button>

              <div className="h-6 w-px bg-slate-300"></div>

              <div>
                <h1 className="heading-2 text-osc-navy">Form Builder</h1>
                <p className="text-caption text-slate-500 -mt-1 font-medium">{currentForm?.title || 'Untitled Form'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-subtle">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'desktop'
                      ? 'bg-white text-osc-navy shadow-soft'
                      : 'text-slate-600 hover:text-osc-navy'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'mobile'
                      ? 'bg-white text-osc-navy shadow-soft'
                      : 'text-slate-600 hover:text-osc-navy'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleSave}
                className="btn-secondary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>

              <button
                onClick={handlePreview}
                className="btn-primary flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>

              <button className="p-2.5 text-slate-600 hover:text-osc-navy hover:bg-slate-100 rounded-xl transition-all duration-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <DragDropProvider>
          {/* Component Palette - Much Smaller */}
          <div className="w-64 border-r border-slate-200 bg-white shadow-soft">
            <ComponentPalette />
          </div>

          {/* Form Canvas Area - Much Larger and More Prominent */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
            <div className={`flex-1 overflow-auto p-8 ${viewMode === 'mobile' ? 'flex justify-center' : ''}`}>
              <div className={`${viewMode === 'mobile' ? 'w-96 bg-white shadow-soft-lg rounded-2xl my-4 animate-scale-in' : 'max-w-4xl mx-auto w-full'}`}>
                <FormCanvas />
              </div>
            </div>
          </div>

          {/* Properties Panel - Smaller */}
          <div className="w-72 border-l border-slate-200 bg-white shadow-soft">
            <div className="p-6">
              <div className="mb-8">
                <h3 className="heading-2 text-osc-navy">Properties</h3>
                <p className="text-body text-slate-600">Configure form settings</p>
              </div>

              <div className="space-y-6">
                {/* Form Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-osc-navy mb-2">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={currentForm?.title || ''}
                      onChange={(e) => updateFormTitle(e.target.value)}
                      className="form-input w-full"
                      placeholder="Enter form title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-osc-navy mb-2">
                      Description
                    </label>
                    <textarea
                      value={currentForm?.description || ''}
                      onChange={(e) => updateFormDescription(e.target.value)}
                      rows={3}
                      className="form-input w-full resize-none"
                      placeholder="Enter form description..."
                    />
                  </div>
                </div>

                {/* Form Options */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-osc-navy text-base">Form Options</h4>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentForm?.settings?.enablePDF || false}
                        onChange={(e) => {
                          if (currentForm) {
                            setCurrentForm({
                              ...currentForm,
                              settings: {
                                ...currentForm.settings,
                                enablePDF: e.target.checked,
                              },
                              updatedAt: new Date(),
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-osc-navy focus:ring-osc-navy focus:border-osc-navy transition-colors"
                      />
                      <span className="ml-3 text-sm text-slate-700 font-medium">Enable PDF generation</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentForm?.settings?.allowSaveProgress || false}
                        onChange={(e) => {
                          if (currentForm) {
                            setCurrentForm({
                              ...currentForm,
                              settings: {
                                ...currentForm.settings,
                                allowSaveProgress: e.target.checked,
                              },
                              updatedAt: new Date(),
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-osc-navy focus:ring-osc-navy focus:border-osc-navy transition-colors"
                      />
                      <span className="ml-3 text-sm text-slate-700 font-medium">Allow save progress</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentForm?.settings?.requireLogin || false}
                        onChange={(e) => {
                          if (currentForm) {
                            setCurrentForm({
                              ...currentForm,
                              settings: {
                                ...currentForm.settings,
                                requireLogin: e.target.checked,
                              },
                              updatedAt: new Date(),
                            });
                          }
                        }}
                        className="rounded border-slate-300 text-osc-navy focus:ring-osc-navy focus:border-osc-navy transition-colors"
                      />
                      <span className="ml-3 text-sm text-slate-700 font-medium">Require login</span>
                    </label>
                  </div>
                </div>

                {/* Field Properties */}
                <FieldPropertiesPanel />
              </div>
            </div>
          </div>
        </DragDropProvider>
      </div>
    </div>
  );
};

export default FormBuilder;