'use client';

import { Organizer } from '@/api/models/Organizer';
import { TOURNAMENT_STATUS_PUBLISHED } from '@/app/constants/tournamentStatus';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TournamentHeaderProps = {
  title?: string;
  showVerificationText?: boolean;
  verificationText?: string;
  showPreviewButton?: boolean;
  previewText?: string;
  showPublishButton?: boolean;
  publishText?: string;
  publishDisabled?: boolean;
  onPublish?: () => void;
  organizer?: Organizer | null;
  tournamentStatus?: string | null;
  createdAt?: string;
};

export default function TournamentHeader({
  title = 'Local Legends League',
  showVerificationText = true,
  verificationText = 'Get Verified to Publish Tournament',
  showPreviewButton = true,
  showPublishButton = true,
  publishText = 'Publish Tournament',
  publishDisabled = false,
  onPublish,
  organizer,
  tournamentStatus,
  createdAt,
}: TournamentHeaderProps) {
  const router = useRouter();
  const isPublished = tournamentStatus === TOURNAMENT_STATUS_PUBLISHED;

  const getTooltipMessage = () => {
    return 'You must be a verified organizer to publish a tournament.';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:gap-4 h-full">
      <div
        className="flex items-center cursor-pointer group transition-all duration-200 ease-out"
        onClick={() => router.back()}
      >
        <ArrowLeft
          color="white"
          size={16}
          className="cursor-pointer group-hover:translate-x-[-2px] transition-transform duration-200 ease-out sm:w-5 sm:h-5"
        />
        <h1 className="text-[12px] sm:text-[14px] text-white font-satoshi-medium transition-colors duration-200 ease-out truncate max-w-[180px] sm:max-w-none ml-1 sm:ml-0">
          {title}
        </h1>
      </div>

      <div className="flex flex-row items-center justify-between w-full sm:w-auto pb-2 sm:pb-0 sm:px-0 gap-2 sm:gap-4 lg:w-auto">
        {showVerificationText && organizer?.verification_status !== 'APPROVED' && (
          <h1 className="flex-1 text-left text-[9px] sm:text-[14px] text-[#FFD600] font-medium font-satoshi-variable sm:flex-none">
            {verificationText}
          </h1>
        )}

        {showPublishButton &&
          (isPublished ? (
            <div className="bg-[rgba(102,255,204,0.2)] flex items-center justify-center rounded-[6px] px-[4px] sm:px-[5px]  w-auto h-[17px] sm:h-[35px]">
              <span className="text-[#4EF162] font-satoshi-variable !font-[500] text-[8px] sm:text-[14px]">
                Published{createdAt
                  ? ` on ${new Date(createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`
                  : ''
                }
              </span>
            </div>
          ) : publishDisabled ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-not-allowed w-auto">
                  <Button
                    type="button"
                    className={`px-[12px] sm:px-[14px] py-[8px] sm:py-[12px] flex justify-center w-[120px] sm:w-[158px] h-[17px] sm:h-[40px] items-center font-satoshi-bold text-[11px] sm:text-[14px] rounded-[4px] ${publishDisabled
                        ? 'bg-[#4EF16266] text-black rounded-[4px]'
                        : 'bg-[#4EF162] text-black hover:bg-[#3DBF50] cursor-pointer rounded-[4px]'
                      }`}
                    disabled={publishDisabled}
                    onClick={() => onPublish?.()}
                    aria-label="Publish Tournament"
                  >
                    {publishText}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                {getTooltipMessage()}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              type="button"
              className={`px-[12px] sm:px-[14px] py-[8px] sm:py-[12px] flex justify-center w-[120px] sm:w-[158px] h-[17px] sm:h-[40px] items-center font-satoshi-bold text-[11px] sm:text-[14px] rounded-[4px] cursor-pointer ${publishDisabled
                  ? 'bg-[#4EF16266] text-black cursor-not-allowed rounded-[4px]'
                  : 'bg-[#4EF162] text-black hover:bg-[#3DBF50] cursor-pointer rounded-[4px]'
                }`}
              disabled={publishDisabled}
              onClick={() => onPublish?.()}
            >
              {publishText}
            </Button>
          ))}
      </div>
    </div>
  );
}
