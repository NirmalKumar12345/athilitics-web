'use client';

import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import * as React from 'react';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  onChange: (date: string | undefined) => void;
  id?: string;
  value?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({ onChange, id, value, className, minDate, maxDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const defaultValue = value || '';

  const [date, setDate] = React.useState<Date | undefined>(new Date(defaultValue));

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const formatLocalDate = (date: Date | undefined) => {
    if (!date) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString)
      return (
        <span className="font-satoshi-variable text-[16px] !font-[400] text-[#7F7F7F]">
          Select Date
        </span>
      );
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);

    const formattedDate = formatLocalDate(selectedDate);
    onChange(formattedDate);
  };

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
    }
  }, [value, onChange]);

  const selectedDayClass = 'bg-white text-black rounded-md';

  // Helper function for today modifier class
  const getTodayModifierClass = React.useCallback(
    (date: Date | undefined) => {
      if (!date) return '';
      return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
        ? selectedDayClass
        : '';
    },
    [today, selectedDayClass]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'h-[56px] pl-12 pr-10 pt-4 pb-4 bg-black border border-[#282A28] text-white rounded-[8px] flex items-center cursor-pointer transition-colors relative',
            className
          )}
        >
          <span className={cn('text-sm', !defaultValue && 'text-gray-400')}>
            {formatDisplayDate(defaultValue)}
          </span>
          <img
            src="/images/arrowdown.svg"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200',
              open && 'rotate-180'
            )}
            alt="Open dropdown"
          />
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          disabled={{
            before: minDate ? new Date(minDate) : today,
            after: maxDate ? new Date(maxDate) : undefined,
          }}
          classNames={{
            disabled: 'text-[#444] opacity-80',
          }}
          modifiersClassNames={{
            today: getTodayModifierClass(date),
            selected: selectedDayClass,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
