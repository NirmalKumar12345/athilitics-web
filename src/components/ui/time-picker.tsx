'use client';

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const NBSP = '\u00A0';
const HOURS_IN_12_FORMAT = 12;
const MINUTES_IN_HOUR = 60;

interface TimePickerPopoverProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

interface TimeState {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

function formatTime(timeString: string): string {
  if (!timeString) return '00:00';

  if (timeString.includes('T')) {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return '00:00';
    const hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (hour === 0 && minutes === '00') return '00:00';

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % HOURS_IN_12_FORMAT || HOURS_IN_12_FORMAT;
    return `${displayHour}:${minutes}${NBSP}${ampm}`;
  }

  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return '00:00';

  if (hours === '00' && minutes === '00') return '00:00';

  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % HOURS_IN_12_FORMAT || HOURS_IN_12_FORMAT;
  const formattedMinutes = minutes.padStart(2, '0');

  return `${displayHour}:${formattedMinutes}${NBSP}${ampm}`;
}

function parseTimeString(timeString: string): TimeState {
  if (!timeString) return { hour: HOURS_IN_12_FORMAT, minute: 0, period: 'AM' };

  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return { hour: HOURS_IN_12_FORMAT, minute: 0, period: 'AM' };

  const hour24 = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  if (hour24 === 0) {
    return { hour: HOURS_IN_12_FORMAT, minute, period: 'AM' };
  } else if (hour24 < 12) {
    return { hour: hour24, minute, period: 'AM' };
  } else if (hour24 === 12) {
    return { hour: HOURS_IN_12_FORMAT, minute, period: 'PM' };
  } else {
    return { hour: hour24 - HOURS_IN_12_FORMAT, minute, period: 'PM' };
  }
}

function timeStateTo24Hour(timeState: TimeState): string {
  let hour24 = timeState.hour;

  if (timeState.period === 'AM' && timeState.hour === HOURS_IN_12_FORMAT) {
    hour24 = 0;
  } else if (timeState.period === 'PM' && timeState.hour !== HOURS_IN_12_FORMAT) {
    hour24 = timeState.hour + HOURS_IN_12_FORMAT;
  }

  return `${hour24.toString().padStart(2, '0')}:${timeState.minute.toString().padStart(2, '0')}`;
}

function TimePickerPopover({
  value,
  onChange,
  className,
  placeholder = 'Select Time',
  disabled = false,
  error = false,
}: TimePickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [timeState, setTimeState] = React.useState<TimeState>(() => parseTimeString(value));

  const displayValue = value?.trim() ? value : '';
  const hasValue = Boolean(displayValue);

  React.useEffect(() => {
    if (value) {
      setTimeState(parseTimeString(value));
    }
  }, [value]);

  const handleTimeStateChange = (newTimeState: Partial<TimeState>) => {
    const updatedTimeState = { ...timeState, ...newTimeState };
    setTimeState(updatedTimeState);
    const time24Hour = timeStateTo24Hour(updatedTimeState);
    onChange(time24Hour);
  };

  const hours = Array.from({ length: HOURS_IN_12_FORMAT }, (_, i) => i + 1);
  const minutes = Array.from({ length: MINUTES_IN_HOUR }, (_, i) => i);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'w-full h-[56px] pl-8 pr-12 pt-4 pb-4 bg-black border border-[#282A28] text-white rounded-[8px] flex items-center cursor-pointer transition-all duration-200 relative group',
            'hover:border-[#3A3C3A] focus-within:border-[#4A4C4A] focus-within:ring-2 focus-within:ring-[#4A4C4A]/20',
            'min-w-[160px]',
            disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
            error && 'border-red-500/50 bg-red-500/5',
            className
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={hasValue ? `Selected time: ${formatTime(displayValue)}` : placeholder}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span
            className={cn(
              'text-sm transition-colors duration-200 font-satoshi-variable whitespace-nowrap overflow-hidden text-ellipsis',
              hasValue ? 'text-white font-[400]' : 'text-[#7F7F7F] font-[300]',
              error && 'text-red-400'
            )}
          >
            {hasValue ? formatTime(displayValue) : placeholder}
          </span>
          <img
            src="/images/arrowdown.svg"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200',
              open && 'rotate-180',
              error ? 'opacity-60' : 'opacity-80 group-hover:opacity-100'
            )}
            alt="Open dropdown"
          />
          <Clock
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
              error ? 'text-red-400' : 'text-[#7F7F7F] group-hover:text-white/80'
            )}
            size={16}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-4 bg-[#1A1A1A] border-[#282A28] shadow-xl"
        align="start"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="text-sm font-medium text-white">Select Time</div>

          <div className="flex gap-3 items-end min-w-0">
            <div className="flex-1 min-w-[70px]">
              <Label className="block text-xs text-[#7F7F7F] mb-1 font-medium">Hour</Label>
              <Select
                value={timeState.hour.toString()}
                onValueChange={(val) => handleTimeStateChange({ hour: parseInt(val) })}
              >
                <SelectTrigger className="w-full px-2 py-2.5 text-sm rounded-md border bg-[#282A28] border-[#3A3C3A] text-white cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-white text-xl font-medium pb-2">:</div>

            <div className="flex-1 min-w-[70px]">
              <Label className="block text-xs text-[#7F7F7F] mb-1 font-medium">Minute</Label>
              <Select
                value={timeState.minute.toString()}
                onValueChange={(val) => handleTimeStateChange({ minute: parseInt(val) })}
              >
                <SelectTrigger className="w-full px-2 py-2.5 text-sm rounded-md border bg-[#282A28] border-[#3A3C3A] text-white cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[65px] flex-shrink-0">
              <Label className="block text-xs text-[#7F7F7F] mb-1 font-medium">Period</Label>
              <Select
                value={timeState.period}
                onValueChange={(val) => handleTimeStateChange({ period: val as 'AM' | 'PM' })}
              >
                <SelectTrigger className="w-full px-2 py-2.5 text-sm rounded-md border bg-[#282A28] border-[#3A3C3A] text-white cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => setOpen(false)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#3A3C3A] hover:bg-[#4A4C4A] rounded-md transition-colors duration-200 cursor-pointer"
            >
              Done
            </Button>
            <Button
              onClick={() => {
                setTimeState({ hour: HOURS_IN_12_FORMAT, minute: 0, period: 'AM' });
                onChange('00:00');
                setOpen(false);
              }}
              className="px-3 py-2 text-sm font-medium text-[#7F7F7F] hover:text-white bg-transparent border border-[#3A3C3A] hover:border-[#4A4C4A] rounded-md transition-colors duration-200 cursor-pointer"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default TimePickerPopover;
