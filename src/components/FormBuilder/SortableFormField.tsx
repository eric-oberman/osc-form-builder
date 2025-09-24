import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';
import type { FormField } from '../../types';
import FieldRenderer from './FieldRenderer';

interface SortableFormFieldProps {
  field: FormField;
}

const SortableFormField = ({ field }: SortableFormFieldProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { removeField, selectField, selectedFieldId, duplicateField } = useFormBuilderStore();
  const isSelected = selectedFieldId === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    removeField(field.id);
  };

  const handleSelect = () => {
    selectField(field.id);
  };

  const handleDuplicate = () => {
    duplicateField(field.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group mb-6 cursor-pointer
        ${isDragging ? 'opacity-50 z-50' : ''}
        ${isSelected ? 'ring-2 ring-osc-blue ring-opacity-50' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle and Actions */}
      {isHovered && (
        <div className="absolute -left-12 top-6 flex flex-col space-y-1 z-10">
          <button
            {...attributes}
            {...listeners}
            className="p-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      {(isHovered || isSelected) && (
        <div className="absolute -right-12 top-6 flex flex-col space-y-2 z-10">
          <button
            onClick={handleSelect}
            className={`p-2 bg-white border rounded-lg shadow-sm transition-colors ${
              isSelected
                ? 'border-osc-blue bg-osc-blue bg-opacity-10 text-osc-blue'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-600'
            }`}
            title="Edit field settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-2 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-lg shadow-sm transition-colors"
            title="Duplicate field"
          >
            <Copy className="h-4 w-4 text-gray-500 hover:text-green-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-lg shadow-sm transition-colors"
            title="Delete field"
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
          </button>
        </div>
      )}

      {/* Field Renderer with Builder Context */}
      <div
        className={`transition-all duration-200 ${isHovered || isSelected ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}`}
        onClick={handleSelect}
      >
        <FieldRenderer field={field} />
      </div>
    </div>
  );
};

export default SortableFormField;