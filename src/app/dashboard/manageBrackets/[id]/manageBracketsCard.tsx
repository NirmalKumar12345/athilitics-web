'use client';
import { TournamentRegistrationList } from '@/api/models/TournamentRegistrationList';
import Avatar from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';


export interface ManageBracketsCardProps {
  registrations: TournamentRegistrationList | any[];
  loading: boolean;
}

function ManageBracketsCard({ registrations, loading }: ManageBracketsCardProps) {
  const [search, setSearch] = useState('');

  const flattenedPlayers = registrations
    ? registrations.flatMap((player: any) =>
      player.registeredCategories
        .filter((cat: any) => player.userName.toLowerCase().includes(search.toLowerCase()))
        .map((cat: any) => ({
          userId: player.userId,
          userName: player.userName,
          userProfilePhoto: player.userProfilePhoto,
          tournamentSportsName: player.tournamentSportsName,
          registrationId: cat.registrationId,
          ageLabel: cat.ageBracket.label,
          genderType: cat.category.gender_type,
          registeredAt: cat.registeredAt,
        }))
    )
    : [];

  return (
    <>
      <div className="w-full">
        <Input
          leftIcon={
            <Search color="#CACACA" className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
          }
          className="h-[44px] sm:h-[50px] w-full border border-[#2A3128] placeholder:!text-[#CACACA] placeholder:!font-satoshi-variable placeholder:!font-[500] placeholder:!text-sm sm:placeholder:!text-[14px]"
          placeholder="Search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        {flattenedPlayers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Image src="/images/athliticsLogo.svg" alt="No players" width={80} height={80} />
            <p className="text-white text-[18px] font-satoshi-variable mt-4">No players found.</p>
          </div>
        ) : (
          flattenedPlayers.map((player) => (
            <Card
              key={player.registrationId}
              className="bg-black w-full rounded-md px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border border-[#2A3128] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0 flex-1">
                <Avatar src={player.userProfilePhoto} name={player.userName} size={63} />
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base truncate">
                    {player.userName}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="border border-[#4EF162] text-[#4EF162] text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-md whitespace-nowrap">
                      {player.tournamentSportsName}
                    </span>
                    <span className="border border-[#C5C5C5] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-md whitespace-nowrap">
                      {player.ageLabel}
                    </span>
                    <span className="border border-[#C5C5C5] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-md whitespace-nowrap">
                      {player.genderType}
                    </span>
                  </div>
                </div>
              </div>
              {/* Right: Registration status */}
              <div className="w-full sm:w-auto flex justify-center sm:justify-end flex-shrink-0">
                <span className="bg-[#1A2C1A] text-[#4EF162] text-[10px] sm:text-xs px-3 sm:px-4 py-2 rounded-[6px] font-satoshi-regular whitespace-nowrap">
                  <span className="lg:hidden">Reg {new Date(player.registeredAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</span>
                  <span className="hidden lg:inline">Registered on {new Date(player.registeredAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</span>
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default ManageBracketsCard;
