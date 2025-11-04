'use client';

import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import DateTimeCard from '@/app/dashboard/[id]/date-time-card';
import LocationVenueCard from '@/app/dashboard/[id]/location-venue-card';
import TournamentInfoCard from '@/app/dashboard/[id]/tournament-info';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useSports } from '@/hooks/useSports';
import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';

const TourDetails = ({
  formik,
  hasSubmitted = false,
  updatedProfileImage,
  onProfileImageUpload,
  onProfileImageRemove,
}: {
  formik: FormikProps<Partial<TournamentUpdateList>>;
  hasSubmitted?: boolean;
  updatedProfileImage?: File | null;
  onProfileImageUpload?: (file: File | null) => void;
  onProfileImageRemove?: () => void;
}) => {
  const { values, errors, setFieldValue } = formik;
  const { sports } = useSports();
  const { organizer } = useOrganizer();

  const [useOrganizerVenue, setUseOrganizerVenue] = useState<boolean>(
    values.organization_address ?? false
  );

  useEffect(() => {
    setUseOrganizerVenue(values.organization_address ?? false);
  }, [values.organization_address]);

  useEffect(() => {
    setFieldValue('organization_address', useOrganizerVenue);
    if (useOrganizerVenue) {
      setFieldValue('venue_address', organizer?.venue || '');
    }
  }, [useOrganizerVenue, organizer?.venue, setFieldValue]);

  const clearFieldError = (field: string) => {
    formik.setFieldError(field, undefined);
  };

  let skillLevelTags: string[] = [];
  if (Array.isArray(values.skill_level)) {
    if (values.skill_level.length === 3) {
      skillLevelTags = ['All Skill Levels'];
    } else {
      skillLevelTags = values.skill_level.slice(0, 2);
    }
  }

  const tags: string[] = [
    values.event_type || '',
    values.format_name || '',
    ...skillLevelTags,
  ].filter((tag): tag is string => typeof tag === 'string' && !!tag);

  const sportsName = sports.find((sport) => sport.id === values.sports_id)?.name || '';
  return (
    <section className="flex flex-col gap-6 max-w-4xl mx-auto">
      <TournamentInfoCard
        tournament_profile={values.tournament_profile || ''}
        title={values.event_name || 'Tournament'}
        category={sportsName}
        tags={tags || []}
        organizer={values.organizer_name || 'Unknown Organizer'}
        description={values.event_descriptions || ''}
        updatedProfileImage={updatedProfileImage}
        onProfileImageUpload={onProfileImageUpload}
        onProfileImageRemove={onProfileImageRemove}
      />
      <DateTimeCard
        type={values.tournament_type || ''}
        onChangeType={(v) => {
          setFieldValue('tournament_type', v);
          clearFieldError('tournament_type');
        }}
        date={values.tournament_date || ''}
        onChangeDate={(v) => {
          setFieldValue('tournament_date', v);
          clearFieldError('tournament_date');
        }}
        startTime={values.tournament_start_time || ''}
        onChangeStartTime={(v) => {
          setFieldValue('tournament_start_time', v);
          clearFieldError('tournament_start_time');
        }}
        endTime={values.tournament_end_time || ''}
        onChangeEndTime={(v) => setFieldValue('tournament_end_time', v)}
        errors={hasSubmitted ? errors : {}} // <-- only show errors if hasSubmitted
        recurring={values.recurring_tournament || false}
        onToggleRecurring={(v) => setFieldValue('recurring_tournament', v)}
        onClearError={clearFieldError} // <-- add this line
      />
      <LocationVenueCard
        venueAddress={values.venue_address || ''}
        onChangeVenueAddress={(v) => {
          setFieldValue('venue_address', v);
          clearFieldError('venue_address');
        }}
        no_of_courts={values.no_of_courts != null ? String(values.no_of_courts) : ''}
        onChangeTablesOrCourts={(v) => {
          setFieldValue('no_of_courts', v);
          clearFieldError('no_of_courts');
        }}
        errors={hasSubmitted ? errors : {}}
        useOrganizerVenue={useOrganizerVenue}
        onToggleVenueAddress={(v) => setUseOrganizerVenue(v)}
        organizerVenue={organizer?.venue || ''}
        organizer={organizer}
      />
    </section>
  );
};

export default TourDetails;
