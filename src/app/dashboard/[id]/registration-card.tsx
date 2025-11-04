'use client';

import { refundPolicy } from '@/app/constants/refund&policy';
import { DatePicker } from '@/components/datePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomDialog } from '@/components/ui/custom_dialog';
import { EventAlertText } from '@/components/ui/event-alert-text';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import * as React from 'react';

type Props = {
  endDate?: string;
  date: string;
  onChangeDate: (v: string) => void;
  setEndDate: (date: string) => void;
  errors?: { [key: string]: string };
  clearFieldError?: (field: string) => void;
  tournamentDate?: string;
};

export default function RegistrationCard({
  date,
  onChangeDate,
  setEndDate,
  endDate,
  errors = {},
  clearFieldError,
  tournamentDate = '',
}: Props) {
  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleDateChange = (selectedDate: string | undefined) => {
    onChangeDate(selectedDate || getTodayFormatted());
  };

  const displayDate = date;

  const [refundDialogOpen, setRefundDialogOpen] = React.useState(false);

  const refundDialogContent = (
    <div className="flex flex-col gap-6 py-4 h-full px-2 sm:px-4 max-h-[75vh] sm:max-h-full overflow-y-auto">
      <div className="flex flex-col items-center gap-4">
        <Image src="/images/athliticsLogo.svg" alt="Athletics Logo" width={80} height={80} />
        <div className="text-center">
          <h2 className="text-white font-[700] text-[18px] sm:text-[22px] mb-2">
            {refundPolicy.title}
          </h2>
          <p className="text-white text-xs sm:text-sm">{refundPolicy.subtitle}</p>
          <p className="text-white text-[10px] sm:text-xs mt-1">{refundPolicy.effectiveFrom}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-1 sm:px-4">
        <div className="space-y-2 sm:space-y-3">
          {refundPolicy.content.map((item, idx) => (
            <p key={idx} className="text-white text-xs sm:text-sm leading-relaxed">
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 sm:mt-6">
        <Button
          className="px-6 sm:px-8 py-2 bg-[#4EF162] text-black font-medium rounded-[4px] hover:bg-[#3DBF50] cursor-pointer text-sm sm:text-base"
          onClick={() => setRefundDialogOpen(false)}
          type="button"
        >
          Agree
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-[796px] w-full h-auto rounded-[8px] bg-[#121212]">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-white font-satoshi-bold !text-[20px]">
          Registration Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-[10px] pt-0 w-full mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center w-full gap-[12px] md:gap-[15px]">
          <div className="grid gap-2 w-full lg:w-auto">
            <Label className="font-satoshi-variable !font-[400] text-[14px] text-white">
              Registration Start Date
            </Label>
            <DatePicker
              onChange={(v) => {
                handleDateChange(v);
                if (v && clearFieldError) clearFieldError('registration_start_date');
              }}
              id="registration_start_date"
              className="w-full lg:w-[365.5px]"
              value={displayDate}
              maxDate={tournamentDate || undefined}
            />
            <EventAlertText />
            <div className="min-h-[20px]">
              {errors.registration_start_date && (
                <span className="text-red-500 text-xs mt-1">{errors.registration_start_date}</span>
              )}
            </div>
          </div>
          <div className="grid gap-2 w-full lg:w-auto">
            <Label className="font-satoshi-variable !font-[400] text-[14px] text-white">
              Registration Closes
            </Label>
            <DatePicker
              onChange={(date) => {
                setEndDate(date || '');
                if (date && clearFieldError) clearFieldError('registration_end_date');
              }}
              id="registration_end_date"
              className="w-full lg:w-[365.5px]"
              value={endDate}
              minDate={date}
              maxDate={tournamentDate || undefined}
            />
            <EventAlertText />
            <div className="min-h-[20px]">
              {errors.registration_end_date && (
                <span className="text-red-500 text-xs mt-1">{errors.registration_end_date}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full gap-[15px]">
          <div className="grid gap-2">
            <div>
              <span
                className="text-[#4EF162] text-[14px] font-satoshi-variable font-[400] cursor-pointer"
                onClick={() => setRefundDialogOpen(true)}
                tabIndex={0}
                role="button"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setRefundDialogOpen(true);
                }}
              >
                Refund Policy
              </span>
              <CustomDialog
                triggerLabel=""
                title={refundPolicy.title}
                description=""
                showFooter={false}
                open={refundDialogOpen}
                onOpenChange={setRefundDialogOpen}
              >
                {refundDialogContent}
              </CustomDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
