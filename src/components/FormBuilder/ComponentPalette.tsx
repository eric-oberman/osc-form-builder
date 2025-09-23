import { useDraggable } from '@dnd-kit/core';
import {
  Type,
  AlignLeft,
  ChevronDown,
  Circle,
  Square,
  Upload,
  PenTool,
  Calendar,
  Hash,
  AtSign,
  Phone,
  MapPin,
  Minus,
  Lightbulb,
} from 'lucide-react';
import type { FieldType } from '../../types';

interface DraggableFieldProps {
  fieldType: FieldType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const DraggableField = ({ fieldType, label, icon, description }: DraggableFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${fieldType}`,
    data: {
      type: 'component-palette',
      fieldType,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group bg-white border border-gray-200 rounded-lg p-3 cursor-grab hover:shadow-sm hover:border-blue-300 transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'hover:scale-[1.01]'}
      `}
    >
      <div className="flex items-start space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center flex-shrink-0 group-hover:from-blue-600 group-hover:to-blue-700 transition-colors">
          <div className="text-white">{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-gray-900 mb-1 leading-tight">{label}</h4>
          <p className="text-xs text-gray-500 line-clamp-2 leading-tight">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ComponentPalette = () => {
  const fieldTypes: Array<{ type: FieldType; label: string; icon: React.ReactNode; description: string }> = [
    {
      type: 'text',
      label: 'Text Input',
      icon: <Type className="h-5 w-5" />,
      description: 'Example: "What is your full name?" - Single-line text for names, titles, IDs'
    },
    {
      type: 'textarea',
      label: 'Text Area',
      icon: <AlignLeft className="h-5 w-5" />,
      description: 'Example: "Please describe your issue" - Multi-line text for detailed responses'
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: <ChevronDown className="h-5 w-5" />,
      description: 'Example: "Which department do you work in?" - Single selection from options'
    },
    {
      type: 'radio',
      label: 'Radio Buttons',
      icon: <Circle className="h-5 w-5" />,
      description: 'Example: "What is your priority level?" - Choose one from visible options'
    },
    {
      type: 'checkbox',
      label: 'Checkboxes',
      icon: <Square className="h-5 w-5" />,
      description: 'Example: "Which services do you need?" - Select multiple options'
    },
    {
      type: 'file',
      label: 'File Upload',
      icon: <Upload className="h-5 w-5" />,
      description: 'Example: "Please upload your resume" - Documents, images, or other files'
    },
    {
      type: 'signature',
      label: 'Digital Signature',
      icon: <PenTool className="h-5 w-5" />,
      description: 'Example: "Please sign to authorize this request" - Digital signature capture'
    },
    {
      type: 'date',
      label: 'Date Picker',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Example: "When do you need this completed?" - Calendar date selection'
    },
    {
      type: 'number',
      label: 'Number Input',
      icon: <Hash className="h-5 w-5" />,
      description: 'Example: "How many attendees?" - Numeric input with validation'
    },
    {
      type: 'email',
      label: 'Email Input',
      icon: <AtSign className="h-5 w-5" />,
      description: 'Example: "What is your email address?" - Email with validation'
    },
    {
      type: 'phone',
      label: 'Phone Input',
      icon: <Phone className="h-5 w-5" />,
      description: 'Example: "What is your phone number?" - Phone with formatting'
    },
    {
      type: 'address',
      label: 'Address Fields',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Example: "What is your mailing address?" - Complete address fields'
    },
    {
      type: 'section',
      label: 'Section Header',
      icon: <Minus className="h-5 w-5" />,
      description: 'Example: "Personal Information" - Organize form into logical sections'
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Components</h3>
          <p className="text-xs text-gray-600">Drag to canvas</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {fieldTypes.map((field) => (
            <DraggableField
              key={field.type}
              fieldType={field.type}
              label={field.label}
              icon={field.icon}
              description={field.description}
            />
          ))}
        </div>

        {/* Compact Pro Tip */}
        <div className="mt-6 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="h-3 w-3 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-blue-900 mb-1">Question Format</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Drag components to create question-and-response pairs for user-friendly forms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;