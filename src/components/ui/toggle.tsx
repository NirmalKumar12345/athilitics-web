'use client';

import { Tournament } from '@/api/models/TournamentList';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { safeDate, todayMidnight } from '../utils';

type TabOption = 'upcoming' | 'past';

export default function Toggle({
  tournaments = [],
  selected,
  setSelected,
}: {
  tournaments?: Tournament[];
  selected: TabOption;
  setSelected: (tab: TabOption) => void;
}) {
  const { upcomingCount, pastCount } = useMemo(() => {
    const todayTS = todayMidnight();
    let upcoming = 0;
    let past = 0;

    tournaments.forEach((t) => {
      const ts = safeDate(t.tournament_date);
      if (ts === null) {
        // Do not count tournaments with null date
        return;
      } else if (ts >= todayTS) {
        upcoming++;
      } else {
        past++;
      }
    });

    return { upcomingCount: upcoming, pastCount: past };
  }, [tournaments]);

  return (
    <div
      className="flex items-center bg-black p-1.5 rounded-lg border-[0.5px] border-[#282A28] gap-[20px] h-[50px] transition-all duration-300 ease-in-out hover:border-[#4EF162]/30 w-auto"
    >
      <button
        onClick={() => setSelected('upcoming')}
        className={cn(
          'px-4 py-1 rounded-md font-satoshi-variable flex items-center gap-2 transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105',
          selected === 'upcoming'
            ? 'bg-[#4EF162] text-black h-10 shadow-lg shadow-green-400/20'
            : 'bg-transparent text-white hover:bg-[#4EF162]/10 hover:text-[#4EF162]'
        )}
      >
        <span className="transition-all duration-300 ease-in-out">Upcoming</span>
        <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-[#FEE440] text-black transition-all duration-300 ease-in-out hover:bg-[#FFE620] hover:scale-110">
          {upcomingCount || 0}
        </span>
      </button>

      <button
        onClick={() => setSelected('past')}
        className={cn(
          'px-5 py-1 rounded-md font-satoshi-variable flex items-center gap-2 text-white transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105',
          selected === 'past'
            ? 'bg-[#4EF162] text-black h-10 shadow-lg shadow-green-400/20'
            : 'bg-transparent hover:bg-[#4EF162]/10 hover:text-[#4EF162]'
        )}
      >
        <span className="transition-all duration-300 ease-in-out">Past</span>
        <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-[#FEE440] text-black transition-all duration-300 ease-in-out hover:bg-[#FFE620] hover:scale-110">
          {pastCount || 0}
        </span>
      </button>
    </div>
  );
}
