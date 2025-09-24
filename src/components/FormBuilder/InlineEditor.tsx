import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Check, X } from 'lucide-react';

interface InlineEditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

const InlineEditor = ({
  value,
  onSave,
  onCancel,
  placeholder = "Enter text...",
  multiline = false,
  className = ""
}: InlineEditorProps) => {
  const [editValue, setEditValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    setIsValid(editValue.trim().length > 0);
  }, [editValue]);

  const handleSave = () => {
    if (isValid && editValue.trim() !== value) {
      onSave(editValue.trim());
    } else {
      onCancel();
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    onCancel();
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const inputProps = {
    ref: inputRef as any,
    value: editValue,
    onChange: (e: any) => setEditValue(e.target.value),
    onKeyDown: handleKeyPress,
    onBlur: handleSave,
    placeholder,
    className: `${className} ${!isValid ? 'border-red-300 focus:border-red-500' : ''}`
  };

  return (
    <div className="relative inline-block w-full">
      {multiline ? (
        <textarea
          {...inputProps}
          rows={2}
          className={`form-input w-full resize-none ${className}`}
        />
      ) : (
        <input
          type="text"
          {...inputProps}
          className={`form-input w-full ${className}`}
        />
      )}

      {/* Action buttons */}
      <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`p-1 rounded transition-colors ${
            isValid
              ? 'text-green-600 hover:bg-green-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Save changes (Enter)"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
          title="Cancel (Escape)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default InlineEditor;