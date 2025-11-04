'use client';
import { Organizer } from '@/api/models/Organizer';
import Avatar from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSports } from '@/hooks/useSports';
import { FormikProps } from 'formik';
import React from 'react';
import { InfoSubText } from '../ui/infoSubText';
import { Label } from '../ui/label';

interface ProgressPreviewSectionProps {
  formik: FormikProps<Partial<Organizer>>;
  dynamicProgressValue: number;
  uploadedImage: string | null;
  countryCode?: string;
  walletBalance?: number;
  currencySymbol?: string;
  tier?: string;
  accountStatus?: string;
}

const ACCOUNT_STATUS_COLOR = '#FEE440';
const SHIMMER_ANIMATION_DELAY = 200;

const ProgressPreviewSection: React.FC<ProgressPreviewSectionProps> = ({
  formik,
  dynamicProgressValue,
  uploadedImage,
  countryCode = '+91',
  walletBalance = 0,
  currencySymbol = '₹',
  tier = 'Free Tier',
  accountStatus = 'Verification Pending',
}) => {
  const { sportsOptions } = useSports();

  const getSportNames = (ids: number[] = []) =>
    sportsOptions.filter((opt) => ids.includes(opt.id)).map((opt) => opt.label);

  const ShimmerBox = ({
    width,
    height,
    className = '',
    delay = 0,
  }: {
    width: string;
    height: string;
    className?: string;
    delay?: number;
  }) => (
    <div
      className={`bg-gradient-to-r from-[#FFFFFF29] via-[#FFFFFF40] to-[#FFFFFF29] animate-pulse rounded ${className}`}
      style={{
        width,
        height,
        animationDelay: `${delay}ms`,
        animationDuration: '1.5s',
      }}
    />
  );

  const renderSport = (ids: number[] = [], label: string) => {
    const names = getSportNames(ids);
    return (
      <div className="flex flex-col flex-1">
        <span className="text-xs text-[#C5C3C3] mb-1">{label}</span>
        <div className="flex gap-2 items-center h-8">
          {names.length === 0 ? (
            <ShimmerBox width="90px" height="28px" delay={SHIMMER_ANIMATION_DELAY * 3} />
          ) : (
            <>
              <span className="text-white text-xs font-medium flex items-center justify-center rounded px-3 h-7 bg-[#232323] whitespace-nowrap">
                {names[0]}
              </span>
              {names.length > 1 && (
                <span className="text-white text-xs font-medium flex items-center justify-center rounded px-3 h-7 bg-[#232323] whitespace-nowrap">
                  +{names.length - 1}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full px-4 md:px-6 py-3 md:py-4 bg-[#16171B] overflow-hidden">
      <div className="mb-2 flex justify-between items-center">
        <span className="font-bold text-sm text-white">Details Completed</span>
        <span className="text-[#4EF162] font-bold text-sm">{dynamicProgressValue}%</span>
      </div>
      <Progress value={dynamicProgressValue} />
      <div className="mt-3 relative">
        {formik.values.organization_role && (
          <div className="absolute right-3 top-3 z-10">
            <span className="text-[#4EF162] border border-[#4EF162] px-2 py-0.5 rounded bg-[#FFFFFF1F] text-xs font-normal">
              {formik.values.organization_role}
            </span>
          </div>
        )}
        <Card className="bg-black rounded-xl border border-[#1D24340F] w-full shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              {!uploadedImage && !formik.values.organization_name ? (
                <ShimmerBox
                  width="60px"
                  height="60px"
                  className="rounded-full"
                  delay={0}
                />
              ) : (
                <div className="w-[60px] h-[60px]">
                  <Avatar src={uploadedImage} name={formik.values.organization_name} size={60} />
                </div>
              )}

              {!formik.values.organization_name ? (
                <ShimmerBox
                  width="150px"
                  height="16px"
                  className="mt-2"
                  delay={SHIMMER_ANIMATION_DELAY}
                />
              ) : (
                <span className="mt-2 font-bold text-base text-[#4EF162]">
                  {formik.values.organization_name}
                </span>
              )}

              {!formik.values.organizer_name ? (
                <ShimmerBox
                  width="120px"
                  height="12px"
                  className="mt-1"
                  delay={SHIMMER_ANIMATION_DELAY * 2}
                />
              ) : (
                <span className="mt-1 font-medium text-xs text-[#C5C3C3]">
                  {formik.values.organizer_name}
                </span>
              )}

              {!formik.values.mobile_number && !formik.values.organization_email ? (
                <ShimmerBox
                  width="180px"
                  height="12px"
                  className="mt-1"
                  delay={SHIMMER_ANIMATION_DELAY * 3}
                />
              ) : (
                <span className="mt-1 text-xs text-white">
                  {countryCode} {formik.values.mobile_number}
                  {formik.values.organization_email ? ` | ${formik.values.organization_email}` : ''}
                </span>
              )}
            </div>
            <div className="my-3 border bg-[#FFFFFF29]" />
            <div className="flex gap-6">
              {renderSport(formik.values.primary_sports, 'Primary Sport')}
              {renderSport(formik.values.other_sports, 'Other Sport')}
            </div>
            <div className="my-3 border bg-[#FFFFFF29]" />
            <div className="mt-4 flex items-center">
              <div className="w-full">
                <Label className="text-white text-xs">Address</Label>
                {!formik.values.venue ? (
                  <ShimmerBox
                    width="200px"
                    height="40px"
                    className="mt-1"
                    delay={SHIMMER_ANIMATION_DELAY * 4}
                  />
                ) : (
                  <div className="bg-[#FFFFFF1F] w-full max-w-sm h-[40px] rounded flex items-center px-2 text-white text-xs">
                    {formik.values.venue}
                  </div>
                )}
              </div>
            </div>
            <div className="my-4 border bg-[#FFFFFF29]" />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-white text-xs">Tier</Label>
                <div className="bg-[#FB7185] w-full max-w-[90px] h-[25px] flex justify-center items-center text-white rounded text-xs">
                  {tier}
                </div>
              </div>
              <div className="flex-1">
                <Label className="text-white text-xs">Wallet</Label>
                <div className="bg-[#3DFEB1] w-full max-w-[90px] h-[25px] flex justify-center items-center text-white rounded text-xs">
                  {currencySymbol}
                  {walletBalance}
                </div>
              </div>
            </div>
            <div
              className="mt-3 w-full max-w-[400px] h-[25px] flex justify-center items-center rounded mb-2"
              style={{ backgroundColor: ACCOUNT_STATUS_COLOR }}
            >
              <span className="text-xs text-black">
                Account Status: <span className="font-bold">{accountStatus}</span>
              </span>
              <InfoSubText
                text=""
                infoSize={12}
                fillColor="black"
                hoverMessage={
                  'You need to verify your physical location with Athlitics representative which will validate your place of business and amenities list.'
                }
                className="ml-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPreviewSection;
