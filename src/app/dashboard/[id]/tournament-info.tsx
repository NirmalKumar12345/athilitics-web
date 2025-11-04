'use client';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadButton } from '@/components/ui/fileUploadButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOrganizer } from '@/hooks/useOrganizer';
import { countBlocks, getPreviewHtml } from '@/utils/tournamentDescriptionUtils';
import DOMPurify from 'dompurify';
import { Pencil, Upload, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import TournamentInfoSkeleton from './TournamentInfoSkeleton';

type Props = {
  title: string;
  category: string;
  tags: string[];
  organizer: string;
  getTagClass?: (tag: string) => string;
  description: string;
  onEdit?: () => void;
  tournament_profile?: string | File | null;
  updatedProfileImage?: File | null;
  onProfileImageUpload?: (file: File | null) => void;
  onProfileImageRemove?: () => void;
};

export default function TournamentInfoCard({
  title,
  category,
  tags,
  organizer,
  description,
  getTagClass,
  tournament_profile,
  updatedProfileImage,
  onProfileImageUpload,
  onProfileImageRemove,
}: Props) {
  if (
    !title ||
    !category ||
    !tags ||
    !organizer ||
    description === null ||
    description === undefined
  ) {
    return <TournamentInfoSkeleton />;
  }

  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const router = useRouter();
  const params = useParams();
  const { organizer: organizerData } = useOrganizer();

  const handleEdit = () => {
    setLoading(true);
    try {
      router.push(`/dashboard/tournament?edit=true&id=${params.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = (file: File | null) => {
    setUploadError('');
    if (onProfileImageUpload) {
      onProfileImageUpload(file);
    }
  };

  const handleProfileImageRemove = () => {
    setUploadError('');
    if (onProfileImageRemove) {
      onProfileImageRemove();
    }
  };

  const handleValidationError = (error: string) => {
    setUploadError(error);
  };

  const isFreeTier = useMemo(() => {
    return organizerData?.tier_status === 'Free Tier';
  }, [organizerData?.tier_status]);

  const maxLines = 5;

  const previewHtml = useMemo(
    () => getPreviewHtml(description || '', maxLines),
    [description, maxLines]
  );
  const sanitizedDescription = useMemo(() => DOMPurify.sanitize(description || ''), [description]);

  const totalBlocks = useMemo(() => countBlocks(description || ''), [description]);

  const avatarSource = useMemo(() => {
    if (updatedProfileImage) {
      return updatedProfileImage;
    }
    if (tournament_profile instanceof File) {
      return tournament_profile;
    }
    if (tournament_profile === '' || tournament_profile === null) {
      return null;
    }
    return tournament_profile;
  }, [updatedProfileImage, tournament_profile]);

  return (
    <div className="w-full max-w-[796px] rounded-[8px] px-[16px] sm:px-[20px] py-[20px] sm:py-[25px] bg-[#282A28]">
      <Card className="rounded-[8px] bg-black h-full min-h-[300px] sm:min-h-[389px]">
        <CardHeader className="pb-0 flex flex-col items-start">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <Avatar src={avatarSource} name={title} size={138} rectangular />
              {onProfileImageUpload && (
                <div className="flex flex-col gap-2 items-center min-h-[60px]">
                  <div className="flex gap-2">
                    {avatarSource && (
                      <Button
                        type="button"
                        onClick={handleProfileImageRemove}
                        aria-label="Remove tournament profile image"
                        className="py-1 bg-red-600  h-auto text-white text-xs rounded hover:bg-red-700 cursor-pointer"
                        disabled={isFreeTier}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={isFreeTier ? 'cursor-not-allowed' : ''}>
                          <FileUploadButton
                            onFileChange={isFreeTier ? () => { } : handleProfileImageUpload}
                            onValidationError={handleValidationError}
                            aria-label="Upload tournament profile image"
                            className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${isFreeTier
                                ? 'bg-[#5de86e] text-gray-black cursor-not-allowed opacity-50'
                                : 'bg-[#4EF162] text-black hover:bg-[#3DBF50] cursor-pointer'
                              }`}
                            disabled={isFreeTier}
                          >
                            <Upload className="size-3" />
                            Upload
                          </FileUploadButton>
                        </div>
                      </TooltipTrigger>
                      {isFreeTier && (
                        <TooltipContent>
                          <p>
                            Upload feature is only available for premium users. Upgrade your plan to
                            access this feature.
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                  {uploadError && (
                    <span className="text-red-500 text-xs font-satoshi-variable text-center">
                      {uploadError}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-start pt-0 sm:pt-4 text-center sm:text-left flex-1">
              <CardTitle className="text-[20px] sm:text-[24px] font-satoshi-bold text-white">
                {title}
              </CardTitle>
              <div className="flex flex-wrap gap-[8px] sm:gap-[10px] mt-3 sm:mt-4 justify-center sm:justify-start">
                <Button
                  type="button"
                  className="px-[12px] sm:px-[14px] py-[10px] sm:py-[12.5px] border border-green-500 text-green-500 bg-transparent font-satoshi-regular text-[12px] sm:text-[14px] rounded-[8px] cursor-default hover:bg-transparent"
                >
                  {category}
                </Button>
                {tags.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    className={`px-[12px] sm:px-[14px] py-[10px] sm:py-[12.5px] border bg-transparent font-satoshi-regular rounded-[8px] cursor-default hover:bg-transparent text-[12px] sm:text-[14px] ${getTagClass ? getTagClass(t) : ''
                      }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-[10px] pt-4 sm:pt-0">
          <div>
            <p className="text-sm mb-1 text-white font-satoshi-regular text-[14px]">Organizer</p>
            <Button
              type="button"
              className="px-[12px] sm:px-[14px] py-[10px] sm:py-[12.5px] bg-[#1D1D1D] text-white font-satoshi-regular text-[12px] sm:text-[14px] rounded-[4px] cursor-default hover:bg-[#1D1D1D] w-full sm:w-auto"
            >
              {organizer}
            </Button>
          </div>

          <div>
            <p className="text-sm mb-1 font-satoshi-regular text-white">Event Description</p>
            <div className="tournament-description-content prose prose-invert max-w-none text-white text-[12px] sm:text-[13px] font-satoshi-variable">
              {!showAll && totalBlocks > maxLines ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: previewHtml,
                    }}
                  />
                  <button
                    type="button"
                    className="ml-1 bg-none border-none p-0 cursor-pointer"
                    onClick={() => setShowAll(true)}
                  >
                    <span className="text-[#4EF162] font-satoshi-regular text-[12px] sm:text-[13px] leading-[24px] capitalize underline underline-offset-2">
                      Show More
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                  {totalBlocks > maxLines && (
                    <button
                      type="button"
                      className="ml-1 bg-none border-none p-0 cursor-pointer"
                      onClick={() => setShowAll(false)}
                    >
                      <span className="text-[#4EF162] font-satoshi-regular text-[12px] sm:text-[13px] leading-[24px] capitalize underline underline-offset-2">
                        Show Less
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-4">
            <Button
              onClick={handleEdit}
              type="button"
              className="px-[12px] sm:px-[14px] py-[10px] sm:py-[12.5px] bg-[#4EF162] items-center font-satoshi-variable font-[700px] text-[12px] sm:text-[14px] text-black rounded-[4px] cursor-pointer hover:bg-[#3DBF50] w-full sm:w-auto"
            >
              <Pencil className="size-4" />
              Edit Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
