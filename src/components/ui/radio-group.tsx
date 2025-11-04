'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'inline-flex items-center justify-between rounded-md px-5 py-6 text-sm font-medium ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:border-primary data-[state=checked]:bg-black/40 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {/* Indicator */}
    <span className="relative mr-3 h-4 w-4">
      <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
        <span className="h-3 w-3 rounded-full bg-[#4EF162]" />
      </RadioGroupPrimitive.Indicator>
      <span className="absolute inset-0 rounded-full border border-[#666]" />
    </span>

    {children}
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup,  };
