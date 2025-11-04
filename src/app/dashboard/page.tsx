'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Checkbox } from '@/components/ui/checkBox';
import { CustomDialog } from '@/components/ui/custom_dialog';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import Toggle from '@/components/ui/toggle';
import TournamentCard from './tournamentCard';

import { Tournament } from '@/api/models/TournamentList';
import { Button } from '@/components/ui/button';
import { InfoSubText } from '@/components/ui/infoSubText';
import { safeDate, todayMidnight } from '@/components/utils';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useTournament } from '@/hooks/useTournament';
import { Routes } from '../constants/routes';
import { termsAndConditions } from '../constants/terms&condition';

const Dashboard = () => {
  const router = useRouter();
  const { organizer, updateLocalData } = useOrganizer();
  const { acceptTournamentTerms, fetchTournamentsByOrganizerId } = useTournament();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tournament, setTournaments] = useState<Tournament[]>([]);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (organizer?.id) {
      setLoading(true);
      fetchTournamentsByOrganizerId(String(organizer.id))
        .then((tournaments) => setTournaments(tournaments))
        .catch(() => setTournaments([]))
        .finally(() => {
          setTimeout(() => setLoading(false), 2000);
        });
    } else {
      setTournaments([]);
    }
  }, [organizer?.id]);

  const handleCreateTournamentButton = () => {
    if (organizer?.terms_and_condition_accepted) {
      setLoading(true);
      setTimeout(() => {
        router.push(Routes.TOURNAMENTS);
      }, 1200);
    } else {
      setDialogOpen(true);
    }
  };

  const handleDialogSubmit = async () => {
    if (!acceptTerms || !organizer?.id) return;
    setLoading(true);
    try {
      await acceptTournamentTerms({
        organizerId: organizer.id,
        tournamentTermsAccepted: true,
      });
      updateLocalData({ terms_and_condition_accepted: true });
      setDialogOpen(false);
      setLoading(false);
      setLoading(true);
      setTimeout(() => {
        router.push(Routes.TOURNAMENTS);
      }, 2000);
    } catch (error) {
      setLoading(false);
    }
  };

  const filteredTournaments = useMemo(() => {
    const todayTS = todayMidnight();
    return tournament.filter((t) => {
      const ts = safeDate(t.tournament_date);
      if (ts === null) return false;
      if (selectedTab === 'upcoming') {
        return ts >= todayTS;
      }
      return ts < todayTS;
    });
  }, [tournament, selectedTab]);

  const dialogContent = (
    <div className="flex flex-col gap-6 py-4 h-full">
      <div className="flex flex-col items-center gap-4">
        <Image src="/images/athliticsLogo.svg" alt="Athletics Logo" width={80} height={80} />
        <div className="text-center">
          <h2 className="text-white font-[700] text-[22px] mb-2">{termsAndConditions.title}</h2>
          <p className="text-white text-sm">{termsAndConditions.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-3">
          {termsAndConditions.content.map((term, idx) => (
            <p key={idx} className="text-white text-sm leading-relaxed">
              {term}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-4 px-4">
        <Checkbox
          id="terms"
          className='cursor-pointer'
          checked={acceptTerms}
          onCheckedChange={(checked: any) => setAcceptTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed"
        >
          I accept the terms and conditions
        </label>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col min-h-screen w-screen px-4 sm:px-8 lg:px-[130px] pt-16 sm:pt-20 pb-18"
      style={{ backgroundColor: '#16171B' }}
    >
      {loading && <LoadingOverlay />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <Toggle tournaments={tournament} selected={selectedTab} setSelected={setSelectedTab} />

        <Button
          type="button"
          className="px-[14px] py-[12.5px] bg-[#4EF162] items-center font-satoshi-bold text-[14px] text-black rounded-[4px] cursor-pointer w-full sm:!w-[171px] hover:bg-[#3DBF50]"
          onClick={handleCreateTournamentButton}
        >
          + Create Tournament
        </Button>

        {!organizer?.terms_and_condition_accepted && (
          <CustomDialog
            triggerLabel=""
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title={termsAndConditions.title}
            description=""
            onConfirm={handleDialogSubmit}
            confirmLabel={loading ? 'Submitting...' : 'Submit'}
            cancelLabel="Cancel"
            showFooter={true}
            confirmDisabled={!acceptTerms || loading}
          >
            {dialogContent}
          </CustomDialog>
        )}
      </div>

      {filteredTournaments.length === 0 ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center bg-[#121212] border-[0.5px] border-[#282A28] mt-4 gap-4 px-4 sm:px-[18px] py-8 sm:py-4">
          <Image src="/images/athliticsLogo.svg" alt="Tournament image" width={123} height={123} />
          <p className="text-white text-base sm:text-[18px] font-satoshi-variable font-[500px] text-center">
            Its game time, Let's begin by creating a tournament.
          </p>
          <div 
            className={`w-auto h-auto sm:h-[30px] rounded-[8px] text-[12px] sm:text-[14px] items-center flex justify-between px-[10px] py-[7px] font-medium text-black
              ${organizer?.verification_status === 'PENDING' 
                ? 'bg-[#FEE440]' 
                : organizer?.verification_status === 'APPROVED' 
                  ? 'bg-[#4EF162]' 
                  : organizer?.verification_status === 'REJECTED' 
                    ? 'bg-red-500' 
                    : 'bg-[#FEE440]'
              }
            `}
          >
            <span className="whitespace-nowrap flex items-center justify-center gap-1 text-center">
              Account Status:{' '}
              <span className="font-satoshi-bold text-[12px] sm:text-[14px]">
                Verification{' '}
                {organizer?.verification_status
                  ?.toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase()) || 'Unknown'}
              </span>
              <InfoSubText
                text=""
                infoSize={16}
                fillColor="#FEE440"
                hoverMessage="You need to verify your physical location with Athlitics representative which will validate your place of business and amenities list."
              />
            </span>
          </div>
          <Button
            type="button"
            className="px-[14px] py-[12.5px] bg-[#4EF162] items-center font-satoshi-bold text-[14px] text-black rounded-[4px] cursor-pointer w-full sm:w-auto hover:bg-[#3DBF50]"
            onClick={handleCreateTournamentButton}
          >
            + Create Tournament
          </Button>
          {!organizer?.terms_and_condition_accepted && (
            <CustomDialog
              triggerLabel=""
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              title={termsAndConditions.title}
              description=""
              onConfirm={handleDialogSubmit}
              confirmLabel={loading ? 'Submitting...' : 'Submit'}
              cancelLabel="Cancel"
              showFooter={true}
              confirmDisabled={!acceptTerms || loading}
            >
              {dialogContent}
            </CustomDialog>
          )}
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col items-center justify-start bg-[#121212] rounded-[8px] border-[0.5px] border-[#282A28] mt-4 gap-4 p-4 sm:p-[18px]">
          <TournamentCard tournaments={filteredTournaments} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
