'use client';
import { Organizer } from '@/api/models/Organizer';
import { RazorPayDto } from '@/api/models/RazorPayDto';
import PopupCard from '@/components/popupCard';
import AddressVerification from '@/components/registerUser/AddressVerification';
import BankDetails from '@/components/registerUser/BankDetails';
import PaymentAccount from '@/components/registerUser/PaymentAccount';
import ProfileDetails from '@/components/registerUser/ProfileDetails';
import SportsRoleDetails from '@/components/registerUser/SportsRoleDetails';
import { Button } from '@/components/ui/button';
import { useProgressContext } from '@/contexts/ProgressContext';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useRazorPay } from '@/hooks/useRazorPay';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Routes } from '../constants/routes';
import Notify from '../dashboard/profile/notify';
import { registerUserValidationSchema } from './validationSchemas';
// Combine Organizer and RazorPayDto fields for the form
type RegisterFormValues = Partial<Organizer> & Partial<RazorPayDto> & {
};

const RegisterUser = () => {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [organizationProfileKey, setOrganizationProfileKey] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // State for pending file uploads
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [pendingDocumentFile, setPendingDocumentFile] = useState<File | null>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ logo?: number; document?: number }>({});

  const {
    isLoading: isUpdating,
    updateOrganizerProfile,
    uploadImage,
    uploadDocument,
  } = useOrganizer(false);
  const { isLoading: isUpdatingRazorpay, createLinkedAccount } = useRazorPay();
  const {
    setFormikValues,
    setDynamicProgressValue,
    setUploadedImage: setContextUploadedImage,
  } = useProgressContext();

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (uploadedImage && uploadedImage.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const initialValues: RegisterFormValues = {
    // Organizer fields
    organization_name: '',
    organizer_name: '',
    mobile_number: '',
    organization_email: '',
    website_link: '',
    document_name: '',
    social_links: [],
    primary_sports: [],
    other_sports: [],
    organization_role: '',
    organization_experience: undefined,
    no_of_annual_events_hosted: undefined,
    venue: '',
    stateId: null,
    cityId: null,
    pin: '',
    document_url: undefined,
    organization_profile: undefined,
    // RazorPayDto fields
    name: 'New Account Info',
    email: '',
    phone: typeof window !== 'undefined' ? sessionStorage.getItem('mobileNumber') || '' : '',
    legal_business_name: '',
    business_type: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
    profile: {
      category: '',
      subcategory: '',
      description: '',
    },
    legal_info: {
      pan: '',
      gst: '',
    },
    bank_account: {
      name: '',
      ifsc: '',
      account_number: '',
      confirm_account_number: '',
    },
  };

  const handleUpdateOrganizer = async (values: RegisterFormValues) => {
    try {
      setIsUploadingFiles(true);

      // Step 1: Update organizer profile first (without file URLs)
      await updateOrganizerProfile({
        ...values,
        organization_profile: organizationProfileKey || undefined,
        document_url: values.document_url || undefined,
      });

      let logoKey = organizationProfileKey;
      let documentKey = values.document_url;

      // Step 2: Upload pending logo file if exists (now that organizer profile exists)
      if (pendingLogoFile) {
        setUploadProgress((prev) => ({ ...prev, logo: 0 }));
        try {
          const logoResult = await uploadImage(pendingLogoFile);
          logoKey = logoResult.key;
          setUploadProgress((prev) => ({ ...prev, logo: 100 }));
          setOrganizationProfileKey(logoKey);
          setPendingLogoFile(null); // Clear pending file after successful upload
        } catch (error) {
          setIsUploadingFiles(false);
          setUploadProgress({});
          toast.error('Failed to upload logo. Please try again.');
          throw error;
        }
      }

      // Step 3: Upload pending document file if exists (after logo upload)
      if (pendingDocumentFile) {
        setUploadProgress((prev) => ({ ...prev, document: 0 }));
        try {
          const documentResult = await uploadDocument(pendingDocumentFile);
          // Document upload returns different format than profile upload
          documentKey = documentResult.key || documentResult.data?.key || documentResult.url;
          setUploadProgress((prev) => ({ ...prev, document: 100 }));
          setPendingDocumentFile(null); // Clear pending file after successful upload
        } catch (error) {
          setIsUploadingFiles(false);
          setUploadProgress({});
          toast.error('Failed to upload document. Please try again.');
          throw error;
        }
      }

      // Step 4: Final update with file URLs if any files were uploaded
      if (
        (pendingLogoFile && logoKey !== organizationProfileKey) ||
        (pendingDocumentFile && documentKey !== values.document_url)
      ) {
        await updateOrganizerProfile({
          ...values,
          organization_profile: logoKey || undefined,
          document_url: documentKey || undefined,
        });
      }

      const isIndividual = values.business_type === 'individual';

      const legalInfo: any = {
        gst: values.legal_info?.gst || '',
      };

      if (!isIndividual) {
        legalInfo.pan = values.legal_info?.pan || '';
      }

      const razorPayDto: RazorPayDto = {
        name: values.name || '',
        email: values.email || '',
        phone: values.phone || '',
        legal_business_name: values.legal_business_name || '',
        business_type: values.business_type || '',
        address: {
          line1: values.address?.line1 || '',
          line2: values.address?.line2 || '',
          city: values.address?.city || '',
          state: values.address?.state || '',
          postal_code: values.address?.postal_code || '',
          country: values.address?.country || '',
        },
        profile: {
          category: values.profile?.category || '',
          subcategory: values.profile?.subcategory || '',
          description: values.profile?.description || '',
        },
        legal_info: legalInfo,
        bank_account: {
          name: values.bank_account?.name || '',
          ifsc: values.bank_account?.ifsc || '',
          account_number: values.bank_account?.account_number || '',
          confirm_account_number: values.bank_account?.confirm_account_number || '',
        },
      };

      try {
        await createLinkedAccount(razorPayDto);
        setIsUploadingFiles(false);
        setUploadProgress({});
        toast.success('Profile updated successfully!');
        setIsPopupVisible(true);
      } catch (error: any) {
        setIsUploadingFiles(false);
        setUploadProgress({});
        console.error('Razorpay account creation failed:', error);
        toast.error(error?.body?.message || 'Failed to create payment account. Please try again.');
        return;
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      setIsUploadingFiles(false);
      setUploadProgress({});
      toast.error(error?.body?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    router.push(Routes.DASHBOARD);
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) {
      setPendingLogoFile(null);
      setUploadedImage(null);
      setOrganizationProfileKey(null);
      sessionStorage.removeItem('uploadedLogo');
      window.dispatchEvent(new Event('uploadedLogoChanged'));
      return;
    }

    // Store file for deferred upload instead of uploading immediately
    setPendingLogoFile(file);
    // Create preview URL for immediate UI feedback
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);

    sessionStorage.setItem('uploadedLogo', previewUrl);
    window.dispatchEvent(new Event('uploadedLogoChanged'));
  };

  const handleRemoveLogo = () => {
    // Clean up object URL to prevent memory leaks
    if (uploadedImage && uploadedImage.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setOrganizationProfileKey(null);
    setPendingLogoFile(null);
    sessionStorage.removeItem('uploadedLogo');
    window.dispatchEvent(new Event('uploadedLogoChanged'));
  };

  const handleDocumentUpload = (file: File | null) => {
    setPendingDocumentFile(file);
  };

  const calculateProgress = (values: Partial<Organizer>): number => {
    const requiredFields = [
      values.organization_name,
      values.organizer_name,
      values.mobile_number,
      values.organization_email,
      Array.isArray(values.primary_sports) && values.primary_sports.length > 0,
      values.organization_role,
      values.venue,
      values.stateId,
      values.cityId,
      values.pin,
    ];

    const optionalFields = [
      values.website_link && values.website_link.trim() !== '',
      values.social_links?.length &&
      values.social_links.length > 0 &&
      values.social_links.some((link) => link.trim() !== ''),
      Array.isArray(values.other_sports) && values.other_sports.length > 0,
      values.organization_experience,
      values.no_of_annual_events_hosted,
    ];

    let filledRequired = requiredFields.filter((field) => {
      if (typeof field === 'boolean') return field;
      if (typeof field === 'string') return field.trim() !== '';
      return field !== null && field !== undefined;
    }).length;

    let filledOptional = optionalFields.filter((field) => {
      if (typeof field === 'boolean') return field;
      if (typeof field === 'string') return field.trim() !== '';
      return field !== null && field !== undefined && field !== 0;
    }).length;

    let uploadedFiles = 0;
    if (pendingLogoFile || uploadedImage) uploadedFiles += 1;
    if (pendingDocumentFile || values.document_url) uploadedFiles += 1;

    const totalRequired = requiredFields.length;
    const totalOptional = optionalFields.length;
    const totalFiles = 2;

    const totalPossible = totalRequired + totalOptional + totalFiles;
    const totalFilled = filledRequired + filledOptional + uploadedFiles;

    return Math.min(100, Math.round((totalFilled / totalPossible) * 100));
  };

  return (
    <div className="w-full h-screen">
      <Formik
        initialValues={initialValues}
        validationSchema={registerUserValidationSchema}
        onSubmit={handleUpdateOrganizer}
        enableReinitialize
      >
        {(formik: FormikProps<RegisterFormValues>) => {
          const dynamicProgressValue = calculateProgress(formik.values);

          // Update context whenever formik values change
          useEffect(() => {
            setFormikValues(formik.values);
            setDynamicProgressValue(dynamicProgressValue);
            setContextUploadedImage(uploadedImage);
          }, [formik.values, dynamicProgressValue, uploadedImage]);

          useEffect(() => {
            const storedOrgName = localStorage.getItem('organizerName') || '';
            const storedMobile = sessionStorage.getItem('mobileNumber');
            const localMobile = localStorage.getItem('organizerMobile') || '';
            const localEmail = localStorage.getItem('organizerEmail') || '';

            formik.setValues({
              ...formik.values,
              organization_name: storedOrgName,
              mobile_number: localMobile || storedMobile || '',
              organization_email: localEmail,
            });
          }, []);

          const handleFormSubmit = async (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            setHasSubmitted(true);
            function getFirstErrorField(errors: any, prefix = ''): string | null {
              for (const key in errors) {
                if (typeof errors[key] === 'string') {
                  return prefix ? `${prefix}.${key}` : key;
                } else if (typeof errors[key] === 'object' && errors[key] !== null) {
                  const nested = getFirstErrorField(errors[key], prefix ? `${prefix}.${key}` : key);
                  if (nested) return nested;
                }
              }
              return null;
            }
            try {
              await formik.validateForm();
              if (formik.isValid) {
                formik.handleSubmit();
              } else {
                const firstErrorField = getFirstErrorField(formik.errors);
                if (firstErrorField) {
                  const el = document.getElementById(firstErrorField);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            } catch (error) {
              console.error('Form validation error:', error);
            }
          };

          return (
            <>
              <div
                style={{
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                className="w-full bg-[#16171B] min-h-screen px-4 sm:px-8 py-4 sm:py-5 relative flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col space-y-4 sm:space-y-6 lg:space-y-8">
                  <ProfileDetails
                    formik={formik}
                    showWelcome={true}
                    uploadedImage={uploadedImage}
                    pendingLogoFile={pendingLogoFile}
                    onImageUpload={handleFileUpload}
                    onImageRemove={handleRemoveLogo}
                    hasSubmitted={hasSubmitted}
                  />

                  <SportsRoleDetails formik={formik} hasSubmitted={hasSubmitted} />

                  <AddressVerification
                    formik={formik}
                    onDocumentUpload={handleDocumentUpload}
                    pendingDocumentFile={pendingDocumentFile}
                    hasSubmitted={hasSubmitted}
                  />
                  <PaymentAccount formik={formik} hasSubmitted={hasSubmitted} />
                  <BankDetails formik={formik} hasSubmitted={hasSubmitted} />
                  <Notify isRegistrationMode={true} />

                  <div className="flex justify-center sm:justify-end w-full pt-6 sm:pt-8 lg:pt-10">
                    <Button
                      type="submit"
                      onClick={handleFormSubmit}
                      className="py-[14px] bg-[#4EF162] hover:bg-[#3DD450] active:bg-[#4EF162] flex justify-center items-center font-tt-norms-pro-medium text-[14px] text-black rounded-[84px] w-[120px] sm:w-[149px] h-[38px] cursor-pointer transition-colors duration-200"
                      disabled={isUpdating || isUpdatingRazorpay}
                    >
                      {isUpdating || isUpdatingRazorpay ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </div>
              </div>

              {isPopupVisible && (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-[#000000B2] z-50"
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  <PopupCard onClose={handleClosePopup} />
                </div>
              )}
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default RegisterUser;
