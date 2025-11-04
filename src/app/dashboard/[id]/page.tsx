'use client';
import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { TOURNAMENT_STATUS_PUBLISHED } from '@/app/constants/tournamentStatus';
import { transformCategoryToObjectPayload, transformCategoryToUpdatePayload } from '@/app/utils/transformCategoriesToPayload';
import PublishPopup from '@/components/publishPupup';
import { Button } from '@/components/ui/button';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { TabsMenu } from '@/components/ui/tabMenu';
import TournamentHeader from '@/components/ui/tournament-header';
import { useCategory } from '@/hooks/useCategory';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useTournament } from '@/hooks/useTournament';
import { parseTo24Hour, toISODateTime } from '@/lib/time-utils';
import { Formik, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Category from './category';
import { getInitialTournamentValues } from './getInitialTournamentValues';
import OrganizationControl from './organizationControl';
import Registration from './registration';
import TourDetails from './tourDetails';
import { processProfileImageUpdate } from './tournamentProfileUtils';
import { useTabValidationCache } from './useTabValidationCache';
import { combinedValidationSchema } from './validationSchemas';

type TournamentData = TournamentUpdateList & {
  categories: Array<any>;
};

function useHasSubmitted() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const markSubmitted = useCallback(() => setHasSubmitted(true), []);
  const resetSubmitted = useCallback(() => setHasSubmitted(false), []);
  return { hasSubmitted, markSubmitted, resetSubmitted };
}

