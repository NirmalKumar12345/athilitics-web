'use client';

import { RazorPayDto } from '@/api/models/RazorPayDto';
import BankDetails from '@/components/registerUser/BankDetails';
import PaymentAccount from '@/components/registerUser/PaymentAccount';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useRazorPay } from '@/hooks/useRazorPay';
import { FormikProps, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AccountInfoValidationSchema } from './validationSchema';

export default function AccountInfoPage() {
  const {
    getLinkedAccountDetails,
    createLinkedAccount,
    updateLinkedAccount,
    isLoading,
    getBusinessCategories,
    getBusinessSubcategories,
  } = useRazorPay();
  const router = useRouter();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { organizer } = useOrganizer(true);
  const [initialValues, setInitialValues] = useState<Partial<RazorPayDto>>({
    name: 'New Account info',
    email: '',
    phone: organizer?.mobile_number || '',
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
  });
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      setShowLoading(true);
      try {
        const res = await getLinkedAccountDetails();
        if (res && res.success && res.data) {
          setIsEditMode(true);
          setAccountData(res.data);


          await getBusinessCategories(true);

          if (res.data.profile?.category) {
            await getBusinessSubcategories(res.data.profile.category, true);
          }

          const newInitialValues = {
            name: 'New Account info',
            email: res.data.email || '',
            phone: res.data.phone || '',
            legal_business_name: res.data.legal_business_name || '',
            business_type: res.data.business_type || '',
            address: {
              line1: res.data.address?.line1 || '',
              line2: res.data.address?.line2 || '',
              city: res.data.address?.city || '',
              state: res.data.address?.state || '',
              postal_code: res.data.address?.postal_code || '',
              country: res.data.address?.country || 'IN',
            },
            profile: {
              category: res.data.profile?.category || '',
              subcategory: res.data.profile?.subcategory || '',
              description: res.data.profile?.description || '',
            },
            legal_info: {
              pan: res.data.legal_info?.pan || '',
              gst: res.data.legal_info?.gst || '',
            },
            bank_account: {
              name: res.data.bank_account?.name || '',
              ifsc: res.data.bank_account?.ifsc || '',
              account_number: res.data.bank_account?.account_number || '',
              confirm_account_number: res.data.bank_account?.confirm_account_number || '',
            },
          };

          setInitialValues(newInitialValues);
        } else {
          setIsEditMode(false);
          setAccountData(null);
          await getBusinessCategories(true);
        }
      } finally {
        setTimeout(() => {
          setShowLoading(false);
        }, 2000);
      }
    })();
  }, []);

  const formik = useFormik<Partial<RazorPayDto>>({
    enableReinitialize: true,
    initialValues,
    validationSchema: AccountInfoValidationSchema,
    onSubmit: async (values) => {
      setHasSubmitted(true);
      setShowLoading(true);
      try {
        const isIndividual = values.business_type === 'individual';

        const legalInfo: any = {
          gst: values.legal_info?.gst || '',
        };

        if (!isIndividual) {
          legalInfo.pan = values.legal_info?.pan || '';
        }

        const payload: RazorPayDto = {
          name: 'New Account info',
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
            country: values.address?.country || 'IN',
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
        let response;
        if (isEditMode) {
          response = await updateLinkedAccount(payload);
        } else {
          response = await createLinkedAccount(payload);
        }
        toast.success(isEditMode ? 'Account details updated successfully!' : 'Account created successfully!');
      } catch (err: any) {
        toast.error(err?.body?.message || 'An error occurred. Please try again.');
      } finally {
        setTimeout(() => {
          setShowLoading(false);
          router.push('/dashboard/profile');
        }, 2000);
      }
    },
  });



  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSubmitted(true);
    formik.setTouched(
      Object.keys(formik.initialValues).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as any),
      true
    );

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
    <div className="min-h-screen w-screen bg-[#16171B]">
      {showLoading && <LoadingOverlay />}
      <div
        className="px-2 sm:px-4 md:px-8 lg:px-12 xl:px-24 2xl:px-[150px] flex-1 w-full flex flex-col items-center justify-center gap-4 py-4 sm:py-8 md:py-[20px] mt-25 sm:mt-8 md:mt-[110px]"
      >
        <form
          onSubmit={handleFormSubmit}
          className="w-full flex flex-col items-center"
        >
          <Card
            className="h-auto bg-[#121212] px-4 py-4 sm:px-8 sm:py-8 md:px-[53px] md:py-[25px] rounded-2 w-auto"
          >
            <PaymentAccount
              formik={formik as FormikProps<Partial<RazorPayDto>>}
              hasSubmitted={hasSubmitted}
            />
            <BankDetails
              formik={formik as FormikProps<Partial<RazorPayDto>>}
              hasSubmitted={hasSubmitted}
            />
          </Card>
          <Button
            type="submit"
            className="w-full max-w-[149px] h-[40px] mt-5 flex bg-[#4EF162] justify-center items-center font-tt-norms-pro-medium text-[14px] rounded-[84px] hover:bg-[#3DDC5A] cursor-pointer text-black"
            disabled={isLoading}
          >
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}
