'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  // Handle mobile click-to-toggle behavior
  React.useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Element;
      const tooltipContent = document.querySelector('[data-radix-tooltip-content]');
      const tooltipTrigger = document.querySelector('[data-radix-tooltip-trigger]');

      if (
        isOpen &&
        tooltipContent &&
        !tooltipContent.contains(target) &&
        tooltipTrigger &&
        !tooltipTrigger.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobile, isOpen]);

  const tooltipProps = isMobile
    ? {
        open: isOpen,
        onOpenChange: setIsOpen,
        ...props,
      }
    : props;

  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...tooltipProps}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Check if this is a TooltipTrigger by looking at the component type
            const childType = (child.type as any)?.displayName || (child.type as any)?.name;
            if (childType === 'TooltipTrigger' || child.type === TooltipTrigger) {
              return isMobile
                ? React.cloneElement(child as React.ReactElement<any>, {
                    ...(child.props as React.HTMLAttributes<HTMLElement>),
                    onClick: (e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(!isOpen);
                      // Call original onClick if it exists
                      const originalOnClick = (child.props as any)?.onClick;
                      if (originalOnClick && typeof originalOnClick === 'function') {
                        originalOnClick(e);
                      }
                    },
                  })
                : child;
            }
          }
          return child;
        })}
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}

// Add displayName for easier identification
Tooltip.displayName = 'Tooltip';

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

TooltipTrigger.displayName = 'TooltipTrigger';

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const isMobile = useIsMobile();
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs',
          isMobile ? 'max-w-[90vw] whitespace-normal break-words text-left' : 'text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
