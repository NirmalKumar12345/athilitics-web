'use client';

import { DatePicker } from '@/components/datePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoSubText } from '@/components/ui/infoSubText';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioBoxGroup';
import { Switch } from '@/components/ui/switch';
import TimePicker from '@/components/ui/time-picker';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOrganizer } from '@/hooks/useOrganizer';
import { CalendarDays } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { validateEndTimeAtLeast30MinAfterStart } from './validationSchemas';

type TournamentType = 'Single Day' | 'Multiple Day';

interface Props {
  recurring: boolean;
  onToggleRecurring: (value: boolean) => void;

  type: string;
  onChangeType: (v: string) => void;
  date: string;
  onChangeDate: (v: string) => void;
  startTime: string;
  onChangeStartTime: (v: string) => void;
  endTime?: string;
  onChangeEndTime: (v: string) => void;
  errors?: { [key: string]: string };
  onClearError?: (field: string) => void; // <-- add this
}

export default function DateTimeCard({
  recurring,
  onToggleRecurring,
  type,
  onChangeType,
  date,
  onChangeDate,
  startTime,
  onChangeStartTime,
  endTime,
  onChangeEndTime,
  errors = {},
  onClearError, // <-- add this
}: Props) {
  const [event_type, setEventType] = useState('single');

  const [endTimeValidationError, setEndTimeValidationError] = useState<string>('');

  React.useEffect(() => {
    setEventType(type);
  }, [type]);

  const { organizer } = useOrganizer();

  const tierStatus = organizer?.tier_status || 'Free Tier';
  const isProTier = tierStatus === 'Pro Tier' || tierStatus === 'Pro Plus Tier';
  const isProPlusTier = tierStatus === 'Pro Plus Tier';

  const canAccessRecurring = isProTier || isProPlusTier;
  const canAccessMultipleDay = isProPlusTier;

  const validateEndTime = (endTimeValue: string, startTimeValue: string) => {
    const error = validateEndTimeAtLeast30MinAfterStart(endTimeValue, startTimeValue);
    setEndTimeValidationError(error);
  };

  React.useEffect(() => {
    if (event_type === 'Multiple Day' && !canAccessMultipleDay) {
      setEventType('Single Day');
      onChangeType('Single Day');
    }
  }, [canAccessMultipleDay, event_type, onChangeType]);

  React.useEffect(() => {
    if (recurring && !canAccessRecurring) {
      onToggleRecurring(false);
    }
  }, [canAccessRecurring, recurring, onToggleRecurring]);

  useEffect(() => {
    if (errors.tournament_end_time) {
      setEndTimeValidationError('');
    }
  }, [errors.tournament_end_time]);

  const handleEventTypeChange = (value: string) => {
    if (value === 'Multiple Day' && !canAccessMultipleDay) {
      return;
    }

    setEventType(value);
    onChangeType(value as TournamentType);
    if (onClearError) {
      onClearError('tournament_type');
    }
  };

  const handleRecurringToggle = (checked: boolean) => {
    if (checked && !canAccessRecurring) {
      toast.error('Recurring tournaments are available for Pro Tier');
      return;
    }

    onToggleRecurring(checked);
  };

  const displayStartTime = startTime || '00:00';
  const displayEndTime = endTime || '00:00';

  return (
    <Card className="max-w-[796px] w-full h-auto rounded-[8px] bg-[#282A28]">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-[16px] font-bold font-satoshi-variable text-white">
          <CalendarDays size={16} /> Date &amp; Time
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full flex flex-col gap-[20px] sm:gap-[23px] pt-0 mx-auto">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Tooltip>
              <div className="flex items-center gap-3">
                <TooltipTrigger asChild>
                  <Switch
                    checked={recurring}
                    onCheckedChange={handleRecurringToggle}
                    className={
                      !canAccessRecurring
                        ? recurring
                          ? 'bg-[#4EF16266] cursor-not-allowed'
                          : 'bg-[#828282] cursor-not-allowed'
                        : 'data-[state=checked]:bg-[#4EF162] cursor-pointer'
                    }
                    disabled={!canAccessRecurring}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!canAccessRecurring
                      ? 'Recurring tournaments are available for Pro Tier and above'
                      : 'Create tournaments that repeat on a schedule'}
                  </p>
                </TooltipContent>
              </div>
              <span className="text-sm text-white font-satoshi-variable">
                Recurring Tournament
                <span className="text-[#F24B8B]">&nbsp;(Pro Feature)</span>
              </span>
            </Tooltip>
          </div>
          <div className="flex items-center mt-2 gap-2">
            <InfoSubText
              hoverMessage={
                'Is this tournament about to happen again in a series we can copy and paste the same settings and create a new tournament.'
              }
            />
          </div>
        </div>
        <div>
          <Label className="text-white text-[14px] font-satoshi-variable">Tournament Type</Label>
          <RadioGroup
            defaultValue="single"
            className="mt-2 flex flex-col sm:flex-row w-full items-start sm:items-center gap-2 sm:gap-4"
            value={event_type}
            onValueChange={handleEventTypeChange}
            id="tournament_type"
          >
            <RadioGroupItem
              value="Single Day"
              className={`gap-3 h-[56px]  font-tt-norms-pro-medium w-full sm:w-[372px]`}
            >
              Single Day
            </RadioGroupItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex-1 w-full sm:w-auto`}>
                  <RadioGroupItem
                    value="Multiple Day"
                    className={`gap-3 w-full sm:w-[372px] font-tt-norms-pro-medium ${!canAccessMultipleDay ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-tt-norms-pro-medium text-white leading-none tracking-normal">
                      Multiple Day {''}
                    </span>
                    <span className="font-tt-norms-pro font-[400] text-sm leading-none tracking-normal text-[#F24B8B]">
                      (Pro Plus Feature)
                    </span>
                  </RadioGroupItem>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {!canAccessMultipleDay
                    ? 'Multiple Day tournaments are available for Pro Plus Tier only'
                    : 'Multiple Day tournaments allow events spanning several days'}
                </p>
              </TooltipContent>
            </Tooltip>
          </RadioGroup>
          {errors.tournament_type && (
            <span className="text-red-500 text-xs mt-1">{errors.tournament_type}</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row w-full gap-[12px] sm:gap-[15px]">
          <label className="flex flex-col gap-[6px] flex-1">
            <span className="text-white text-[14px] font-satoshi-variable">Date</span>
            <DatePicker
              onChange={(selectedDate) => {
                onChangeDate(selectedDate ?? '');
                if (selectedDate && onClearError) onClearError('tournament_date');
              }}
              id="tournament_date"
              value={date}
            />
            {errors.tournament_date && (
              <span className="text-red-500 text-xs mt-1">{errors.tournament_date}</span>
            )}
          </label>

          <label className="flex flex-col gap-[6px] flex-1">
            <span className="text-white text-[14px] font-satoshi-variable">Start Time</span>
            <TimePicker
              value={displayStartTime}
              onChange={(val) => {
                onChangeStartTime(val);
                // Re-validate end time when start time changes
                if (endTime) {
                  validateEndTime(endTime, val);
                }
                if (val && onClearError) onClearError('tournament_start_time');
              }}
              id="tournament_start_time"
            />
            {errors.tournament_start_time && (
              <span className="text-red-500 text-xs mt-1">{errors.tournament_start_time}</span>
            )}
          </label>

          <label className="flex flex-col gap-[6px] flex-1">
            <span className="text-white text-[14px] font-satoshi-variable">
              End Time (Optional)
            </span>
            <TimePicker
              value={displayEndTime}
              onChange={(val) => {
                onChangeEndTime(val);
                // Immediate validation for end time
                validateEndTime(val, startTime);
                if (val && onClearError) onClearError('tournament_end_time');
              }}
              id="tournament_end_time"
              min={displayStartTime}
            />
            {(endTimeValidationError || errors.tournament_end_time) && (
              <span className="text-red-500 text-xs mt-1">
                {endTimeValidationError || errors.tournament_end_time}
              </span>
            )}
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
