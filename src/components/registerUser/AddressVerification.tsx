'use client';

import { Organizer } from '@/api/models/Organizer';
import { DragDropFileUpload } from '@/components/dragDropFileUpload';
import FormInput from '@/components/FormInput';
import { InfoSubText } from '@/components/ui/infoSubText';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/hooks/useLocation';
import { FormikProps } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';

const PIN_LENGTH = 6;
const AddressAndVerification = ({
  formik,
  onDocumentUpload,
  pendingDocumentFile,
  hasSubmitted = false,
}: {
  formik: FormikProps<Partial<Organizer>>;
  onDocumentUpload: (file: File | null) => void;
  pendingDocumentFile?: File | null;
  hasSubmitted?: boolean;
}) => {
  const {
    states,
    cities,
    selectedStateId,
    selectedCityId,
    isLoadingStates,
    isLoadingCities,
    statesError,
    citiesError,
    handleStateChange,
    handleCityChange,
  } = useLocation({
    initialStateId: formik.values?.stateId ?? null,
    initialCityId: formik.values?.cityId ?? null,
  });

  useEffect(() => {
    if (formik.values?.stateId !== selectedStateId) {
      handleStateChange(formik.values?.stateId ?? null);
    }
  }, [formik.values?.stateId, selectedStateId, handleStateChange]);

  useEffect(() => {
    if (formik.values?.cityId !== selectedCityId) {
      handleCityChange(formik.values?.cityId ?? null);
    }
  }, [formik.values?.cityId, selectedCityId, handleCityChange]);

  const pinRegex = useMemo(() => new RegExp(`^\\d{${PIN_LENGTH}}$`), [PIN_LENGTH]);

  const clearFieldError = useCallback(
    (field: string) => {
      formik.setFieldError(field, undefined);
    },
    [formik]
  );

  const handleStateValueChange = useCallback(
    (val: string) => {
      const stateId = Number(val);
      handleStateChange(stateId);
      formik.setFieldValue('stateId', stateId);
      formik.setFieldValue('cityId', null);
      if (val) clearFieldError('stateId');
    },
    [handleStateChange, formik, clearFieldError]
  );

  const handleCityValueChange = useCallback(
    (val: string) => {
      const cityId = Number(val);
      handleCityChange(cityId);
      formik.setFieldValue('cityId', cityId);
      if (val) clearFieldError('city');
    },
    [handleCityChange, formik, clearFieldError]
  );

  const handleFileUpload = async (file: File | null) => {
    onDocumentUpload?.(file);
    if (file) {
      formik.setFieldValue('document_name', file.name);
    } else {
      formik.setFieldValue('document_name', '');
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full max-w-[736px] h-full">
      <div>
        <span className="font-satoshi-bold text-[18px] sm:text-[22px] text-white">
          Address & Verification
        </span>
        <div className="grid gap-2 mt-5">
          <Label htmlFor="address" className="font-satoshi-variable text-[14px] text-white">
            Venue/Club Address
          </Label>
          <Textarea
            id="venue"
            placeholder="Enter Address"
            className={`h-[90px] sm:w-full lg:w-[880px] font-satoshi-variable font-[500] text-[16px] text-white ${
              hasSubmitted && formik.errors.venue ? 'border-red-500 focus:border-red-500' : ''
            }`}
            value={formik.values?.venue || ''}
            onChange={(e) => {
              formik.setFieldValue('venue', e.target.value);
              if (e.target.value.trim()) clearFieldError('venue');
            }}
            aria-invalid={!!(hasSubmitted && formik.errors.venue)}
            aria-describedby={hasSubmitted && formik.errors.venue ? 'venue-error' : undefined}
          />
          {hasSubmitted && formik.errors.venue && (
            <span
              id="venue-error"
              className="text-red-500 text-xs mt-1 font-satoshi-variable"
              role="alert"
              aria-live="polite"
            >
              {formik.errors.venue}
            </span>
          )}
          <div className="flex items-center gap-2">
            <InfoSubText
              text="Our team will use this address to verify your account"
              hoverMessage={
                'Our team representative will come and inspect the venue and will validate your Place of business to allow you to publish tournaments.'
              }
            />
          </div>
        </div>
        <div className="mt-5 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="grid gap-2 w-full lg:w-auto">
            <Label htmlFor="state" className="font-satoshi-variable text-[14px] text-white">
              State
            </Label>
            <Select
              value={selectedStateId ? String(selectedStateId) : ''}
              onValueChange={handleStateValueChange}
            >
              <SelectTrigger
                id="stateId" // Add proper ID for validation
                className={`w-full lg:w-[435px] text-[white] flex items-center px-4 !h-[56px] ${
                  hasSubmitted && formik.errors.stateId ? 'border-red-500 focus:border-red-500' : ''
                }`}
                aria-invalid={!!(hasSubmitted && formik.errors.stateId)}
                aria-describedby={
                  hasSubmitted && formik.errors.stateId ? 'stateId-error' : undefined
                }
              >
                <SelectValue placeholder={isLoadingStates ? 'Loading...' : 'Select'} />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={String(state.id)}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="min-h-[20px]">
              {hasSubmitted && formik.errors.stateId && (
                <span
                  id="stateId-error"
                  className="text-red-500 text-xs mt-1 font-satoshi-variable"
                  role="alert"
                  aria-live="polite"
                >
                  {formik.errors.stateId}
                </span>
              )}
              {statesError && (
                <span className="text-red-500 text-xs mt-1">
                  Failed to load states: {statesError}
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-2 w-full lg:w-auto">
            <Label htmlFor="city" className="font-satoshi-variable text-[14px] text-white">
              City
            </Label>
            <Select
              value={selectedCityId ? String(selectedCityId) : ''}
              onValueChange={handleCityValueChange}
              disabled={!selectedStateId || isLoadingCities}
            >
              <SelectTrigger
                id="cityId" // Add proper ID for validation
                className={`w-full lg:w-[435px] text-white flex items-center px-4 !h-[56px] ${
                  hasSubmitted && formik.errors.cityId ? 'border-red-500 focus:border-red-500' : ''
                }`}
                aria-invalid={!!(hasSubmitted && formik.errors.cityId)}
                aria-describedby={hasSubmitted && formik.errors.cityId ? 'cityId-error' : undefined}
              >
                <SelectValue placeholder={isLoadingCities ? 'Loading...' : 'Select'} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((cityObj) => (
                  <SelectItem key={cityObj.id} value={String(cityObj.id)}>
                    {cityObj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="min-h-[20px]">
              {hasSubmitted && formik.errors.cityId && (
                <span
                  id="cityId-error"
                  className="text-red-500 text-xs mt-1 font-satoshi-variable"
                  role="alert"
                  aria-live="polite"
                >
                  {formik.errors.cityId}
                </span>
              )}
              {citiesError && (
                <span className="text-red-500 text-xs mt-1">
                  Failed to load cities: {citiesError}
                </span>
              )}
            </div>
          </div>
        </div>
        <FormInput
          label="Pincode"
          id="pin"
          type="text"
          placeholder="Enter PIN"
          inputClassName="h-[56px] w-full lg:w-[435px]"
          value={formik.values?.pin || ''}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > PIN_LENGTH) value = value.slice(0, PIN_LENGTH);
            formik.setFieldValue('pin', value);
            if (value.length === PIN_LENGTH && pinRegex.test(value)) clearFieldError('pin');
            else if (!value) clearFieldError('pin');
          }}
          error={hasSubmitted ? formik.errors.pin : undefined}
          className="mt-5"
        />
        <div className="grid gap-2 mt-5">
          <Label htmlFor="document" className="font-satoshi-variable text-[14px] text-white">
            Upload Document (Optional)
          </Label>
          <DragDropFileUpload
            onFileChange={handleFileUpload}
            isDragAndDropEnabled={true}
            uploadedDocument={formik.values?.document_url}
            uploadDocumentName={formik.values?.document_name}
            placeholderText="Upload or Drag & Drop document"
            acceptedFormats={['.png', '.jpeg', '.pdf']}
            maxFileSizeMB={2}
            defaultImageSrc="/images/image.svg"
            className="sm:w-full lg:w-[880px] h-[80px] text-white"
          />
          {pendingDocumentFile && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-500 text-sm font-satoshi-variable">
                📄 {pendingDocumentFile.name} (
                {(pendingDocumentFile.size / (1024 * 1024)).toFixed(2)} MB) - pending upload
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <InfoSubText
              text="Club ID, Government ID etc."
              hoverMessage={
                ' Identity front and back is also required for us for governmental compliances.'
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
};
export default AddressAndVerification;