export default function TourDetailsPage() {
  const params = useParams();
  const tournamentIdFromUrl = Number(params?.id);

  const {
    getTournamentById,
    updateTournament,
    publishTournament,
    tournaments,
    uploadTournamentProfilePicture,
  } = useTournament(true, tournamentIdFromUrl);
  const { createCategory, updateCategory, deleteCategory } = useCategory(false);
  const { organizer } = useOrganizer();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tourDetails');
  const [activeCategoryAccordion, setActiveCategoryAccordion] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const formikRef = useRef<any>(null);
  const { getTabValidationSchema } = require('./validationSchemas');
  const { collectTabValidationErrors } = require('./validationUtils');
  const { hasSubmitted, markSubmitted, resetSubmitted } = useHasSubmitted();
  const [updatedProfileImage, setUpdatedProfileImage] = useState<File | null>(null);
  const [hasProfileImageChanged, setHasProfileImageChanged] = useState(false);
  const [showPublishPopup, setShowPublishPopup] = useState(false);

  const tournamentId = useMemo(() => tournaments?.id, [tournaments?.id]);

  const initialValues: Partial<TournamentUpdateList> = useMemo(
    () => getInitialTournamentValues(tournaments),
    [tournaments]
  );

  useEffect(() => {
    if (initialValues?.categories && initialValues.categories.length > 0) {
      const firstCat = initialValues.categories[0] as any;
      const missingRequired =
        !firstCat?.ageBracket ||
        !firstCat?.gender_type ||
        !firstCat?.maximum_participants ||
        !firstCat?.format_type ||
        (firstCat?.entry_fee === undefined || firstCat?.entry_fee === null || firstCat?.entry_fee === '' || isNaN(Number(firstCat?.entry_fee)));
      setActiveCategoryAccordion(missingRequired ? [0] : []);
    } else {
      setActiveCategoryAccordion([0]);
    }
  }, [initialValues?.categories]);

  useEffect(() => {
    if (tournamentId) {
      setShowLoading(true);
      getTournamentById(tournamentId)
        .then((data: any) => {
          const tournament = data;
          const categories = Array.isArray(tournament?.categories) ? tournament.categories : [];
          setTournamentData({
            ...tournament,
            categories,
          });
        })
        .catch((err: any) => {
          console.error('Error fetching tournament:', err);
          setTournamentData(null);
        })
        .finally(() => {
          setTimeout(() => {
            setShowLoading(false);
          }, 2000);
        });
    } else {
      setTournamentData(null);
    }
  }, [tournamentId]);

  const handleUpdateTournament = async (values: Partial<TournamentUpdateList>) => {
    setIsUpdating(true);
    let updateData = {
      ...values,
      sports_id: values.sports_id === null ? undefined : values.sports_id,
      recurring_tournament: values.recurring_tournament || false,
      tournament_type: values.tournament_type === null ? undefined : values.tournament_type,
      tournament_date: values.tournament_date === null ? undefined : values.tournament_date,
      tournament_start_time: toISODateTime(
        values.tournament_date || '',
        parseTo24Hour(values.tournament_start_time || '')
      ),
      tournament_end_time: toISODateTime(
        values.tournament_date || '',
        parseTo24Hour(values.tournament_end_time || '')
      ),
      no_of_courts: Number(values.no_of_courts),
      tournament_profile:
        typeof values.tournament_profile === 'string' ? values.tournament_profile : '',
      registration_start_date:
        values.registration_start_date === null ? undefined : values.registration_start_date,
      registration_end_date:
        values.registration_end_date === null ? undefined : values.registration_end_date,
      auto_messages: values.auto_messages,
      organization_address: values.organization_address,
      allow_In_App_Wallet_Payment: values.allow_In_App_Wallet_Payment,
      allow_player_score_submission: values.allow_player_score_submission,
      visibility: values.visibility || '',
    };
    const tournamentId = Number(tournaments?.id);
    if (isNaN(tournamentId)) {
      toast.error('Invalid tournament ID. Unable to update tournament.');
      setIsUpdating(false);
      return;
    }

    try {
      await processProfileImageUpdate(tournamentId, updateData, {
        updatedProfileImage,
        hasProfileImageChanged,
        uploadTournamentProfilePicture,
        updateTournament,
        resetImageState,
        router,
        toast,
      });
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        JSON.stringify(error) ||
        'Failed to update tournament';
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePublishTournament = async (tournamentId: number) => {
    try {
      await publishTournament(tournamentId);
      toast.success('Tournament published successfully!');
    } catch (error: any) {
      toast.error(error?.body?.message || 'Failed to publish tournament');
    }
  };

  const handleTournamentProfileUpload = async (file: File | null) => {
    setUpdatedProfileImage(file);
    setHasProfileImageChanged(true);

    if (formikRef.current && formikRef.current.setFieldValue) {
      formikRef.current.setFieldValue('tournament_profile', file);
    }
  };

  const handleTournamentProfileRemove = () => {
    setUpdatedProfileImage(null);
    setHasProfileImageChanged(true);

    if (formikRef.current && formikRef.current.setFieldValue) {
      formikRef.current.setFieldValue('tournament_profile', '');
    }
  };

  const resetImageState = () => {
    setUpdatedProfileImage(null);
    setHasProfileImageChanged(false);
  };

  const validateUpToTab = useTabValidationCache();
  const handleTabUpdate = useCallback(
    async (
      formik: FormikProps<Partial<TournamentUpdateList>>,
      tab: string,
      onSuccess: () => void
    ) => {
      markSubmitted();
      const validation = await validateUpToTab(formik, tab);
      if (validation) {
        setActiveTab(validation.tab);
        setTimeout(() => {
          const firstErrorField = Object.keys(validation.errors)[0];
          const el = document.getElementById(firstErrorField);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }
      resetSubmitted();
      onSuccess();
    },
    [markSubmitted, resetSubmitted, validateUpToTab]
  );

  const handleCategorySubmit = useCallback(async () => {
    const formik = formikRef.current;
    if (!formik) return;

    markSubmitted();

    const validation = await validateUpToTab(formik, 'Category');
    if (validation) {
      setActiveTab(validation.tab);
      setTimeout(() => {
        const firstErrorField = Object.keys(validation.errors)[0];
        const el = document.getElementById(firstErrorField);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const categoriesData = formik.values?.categories;
    const tournament_id = tournaments?.id;
    if (!tournament_id) {
      toast.error('Tournament ID is missing');
      return;
    }

    try {
      for (const categoryData of categoriesData || []) {
        if (categoryData.ageBracket?.id) {
          const categoryWithOrganizerId = {
            ...categoryData,
            organizerId: organizer?.id || 0,
          };

          const existingCategory = tournaments?.categories?.find((cat: any) => cat.id === categoryData.id);
          if (existingCategory) {
            const updatePayload = transformCategoryToUpdatePayload(categoryWithOrganizerId);
            await updateCategory(categoryData.id, updatePayload);
          } else {
            const createPayload = transformCategoryToObjectPayload(categoryWithOrganizerId, tournament_id);
            await createCategory(createPayload);
          }
        }
      }

      toast.success('Categories saved successfully!');
      resetSubmitted();
      setActiveTab('organization');
    } catch (error) {
      toast.error('Failed to save categories');
    }
  }, [
    markSubmitted,
    createCategory,
    updateCategory,
    deleteCategory,
    resetSubmitted,
    setActiveTab,
    tournaments?.id,
    organizer?.id,
    validateUpToTab,
  ]);

  const handleDeleteCategory = useCallback(async (categoryId: number, categoryIndex: number) => {
    const formik = formikRef.current;
    if (!formik) return;

    try {
      const existingCategory = tournaments?.categories?.find((cat: any) => cat.id === categoryId);

      if (existingCategory) {
        await deleteCategory(categoryId);
        toast.success('Category deleted successfully!');
      }

      const currentCategories = formik.values?.categories || [];
      const updatedCategories = currentCategories.filter((_: any, index: number) => index !== categoryIndex);
      formik.setFieldValue('categories', updatedCategories);

    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  }, [deleteCategory, tournaments?.categories]);

  const handleAddCategory = useCallback(async () => {
    const formik = formikRef.current;
    if (!formik) return;
    let currentIdx;
    const lastIdx = (formik.values.categories?.length ?? 0) - 1;
    const errors = await formik.validateForm();
    const lastCategoryErrors = errors.categories && errors.categories[lastIdx];
    if (!activeCategoryAccordion || activeCategoryAccordion.length === 0) {
      if (lastIdx < 0) return;
      if (lastCategoryErrors && Object.keys(lastCategoryErrors).length > 0) {
        setActiveCategoryAccordion([lastIdx]);
        markSubmitted();
        return;
      } else {
        const organizerId = organizer?.id || 0;
        const newCategoryList = {
          id: Date.now(),
          ageBracket: undefined,
          gender_type: undefined,
          tournamentId: tournaments?.id || 0,
          organizerId,
          divisions_label: '',
          divisions_alias: '',
          format_type: undefined,
          entry_fee: undefined,
          waiting_list: false,
          maximum_participants: undefined,
        };
        const updatedCategories = [...(formik.values.categories || []), newCategoryList];
        formik.setFieldValue('categories', updatedCategories);
        setActiveCategoryAccordion([updatedCategories.length - 1]);
        return;
      }
    }
    markSubmitted();
    currentIdx = activeCategoryAccordion[activeCategoryAccordion.length - 1];
    const categoryErrors = errors.categories && errors.categories[currentIdx];
    if (categoryErrors && Object.keys(categoryErrors).length > 0) {
      return;
    }
    const organizerId = organizer?.id || 0;
    const newCategoryList = {
      id: Date.now(),
      ageBracket: undefined,
      gender_type: undefined,
      tournamentId: tournaments?.id || 0,
      organizerId,
      divisions_label: '',
      divisions_alias: '',
      format_type: undefined,
      entry_fee: undefined,
      waiting_list: false,
      maximum_participants: undefined,
    };
    const updatedCategories = [...(formik.values.categories || []), newCategoryList];
    formik.setFieldValue('categories', updatedCategories);
    setActiveCategoryAccordion([updatedCategories.length - 1]);
  }, [organizer?.id, tournaments?.id, activeCategoryAccordion, markSubmitted]);

  const tabList = ['tourDetails', 'registration', 'Category', 'organization'];
  const handleOnPublish = () => {
    setShowPublishPopup(true);
  };

  const handlePublishConfirm = async () => {
    setShowPublishPopup(false);
    if (!formikRef.current) return;
    markSubmitted();
    let hasAnyError = false;
    for (const tab of tabList) {
      const schema = getTabValidationSchema(tab);
      const values = formikRef.current.values;
      const result = await collectTabValidationErrors(schema, values);
      if (result && result.errors && Object.keys(result.errors).length > 0) {
        hasAnyError = true;
        setActiveTab(tab);
        const firstErrorField = Object.keys(result.errors)[0];
        setTimeout(() => {
          const el = document.getElementById(firstErrorField);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        break;
      }
    }
    if (hasAnyError) {
      toast.error('First you can fill all the necessary data before publishing.');
      return;
    }
    if (tournaments?.id) {
      handlePublishTournament(tournaments?.id);
    } else {
      toast.error('Tournament ID is missing');
    }
  };

  const handlePublishCancel = () => {
    setShowPublishPopup(false);
  };

  const handleOrganizationSubmit = useCallback(async () => {
    const formikInstance = formikRef.current;
    if (!formikInstance) return;

    markSubmitted();

    // Validate all tabs up to organization
    const validation = await validateUpToTab(formikInstance, 'organization');
    if (validation) {
      setActiveTab(validation.tab);
      setTimeout(() => {
        const firstErrorField = Object.keys(validation.errors)[0];
        const el = document.getElementById(firstErrorField);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    resetSubmitted();
    setShowLoading(true);
    formikInstance.submitForm();
    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  }, [markSubmitted, resetSubmitted, validateUpToTab]);

  return (
    <div className="flex flex-col w-screen min-h-screen bg-[#16171B]">
      {showLoading && <LoadingOverlay />}
      {!showLoading && (
        <nav className="border-b border-b-[#444444] items-center h-[48px] sm:h-[54px] w-full bg-[#16171B] fixed left-0 right-0 z-10 top-[48px] sm:top-[54px]">
          <div className="px-4 sm:px-8 md:px-16 lg:px-[130px] py-2">
            <TournamentHeader
              title={tournamentData?.event_name || 'Local Legends League'}
              verificationText="Get Verified to Publish Tournament"
              publishText="Publish Tournament"
              showPublishButton={true}
              publishDisabled={
                tournamentData?.tournament_status === TOURNAMENT_STATUS_PUBLISHED ||
                !['APPROVED'].includes(organizer?.verification_status || '')
              }
              onPublish={handleOnPublish}
              organizer={organizer}
              tournamentStatus={tournamentData?.tournament_status}
              createdAt={tournamentData?.created_at}
            />
          </div>
        </nav>
      )}
      <PublishPopup
        open={showPublishPopup}
        onConfirm={handlePublishConfirm}
        onCancel={handlePublishCancel}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={combinedValidationSchema}
        onSubmit={handleUpdateTournament}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formik) => {
          const tabs = [
            {
              value: 'tourDetails',
              label: 'Details',
              content: (
                <TourDetails
                  formik={formik}
                  hasSubmitted={hasSubmitted}
                  updatedProfileImage={updatedProfileImage}
                  onProfileImageUpload={handleTournamentProfileUpload}
                  onProfileImageRemove={handleTournamentProfileRemove}
                />
              ),
            },
            {
              value: 'registration',
              label: 'Registration',
              content: <Registration formik={formik} hasSubmitted={hasSubmitted} />,
            },
            {
              value: 'Category',
              label: 'Category/Age',
              content: (
                <Category
                  formik={formik}
                  hasSubmitted={hasSubmitted}
                  onDeleteCategory={handleDeleteCategory}
                  onAddCategory={handleAddCategory}
                  activeAccordion={activeCategoryAccordion}
                  setActiveAccordion={setActiveCategoryAccordion}
                />
              ),
            },
            {
              value: 'organization',
              label: 'Organizer Controls',
              content: <OrganizationControl formik={formik} hasSubmitted={hasSubmitted} />,
            },
          ];

          const getTabButtonConfig = () => {
            const tabConfig = {
              tourDetails: {
                cancelAction: () => router.back(),
                cancelText: 'Cancel',
                nextAction: () =>
                  handleTabUpdate(formik, 'tourDetails', () => setActiveTab('registration')),
                nextText: 'Update Changes',
                isLoading: false,
              },
              registration: {
                cancelAction: () => setActiveTab('tourDetails'),
                cancelText: 'Cancel',
                nextAction: () =>
                  handleTabUpdate(formik, 'registration', () => setActiveTab('Category')),
                nextText: 'Update Changes',
                isLoading: false,
              },
              Category: {
                cancelAction: () => setActiveTab('registration'),
                cancelText: 'Cancel',
                nextAction: handleCategorySubmit,
                nextText: 'Update Changes',
                isLoading: false,
              },
              organization: {
                cancelAction: () => setActiveTab('Category'),
                cancelText: 'Cancel',
                nextAction: handleOrganizationSubmit,
                nextText: isUpdating ? 'Save and Exit...' : 'Save and Exit',
                isLoading: isUpdating,
              },
            };
            return tabConfig[activeTab as keyof typeof tabConfig];
          };

          const buttonConfig = getTabButtonConfig();
          const cancelButtonClass =
            'px-[14px] py-[12.5px] bg-[#121212] items-center font-satoshi-variable font-[700] text-[14px] text-white rounded-[4px] cursor-pointer hover:bg-[#1a1a1a] border border-[#E6E6E6]';
          const nextButtonClass =
            'px-[14px] py-[12.5px] bg-[#4EF162] items-center font-satoshi-variable font-[700] text-[14px] text-black rounded-[4px] cursor-pointer hover:bg-[#3DBF50]';

          return (
            <>
              <div className="w-full flex justify-center lg:px-0 pt-[96px] sm:pt-[108px]">
                <div className="py-4 sm:py-6 w-full max-w-4xl px-4 sm:px-8 md:px-16 lg:px-0">
                  <TabsMenu tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                  {buttonConfig && (
                    <div className="flex flex-col sm:flex-row justify-end items-center md:mr-0 lg:mr-24 mt-6 gap-4 sm:gap-35">
                      {activeTab === 'Category' && (
                        <Button
                          type="button"
                          className="w-full sm:w-auto px-[14px] py-[12.5px] bg-[#232323] border border-[#4EF162] text-[#4EF162] font-satoshi-bold text-[14px] rounded-[4px] cursor-pointer hover:bg-[#232323] mb-2 sm:mb-0"
                          onClick={handleAddCategory}
                          style={{ minWidth: 140 }}
                        >
                          Add Category
                        </Button>
                      )}
                      <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <Button
                          type="button"
                          className={cancelButtonClass}
                          onClick={() => {
                            resetSubmitted();
                            buttonConfig.cancelAction();
                          }}
                        >
                          {buttonConfig.cancelText}
                        </Button>
                        <Button
                          type="button"
                          className={nextButtonClass}
                          onClick={() => {
                            markSubmitted();
                            buttonConfig.nextAction();
                          }}
                          disabled={buttonConfig.isLoading}
                        >
                          {buttonConfig.nextText}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
}
