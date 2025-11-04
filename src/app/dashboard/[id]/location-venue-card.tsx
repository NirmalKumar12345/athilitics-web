'use client';

import { Organizer } from '@/api/models/Organizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoSubText } from '@/components/ui/infoSubText';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';

const filterNumericInput = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

type Props = {
  venueAddress: string;
  onChangeVenueAddress: (value: string) => void;
  no_of_courts: string;
  onChangeTablesOrCourts: (value: string) => void;
  venueStatus?: string;
  errors?: { [key: string]: string };
  clearFieldError?: (field: string) => void;
  useOrganizerVenue?: boolean;
  onToggleVenueAddress?: (value: boolean) => void;
  organizerVenue?: string;
  organizer?: Organizer | null;
};

export default function LocationVenueCard({
  venueAddress,
  onChangeVenueAddress,
  no_of_courts,
  onChangeTablesOrCourts,
  venueStatus = 'Not Verified',
  errors = {},
  clearFieldError,
  useOrganizerVenue,
  onToggleVenueAddress,
  organizerVenue,
  organizer,
}: Props) {
  // Determine what to show in textarea
  const addressValue = useOrganizerVenue ? organizerVenue : venueAddress;

  const actualVenueStatus = organizer?.verification_status === 'APPROVED' ? 'Verified' : 'Not Verified';

  return (
    <Card className="max-w-[796px] w-full h-auto rounded-[8px] bg-[#282A28]">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-white font-satoshi-bold !text-[16px]">
          <MapPin size={20} className="text-white" />
          Location & Venue
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-[10px] pt-0 w-full mx-auto">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <Label className="text-white text-[14px] font-satoshi-variable font-[400]">
              Venue Address
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={useOrganizerVenue}
                className="data-[state=checked]:bg-[#4EF162] cursor-pointer"
                onCheckedChange={onToggleVenueAddress}
                id="venue_toggle"
              />
              <span className="text-xs text-white">
                {useOrganizerVenue ? 'Same as Organization Address' : 'Same as organization address'}
              </span>
            </div>
          </div>
          <Textarea
            placeholder="Enter venue Address"
            className={`w-full !h-auto text-white ${errors.venue_address ? 'border-red-500' : ''}`}
            value={addressValue}
            onChange={(e) => {
              if (!useOrganizerVenue) {
                onChangeVenueAddress(e.target.value);
                if (e.target.value.trim() && clearFieldError) clearFieldError('venue_address');
              }
            }}
            disabled={useOrganizerVenue}
            id="venue_address"
          />
          {errors.venue_address && (
            <span className="text-red-500 text-xs mt-1">{errors.venue_address}</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row w-full gap-[12px] sm:gap-[15px]">
          <div className="space-y-2 flex-1">
            <Label className="text-white text-[14px] font-satoshi-variable font-[400]">
              Number of Tables / Courts
            </Label>
            <Input
              showBorder
              type="text"
              maxLength={3}
              placeholder="Enter Number of Tables / Courts"
              className={`w-full !h-[56px] text-[#7F7F7F] ${
                errors.no_of_courts ? 'border-red-500' : ''
              }`}
              value={no_of_courts}
              onChange={(e) => {
                const val = filterNumericInput(e.target.value);
                let num = Number(val);
                if (val === '' || (num >= 1 && num <= 100)) {
                  onChangeTablesOrCourts(val);
                  if (val.trim() && clearFieldError) clearFieldError('no_of_courts');
                }
              }}
              id="no_of_courts"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {errors.no_of_courts && (
              <span className="text-red-500 text-xs mt-1">{errors.no_of_courts}</span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <Label className="text-white text-[14px] font-satoshi-variable font-[400]">
              Venue Status
            </Label>
            <div className={`flex items-center justify-between w-full h-[56px] px-3 rounded-md bg-black border border-[#282A28] ${actualVenueStatus === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`}>
              <span>{actualVenueStatus}</span>
              <InfoSubText
                infoSize={16}
                text=""
                fillColor="#FEE440"
                hoverMessage="You need your venue verified to be able to publish tournament"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
