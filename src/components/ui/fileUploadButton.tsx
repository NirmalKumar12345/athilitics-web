import { cn } from '@/lib/utils';
import * as React from 'react';

interface FileUploadButtonProps extends React.ComponentProps<'button'> {
  onFileChange: (file: File | null) => void;
  className?: string;
  onValidationError?: (error: string) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileChange,
  className,
  children,
  onValidationError,
  ...props
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (PNG, JPG, or JPEG only).';
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 2MB.';
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        onValidationError?.(validationError);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }
    
    onFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button type="button" className={cn(className)} onClick={handleClick} {...props}>
        {children}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export { FileUploadButton };

