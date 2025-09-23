import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useFormBuilderStore } from '../../stores/useFormBuilderStore';
import type { FormField } from '../../types';

interface DragDropProviderProps {
  children: React.ReactNode;
}

const DragDropProvider = ({ children }: DragDropProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { currentForm, setCurrentForm, addField } = useFormBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // If dragging from component palette to canvas
    if (active.data.current?.type === 'component-palette') {
      const fieldType = active.data.current.fieldType;
      const newField: FormField = {
        id: `field-${Date.now()}`,
        type: fieldType,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        required: false,
        validation: [],
        conditionalLogic: [],
        styling: { width: 'full' },
      };

      if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
        newField.options = ['Option 1', 'Option 2', 'Option 3'];
      }

      addField(newField);
      setActiveId(null);
      return;
    }

    // If reordering fields in canvas
    if (currentForm && active.id !== over.id) {
      const oldIndex = currentForm.fields.findIndex(field => field.id === active.id);
      const newIndex = currentForm.fields.findIndex(field => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(currentForm.fields, oldIndex, newIndex);
        setCurrentForm({
          ...currentForm,
          fields: newFields,
          updatedAt: new Date(),
        });
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={currentForm?.fields.map(f => f.id) || []} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="bg-white shadow-lg border border-gray-300 rounded-lg p-4 opacity-90">
            Dragging field...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropProvider;