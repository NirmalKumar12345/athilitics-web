'use client';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import * as React from 'react';

interface MultiSelectOption {
  label: string;
  value: string | number;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
  placeholder?: string;
  maxVisible?: number;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  maxVisible = 4,
  className,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const stringifiedValueSet = React.useMemo(() => new Set(value.map(String)), [value]);

  const toggleOption = (optionValue: string | number) => {
    const optionValueStr = String(optionValue);
    const newValue = stringifiedValueSet.has(optionValueStr)
      ? value.filter((v) => String(v) !== optionValueStr)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string | number) => {
    const optionValueStr = String(optionValue);
    if (stringifiedValueSet.has(optionValueStr)) {
      onChange(value.filter((v) => String(v) !== optionValueStr));
    }
  };
  const clearSelection = () => {
    onChange([]);
  };

  const toggleAll = () => {
    if (value.length === options.length) {
      clearSelection();
    } else {
      onChange(options.map((option) => option.value));
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center cursor-pointer justify-between rounded-md border-input bg-black px-2 sm:px-3 py-2 text-sm font-satoshi-variable text-black shadow-xs focus-visible:ring-[3px] focus-visible:ring-ring/50 focus:outline-none data-[placeholder]:text-white data-[placeholder]:font-300 min-h-[40px] sm:min-h-[56px]',
            className
          )}
        >
          {value.length > 0 ? (
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden">
              <div className="flex sm:hidden items-center gap-1 flex-1 min-w-0">
                {value.length > 0 && (
                  <Badge className="flex items-center gap-1 max-w-[120px] h-[28px] border-[1px] border-[#292828] bg-[#16171B] font-satoshi-variable font-[500] text-[12px] truncate">
                    <span className="truncate flex-1">
                      {options.find((o) => String(o.value) === String(value[0]))?.label}
                    </span>
                    <X
                      className="cursor-pointer w-[12px] h-[12px] flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(value[0]);
                      }}
                    />
                  </Badge>
                )}
                {value.length > 1 && (
                  <Badge className="text-[12px] h-[28px] bg-[#16171B] border-[#292828] px-2">
                    +{value.length - 1} more
                  </Badge>
                )}
              </div>

              <div className="hidden sm:flex flex-wrap items-center gap-2 flex-1 min-w-0">
                {value.slice(0, maxVisible).map((val) => {
                  const option = options.find((o) => String(o.value) === String(val));
                  return (
                    <Badge
                      key={String(val)}
                      className="flex items-center gap-1 max-w-[128px] h-[36px] border-[1px] border-[#292828] bg-[#16171B] font-satoshi-variable font-[500] text-[14px] truncate"
                    >
                      <span className="truncate flex-1">{option?.label}</span>
                      <X
                        className="cursor-pointer w-[16px] h-[16px] flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(val);
                        }}
                      />
                    </Badge>
                  );
                })}
                {value.length > maxVisible && (
                  <Badge className="text-[14px] h-[36px] bg-[#16171B] border-[#292828]">
                    +{value.length - maxVisible} more
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <span className="text-white font-[300] font-satoshi-variable text-[14px] sm:text-[16px] truncate">
              {placeholder}
            </span>
          )}
          <img
            src="/images/arrowdown.svg"
            alt={isPopoverOpen ? 'Close dropdown' : 'Open dropdown'}
            className={cn(
              'transition-transform duration-200 ease-in-out flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5',
              isPopoverOpen && 'rotate-180'
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 sm:w-80 p-2 bg-[#16171B] border border-accent text-white">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-8 sm:h-10 w-full px-2 sm:px-3 py-1 sm:py-2 text-sm font-satoshi-variable text-white bg-transparent border-input placeholder:text-white"
          />
          <CommandList className="max-h-auto overflow-y-auto">
            <CommandEmpty className="text-white font-satoshi-variable text-[16px] text-center">
              No options found.
            </CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={toggleAll} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {value.length === options.length && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="font-satoshi-variable text-white font-[400] text-[14px]">
                    Select All
                  </span>
                </div>
              </CommandItem>
              {options.map((option) => {
                const isSelected = value.map(String).includes(String(option.value));
                return (
                  <CommandItem
                    key={String(option.value)}
                    onSelect={() => toggleOption(option.value)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span
                        className={cn(
                          'font-satoshi-variable text-[14px]',
                          isSelected ? 'text-white font-[500]' : 'text-white font-[400]'
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
