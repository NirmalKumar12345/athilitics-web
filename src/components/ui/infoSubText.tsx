'use client';

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface InfoSubTextProps {
  text?: string;
  className?: string;
  infoSize?: number;
  hoverMessage?: string;
  fillColor?: string;
}

export function InfoSubText({
  text = 'For sub text',
  className,
  infoSize = 18,
  fillColor = '#64748B',
  hoverMessage = 'Info',
}: InfoSubTextProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 py-1', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Info
              className={`fill-[${fillColor}] bg-transparent cursor-pointer`}
              size={infoSize}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{hoverMessage}</TooltipContent>
      </Tooltip>
      <span className="text-white text-[12px] font-medium">{text}</span>
    </div>
  );
}
