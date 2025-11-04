'use client';
import { Organizer } from '@/api/models/Organizer';
import FormInput from '@/components/FormInput';
import { InfoSubText } from '@/components/ui/infoSubText';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multiSelect';
import { useSports } from '@/hooks/useSports';
import { FormikProps } from 'formik';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const SportsAndRoleDetails = ({
  formik,
  hasSubmitted = false,
}: {
  formik: FormikProps<Partial<Organizer>>;
  hasSubmitted?: boolean;
}) => {
  const { sportsOptions, isLoading: sportsLoading, error: sportsError } = useSports();

  const primarySportsOptions = React.useMemo(
    () =>
      sportsOptions.filter((option: (typeof sportsOptions)[number]) => !!option.canPrimarySports),
    [sportsOptions]
  );

  const { values, errors: formErrors, setFieldValue, setFieldError } = formik;

  const primarySportsValue = React.useMemo(
    () => values.primary_sports?.map((name) => String(name)) || [],
    [values.primary_sports]
  );

  const otherSportsValue = React.useMemo(
    () => values.other_sports?.map((name) => String(name)) || [],
    [values.other_sports]
  );

  const organizationExperienceValue = React.useMemo(
    () =>
      values?.organization_experience === 0 || values?.organization_experience == null
        ? ''
        : String(values?.organization_experience),
    [values?.organization_experience]
  );

  const annualEventsValue = React.useMemo(
    () =>
      values?.no_of_annual_events_hosted === 0 || values?.no_of_annual_events_hosted === undefined
        ? ''
        : String(values?.no_of_annual_events_hosted),
    [values?.no_of_annual_events_hosted]
  );

  const clearFieldError = React.useCallback(
    (field: string) => {
      setFieldError(field, undefined);
    },
    [setFieldError]
  );

  const handlePrimarySportsChange = React.useCallback(
    (vals: (string | number)[]) => {
      const stringVals = vals.map((v) => String(v));
      setFieldValue(
        'primary_sports',
        stringVals.map((v) => Number(v))
      );
      if (vals.length > 0) clearFieldError('primary_sports');
    },
    [setFieldValue, clearFieldError]
  );

  const handleOtherSportsChange = React.useCallback(
    (vals: (string | number)[]) => {
      const stringVals = vals.map((v) => String(v));
      setFieldValue(
        'other_sports',
        stringVals.map((v) => Number(v))
      );
    },
    [setFieldValue]
  );

  return (
    <div className="h-full">
      <form className="w-full max-w-[736px]">
        <div>
          <span className="font-satoshi-bold text-[18px] sm:text-[22px] text-white">
            Sport & Role Details
          </span>
          <div className="grid gap-2 mt-10">
            <Label htmlFor="primarysport" className="font-satoshi-variable text-[14px] text-white">
              Primary Sport
            </Label>
            <MultiSelect
              className={`sm:w-full lg:w-[880px] text-white flex items-center px-4 !h-[56px] ${hasSubmitted && formErrors.primary_sports ? 'border-red-500 focus:border-red-500' : ''}`}
              options={primarySportsOptions}
              value={primarySportsValue}
              onChange={handlePrimarySportsChange}
              placeholder={sportsLoading ? 'Loading sports...' : 'Select'}
              maxVisible={3}
              aria-invalid={!!(hasSubmitted && formErrors.primary_sports)}
              aria-describedby={
                hasSubmitted && formErrors.primary_sports ? 'primary_sports-error' : undefined
              }
            />
            {hasSubmitted && formErrors.primary_sports && (
              <span
                id="primary_sports-error"
                className="text-red-500 text-xs mt-1 font-satoshi-variable"
                role="alert"
                aria-live="polite"
              >
                {formErrors.primary_sports}
              </span>
            )}
            {sportsError && (
              <span className="text-red-500 text-xs mt-1">
                Failed to load sports: {sportsError}
              </span>
            )}
            <div className="flex items-center gap-2">
              <InfoSubText
                hoverMessage={'The primary sport you conduct tournament or partake in'}
              />
            </div>
          </div>
          <div className="grid gap-2 mt-8">
            <Label htmlFor="othersports" className="font-satoshi-variable text-[14px] text-white">
              Other Sports (Optional)
            </Label>
            <MultiSelect
              className="sm:w-full lg:w-[880px] text-[#7F7F7F] flex items-center px-4 !h-[56px]"
              options={sportsOptions}
              value={otherSportsValue}
              onChange={handleOtherSportsChange}
              placeholder={sportsLoading ? 'Loading sports...' : 'Select'}
              maxVisible={3}
            />
            <div className="flex items-center gap-2">
              <InfoSubText
                hoverMessage={'If you also wish to conduct any other sport tournaments.'}
              />
            </div>
          </div>
          <div className="mt-8">
            <Label
              htmlFor="organization_role"
              className="font-satoshi-variable text-[14px] text-white mb-2"
            >
              Organisation Role
            </Label>
            <div className="sm:w-full lg:w-[880px]">
              <Select
                value={values?.organization_role || ''}
                onValueChange={(newValue) => {
                  setFieldValue('organization_role', newValue);
                  if (newValue.trim()) clearFieldError('organization_role');
                }}
              >
                <SelectTrigger
                  className={`!h-[56px] w-full text-white ${hasSubmitted && formErrors.organization_role ? 'border-red-500 focus:border-red-500' : ''}`}
                  id="organization_role"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual Organizer">Individual Organizer</SelectItem>
                  <SelectItem value="Club">Club</SelectItem>
                  <SelectItem value="Academy">Academy</SelectItem>
                  <SelectItem value="Federation">Federation</SelectItem>
                </SelectContent>
              </Select>
              {hasSubmitted && formErrors.organization_role && (
                <span
                  id="organization_role-error"
                  className="text-red-500 text-xs mt-1 font-satoshi-variable block min-h-[20px]"
                  role="alert"
                  aria-live="polite"
                >
                  {formErrors.organization_role}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mt-8">
            <div className="relative w-full lg:w-auto">
              <FormInput
                label="Organizing Experience (Optional)"
                id="organization_experience"
                type="text"
                placeholder="Eg: 5 Years"
                inputClassName="h-[56px] w-full lg:w-[435px] pr-[60px]"
                value={organizationExperienceValue}
                onChange={(e) => {
                  const val = e.target.value.trim();

                  if (val === '' || val === '0') {
                    setFieldValue('organization_experience', undefined);
                    setFieldValue('no_of_annual_events_hosted', undefined);
                  } else {
                    const numVal = Number(val);
                    if (!isNaN(numVal)) {
                      setFieldValue('organization_experience', numVal);
                    }
                  }
                }}
              />
              <span className="absolute right-4 top-[42px] text-white font-satoshi-variable text-[16px]">
                Years
              </span>
            </div>
            <div className="relative w-full lg:w-auto">
              <FormInput
                label="No of Annual Events Hosted (Optional)"
                id="no_of_annual_events_hosted"
                type="text"
                placeholder="Eg: 20 Events"
                inputClassName={`h-[56px] w-full lg:w-[435px] pr-[60px] ${
                  !(values?.organization_experience && values.organization_experience > 0)
                    ? 'bg-[#232323] text-[#A0A0A0] cursor-not-allowed'
                    : ''
                }`}
                value={annualEventsValue}
                onChange={(e) => {
                  const val = e.target.value.trim();

                  if (val === '' || val === '0') {
                    setFieldValue('no_of_annual_events_hosted', undefined);
                  } else {
                    const numVal = Number(val);
                    if (!isNaN(numVal)) {
                      setFieldValue('no_of_annual_events_hosted', numVal);
                    }
                  }
                }}
                readOnly={!(values?.organization_experience && values.organization_experience > 0)}
              />
              <span className="absolute right-4 top-[42px] text-white font-satoshi-variable text-[16px]">
                Events
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SportsAndRoleDetails;
