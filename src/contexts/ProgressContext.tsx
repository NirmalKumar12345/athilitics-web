'use client';
import { createContext, useContext } from 'react';

interface ProgressContextType {
  formikValues: any;
  dynamicProgressValue: number;
  uploadedImage: string | null;
  setFormikValues: (values: any) => void;
  setDynamicProgressValue: (value: number) => void;
  setUploadedImage: (image: string | null) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  return context;
};

export { ProgressContext };
