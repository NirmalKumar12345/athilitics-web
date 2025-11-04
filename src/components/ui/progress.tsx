'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-[#4EF162] relative h-[18px] w-full flex items-center overflow-hidden rounded-full px-[9px]',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-black h-[10px] transition-all rounded-l-full"
        style={{ width: `${value || 0}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
