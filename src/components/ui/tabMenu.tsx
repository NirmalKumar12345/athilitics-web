import { cn } from '@/lib/utils';
import * as React from 'react';

type Tab = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
};

export function TabsMenu({ tabs, activeTab, onTabChange }: Props) {
  const [internalActive, setInternalActive] = React.useState(tabs[0].value);

  const currentActive = activeTab !== undefined ? activeTab : internalActive;

  const handleTabClick = (tabValue: string) => {
    if (tabValue === currentActive) return;

    setTimeout(() => {
      if (onTabChange) {
        onTabChange(tabValue);
      } else {
        setInternalActive(tabValue);
      }
    }, 100);
  };

  return (
    <div>
      <div className="flex justify-start gap-6 border-[#333] mb-6 overflow-x-auto lg:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              'pb-2 text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 whitespace-nowrap min-w-0 flex-shrink-0',
              currentActive === tab.value
                ? 'border-b-2 border-[#4EF162] text-[#4EF162] cursor-pointer'
                : 'text-muted-foreground cursor-pointer hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className={cn('transition-opacity duration-300 ease-in-out')}>
          {tabs.find((t) => t.value === currentActive)?.content}
        </div>
      </div>
    </div>
  );
}
