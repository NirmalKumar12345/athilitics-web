'use client';

import { TournamentDTO } from '@/api/models/TournamentDTO';
import { TournamentUpdateDTO } from '@/api/models/TournamentUpdateDTO';
import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { Routes } from '@/app/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { MultiSelect } from '@/components/ui/multiSelect';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioBoxGroup';
import RichTextEditor from '@/components/ui/richTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useSports } from '@/hooks/useSports';
import { useTournament } from '@/hooks/useTournament';
import { Formik, FormikProps } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { tournamentFormValidationSchema } from './validationSchema';

interface TournamentFormProps {
  onSaveAndProceed: (formData: any) => void;
  isCreateMode?: boolean;
  tournamentId?: string | null;
}

export default function TournamentForm({ isCreateMode = true, tournamentId }: TournamentFormProps) {
  const router = useRouter();
  const { createTournament, updateTournament, getTournamentById, isLoading } = useTournament(false);
  const { tournaments } = useTournament();
  const { organizer } = useOrganizer();
  const { sports, fetchSportAssetUrl } = useSports();
  const [showLoading, setShowLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<TournamentUpdateList>>({
    event_name: '',
    sports_id: 0,
    event_type: '',
    format_name: '',
    skill_level: [],
    event_descriptions: '',
    recurring_tournament: false,
    venue_address: '',
    organization_address: false,
    no_of_courts: undefined,
    registration_start_date: '',
    registration_end_date: '',
    allow_In_App_Wallet_Payment: false,
    allow_player_score_submission: false,
    visibility: '',
    tournament_profile: '',
  });

  useEffect(() => {
    if (!isCreateMode && tournamentId) {
      setShowLoading(true);
      getTournamentById(Number(tournamentId))
        .then(async (data: any) => {
          let tournamentProfile = data.tournament_profile || '';
          if (!tournamentProfile && data.sports_id) {
            tournamentProfile = await fetchSportAssetUrl(data.sports_id, 'tournament_placeholder') || '';
          }
          setInitialValues({
            event_name: data.event_name || '',
            sports_id: data.sports_id || 0,
            event_type: data.event_type || '',
            format_name: data.format_name || '',
            skill_level: data.skill_level || [],
            event_descriptions: data.event_descriptions || '',
            recurring_tournament: data.recurring_tournament || false,
            venue_address: data.venue_address || '',
            no_of_courts: data.no_of_courts,
            registration_start_date: data.registration_start_date || '',
            registration_end_date: data.registration_end_date || '',
            auto_messages: data.auto_messages ?? false,
            organization_address: data.organization_address ?? false,
            allow_In_App_Wallet_Payment: data.allow_In_App_Wallet_Payment ?? true,
            allow_player_score_submission: data.allow_player_score_submission ?? false,
            visibility: data.visibility || '',
            id: data.id,
            tournament_profile: tournamentProfile,
          });
        })
        .catch(() => {
          toast.error('Failed to fetch tournament details');
        })
        .finally(() =>
          setTimeout(() => {
            setShowLoading(false);
          }, 2000)
        );
    }
  }, [isCreateMode, tournamentId, getTournamentById]);
  useEffect(() => {
    if (initialValues.sports_id) {
      fetchSportAssetUrl(initialValues.sports_id, 'tournament_placeholder').then((url) => {
        if (url && initialValues.tournament_profile !== url) {
          setInitialValues((prev) => ({ ...prev, tournament_profile: url }));
        }
      });
    }
  }, [initialValues.sports_id]);

  const buildCreatePayload = (values: Partial<TournamentUpdateList>): TournamentDTO => ({
    event_name: values.event_name,
    sports_id: Number(values.sports_id),
    organization_id: organizer?.id ?? 0,
    event_type: values.event_type,
    format_name: values.format_name,
    skill_level: values.skill_level,
    event_descriptions: values.event_descriptions || '',
    tournament_profile: '',
  });

  const buildUpdatePayload = (values: Partial<TournamentUpdateList>): TournamentUpdateDTO => {
    return {
      event_name: values.event_name ?? initialValues.event_name,
      sports_id: Number(values.sports_id ?? initialValues.sports_id) ?? undefined,
      organization_id: organizer?.id ?? initialValues.organization_id ?? 0,
      event_type: values.event_type ?? initialValues.event_type,
      format_name: values.format_name ?? initialValues.format_name,
      skill_level: values.skill_level ?? initialValues.skill_level,
      event_descriptions: values.event_descriptions ?? initialValues.event_descriptions ?? '',
      tournament_type: values.tournament_type ?? initialValues.tournament_type ?? undefined,
      recurring_tournament:
        values.recurring_tournament ?? initialValues.recurring_tournament ?? false,
      tournament_date: values.tournament_date ?? initialValues.tournament_date ?? undefined,
      tournament_start_time:
        values.tournament_start_time ?? initialValues.tournament_start_time ?? undefined,
      tournament_end_time:
        values.tournament_end_time ?? initialValues.tournament_end_time ?? undefined,
      venue_address: values.venue_address ?? initialValues.venue_address,
      no_of_courts: values.no_of_courts ?? initialValues.no_of_courts ?? undefined,
      registration_start_date:
        values.registration_start_date ?? initialValues.registration_start_date ?? undefined,
      registration_end_date:
        values.registration_end_date ?? initialValues.registration_end_date ?? undefined,
      visibility: values.visibility ?? initialValues.visibility,
      auto_messages: values.auto_messages ?? initialValues.auto_messages,
      organization_address: values.organization_address ?? initialValues.organization_address,
      allow_In_App_Wallet_Payment:
        values.allow_In_App_Wallet_Payment ?? initialValues.allow_In_App_Wallet_Payment,
      allow_player_score_submission:
        values.allow_player_score_submission ?? initialValues.allow_player_score_submission,
      tournament_profile: values.tournament_profile ?? initialValues.tournament_profile ?? '',
    };
  };

  const handleFormSubmit = async (values: typeof initialValues) => {
    try {
      setShowLoading(true);
      let response;
      if (isCreateMode) {
        const payload: TournamentDTO = buildCreatePayload(values);
        response = await createTournament(payload);
      } else {
        const payload: TournamentUpdateDTO = buildUpdatePayload(values);
        response = await updateTournament(Number(tournamentId), payload);
      }

      toast.success(
        isCreateMode ? 'Tournament created successfully!' : 'Tournament updated successfully!'
      );

      const id = isCreateMode ? response?.data?.tournamentId : values.id || tournamentId;

      if (!id) {
        toast.error(
          'Tournament ID is missing in the response. Please try again or contact support.'
        );
        setShowLoading(false);
        return;
      }

      setTimeout(() => {
        router.push(Routes.TOURNAMENT_DETAILS(id));
        setShowLoading(false);
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.message ||
        (isCreateMode ? 'Failed to create tournament' : 'Failed to update tournament')
      );
      setShowLoading(false);
    }
  };

  return (
    <>
      {showLoading && <LoadingOverlay />}
      <Formik
        initialValues={initialValues}
        validationSchema={tournamentFormValidationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {(formik: FormikProps<Partial<TournamentUpdateList>>) => {
          useEffect(() => {
            if (formik.values.sports_id) {
              fetchSportAssetUrl(formik.values.sports_id, 'tournament_placeholder').then((url) => {
                if (url && formik.values.tournament_profile !== url) {
                  formik.setFieldValue('tournament_profile', url);
                }
              });
            }
          }, [formik.values.sports_id]);
          return (
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col items-center bg-[#16171B] py-0 md:py-12 lg:py-[100px] w-screen min-h-screen">
                <div className="w-full max-w-[796px] bg-[#121212] border-0 md:border rounded-none md:rounded-[8px] border-[#282A28] px-4 md:px-6 lg:px-[30px] mt-[45px] sm:mb-[80px] md:mt-0 py-4 md:py-6 m-0 md:mx-auto md:my-0">
                  <div className="flex items-center gap-3 mb-4 md:mb-6 lg:mb-8 py-2">
                    <Image
                      src="/images/tournamentFrame.svg"
                      alt="Tournament"
                      width={24}
                      height={24}
                      className="md:w-8 md:h-8 flex-shrink-0"
                    />
                    <p className="text-white text-[16px] md:text-[18px] lg:text-[20px] font-bold leading-tight">
                      Tournament Details
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-4 lg:gap-6">
                    <div>
                      <Label className="text-white text-[14px] md:text-[16px] lg:text-[18px] block mb-2">
                        Event Name
                      </Label>
                      <Input
                        id="event_name"
                        type="text"
                        placeholder="Enter Name"
                        className={`h-[56px] md:h-[52px] lg:h-[56px] w-full bg-black text-white border-[#3C3B3B] focus:border-[#4EF162] ${formik.errors.event_name && formik.touched.event_name
                          ? 'border-red-500'
                          : ''
                          }`}
                        {...formik.getFieldProps('event_name')}
                      />
                      {formik.errors.event_name && formik.touched.event_name && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formik.errors.event_name}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-white text-[14px] md:text-[16px] lg:text-[18px]">
                        Sport
                      </Label>
                      <Select
                        value={formik.values.sports_id ? String(formik.values.sports_id) : ''}
                        onValueChange={(val) => formik.setFieldValue('sports_id', val)}
                      >
                        <SelectTrigger
                          className={`w-full !h-[56px] md:!h-[52px] lg:!h-[56px] text-white bg-black border-[#3C3B3B] focus:border-[#4EF162] ${formik.errors.sports_id && formik.touched.sports_id
                            ? 'border-red-500'
                            : ''
                            }`}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport.id} value={sport.id.toString()}>
                              {sport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.errors.sports_id && formik.touched.sports_id && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formik.errors.sports_id}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label className="text-white text-[14px] md:text-[16px] lg:text-[18px] block mb-2">
                        Event Type
                      </Label>
                      <RadioGroup
                        defaultValue="Tournament"
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3"
                        value={formik.values.event_type}
                        onValueChange={(val) => formik.setFieldValue('event_type', val)}
                      >
                        <RadioGroupItem className="w-auto" value="Tournament">
                          Tournament
                        </RadioGroupItem>
                        <RadioGroupItem className="w-auto" value="Friendly">
                          Friendly
                        </RadioGroupItem>
                        <RadioGroupItem className="w-auto" value="League">
                          League
                        </RadioGroupItem>
                      </RadioGroup>
                      {formik.errors.event_type && formik.touched.event_type && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formik.errors.event_type}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-white text-[14px] md:text-[16px] lg:text-[18px]">
                        Event Format
                      </Label>
                      <Select
                        value={formik.values.format_name}
                        onValueChange={(val) => formik.setFieldValue('format_name', val)}
                      >
                        <SelectTrigger
                          className={`w-full !h-[56px] md:!h-[52px] lg:!h-[56px] text-white bg-black border-[#3C3B3B] focus:border-[#4EF162] ${formik.errors.format_name && formik.touched.format_name
                            ? 'border-red-500'
                            : ''
                            }`}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Singles Only">Singles Only</SelectItem>
                          <SelectItem value="Doubles Only">Doubles Only</SelectItem>
                          <SelectItem value="Singles and Doubles">Singles and Doubles</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.errors.format_name && formik.touched.format_name && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formik.errors.format_name}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label className="text-white text-[14px] md:text-[16px] lg:text-[18px] block mb-2">
                        Skill Level
                      </Label>
                      <MultiSelect
                        className={
                          'w-full text-white border border-[#3C3B3B] bg-black flex items-center px-3 md:px-4 !h-[56px] md:!h-[52px] lg:!h-[56px]'
                        }
                        options={[
                          { label: 'Beginner', value: 'Beginner' },
                          { label: 'Intermediate', value: 'Intermediate' },
                          { label: 'Advanced', value: 'Advanced' },
                        ]}
                        value={formik.values.skill_level || []}
                        onChange={(vals) => formik.setFieldValue('skill_level', vals.map(String))}
                        placeholder="Select"
                        maxVisible={3}
                      />
                      {formik.errors.skill_level && formik.touched.skill_level && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formik.errors.skill_level}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label className="text-white text-[14px] md:text-[16px] lg:text-[18px] block mb-2">
                        Event Description
                      </Label>
                      <div className="w-full">
                        <RichTextEditor
                          value={formik.values.event_descriptions}
                          onChange={(val) => formik.setFieldValue('event_descriptions', val)}
                        />
                      </div>
                      {formik.errors.event_descriptions && formik.touched.event_descriptions && (
                        <span className="text-red-500 text-xs mt-1 block">
                          {formik.errors.event_descriptions}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-[796px] flex flex-col sm:flex-row justify-end gap-3 mt-4 sm:mt-2 md:mt-6 px-4 md:px-0 mb-4 sm:mb-6 md:mb-0">
                  <Button
                    type="button"
                    className="px-4 py-3 md:px-[14px] md:py-[12.5px] bg-[#121212] items-center font-satoshi-variable font-[700px] text-[14px] text-white rounded-[4px] cursor-pointer hover:bg-[#1a1a1a] border border-[#E6E6E6] w-full sm:w-auto min-h-[44px] md:min-h-[40px]"
                    onClick={() => router.push(Routes.DASHBOARD)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-3 md:px-[14px] md:py-[12.5px] bg-[#4EF162] items-center font-satoshi-variable font-[700px] text-[14px] text-black rounded-[4px] cursor-pointer hover:bg-[#3DBF50] w-full sm:w-auto min-h-[44px] md:min-h-[40px]"
                  >
                    {isLoading ? 'Saving...' : 'Save & Proceed'}
                  </Button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
