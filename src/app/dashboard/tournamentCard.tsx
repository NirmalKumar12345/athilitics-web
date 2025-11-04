'use client';
import { Tournament } from '@/api/models/TournamentList';
import { TOURNAMENT_STATUS_PUBLISHED } from '@/app/constants/tournamentStatus';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useSports } from '@/hooks/useSports';
import { Search, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

function TournamentCard({ tournaments = [] }: { tournaments?: Tournament[] }) {
  const [search, setSearch] = React.useState('');
  const [showLoading] = React.useState(false);
  const router = useRouter();
  const { organizer } = useOrganizer();
  const { sports, isLoading } = useSports();

  const filteredSkillLevelsMap = React.useMemo(() => {
    const map: { [id: string]: string[] } = {};
    (tournaments || []).forEach((t) => {
      map[t.id] = Array.isArray(t.skill_level)
        ? t.skill_level.filter((s) => s && s.trim() !== '')
        : [];
    });
    return map;
  }, [tournaments]);

  const filteredTournaments = React.useMemo(() => {
    return tournaments.filter((t) => t.event_name.toLowerCase().includes(search.toLowerCase()));
  }, [tournaments, search]);

  return (
    <div className="flex flex-col gap-2 w-full h-auto">
      {(showLoading || isLoading) && <LoadingOverlay />}
      <div className="relative w-full">
        <Input
          leftIcon={<Search color="#CACACA" className="w-[16px] h-[16px]" />}
          className="h-[40px] sm:h-[50px] w-full border border-[#2A3128] placeholder:!text-[#CACACA] placeholder:!font-satoshi-variable placeholder:!font-[500] placeholder:!text-[12px] sm:placeholder:!text-[14px]"
          placeholder="Search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filteredTournaments.map((tournaments, idx) => {
        const sport =
          !tournaments.sportsName && tournaments.sports_id
            ? sports.find((s) => s.id === tournaments.sports_id)
            : undefined;

        const isPublished = tournaments.tournament_status === TOURNAMENT_STATUS_PUBLISHED;

        const filteredSkillLevels = filteredSkillLevelsMap[tournaments.id] || [];

        return (
          <div key={tournaments.id} className={idx > 0 ? 'mt-4' : ''}>
            <Card className="w-full h-auto rounded-[5px] bg-black px-[8px] sm:px-[12px] py-[12px] sm:py-[15px] relative">
              <div className="flex flex-row sm:absolute sm:top-[15px] sm:right-[12px] justify-between sm:justify-end sm:gap-3 items-center mb-3 sm:mb-0">
                {isPublished && (
                  <div className="bg-[rgba(242,120,107,0.2)] flex items-center px-[4px] sm:px-[5px] gap-0.5 rounded-[6px] h-[18px] sm:h-[23px] whitespace-nowrap  sm:order-1">
                    <UserCheck
                      className="w-[10px] h-[10px] sm:w-[16px] sm:h-[16px]"
                      color="#F7796C"
                    />
                    <span className="text-[#F7796C] font-satoshi-bold text-[8px] sm:text-[14px]">
                      {tournaments.current_participants !== undefined
                        ? tournaments.current_participants
                        : 0}
                      /
                      {tournaments.categories
                        ?.flat()
                        .reduce(
                          (total, category) => total + (category.maximum_participants || 0),
                          0
                        ) || 0}
                    </span>
                    <span className="text-[#F7796C] font-satoshi-variable !font-[500] text-[8px] sm:text-[14px]">
                      Players
                      <span className="hidden sm:inline"> Registered</span>
                    </span>
                  </div>
                )}
                <div
                  className={`${isPublished ? 'bg-[rgba(102,255,204,0.2)]' : 'bg-[rgba(254,228,64,0.2)]'
                    } flex items-center justify-center rounded-[6px] px-[4px] sm:px-[5px] whitespace-nowrap h-[18px] sm:h-[23px]  sm:order-2`}
                >
                  <span
                    className={`${isPublished ? 'text-[#4EF162]' : 'text-[#FEE440]'
                      } font-satoshi-variable !font-[500] text-[8px] sm:text-[14px]`}
                  >
                    {isPublished
                      ? `Published${tournaments.created_at
                        ? ` on ${new Date(tournaments.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}`
                        : ''
                      }`
                      : 'Not Published'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-0">
                <div className="flex gap-2 sm:gap-3 flex-1 lg:pr-[200px]">
                  <div className="flex flex-col items-center flex-shrink-0">

                    <Avatar
                      src={tournaments.tournament_profile}
                      name={tournaments.event_name}
                      size={75}
                      rectangular
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="text-white font-satoshi-variable !font-[500] text-[14px] sm:text-[16px] lg:text-[18px] leading-tight">
                        {tournaments.event_name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {(tournaments.sportsName && tournaments.sportsName.trim() !== '') || sport ? (
                        <div className="border border-[#4EF162] rounded-[6px] sm:rounded-[8px] flex items-center justify-center px-[8px] sm:px-[10px] lg:px-[14px] py-[4px] sm:py-[6px] lg:py-[8px]">
                          <span className="text-[#4EF162] font-satoshi-variable text-[9px] sm:text-[10px] lg:text-[12px]">
                            {tournaments.sportsName && tournaments.sportsName.trim() !== ''
                              ? tournaments.sportsName
                              : sport?.name}
                          </span>
                        </div>
                      ) : null}
                      {tournaments.event_type && tournaments.event_type.trim() !== '' && (
                        <div className="border border-[#C5C5C5] rounded-[6px] sm:rounded-[8px] flex items-center justify-center px-[8px] sm:px-[10px] lg:px-[14px] py-[4px] sm:py-[6px] lg:py-[8px]">
                          <span className="text-white font-satoshi-variable text-[9px] sm:text-[10px] lg:text-[12px]">
                            {tournaments.event_type}
                          </span>
                        </div>
                      )}
                      {tournaments.format_name && tournaments.format_name.trim() !== '' && (
                        <div className="border border-[#C5C5C5] rounded-[6px] sm:rounded-[8px] flex items-center justify-center px-[8px] sm:px-[10px] lg:px-[14px] py-[4px] sm:py-[6px] lg:py-[8px]">
                          <span className="text-white font-satoshi-variable text-[9px] sm:text-[10px] lg:text-[12px]">
                            {tournaments.format_name}
                          </span>
                        </div>
                      )}
                      {filteredSkillLevels.length === 3 ? (
                        <div className="border border-[#C5C5C5] rounded-[6px] sm:rounded-[8px] flex items-center justify-center px-[8px] sm:px-[10px] lg:px-[14px] py-[4px] sm:py-[6px] lg:py-[8px]">
                          <span className="text-white font-satoshi-variable text-[9px] sm:text-[10px] lg:text-[12px]">
                            All Skill Levels
                          </span>
                        </div>
                      ) : (
                        filteredSkillLevels.slice(0, 2).map((skill, idx) => (
                          <div
                            key={idx}
                            className="border border-[#C5C5C5] rounded-[6px] sm:rounded-[8px] flex items-center justify-center px-[8px] sm:px-[10px] lg:px-[14px] py-[4px] sm:py-[6px] lg:py-[8px]"
                          >
                            <span className="text-white font-satoshi-variable text-[9px] sm:text-[10px] lg:text-[12px]">
                              {skill}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-stretch sm:justify-end lg:justify-end mt-3 sm:mt-4 lg:mt-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4 w-full sm:w-auto">
                    {isPublished ? (
                      <>
                        <Button
                          type="button"
                          className="border border-[#4EF162] cursor-pointer w-full sm:w-[130px] lg:w-[141px] !h-[28px] sm:!h-[30px] rounded-[4px] flex items-center justify-center"
                          onClick={() => router.push(`/dashboard/manageBrackets/${tournaments.id}`)}
                        >
                          <span className="text-[#4EF162] font-satoshi-bold text-[11px] sm:text-[12px] lg:text-[14px]">
                            Manage Brackets
                          </span>
                        </Button>
                        <Button
                          type="button"
                          className="bg-[#4EF162] w-full sm:w-[120px] lg:w-[135px] hover:bg-[#4EF162]/80 cursor-pointer !h-[28px] sm:!h-[30px] rounded-[4px] flex items-center justify-center"
                          onClick={() => {
                            router.push(`/dashboard/${tournaments.id}`);
                          }}
                        >
                          <span className="text-black font-satoshi-bold text-[11px] sm:text-[12px] lg:text-[14px]">
                            Edit Tournament
                          </span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        className="bg-[#4EF162] w-full sm:w-[180px] lg:w-[200px] hover:bg-[#4EF162]/80 cursor-pointer !h-[28px] sm:!h-[30px] rounded-[4px] flex items-center justify-center"
                        onClick={() => {
                          router.push(`/dashboard/${tournaments.id}`);
                        }}
                      >
                        <span className="text-black font-satoshi-bold text-[11px] sm:text-[12px] lg:text-[14px]">
                          Edit & Publish Tournament
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default TournamentCard;
