'use client';

import Avatar from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

const Pdf = '/images/pdf.svg';

// Custom hook to track screen size
const useScreenSize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isLargeScreen;
};

interface DragDropFileUploadProps {
  onFileChange: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  isDragAndDropEnabled?: boolean;
  uploadedDocument?: string;
  uploadDocumentName?: string;
  uploadedDocuments?: string[];
  uploadDocumentNames?: string[];
  placeholderText?: string;
  acceptedFormats?: string[];
  maxFileSizeMB?: number;
  className?: string;
  defaultImageSrc?: string;
  allowMultiple?: boolean;
  maxFiles?: number;
}

const DragDropFileUpload: React.FC<DragDropFileUploadProps> = ({
  onFileChange,
  onFilesChange,
  isDragAndDropEnabled = false,
  placeholderText = 'Upload or Drag & Drop document',
  uploadedDocument,
  uploadDocumentName,
  uploadedDocuments,
  uploadDocumentNames,
  acceptedFormats = ['.png', '.jpeg', '.pdf'],
  maxFileSizeMB = 2,
  className,
  defaultImageSrc = '/photo.svg',
  allowMultiple = false,
  maxFiles = 2,
}) => {
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [objectURLs, setObjectURLs] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLargeScreen = useScreenSize();

  useEffect(() => {
    if (allowMultiple) {
      // Handle multiple files
      const urls = uploadedFiles
        .filter((file) => file.type !== 'application/pdf')
        .map((file) => URL.createObjectURL(file));
      setObjectURLs(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      // Handle single file (existing logic)
      if (uploadedFile && uploadedFile.type !== 'application/pdf') {
        const url = URL.createObjectURL(uploadedFile);
        setObjectURL(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      } else {
        setObjectURL(null);
      }
    }
  }, [uploadedFile, uploadedFiles, allowMultiple]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileSizeMB > maxFileSizeMB) {
        alert(`File size exceeds ${maxFileSizeMB} MB`);
        return;
      }

      if (!acceptedFormats.includes(`.${fileExtension}`)) {
        alert(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
        return;
      }

      if (allowMultiple) {
        setUploadedFiles((prev) => {
          const newFiles = [...prev, file];
          if (newFiles.length > maxFiles) {
            alert(`Maximum ${maxFiles} files allowed`);
            return prev;
          }
          onFilesChange?.(newFiles);
          return newFiles;
        });
      } else {
        setUploadedFile(file);
        onFileChange(file);
      }
    } else {
      if (allowMultiple) {
        setUploadedFiles([]);
        onFilesChange?.([]);
      } else {
        setUploadedFile(null);
        onFileChange(null);
      }
    }
  };

  const handleFilesChange = (files: FileList) => {
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      const fileSizeMB = file.size / (1024 * 1024);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileSizeMB > maxFileSizeMB) {
        alert(`File ${file.name} size exceeds ${maxFileSizeMB} MB`);
        return;
      }

      if (!acceptedFormats.includes(`.${fileExtension}`)) {
        alert(
          `Invalid file format for ${file.name}. Accepted formats: ${acceptedFormats.join(', ')}`
        );
        return;
      }

      validFiles.push(file);
    });

    if (allowMultiple) {
      const newFiles = [...uploadedFiles, ...validFiles];
      if (newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed. Only first ${maxFiles} files will be uploaded.`);
        const limitedFiles = newFiles.slice(0, maxFiles);
        setUploadedFiles(limitedFiles);
        onFilesChange?.(limitedFiles);
      } else {
        setUploadedFiles(newFiles);
        onFilesChange?.(newFiles);
      }
    } else if (validFiles.length > 0) {
      setUploadedFile(validFiles[0]);
      onFileChange(validFiles[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);

    if (allowMultiple) {
      handleFilesChange(event.dataTransfer.files);
    } else {
      const file = event.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (allowMultiple) {
      handleFilesChange(files);
    } else {
      const file = files[0] || null;
      handleFileChange(file);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>, index?: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (allowMultiple && typeof index === 'number') {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      onFilesChange?.(newFiles);
    } else {
      if (allowMultiple) {
        setUploadedFiles([]);
        setObjectURLs([]);
        onFilesChange?.([]);
      } else {
        setUploadedFile(null);
        setObjectURL(null);
        onFileChange(null);
      }
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const renderFileItem = (file: File, index: number, objectUrl?: string) => (
    <div
      key={`${file.name}-${index}`}
      className="flex items-center justify-between rounded-md p-3 sm:p-4 bg-black mb-2"
      style={{ border: '1px solid #3C3B3B' }}
    >
      <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0">
        {file.type === 'application/pdf' ? (
          <img
            src={Pdf}
            alt="PDF document preview"
            className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0"
          />
        ) : (
          <div className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0 flex items-center justify-center">
            <Avatar src={objectUrl} size={isLargeScreen ? 48 : 32} name={file.name} />
          </div>
        )}
        <div className="text-white flex flex-col min-w-0 flex-1">
          <span className="font-satoshi-bold text-xs sm:text-sm truncate">{file.name}</span>
          <span className="text-[#C5C3C3] text-[10px] sm:text-xs">
            {file.size / 1024 > 1024
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              : `${(file.size / 1024).toFixed(2)} KB`}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => handleCancel(e, index)}
        type="button"
        className="ml-2 sm:ml-4 w-8 h-8 sm:w-10 sm:h-9 flex items-center justify-center text-white text-[16px] sm:text-[20px] font-bold rounded-full pointer-events-auto z-10 hover:bg-gray-600 transition-colors cursor-pointer flex-shrink-0"
        style={{ backgroundColor: '#3C3B3B' }}
        aria-label="Remove uploaded file"
      >
        ×
      </button>
    </div>
  );

  const renderExistingFileItem = (src: string, name: string, index: number) => (
    <div
      key={`existing-${name}-${index}`}
      className="flex items-center justify-between rounded-md p-3 sm:p-4 bg-black mb-2"
      style={{ border: '1px solid #3C3B3B' }}
    >
      <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0">
        {name.toLowerCase().endsWith('.pdf') ? (
          <img
            src={Pdf}
            alt="PDF document preview"
            className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0"
          />
        ) : (
          <div className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0 flex items-center justify-center">
            <Avatar src={src} size={isLargeScreen ? 48 : 32} name={name} />
          </div>
        )}
        <div className="text-white flex flex-col min-w-0 flex-1">
          <span className="font-satoshi-bold text-xs sm:text-sm truncate">{name}</span>
        </div>
      </div>
    </div>
  );

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      return;
    }
    inputRef.current?.click();
  };

  return (
    <div className={cn('relative w-full', className)}>
      {allowMultiple ? (
        // Multiple files upload UI
        <div className="space-y-2">
          {/* Existing uploaded files */}
          {uploadedDocuments &&
            uploadDocumentNames &&
            uploadedDocuments.map(
              (src, index) =>
                uploadDocumentNames[index] &&
                renderExistingFileItem(src, uploadDocumentNames[index], index)
            )}

          {/* Currently uploaded files */}
          {uploadedFiles.map((file, index) => renderFileItem(file, index, objectURLs[index]))}

          {/* Upload area */}
          {uploadedFiles.length < maxFiles && (
            <label
              className={cn(
                'relative flex items-center justify-between rounded-md p-3 sm:p-4 bg-black cursor-pointer select-none',
                dragOver ? 'border-blue-600' : 'border-[#3C3B3B]'
              )}
              style={{ border: '1px solid #3C3B3B' }}
              onDragOver={isDragAndDropEnabled ? handleDragOver : undefined}
              onDragLeave={isDragAndDropEnabled ? handleDragLeave : undefined}
              onDrop={isDragAndDropEnabled ? handleDrop : undefined}
              onClick={handleLabelClick}
            >
              <div className="flex items-center gap-2 sm:gap-4 w-full">
                <img
                  src={defaultImageSrc}
                  alt="Default preview"
                  className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-white font-satoshi-variable font-[500] text-[12px] sm:text-[14px]">
                    {placeholderText} ({uploadedFiles.length}/{maxFiles})
                  </span>
                  <span className="text-[#7F7F7F] font-satoshi-variable font-[500] text-[10px] sm:text-[12px] break-words">
                    Maximum file size {maxFileSizeMB} MB - acceptable file types{' '}
                    {acceptedFormats.join(', ')}
                  </span>
                </div>
              </div>
            </label>
          )}
        </div>
      ) : (
        // Single file upload UI (existing logic)
        <label
          className={cn(
            'relative flex items-center justify-between rounded-md p-3 sm:p-4 bg-black cursor-pointer select-none',
            dragOver ? 'border-blue-600' : 'border-[#3C3B3B]'
          )}
          style={{ border: '1px solid #3C3B3B' }}
          onDragOver={isDragAndDropEnabled ? handleDragOver : undefined}
          onDragLeave={isDragAndDropEnabled ? handleDragLeave : undefined}
          onDrop={isDragAndDropEnabled ? handleDrop : undefined}
          onClick={handleLabelClick}
        >
          <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0">
            {uploadedFile ? (
              <>
                {uploadedFile.type === 'application/pdf' ? (
                  <img
                    src={Pdf}
                    alt="PDF document preview"
                    className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0 flex items-center justify-center">
                    <Avatar
                      src={objectURL}
                      size={isLargeScreen ? 48 : 32}
                      name={uploadedFile.name}
                    />
                  </div>
                )}
                <div className="text-white flex flex-col min-w-0 flex-1">
                  <span className="font-satoshi-bold text-xs sm:text-sm truncate">
                    {uploadedFile.name}
                  </span>
                  <span className="text-[#C5C3C3] text-[10px] sm:text-xs">
                    {uploadedFile.size / 1024 > 1024
                      ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : `${(uploadedFile.size / 1024).toFixed(2)} KB`}
                  </span>
                </div>
              </>
            ) : uploadDocumentName && uploadedDocument ? (
              <>
                {uploadDocumentName.toLowerCase().endsWith('.pdf') ? (
                  <img
                    src={Pdf}
                    alt="PDF document preview"
                    className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0 flex items-center justify-center">
                    <Avatar
                      src={uploadedDocument}
                      size={isLargeScreen ? 48 : 32}
                      name={uploadDocumentName}
                    />
                  </div>
                )}
                <div className="text-white flex flex-col min-w-0 flex-1">
                  <span className="font-satoshi-bold text-xs sm:text-sm truncate">
                    {uploadDocumentName}
                  </span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={defaultImageSrc}
                  alt="Default preview"
                  className="w-[32px] h-[32px] sm:w-[48px] sm:h-[48px] flex-shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-white font-satoshi-variable font-[500] text-[12px] sm:text-[14px]">
                    {placeholderText}
                  </span>
                  <span className="text-[#7F7F7F] font-satoshi-variable font-[500] text-[10px] sm:text-[12px] break-words">
                    Maximum file size {maxFileSizeMB} MB - acceptable file types{' '}
                    {acceptedFormats.join(', ')}
                  </span>
                </div>
              </>
            )}
          </div>
          {(uploadedFile || (uploadDocumentName && uploadedDocument)) && (
            <button
              onClick={(e) => handleCancel(e)}
              type="button"
              className="ml-2 sm:ml-4 w-8 h-8 sm:w-10 sm:h-9 flex items-center justify-center text-white text-[16px] sm:text-[20px] font-bold rounded-full pointer-events-auto z-10 hover:bg-gray-600 transition-colors cursor-pointer flex-shrink-0"
              style={{ backgroundColor: '#3C3B3B' }}
              aria-label="Remove uploaded file"
            >
              ×
            </button>
          )}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={acceptedFormats.join(',')}
        multiple={allowMultiple}
      />
    </div>
  );
};

export { DragDropFileUpload };
