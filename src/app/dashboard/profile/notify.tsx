'use client';
import { InfoSubText } from '@/components/ui/infoSubText';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useCallback, useMemo, useState } from 'react';

type TierStatus = 'Free Tier' | 'Pro Tier' | 'Pro Plus Tier' | string;

interface NotifyProps {
  isRegistrationMode?: boolean;
}

const Notify = ({ isRegistrationMode = false }: NotifyProps) => {
  const { organizer, isLoading } = useOrganizer(!isRegistrationMode);
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(false);

  const isToggleEnabled = useMemo((): boolean => {
    if (isRegistrationMode) return false;

    if (!organizer?.tier_status) return false;

    const tierStatus = organizer.tier_status as TierStatus;
    return tierStatus === 'Pro' || tierStatus === 'Pro Plus';
  }, [organizer?.tier_status, isRegistrationMode]);

  const handleToggleChange = useCallback(
    (checked: boolean) => {
      if (isToggleEnabled) {
        setIsNotifyEnabled(checked);
        console.log('Notification preference updated:', checked);
      }
    },
    [isToggleEnabled]
  );

  const tooltipContent = useMemo(() => {
    if (isRegistrationMode) {
      return 'WhatsApp notifications will be available after registration completion.';
    }

    const tierStatus = organizer?.tier_status as TierStatus;
    if (tierStatus === 'Free Tier') {
      return 'WhatsApp notifications are available for Pro Tier and above.';
    }
    return 'This feature is not available for your current tier.';
  }, [organizer?.tier_status, isRegistrationMode]);

  const switchComponent = (
    <Switch
      checked={isNotifyEnabled}
      onCheckedChange={handleToggleChange}
      disabled={!isToggleEnabled || isLoading}
      className="data-[state=checked]:bg-[#4EF162] disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Toggle WhatsApp notifications"
      aria-describedby="notify-description"
    />
  );

  return (
    <div className="w-full">
      <div>
        <div className="flex gap-4 items-center">
          <span className="font-satoshi-bold text-[18px] sm:text-[22px] text-white">
            Auto Notify
          </span>
          <InfoSubText
            text=""
            hoverMessage="Auto notify will send automatic notifications to groups where the athlitics whatsapp integration is available."
            className="fill-[#64748B] w-[18px] h-[18px] bg-transparent"
          />
        </div>
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 w-full max-w-[880px]">
            <div>
              <span className="font-satoshi-variable font-[300] text-white" id="notify-description">
                Receive WhatsApp Notifications{' '}
                <span className="font-satoshi-variable font-[300] text-[#F24B8B]">
                  (Pro Feature)
                </span>
              </span>
            </div>

            <span>
              {!isToggleEnabled && !isLoading ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-not-allowed">{switchComponent}</div>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8}>
                    <p className="text-sm leading-relaxed">{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                switchComponent
              )}
            </span>
          </div>
          <div className="flex items-center mt-2 gap-2">
            <InfoSubText
              hoverMessage={
                'If you would like to directly get whatsapp notifications on groups you have added.'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notify;
