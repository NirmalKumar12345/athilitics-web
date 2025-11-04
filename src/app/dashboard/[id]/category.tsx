'use client';

import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioBoxGroup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAgeBrackets } from '@/hooks/useAgeBrackets';
import { useOrganizer } from '@/hooks/useOrganizer';
import { FormikProps } from 'formik';
import { CircleCheck, IndianRupee, Trash2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const Category = ({
  formik,
  hasSubmitted = false,
  onDeleteCategory,
  onAddCategory,
  activeAccordion,
  setActiveAccordion,
}: {
  formik: FormikProps<Partial<TournamentUpdateList>>;
  hasSubmitted?: boolean;
  onDeleteCategory?: (categoryId: number, categoryIndex: number) => Promise<void>;
  onAddCategory?: () => void;
  activeAccordion: number[];
  setActiveAccordion: (idxs: number[]) => void;
}) => {
  const { organizer } = useOrganizer();
  const { errors: formErrors, values, setFieldValue, setFieldError } = formik;

  const categoryRefs = useRef<HTMLDivElement[][]>([]);

  const { ageBracketOptions } = useAgeBrackets();

  const handleDeleteCategory = async (catIdx: number) => {
    const category = (values.categories || [])[catIdx] as any;

    if (onDeleteCategory && category?.id) {
      await onDeleteCategory(category.id, catIdx);
    } else {
      const newCategories = (values.categories || []).filter((_, i) => i !== catIdx);
      setFieldValue('categories', newCategories);
    }
  };

  const handleAgeChange = (categoryIdx: number, ageId: string) => {
    const selectedAge = ageBracketOptions.find((opt) => opt.id === Number(ageId));
    const newCategories = (values.categories || []).map((category: any, cIdx: number) => {
      if (cIdx === categoryIdx) {
        return {
          ...category,
          ageBracket: selectedAge || category.ageBracket,
        };
      }
      return category;
    });
    setFieldValue('categories', newCategories);
  };

  const handleGenderChange = (categoryIdx: number, gender: string) => {
    const newCategories = (values.categories || []).map((category: any, cIdx: number) => {
      if (cIdx === categoryIdx) {
        return {
          ...category,
          gender_type: gender,
        };
      }
      return category;
    });
    setFieldValue('categories', newCategories);
  };

  const handleFormatChange = (categoryIdx: number, format: string) => {
    const newCategories = (values.categories || []).map((category: any, cIdx: number) => {
      if (cIdx === categoryIdx) {
        return {
          ...category,
          format_type: format,
        };
      }
      return category;
    });
    setFieldValue('categories', newCategories);
  };

  const handleWaitingListChange = (categoryIdx: number, value: string) => {
    const newCategories = (values.categories || []).map((category: any, cIdx: number) => {
      if (cIdx === categoryIdx) {
        return {
          ...category,
          waiting_list: value === 'allowed',
        };
      }
      return category;
    });
    setFieldValue('categories', newCategories);
  };

  const handleMaxParticipantsChange = (categoryIdx: number, value: string) => {
    const newCategories = (values.categories || []).map((category: any, cIdx: number) => {
      if (cIdx === categoryIdx) {
        return {
          ...category,
          maximum_participants: value === '' ? undefined : Number(value),
        };
      }
      return category;
    });
    setFieldValue('categories', newCategories);
  };

  const handleEntryFeeChange = (categoryIdx: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    let num = Number(numericValue);
    if (numericValue === '' || (num >= 1 && num <= 999)) {
      const newCategories = (values.categories || []).map((category: any, cIdx: number) => {
        if (cIdx === categoryIdx) {
          return {
            ...category,
            entry_fee: numericValue === '' ? undefined : num,
          };
        }
        return category;
      });
      setFieldValue('categories', newCategories);
    }
  };

  const clearFieldError = React.useCallback(
    (field: string) => {
      setFieldError(field, undefined);
    },
    [setFieldError]
  );

  const useClearOnChange = <T extends (...args: any[]) => void>() => {
    return React.useCallback(
      (field: string, handler: T) => {
        return (...args: any[]) => {
          clearFieldError(field);
          handler(...args);
        };
      },
      [clearFieldError]
    );
  };

  const clearOnChange = useClearOnChange();

  const ageOptions = ageBracketOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
  }));

  useEffect(() => {
    const categories = values.categories || [];
    if (categories.length === 0) {
      const defaultCategory = {
        id: Date.now(),
        ageBracket: undefined,
        gender_type: undefined,
        tournamentId: 0,
        organizerId: organizer?.id || 0,
        divisions_label: '',
        divisions_alias: '',
        format_type: undefined,
        entry_fee: undefined,
        waiting_list: false,
        maximum_participants: undefined,
      };
      setFieldValue('categories', [defaultCategory]);
    }
  }, [values.categories, organizer?.id, setFieldValue]);


  const tournamentFormatName = formik?.values?.format_name || undefined;

  let disableSingles = false;
  let disableDoubles = false;
  if (tournamentFormatName === 'Singles Only') {
    disableDoubles = true;
  } else if (tournamentFormatName === 'Doubles Only') {
    disableSingles = true;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Accordion
        type="multiple"
        className="w-full max-w-[796px]"
        value={activeAccordion.map(idx => {
          const cat = (values.categories ?? [])[idx] as any;
          return `category-${cat && typeof cat.id !== 'undefined' ? cat.id : idx}`;
        })}
        onValueChange={vals => {
          const cats = values.categories ?? [];
          const idxs = vals
            .map(val => {
              const match = val.match(/^category-(\d+)$/);
              if (match) {
                const id = Number(match[1]);
                const foundIdx = cats.findIndex((cat: any, i: number) => (typeof cat.id !== 'undefined' ? cat.id === id : i === id));
                return foundIdx !== -1 ? foundIdx : null;
              }
              return null;
            })
            .filter(idx => idx !== null) as number[];
          setActiveAccordion(idxs);
        }}
      >
        {(values.categories ?? []).map((category: any, idx: number) => {
          const categoryError =
            Array.isArray(formErrors.categories) && formErrors.categories[idx]
              ? (formErrors.categories[idx] as Record<string, any>)
              : {};
          const summaryChips = (
            <div className='flex flex-row justify-between w-full items-center gap-2 sm:gap-0 flex-wrap'>
              <div className="flex flex-row flex-wrap gap-4 sm:gap-8 items-center overflow-x-auto py-1 sm:py-2">
                <span className="font-satoshi-bold text-white text-xs sm:text-base text-left">Category - {idx + 1}</span>
                {(category?.ageBracket?.label || category?.gender_type || category?.format_type) && (
                  <span className="px-2 py-1 sm:px-4 sm:py-2 rounded border border-[#4EF162] text-white bg-[#16171B] text-xs sm:text-sm font-satoshi-regular">
                    {[category?.ageBracket?.label, category?.gender_type, category?.format_type].filter(Boolean).join(' - ')}
                  </span>
                )}
              </div>
              {category?.entry_fee && (
                <span className="flex items-center rounded overflow-hidden border-2 border-[#4EF162] w-auto mt-0 sm:mt-0">
                  <span className="px-1 py-1 sm:px-1 sm:py-2 bg-black text-white text-base sm:text-lg font-satoshi-bold flex items-center w-[65px]">
                    ₹{Math.trunc(Number(category.entry_fee))}
                  </span>
                  <span className="px-1 py-1 sm:px-2 sm:py-2 bg-[#4EF162] flex items-center justify-center w-[32px]">
                    <CircleCheck className="w-4 sm:w-6 h-4 sm:h-6 text-black " color='white' fill='black' />
                  </span>
                </span>
              )}
            </div>
          );
          return (
            <AccordionItem key={typeof (category as any).id !== 'undefined' ? (category as any).id : idx} value={`category-${typeof (category as any).id !== 'undefined' ? (category as any).id : idx}`} className="bg-[#121212] rounded-[8px] border border-[#282A28] mb-4">
              <AccordionTrigger className="px-6 py-4 flex items-center justify-between">
                {summaryChips}

              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="px-[20px] sm:px-[30px] pt-[20px] pb-[20px]">
                  <div className='flex justify-between items-center mb-4'>
                    <span className="font-satoshi-bold text-white">Categories</span>
                    {idx !== 0 && (
                      <span
                        className="cursor-pointer flex justify-end"
                        onClick={e => { e.stopPropagation(); handleDeleteCategory(idx); }}
                      >
                        <Trash2 className="w-[20px] h-[20px]" color="white" />
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2 mt-3 sm:mt-4 mb-4">
                    <Label htmlFor="age" className="font-satoshi-variable text-[14px] text-white">
                      Age Limit
                    </Label>
                    <Select
                      value={category?.ageBracket?.id ? String(category.ageBracket.id) : ''}
                      onValueChange={(val) => handleAgeChange(idx, val)}
                    >
                      <SelectTrigger className="w-full !h-[56px] text-white" id={`age_${idx}`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageOptions.map((opt) => (
                          <SelectItem key={opt.id} value={String(opt.id)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {hasSubmitted && categoryError.ageBracket && (
                      <span className="text-red-500 text-xs mt-1">{categoryError.ageBracket}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-col flex-1">
                      <Label className="font-satoshi-variable text-[14px] text-white mb-2">Gender</Label>
                      <RadioGroup
                        value={category?.gender_type || ''}
                        onValueChange={(val) => handleGenderChange(idx, val)}
                        className="flex flex-col sm:flex-row justify-between gap-[6px] sm:gap-[6px]"
                        id={`gender_${idx}`}
                      >
                        <RadioGroupItem
                          className="border border-[#3C3B3B] w-full sm:w-[241px] h-[56px] font-tt-norms-pro-medium text-[14px] sm:text-[16px]"
                          value="Male"
                        >
                          Male
                        </RadioGroupItem>
                        <RadioGroupItem
                          className="border border-[#3C3B3B] w-full sm:w-[241px] h-[56px] font-tt-norms-pro-medium text-[14px] sm:text-[16px]"
                          value="Female"
                        >
                          Female
                        </RadioGroupItem>
                        <RadioGroupItem
                          className="border border-[#3C3B3B] w-full sm:w-[241px] h-[56px] font-tt-norms-pro-medium text-[14px] sm:text-[16px]"
                          value="Mixed"
                        >
                          Mixed
                        </RadioGroupItem>
                      </RadioGroup>

                      {hasSubmitted && categoryError.gender_type && (
                        <span className="text-red-500 text-xs mt-1">{categoryError.gender_type}</span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 mt-4">
                      <Label className="font-satoshi-variable text-[14px] text-white mb-2">Format</Label>
                      <RadioGroup
                        value={category?.format_type || ''}
                        onValueChange={(val) => handleFormatChange(idx, val)}
                        className="flex flex-col sm:flex-row justify-between gap-[6px] sm:gap-[5px]"
                        id={`format_${idx}`}
                      >
                        <RadioGroupItem
                          className={`border border-[#3C3B3B] w-full sm:w-full h-[56px] font-tt-norms-pro-medium text-[14px] sm:text-[16px]${disableSingles ? ' bg-[#151515] text-[#888] cursor-not-allowed' : ''}`}
                          value="Singles"
                          disabled={disableSingles}
                        >
                          {disableSingles ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>Singles</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Only Doubles format is allowed for this tournament
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            'Singles'
                          )}
                        </RadioGroupItem>
                        <RadioGroupItem
                          className={`border border-[#3C3B3B] w-full sm:w-full h-[56px] font-tt-norms-pro-medium text-[14px] sm:text-[16px]${disableDoubles ? ' bg-[#151515] text-[#888] cursor-not-allowed' : ''}`}
                          value="Doubles"
                          disabled={disableDoubles}
                        >
                          {disableDoubles ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>Doubles</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Only Singles format is allowed for this tournament
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            'Doubles'
                          )}
                        </RadioGroupItem>
                      </RadioGroup>
                      {hasSubmitted && categoryError.format_type && (
                        <span className="text-red-500 text-xs mt-1">{categoryError.format_type}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor={`entry_fee_${idx}`} className="font-satoshi-variable text-[14px] text-white">
                      Entry Fee
                    </Label>
                    <div className="relative rounded-[8px] flex items-start gap-[8px] mt-2">
                      <Input
                        type="text"
                        maxLength={3}
                        placeholder="Enter the amount"
                        value={category?.entry_fee ? String(Math.trunc(Number(category.entry_fee))) : ''}
                        className={`w-full h-[56px] pl-8 pr-28 pt-4 pb-4 bg-black text-white rounded-[8px] border border-[#282A28] focus:outline-none ${hasSubmitted && categoryError.entry_fee ? 'border-red-500' : ''}`}
                        onChange={(e) => handleEntryFeeChange(idx, e.target.value)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id={`entry_fee_${idx}`}
                      />
                      <IndianRupee
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex text-white"
                        size={14}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-[12px] lg:text-[14px] font-satoshi-variable font-[400]">
                        Event or Per Match
                      </span>
                    </div>
                    {hasSubmitted && categoryError.entry_fee && (
                      <span className="text-red-500 text-xs mt-1">{categoryError.entry_fee}</span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row w-full gap-[12px] sm:gap-[15px] mt-4">
                    <div className="flex flex-col flex-1">
                      <Label className="font-satoshi-variable text-[14px] text-white mb-2">
                        Maximum Participants
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter Number"
                        value={
                          category?.maximum_participants !== undefined
                            ? String(category.maximum_participants)
                            : ''
                        }
                        onChange={(e) => handleMaxParticipantsChange(idx, e.target.value)}
                        className="bg-black border-[#3C3B3B] w-full text-white h-[56px]"
                        id={`max_participants_${idx}`}
                      />
                      {hasSubmitted && categoryError.maximum_participants && (
                        <span className="text-red-500 text-xs mt-1">
                          {categoryError.maximum_participants}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label className="text-white text-[14px] font-satoshi-variable">
                        Over-Capacity Waiting List
                      </Label>
                      <RadioGroup
                        value={category?.waiting_list === true ? 'allowed' : 'not_allowed'}
                        onValueChange={(val) => handleWaitingListChange(idx, val)}
                        className="mt-2 flex flex-col sm:flex-row w-full items-center gap-[6px] sm:gap-[15px]"
                      >
                        <RadioGroupItem
                          value="not_allowed"
                          className="border border-[#282A28] w-full sm:w-[177.25px] h-[56px] rounded-[8px] bg-black text-white font-tt-norms-pro-medium text-[14px] sm:text-[16px]"
                        >
                          Not Allowed
                        </RadioGroupItem>
                        <RadioGroupItem
                          value="allowed"
                          className="border border-[#282A28] w-full sm:w-[177.25px] h-[56px] rounded-[8px] bg-black text-white font-tt-norms-pro-medium text-[14px] sm:text-[16px]"
                        >
                          Allowed
                        </RadioGroupItem>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {/* Show array-level error for categories if present and hasSubmitted */}
      {hasSubmitted && typeof formErrors.categories === 'string' && !!formErrors.categories && (
        <span className="text-red-500 text-xs mt-1">{formErrors.categories}</span>
      )}
    </div>
  );
};

export default Category;