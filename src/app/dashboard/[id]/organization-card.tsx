'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/RadioBoxGroup';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOrganizer } from '@/hooks/useOrganizer';

type Props = {
  autoMessages: boolean;
  onToggleAutoMessages: (value: boolean) => void;
  allowWallet: boolean;
  onToggleAllowWallet: (value: boolean) => void;
  allowPlayerScoreSubmission: boolean;
  onToggleAllowPlayerScoreSubmission: (value: boolean) => void;
  visibility: string;
  onChangeVisibility: (value: string) => void;
  errors?: { [key: string]: string }; // add
  clearFieldError?: (field: string) => void; // add
};

export default function OrganizationCard({
  autoMessages,
  onToggleAutoMessages,
  allowWallet,
  onToggleAllowWallet,
  allowPlayerScoreSubmission,
  onToggleAllowPlayerScoreSubmission,
  visibility,
  onChangeVisibility,
  errors = {},
  clearFieldError,
}: Props) {
  const { organizer } = useOrganizer();

  const tierStatus = organizer?.tier_status || 'Free Tier';
  const isProTier = tierStatus === 'Pro Tier';
  const isProPlusTier = tierStatus === 'Pro Plus Tier';

  const canAccessAutoMessages = isProTier || isProPlusTier;
  const canAccessWalletPayment = isProPlusTier;
  const canAccessPlayerScoreSubmission = isProPlusTier;

  const handleAutoMessagesToggle = (checked: boolean) => {
    if (checked && !canAccessAutoMessages) {
      return;
    }
    onToggleAutoMessages(checked);
  };

  const handleWalletToggle = (checked: boolean) => {
    if (checked && !canAccessWalletPayment) {
      return;
    }
    onToggleAllowWallet(checked);
  };

  const handlePlayerScoreToggle = (checked: boolean) => {
    if (checked && !canAccessPlayerScoreSubmission) {
      return;
    }
    onToggleAllowPlayerScoreSubmission(checked);
  };
  return (
    <Card className="max-w-[796px] w-full !rounded-[8px] px-[20px] sm:px-[30px] py-[20px] sm:py-[25px] border-[0.5px] border-[#282A28] bg-[#121212]">
      <CardHeader className="p-0">
        <CardTitle className="text-white font-satoshi-bold !text-[18px] sm:!text-[20px]">
          Organizer Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-0 w-full mx-auto">
        <div className="flex w-full">
          <div className="space-y-4 sm:space-y-2 flex-1">
            <Tooltip>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <span className="text-white text-[14px] font-satoshi-variable font-[400]">
                  Auto messages
                </span>
                <TooltipTrigger asChild>
                  <Switch
                    checked={autoMessages}
                    onCheckedChange={handleAutoMessagesToggle}
                    className={
                      !canAccessAutoMessages
                        ? autoMessages
                          ? 'bg-[#4EF16266] cursor-not-allowed'
                          : 'bg-[#828282] cursor-not-allowed'
                        : 'data-[state=checked]:bg-[#4EF162] cursor-pointer'
                    }
                    disabled={!canAccessAutoMessages}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!canAccessAutoMessages
                      ? 'Auto messages are available for Pro Tier'
                      : 'Automatically send messages to tournament participants'}
                  </p>
                </TooltipContent>
              </div>
            </Tooltip>
            <div className="mt-2">
              <span className="text-[#7F7F7F] text-[13px] font-satoshi-variable font-[400]">
                Pro only
              </span>
            </div>
            <Tooltip>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <span className="text-white text-[14px] font-satoshi-variable font-[400]">
                  {tierStatus === 'Free Tier'
                    ? "Don't Allow In-App Wallet Payment"
                    : 'Allow In-App Wallet Payment'}
                </span>
                <TooltipTrigger asChild>
                  <Switch
                    checked={allowWallet}
                    onCheckedChange={handleWalletToggle}
                    className={
                      !canAccessWalletPayment
                        ? allowWallet
                          ? 'bg-[#4EF16266] cursor-not-allowed'
                          : 'bg-[#828282] cursor-not-allowed'
                        : 'data-[state=checked]:bg-[#4EF162] cursor-pointer'
                    }
                    disabled={!canAccessWalletPayment}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!canAccessWalletPayment
                      ? 'In-App Wallet Payment is available for Pro Plus Tier only'
                      : 'Enable participants to pay tournament fees via in-app wallet'}
                  </p>
                </TooltipContent>
              </div>
            </Tooltip>
            <div className="mt-2">
              <span className="text-[#7F7F7F] text-[13px] font-satoshi-variable font-[400]">
                Pro Plus tier only
              </span>
            </div>
            <Tooltip>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 gap-2 sm:gap-0">
                <span className="text-white text-[14px] font-satoshi-variable font-[400]">
                  Allow Player Score Submission?
                </span>
                <TooltipTrigger asChild>
                  <Switch
                    checked={allowPlayerScoreSubmission}
                    onCheckedChange={handlePlayerScoreToggle}
                    className={
                      !canAccessPlayerScoreSubmission
                        ? allowPlayerScoreSubmission
                          ? 'bg-[#4EF16266] cursor-not-allowed'
                          : 'bg-[#828282] cursor-not-allowed'
                        : 'data-[state=checked]:bg-[#4EF162] cursor-pointer'
                    }
                    disabled={!canAccessPlayerScoreSubmission}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!canAccessPlayerScoreSubmission
                      ? 'Player Score Submission is available for Pro Plus Tier only'
                      : 'Allow players to submit their own scores during tournaments'}
                  </p>
                </TooltipContent>
              </div>
            </Tooltip>
            <div className="mt-2">
              <span className="text-[#7F7F7F] text-[13px] font-satoshi-variable font-[400]">
                Pro Plus tier only
              </span>
            </div>
          </div>
        </div>
        <div className="mt-[25px] sm:mt-[30px]">
          <Label className="text-white text-[14px] font-satoshi-variable">Visibility</Label>
          <RadioGroup
            defaultValue="public"
            className="mt-2 flex flex-col sm:flex-row w-full items-start sm:items-center gap-2 sm:gap-4"
            value={visibility}
            onValueChange={(v) => {
              onChangeVisibility(v);
              if (v && clearFieldError) clearFieldError('visibility');
            }}
            id="visibility"
          >
            <RadioGroupItem
              value="public"
              className="border border-[#282A28] w-full sm:w-[365px] h-[56px] rounded-[8px] bg-black text-white font-tt-norms-pro-medium text-[14px] sm:text-[16px]"
            >
              <span className="font-medium text-base leading-none tracking-normal">Public</span>
            </RadioGroupItem>
            <RadioGroupItem
              value="private"
              className="border border-[#282A28] w-full sm:w-[365px] h-[56px] rounded-[8px] bg-black text-white font-tt-norms-pro-medium text-[14px] sm:text-[16px] opacity-50 cursor-not-allowed"
              disabled
            >
              <span className="font-medium text-base leading-none tracking-normal">
                Private (Club Only)
              </span>
            </RadioGroupItem>
          </RadioGroup>
          {errors.visibility && (
            <span className="text-red-500 text-xs mt-1">{errors.visibility}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
