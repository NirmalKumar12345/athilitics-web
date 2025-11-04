'use client';
import { Organizer } from '@/api/models/Organizer';
import { Routes } from '@/app/constants/routes';
import AddressVerification from '@/components/registerUser/AddressVerification';
import ProfileDetails from '@/components/registerUser/ProfileDetails';
import SportsRoleDetails from '@/components/registerUser/SportsRoleDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { TabsMenu } from '@/components/ui/tabMenu';
import { useOrganizer } from '@/hooks/useOrganizer';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Notify from './notify';
import Subscription from './subscription';
import { combinedValidationSchema, getTabValidationSchema } from './validationSchemas';

const Profile = () => {
  const { organizer, isLoading, updateOrganizerProfile, uploadImage, uploadDocument } =
    useOrganizer();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [updatedLogo, setUpdatedLogo] = useState<File | null>(null);
  const [updatedDocument, setUpdatedDocument] = useState<File | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Initial form values
  const initialValues: Partial<Organizer> = {
    organization_name: organizer?.organization_name || '',
    organizer_name: organizer?.organizer_name || '',
    mobile_number: organizer?.mobile_number || '',
    organization_email: organizer?.organization_email || '',
    primary_sports: organizer?.primary_sports || [],
    other_sports: organizer?.other_sports || [],
    organization_role: organizer?.organization_role || '',
    venue: organizer?.venue || '',
    stateId: organizer?.stateId || null,
    cityId: organizer?.cityId || null,
    pin: organizer?.pin || '',
    social_links: organizer?.social_links || [],
    website_link: organizer?.website_link || '',
    document_name: organizer?.document_name || '',
    document_url: organizer?.document_url,
    organization_profile: organizer?.organization_profile,
    organization_experience: organizer?.organization_experience,
    no_of_annual_events_hosted: organizer?.no_of_annual_events_hosted,
  };

  const handleUpdateOrganizer = async (values: Partial<Organizer>) => {
    setIsUpdating(true);
    setHasSubmitted(true); // Enable error display for final submission

    let updateData = {
      ...values,
      primary_sports: Array.isArray(values.primary_sports)
        ? values.primary_sports.map((sport) =>
            typeof sport === 'string' ? parseInt(sport) : sport
          )
        : values.primary_sports,
      other_sports: Array.isArray(values.other_sports)
        ? values.other_sports.map((sport) => (typeof sport === 'string' ? parseInt(sport) : sport))
        : values.other_sports,
      stateId: values.stateId || undefined,
      cityId: values.cityId || undefined,
    };

    if (!updatedDocument && !updatedLogo) {
      if ('document_url' in updateData) {
        delete updateData.document_url;
      }
    }

    try {
      if (updatedLogo && updatedDocument) {
        const result = await uploadImage(updatedLogo);
        updateData.organization_profile = result.key;
        const docResult = await uploadDocument(updatedDocument);
        updateData.document_url = docResult.key;
        await updateOrganizerProfile(updateData);
        toast.success('Profile and document updated successfully!');
        router.push(Routes.DASHBOARD);
      } else if (updatedLogo) {
        const result = await uploadImage(updatedLogo);
        updateData.organization_profile = result.key;
        if (!updatedDocument && 'document_url' in updateData) {
          delete updateData.document_url;
        }
        await updateOrganizerProfile(updateData);
        toast.success('Profile updated successfully with new logo!');
        router.push(Routes.DASHBOARD);
      } else if (hasImageChanged && !updatedLogo) {
        delete updateData.organization_profile;
        if (!updatedDocument && 'document_url' in updateData) {
          delete updateData.document_url;
        }
        await updateOrganizerProfile(updateData);
        toast.success('Profile updated successfully! Logo removed.');
        router.push(Routes.DASHBOARD);
      } else {
        delete updateData.organization_profile;
        if (updatedDocument) {
          const docResult = await uploadDocument(updatedDocument);
          updateData.document_url = docResult.key;
        } else {
          if ('document_url' in updateData) {
            delete updateData.document_url;
          }
        }
        await updateOrganizerProfile(updateData);
        toast.success('Profile updated successfully!');
        router.push(Routes.DASHBOARD);
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      const errorMessage = error?.body?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const validateUpToTab = async (formik: FormikProps<Partial<Organizer>>, tab: string) => {
    const tabOrder = ['profile', 'sport', 'address'];
    const tabIndex = tabOrder.indexOf(tab);

    for (let i = 0; i <= tabIndex; i++) {
      const currentTab = tabOrder[i];
      const schema = getTabValidationSchema(currentTab);

      try {
        await schema.validate(formik.values, { abortEarly: false });
      } catch (error: any) {
        const validationErrors: { [key: string]: string } = {};
        error.inner?.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });

        // Set validation errors in formik
        formik.setErrors(validationErrors);
        setHasSubmitted(true); // Enable error display

        return { tab: currentTab, errors: validationErrors };
      }
    }
    return null;
  };

  const handleTabUpdate = async (
    formik: FormikProps<Partial<Organizer>>,
    tab: string,
    onSuccess: () => void
  ) => {
    const validation = await validateUpToTab(formik, tab);
    if (validation) {
      setActiveTab(validation.tab);
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          const firstErrorField = Object.keys(validation.errors)[0];
          const el = document.getElementById(firstErrorField);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    // If validation passes, clear the hasSubmitted state for better UX
    setHasSubmitted(false);
    onSuccess();
  };

  const handleImageRemove = () => {
    setUpdatedLogo(null);
    setHasImageChanged(true);
  };

  const handleImageUpload = async (file: File | null) => {
    setUpdatedLogo(file);
    setHasImageChanged(true);
  };

  const handleDocumentUpload = async (file: File | null) => {
    setUpdatedDocument(file);
  };

  const handleTabChange = (newTab: string) => {
    // Reset validation state when manually changing tabs for better UX
    setHasSubmitted(false);
    setActiveTab(newTab);
  };

  useEffect(() => {
    const tab = sessionStorage.getItem('profile_active_tab');
    if (tab === 'subscription') {
      setActiveTab('subscription');
      sessionStorage.removeItem('profile_active_tab');
    }
  }, []);

  return (
    <div className="flex flex-col h-auto min-w-screen pt-16 sm:pt-20 pb-[30px] px-4 sm:px-8 lg:px-[352px] bg-[#16171B]">
      {isLoading && <LoadingOverlay />}
      <Formik
        initialValues={initialValues}
        validationSchema={combinedValidationSchema}
        enableReinitialize
        onSubmit={handleUpdateOrganizer}
      >
        {(formik) => {
          const tabs = [
            {
              value: 'profile',
              label: 'Profile Details',
              content: (
                <Card className="bg-[#121212] border-[#121212] sm:w-full md:w-full lg:w-[935px]">
                  <CardContent className="text-white">
                    <ProfileDetails
                      formik={formik}
                      updatedLogo={updatedLogo}
                      onImageRemove={handleImageRemove}
                      onImageUpload={handleImageUpload}
                      hasSubmitted={hasSubmitted}
                    />
                  </CardContent>
                </Card>
              ),
            },
            {
              value: 'sport',
              label: 'Sport & Role Details',
              content: (
                <Card className="bg-[#121212] border-[#121212] sm:w-full md:w-full lg:w-[935px]">
                  <CardContent className="text-white">
                    <SportsRoleDetails formik={formik} hasSubmitted={hasSubmitted} />
                  </CardContent>
                </Card>
              ),
            },
            {
              value: 'address',
              label: 'Address & Verification',
              content: (
                <Card className="bg-[#121212] border-[#121212] sm:w-full md:w-full lg:w-[935px]">
                  <CardContent className="text-white">
                    <AddressVerification
                      formik={formik}
                      onDocumentUpload={handleDocumentUpload}
                      hasSubmitted={hasSubmitted}
                    />
                  </CardContent>
                </Card>
              ),
            },
            {
              value: 'notify',
              label: 'Notify',
              content: (
                <Card className="bg-[#121212] border-[#121212] sm:w-full md:w-full lg:w-[935px]">
                  <CardContent className="text-white">
                    <Notify />
                  </CardContent>
                </Card>
              ),
            },
            {
              value: 'subscription',
              label: 'Subscription',
              content: <Subscription />,
            },
          ];

          const getTabButtonConfig = () => {
            const tabConfig = {
              profile: {
                cancelAction: () => router.back(),
                cancelText: 'Cancel',
                nextAction: () => handleTabUpdate(formik, 'profile', () => setActiveTab('sport')),
                nextText: 'Update Changes',
                isLoading: false,
              },
              sport: {
                cancelAction: () => setActiveTab('profile'),
                cancelText: 'Cancel',
                nextAction: () => handleTabUpdate(formik, 'sport', () => setActiveTab('address')),
                nextText: 'Update Changes',
                isLoading: false,
              },
              address: {
                cancelAction: () => setActiveTab('sport'),
                cancelText: 'Cancel',
                nextAction: () => handleTabUpdate(formik, 'address', () => setActiveTab('notify')),
                nextText: 'Update Changes',
                isLoading: false,
              },
              notify: {
                cancelAction: () => setActiveTab('address'),
                cancelText: 'Cancel',
                nextAction: () => handleTabUpdate(formik, 'address', () => formik.submitForm()),
                nextText: isUpdating ? 'Updating...' : 'Update Changes',
                isLoading: isUpdating,
              },
            };

            return tabConfig[activeTab as keyof typeof tabConfig];
          };

          const buttonConfig = getTabButtonConfig();
          const cancelButtonClass =
            'px-[14px] py-[12.5px] bg-[#121212] items-center font-satoshi-variable font-[700] text-[14px] text-white rounded-[4px] cursor-pointer hover:bg-[#1a1a1a] border border-[#E6E6E6] sm:w-full md:w-auto';
          const nextButtonClass =
            'px-[14px] py-[12.5px] bg-[#4EF162] items-center font-satoshi-variable font-[700] text-[14px] text-black rounded-[4px] cursor-pointer hover:bg-[#3DBF50] sm:w-full md:w-auto';

          return (
            <>
              <TabsMenu tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
              {buttonConfig && (
                <div className="flex justify-between sm:justify-end gap-4 mt-4 sm:w-full lg:w-[935px]">
                  <Button
                    type="button"
                    className={cancelButtonClass}
                    onClick={buttonConfig.cancelAction}
                  >
                    {buttonConfig.cancelText}
                  </Button>
                  <Button
                    type="button"
                    className={nextButtonClass}
                    onClick={buttonConfig.nextAction}
                    disabled={buttonConfig.isLoading}
                  >
                    {buttonConfig.nextText}
                  </Button>
                </div>
              )}
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default Profile;
