'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('flex gap-4', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-md border border-[#3C3B3B] cursor-pointer bg-black w-[237px] h-[56px]',
        'data-[state=checked]:border-[#4EF162] text-white font-[500px] data-[state=checked]:text-white',
        className
      )}
    >
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        className={cn(
          'w-[16px] h-[16px] rounded-full border border-gray-500 flex items-center justify-center',
          'data-[state=checked]:border-[#4EF162] transition-colors'
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="w-[8px] h-[8px] rounded-full bg-[#4EF162]"
        />
      </RadioGroupPrimitive.Item>
      <span className="text-sm font-medium">{children}</span>
    </label>
  );
}

export { RadioGroup, RadioGroupItem };
