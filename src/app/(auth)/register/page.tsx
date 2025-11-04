'use client';
import { MOBILE_REGEX } from '@/app/constants/regex';
import { Routes } from '@/app/constants/routes';
import { termsAndConditionForSignup } from '@/app/constants/terms&condition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { CustomDialog } from '@/components/ui/custom_dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function User() {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const isMobileValid = useMemo(() => MOBILE_REGEX.test(mobile), [mobile]);
  const router = useRouter();

  const { isLoading, error, signUp, updateMobileNumber, validateMobileNumber, clearError } =
    useUser();
  useEffect(() => {
    const storedMobile = sessionStorage.getItem('mobileNumber');
    if (storedMobile) {
      setMobile(storedMobile);
      updateMobileNumber(storedMobile);
    }
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [mobile, name, error, clearError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateMobileNumber(mobile);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter organizer name');
      return;
    }
    updateMobileNumber(mobile);
    if (name) {
      localStorage.setItem('organizerName', name);
    }

    const result = await signUp({ mobileNumber: mobile });

    if (result.success) {
      toast.success(result.message || 'Organizer created successfully');
      setShowLoading(true);
      setTimeout(() => {
        router.replace(Routes.VERIFY_OTP);
      }, 2000);
    } else {
      if (result.shouldRedirect) {
        toast.info(result.message || 'OTP already sent. Please wait before requesting a new one.');
        setShowLoading(true);
        setTimeout(() => {
          router.replace(Routes.VERIFY_OTP);
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to Sign Up');
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const focusInput = () => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      };

      focusInput();
      const focusTimeout = setTimeout(focusInput, 100);

      const raf = requestAnimationFrame(() => {
        setTimeout(focusInput, 150);
      });

      const handleWindowFocus = () => {
        focusInput();
      };

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setTimeout(focusInput, 50);
        }
      };

      window.addEventListener('focus', handleWindowFocus);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearTimeout(focusTimeout);
        cancelAnimationFrame(raf);
        window.removeEventListener('focus', handleWindowFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    // If not in browser, do nothing
    return undefined;
  }, []);

  return (
    <>
      {(isLoading || showLoading) && <LoadingOverlay />}
      <Card className="w-full max-w-[95vw] md:max-w-[500px] lg:min-w-md rounded-[20px] bg-[#16171B] px-6 md:px-6 py-6 md:py-6 mb-6 md:mb-8 lg:mb-14 mx-auto">
        <CardTitle className="leading-[100%] mt-2 font-sansation-bold text-[22px] md:text-[24px] lg:text-[26px] ml-2 md:ml-[22px] text-white">
          Join Athlitics Now
        </CardTitle>
        <CardContent className="max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide w-full md:w-[410px] lg:w-[490px] mx-auto px-0 md:px-0 lg:px-3">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="font-satoshi-variable text-[14px] text-white">
                  Organizer Name / Club Name
                </Label>
                <Input
                  ref={nameInputRef}
                  showFocusBorder={false}
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  className="h-[48px] md:h-[52px] lg:h-[56px] w-full md:w-[350px] lg:w-[410px] font-satoshi-variable text-[15px] md:text-[16px]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile" className="font-satoshi-variable text-[14px] text-white">
                  Phone Number
                </Label>
                <Input
                  id="mobile"
                  type="number"
                  showFocusBorder={false}
                  isMobileNumber={true}
                  placeholder="Enter Phone"
                  className="h-[48px] md:h-[52px] lg:h-[56px] w-full md:w-[350px] lg:w-[410px] font-satoshi-variable text-[15px] md:text-[16px]"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  pattern="\d{10}"
                />
              </div>
            </div>

            <div className="mt-4 mb-2">
              <p className="text-white font-satoshi-variable text-[12.5px] text">
                By signing up as an Organiser on Athlitics.com, you agree to the following
              </p>
              <div className=" mt-1">
                <CustomDialog
                  height="auto"
                  triggerLabel={
                    <span
                      className="text-white underline cursor-pointer hover:text-gray-300 font-sansation-variable text-[14px]"
                      onClick={() => setTermsDialogOpen(true)}
                    >
                      terms and conditions
                    </span>
                  }
                  title={termsAndConditionForSignup.title}
                  showFooter={false}
                  open={termsDialogOpen}
                  onOpenChange={setTermsDialogOpen}
                >
                  <div className="flex flex-col gap-6 py-8 h-full max-h-[500px] overflow-y-auto">
                    <div className="flex flex-col items-center gap-4">
                      <Image
                        src="/images/athliticsLogo.svg"
                        alt="Athletics Logo"
                        width={80}
                        height={80}
                      />
                      <div className="text-center">
                        <h2 className="text-white text-xl font-bold mb-2 text-center">
                          {termsAndConditionForSignup.subtitle}
                        </h2>
                        <p className="text-white text-sm mb-4 text-center">
                          {termsAndConditionForSignup.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 px-4">
                      {termsAndConditionForSignup.content.map((item: any, index: any) => (
                        <p
                          key={index}
                          className="text-white text-sm leading-relaxed whitespace-pre-line"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <Button
                        className="px-8 py-2 bg-[#4EF162] text-black font-medium rounded-[4px] hover:bg-[#3DBF50] cursor-pointer"
                        onClick={() => setTermsDialogOpen(false)}
                        type="button"
                      >
                        Agree
                      </Button>
                    </div>
                  </div>
                </CustomDialog>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full md:w-[350px] lg:w-[410px] !h-[48px] md:!h-[52px] lg:!h-[56px] cursor-pointer mt-2 hover:bg-[#3DBF50] bg-[#4EF162] font-satoshi-bold font-bold text-[15px] md:text-[16px] text-black"
              disabled={!name || !mobile || !isMobileValid || isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <div>
              <p className="text-white font-satoshi-variable text-[14px] mt-4 mb-4">
                Already have an account?{' '}
                <Link href="/login" className="text-[#4EF162] cursor-pointer hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
