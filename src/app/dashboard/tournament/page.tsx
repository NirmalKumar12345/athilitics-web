'use client';

import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { Routes } from '@/app/constants/routes';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import TournamentForm from './tournamentForm';

function TournamentPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get('edit') === 'true';
  const isCreateMode = !isEdit;
  const tournamentId = searchParams?.get('id'); // get id from query

  const handleBack = () => {
    router.back();
  };

  const handleSaveAndProceed = async (formData: TournamentUpdateList) => {
    if (formData.id) {
      router.push(Routes.TOURNAMENT_DETAILS(formData.id));
    }
  };

  const pageHeader = (
    <div
      className="flex items-center gap-2 px-4 md:px-8 lg:px-[130px] py-4 cursor-pointer group transition-all duration-200 ease-out"
      onClick={handleBack}
    >
      <ArrowLeft
        color="white"
        size={20}
        className="cursor-pointer group-hover:translate-x-[-2px] transition-transform duration-200 ease-out"
      />
      <h1 className="text-[14px] text-white font-satoshi-medium transition-colors duration-200 ease-out">
        {isCreateMode ? 'Create Tournament' : 'Edit Tournament'}
      </h1>
    </div>
  );

  return (
    <div>
      <div className="sticky top-[47px] sm:top-[54px] z-10 bg-[#16171B] border-b border-[#282A28]">
        {pageHeader}
      </div>
      <TournamentForm
        onSaveAndProceed={handleSaveAndProceed}
        isCreateMode={isCreateMode}
        tournamentId={tournamentId}
      />
    </div>
  );
}

export default function TournamentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TournamentPageInner />
    </Suspense>
  );
}
