import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isMobileNumber?: boolean;
  showFocusBorder?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  inputClassName = '',
  labelClassName = 'font-satoshi-variable text-[14px] text-white',
  required = false,
  disabled = false,
  readOnly = false,
  isMobileNumber = false,
  showFocusBorder = false,
}) => {
  return (
    <div className={`grid gap-2 ${className}`}>
      <Label htmlFor={id} className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        showFocusBorder={showFocusBorder}
        id={id}
        type={type}
        placeholder={placeholder}
        className={`font-satoshi-variable font-[500] text-[16px] ${
          error ? 'border-red-500 focus:border-red-500' : ''
        } ${inputClassName}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        isMobileNumber={isMobileNumber}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span
          id={`${id}-error`}
          className="text-red-500 text-xs mt-1 font-satoshi-variable"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
