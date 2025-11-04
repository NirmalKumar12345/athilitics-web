'use client';
import { TournamentRegistrationList } from '@/api/models/TournamentRegistrationList';
import { Button } from '@/components/ui/button';
import { InfoSubText } from '@/components/ui/infoSubText';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useTournament } from '@/hooks/useTournament';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './manageBrackets.module.css';
import ManageBracketsCard from './manageBracketsCard';
import ToggleNav from './toggleNav';

const ManageBrackets = () => {
  const router = useRouter();
  const pathname = usePathname();

  const pathParts = pathname.split('/').filter(Boolean);
  const parsedId = Number(pathParts[pathParts.length - 1]);
  const tournamentId = isNaN(parsedId) ? undefined : parsedId;

  const { tournaments: tournamentData, getTournamentRegistrations, downloadTournamentExcelFile } = useTournament(true, tournamentId);

  const [registrations, setRegistrations] = useState<TournamentRegistrationList>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      setLoading(true);
      getTournamentRegistrations(Number(tournamentId))
        .then((data) => {
          setRegistrations(Array.isArray(data) ? data : []);
        })
        .finally(() => {
          setTimeout(() => setLoading(false), 2000);
        });
    } else {
      setRegistrations([]);
    }
  }, [tournamentId]);

  const handleBack = () => {
    router.back();
  };

  const [tab, setTab] = useState<'reg_info' | 'bracket'>('reg_info');
  const [regTab, setRegTab] = useState<
    'reg_complete' | 'payment_complete' | 'waitlist' | 'withdraw'
  >('reg_complete');
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Refs for dynamic underline positioning
  const regInfoRef = useRef<HTMLButtonElement>(null);
  const bracketRef = useRef<HTMLButtonElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Page entry animation
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Dynamic underline positioning
  useEffect(() => {
    const updateUnderline = () => {
      const activeRef = tab === 'reg_info' ? regInfoRef : bracketRef;
      if (activeRef.current) {
        const { offsetLeft, offsetWidth } = activeRef.current;
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
      }
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [tab]);
  // services/tournaments.ts




  const handlePopupCancel = () => setShowDownloadPopup(false);
  const handlePopupDownload = () => {
    setShowDownloadPopup(false);
  };

  const pageHeader = (
    <nav
      className={`fixed top-[48px] sm:top-[54px] z-20 w-full bg-[#16171B] border-b border-b-[#444444] ${styles.slideDown}`}
    >
      <div
        className="flex items-center gap-2 px-4 sm:px-8 md:px-16 lg:px-[130px] py-3 sm:py-4 cursor-pointer group transition-all duration-200 ease-out"
        onClick={handleBack}
      >
        <ArrowLeft
          color="white"
          size={18}
          className="sm:w-[20px] sm:h-[20px] md:w-[20px] md:h-[20px] cursor-pointer group-hover:translate-x-[-2px] transition-transform duration-200 ease-out"
        />
        <h1 className="text-sm sm:text-[14px] md:text-[15px] text-white font-satoshi-medium transition-colors duration-200 ease-out truncate">
          <span className="hidden sm:inline">
            {tournamentData?.event_name || 'Local Legends League'} /{' '}
          </span>
          <span className="sm:hidden">Manage Brackets</span>
          <span className="hidden sm:inline">Manage Brackets</span>
        </h1>
      </div>
    </nav>
  );

  return (
    <>
      {pageHeader}
      {loading && <div className="fixed inset-0 z-[100]"><LoadingOverlay /></div>}
      <div
        className={`min-h-screen w-full bg-[#16171B] transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >
        <div className="px-3 sm:px-6 md:px-12 lg:px-24 xl:px-[150px] flex-1 w-full flex flex-col items-start justify-start gap-4 py-4 sm:py-5 md:py-[20px] mt-[84px] sm:mt-[96px] md:mt-[100px]">
          <div className="flex gap-4 sm:gap-6 md:gap-8 mb-2 relative sm:overflow-x-visible overflow-x-auto w-full min-w-0">
            <button
              ref={regInfoRef}
              className={`flex flex-col items-center pb-2 text-[11px] sm:text-[15px] md:text-[16px] cursor-pointer font-medium relative transition-all duration-300 ease-out transform whitespace-nowrap min-w-0 flex-shrink pl-1 ${styles.focusVisible} ${tab === 'reg_info'
                ? 'text-white font-sansation-bold scale-105'
                : `text-[#C5C3C3] font-sansation-regular hover:text-white ${styles.hoverScale102}`
                }`}
              onClick={() => setTab('reg_info')}
            >
              <span className="relative transition-all duration-300 ease-out truncate block max-w-[90vw]">
                Registration Info
              </span>
            </button>
            <button
              ref={bracketRef}
              className={`flex flex-col items-center pb-2 text-[11px] sm:text-[15px] md:text-[16px] cursor-pointer font-medium relative transition-all duration-300 ease-out transform whitespace-nowrap min-w-0 flex-shrink ${styles.focusVisible} ${tab === 'bracket'
                ? 'text-white font-sansation-bold scale-105'
                : `text-[#C5C3C3] font-sansation-regular hover:text-white ${styles.hoverScale102}`
                }`}
              onClick={() => setTab('bracket')}
            >
              <span className="relative transition-all duration-300 ease-out truncate block max-w-[90vw]">
                Bracket
              </span>
            </button>
            {/* Enhanced dynamic sliding underline */}
            <div
              className="absolute bottom-0 h-[3px] bg-gradient-to-r from-[#4EF162] to-[#D9D9D9] rounded-t-[2px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform shadow-lg"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
                boxShadow: '0 0 8px rgba(78, 241, 98, 0.6)',
              }}
            />
          </div>

          {/* Content container with enhanced smooth transitions */}
          <div className="relative w-full overflow-hidden">
            {/* Registration Info Tab Content */}
            <div
              className={`transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${tab === 'reg_info'
                ? `opacity-100 translate-x-0 scale-100 relative ${styles.fadeInUp}`
                : 'opacity-0 translate-x-[-30px] scale-95 absolute top-0 left-0 w-full pointer-events-none'
                }`}
            >
              <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center justify-between w-full max-w-full gap-4 md:gap-2">
                <div
                  className={`order-2 md:order-1 w-full md:w-auto min-w-0 ${styles.slideInLeft}`}
                >
                  <ToggleNav selected={regTab} setSelected={setRegTab} tournament={tournamentData} />
                </div>
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 order-1 md:order-2 w-full md:w-auto min-w-0 ${styles.slideInRight}`}
                >
                  <div className="bg-[rgba(242,120,107,0.2)] flex items-center px-2 sm:px-[11px] gap-1 sm:gap-2 rounded-[6px] h-[36px] sm:h-[40px] transition-all duration-300 hover:bg-[rgba(242,120,107,0.3)] hover:scale-105 hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start lg:min-w-max">
                    <UserCheck
                      className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
                      color="#F7796C"
                    />
                    <span className="text-[#F7796C] font-satoshi-bold text-xs sm:text-[14px]">
                      {tournamentData?.current_participants}/
                      {tournamentData?.categories
                        ?.flat()
                        .reduce(
                          (total, category) => total + (category.maximum_participants || 0),
                          0
                        ) || 0}
                    </span>
                    <span className="text-[#F7796C] font-satoshi-medium text-xs sm:text-[14px] hidden lg:inline">
                      Players Registered
                    </span>
                    <span className="text-[#F7796C] font-satoshi-medium text-xs lg:hidden">
                      Players
                    </span>
                  </div>
                  <Button
                    type="button"
                    className="bg-[#16171B] text-[#4EF162] font-satoshi-bold border border-[#4EF162] text-xs sm:text-[14px] px-3 sm:px-4 py-2 rounded-[4px] flex items-center gap-1 sm:gap-2 cursor-pointer h-[36px] sm:h-[40px] transition-all duration-300 hover:bg-[#4EF162] hover:text-black transform hover:scale-105 hover:shadow-[0_0_20px_rgba(78,241,98,0.4)] w-full sm:w-auto justify-center lg:min-w-max"
                    onClick={() => {
    if (tournamentId !== undefined) {
      downloadTournamentExcelFile(tournamentId);
    }
  }}
                  >
                    <span className="lg:hidden">Download Data</span>
                    <span className="hidden lg:inline">Download Player Data</span>
                    <InfoSubText
                      fillColor="#4EF162"
                      hoverMessage="You can download the players willing to participate in the tournament"
                      text=""
                      className="ml-1 transition-transform duration-300 group-hover:rotate-12"
                    />
                  </Button>
                </div>
              </div>
              <div
                className={`bg-[#121212] border border-[#282A28] rounded-[8px] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] max-w-full w-full py-3 sm:py-4 md:py-[18px] px-3 sm:px-4 md:px-[18px] flex flex-col gap-4 mt-4 transition-all duration-400 ease-out hover:border-[#4EF162]/30 ${styles.fadeInUpDelayed}`}
              >
                <ManageBracketsCard registrations={registrations} loading={loading} />
              </div>
            </div>

            {/* Bracket Tab Content */}
            <div
              className={`transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${tab === 'bracket'
                ? `opacity-100 translate-x-0 scale-100 relative ${styles.fadeInUp}`
                : 'opacity-0 translate-x-[30px] scale-95 absolute top-0 left-0 w-full pointer-events-none'
                }`}
            >
              <div className="w-full flex flex-col items-end max-w-full">
                <div
                  className={`flex flex-col sm:flex-row justify-end gap-2 mb-4 w-full ${styles.slideInRight}`}
                >
                  <Button
                    type="button"
                    className="bg-[#16171B] text-[#4EF162] font-sansation-bold border border-[#4EF162] text-xs sm:text-[14px] px-3 sm:px-4 py-2 rounded-[4px] flex items-center gap-1 sm:gap-2 cursor-pointer h-[36px] sm:h-[40px] transition-all duration-300 hover:bg-[#4EF162] hover:text-black transform hover:scale-105 hover:shadow-[0_0_20px_rgba(78,241,98,0.4)] justify-center"
                    onClick={() => {
    if (tournamentId !== undefined) {
      downloadTournamentExcelFile(tournamentId);
    }
  }}
                  >
                    <span className="sm:hidden">Download Data</span>
                    <span className="hidden sm:inline">Download Player Data</span>
                    <InfoSubText
                      fillColor="#4EF162"
                      hoverMessage="You can download the players willing to participate in the tournament"
                      text=""
                      className="ml-1  transition-transform duration-300 group-hover:rotate-12"
                    />
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#4EF162] hover:bg-[#4EF162]/80 text-black font-satoshi-bold text-xs sm:text-[14px] px-3 sm:px-4 py-2 rounded-[4px] flex items-center gap-1 sm:gap-2 cursor-pointer h-[36px] sm:h-[40px] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(78,241,98,0.6)] justify-center"
                  >
                    <span className="sm:hidden">Upload</span>
                    <span className="hidden sm:inline">Upload Bracket</span>
                    <InfoSubText
                      fillColor="black"
                      hoverMessage={
                        'The first bracket needs to be uploaded to publish the matches and listings.'
                      }
                      text=""
                      className="ml-1 transition-transform duration-300 group-hover:rotate-12"
                    />
                  </Button>
                </div>
                <div
                  className={`bg-[#121212] border border-[#282A28] rounded-[8px] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] w-full py-3 sm:py-4 md:py-[15px] transition-all duration-400 ease-out hover:border-[#4EF162]/30 ${styles.fadeInUpDelayed}`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageBrackets;
