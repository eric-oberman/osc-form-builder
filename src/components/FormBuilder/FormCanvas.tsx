import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MousePointer2, Zap, ArrowDown } from 'lucide-react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';
import SortableFormField from './SortableFormField';

const FormCanvas = () => {
  const { currentForm } = useFormBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <div className="h-full flex flex-col">
      {/* Form Header */}
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-2 mb-2">
            {currentForm?.title || 'Untitled Form'}
          </h2>
          <p className="text-subtitle">
            {currentForm?.description || 'Add a description for your form in the properties panel'}
          </p>
        </div>
      </div>

      {/* Form Canvas - Much Larger and More Prominent */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto h-full">
          <div
            ref={setNodeRef}
            className={`
              h-full min-h-[600px] bg-white rounded-2xl shadow-lg transition-all duration-300 ease-in-out
              ${isOver
                ? 'border-4 border-blue-500 bg-blue-50 shadow-2xl scale-[1.01]'
                : 'border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
              }
            `}
          >
            {currentForm?.fields && currentForm.fields.length > 0 ? (
              <div className="p-8">
                <SortableContext
                  items={currentForm.fields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6">
                    {currentForm.fields.map((field) => (
                      <SortableFormField key={field.id} field={field} />
                    ))}
                  </div>
                </SortableContext>

                {/* Drop Zone for Adding More Fields */}
                <div className={`
                  mt-8 p-8 border-2 border-dashed rounded-xl transition-all duration-200
                  ${isOver
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}>
                  <div className="text-center">
                    <ArrowDown className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">Drop components here to add more fields</p>
                    <p className="text-xs text-gray-500 mt-1">Drag from the component palette on the left</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-lg">
                  {/* Large, Prominent Drop Zone */}
                  <div className={`
                    p-12 rounded-2xl transition-all duration-300 mb-8
                    ${isOver
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-500'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300'
                    }
                  `}>
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        {isOver ? (
                          <Zap className="h-12 w-12 text-white animate-pulse" />
                        ) : (
                          <MousePointer2 className="h-12 w-12 text-white" />
                        )}
                      </div>

                      {isOver && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 border-4 border-blue-500 border-dashed rounded-full animate-ping opacity-25"></div>
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {isOver ? 'Drop Component Here!' : 'Drag Components to This Area'}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      {isOver
                        ? 'Release to add the component to your form'
                        : 'Start building your form by dragging components from the left panel into this area'
                      }
                    </p>

                    {!isOver && (
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <Plus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Text & Input Fields</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <Plus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Selection Controls</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <Plus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">File & Signature</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <Plus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Layout Elements</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Footer */}
          {currentForm?.fields && currentForm.fields.length > 0 && (
            <div className="mt-6 text-center">
              <button className="btn-primary text-lg px-8 py-3">
                Submit Form
              </button>
              <p className="text-caption mt-3 text-gray-500">
                This is how your form will appear to users
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;