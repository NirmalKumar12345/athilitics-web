'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

type TabOption = 'reg_complete' | 'payment_complete' | 'waitlist' | 'withdraw';

export default function ToggleNav({
  selected,
  setSelected,
  tournament,
}: {
  selected: TabOption;
  setSelected: (tab: TabOption) => void;
  tournament: any;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab: TabOption) => {
    if (tab === selected) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setSelected(tab);
      setIsTransitioning(false);
    }, 150);
  };

  const tabs = [
    { id: 'reg_complete', label: 'Reg Complete', count: tournament?.current_participants || 0 },
    { id: 'payment_complete', label: 'Payment Complete', count: 0 },
    { id: 'waitlist', label: 'Waitlist', count: 0 },
    { id: 'withdraw', label: 'Withdraw', count: 0 },
  ] as const;

  return (
    <div>
      <div className="w-auto flex items-center bg-black p-1 sm:p-2 rounded-lg border-[0.5px] border-[#282A28] gap-2 sm:gap-3 md:gap-2 lg:gap-[20px] h-[44px] sm:h-[50px] transition-all duration-300 hover:border-[#4EF162]/30 overflow-x-auto md:overflow-x-visible">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-2 sm:px-3 md:px-2.5 lg:px-4 py-1 rounded-md font-satoshi-variable flex items-center gap-1 sm:gap-2 md:gap-1.5 lg:gap-2 cursor-pointer relative transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] transform whitespace-nowrap text-xs sm:text-sm md:text-[13px] lg:text-base flex-shrink-0',
              selected === tab.id
                ? 'bg-[#4EF162] text-black h-8 sm:h-9 md:h-9.5 lg:h-10 scale-105 shadow-lg shadow-[#4EF162]/30'
                : 'bg-transparent text-white hover:bg-[#4EF162]/10 hover:text-[#4EF162] hover:scale-102',
              isTransitioning && selected === tab.id && 'animate-pulse'
            )}
          >
            <span className="whitespace-nowrap flex items-center gap-1 sm:gap-2 transition-all duration-300">
              <span
                className={cn(
                  'transition-all duration-300 text-[10px] sm:text-sm md:text-[13px] lg:text-base',
                  selected === tab.id ? 'font-bold' : 'font-medium'
                )}
              >
                <span className="lg:hidden">
                  {tab.label === 'Reg Complete'
                    ? 'Registered'
                    : tab.label === 'Payment Complete'
                      ? 'Payment'
                      : tab.label === 'Waitlist'
                        ? 'Waitlist'
                        : tab.label === 'Withdraw'
                          ? 'Withdraw'
                          : ''}
                </span>
                <span className="hidden lg:inline">{tab.label}</span>
              </span>
              <span
                className={cn(
                  'text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded font-semibold transition-all duration-300 transform',
                  selected === tab.id
                    ? 'bg-[#FEE440] text-black scale-110 shadow-md'
                    : 'bg-[#FEE440] text-black hover:scale-105'
                )}
              >
                {tab.count}
              </span>
            </span>

            {/* Hover indicator */}
            {selected !== tab.id && (
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#4EF162]/0 to-[#4EF162]/0 hover:from-[#4EF162]/5 hover:to-[#4EF162]/10 transition-all duration-300 pointer-events-none" />
            )}

            {/* Active indicator glow */}
            {selected === tab.id && (
              <div className="absolute inset-0 rounded-md bg-[#4EF162] opacity-100 animate-pulse pointer-events-none -z-10" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
