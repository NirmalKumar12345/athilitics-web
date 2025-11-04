'use client';
import { Routes } from '@/app/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function Login() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ mobile?: string }>({});
  const [showLoading, setShowLoading] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('sessionExpired')) {
      toast.error('Session expired', { autoClose: 3500 });
      setTimeout(() => {
        localStorage.removeItem('sessionExpired');
      }, 500);
    }
  }, []);

  const {
    isLoading,
    error,
    isAuthenticated,
    mobileNumber,
    otpSent,
    sendOtp,
    updateMobileNumber,
    validateMobileNumber,
    canSendOtp,
    clearError,
  } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a field verification token stored
      const fieldVerificationToken = sessionStorage.getItem('fieldVerificationToken');
      if (fieldVerificationToken) {
        sessionStorage.removeItem('fieldVerificationToken');
        router.replace(`/fieldVerification/${fieldVerificationToken}`);
        return;
      }
      
      router.replace(Routes.DASHBOARD);
    }

    if (mobileNumber && otpSent) {
      updateMobileNumber(mobileNumber);
    }

    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        sessionStorage.setItem('otpSent', 'false');
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
    return undefined;
  }, [isAuthenticated, mobileNumber, otpSent, router]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const fieldVerificationToken = sessionStorage.getItem('fieldVerificationToken');
      if (fieldVerificationToken) {
        toast.info('Please login to access the field verification link');
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const focusInput = () => {
        if (mobileInputRef.current) {
          mobileInputRef.current.focus();
        }
      };

      focusInput();
      const focusTimeout = setTimeout(focusInput, 100);

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
        window.removeEventListener('focus', handleWindowFocus);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
    // If not in browser, do nothing
    return undefined;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const focusInput = () => {
        if (mobileInputRef.current) {
          mobileInputRef.current.focus();
        }
      };

      if (!isAuthenticated) {
        const focusTimeout = setTimeout(focusInput, 100);
        return () => clearTimeout(focusTimeout);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const focusInput = () => {
        if (mobileInputRef.current && !isAuthenticated) {
          mobileInputRef.current.focus();
        }
      };
      const raf = requestAnimationFrame(() => {
        setTimeout(focusInput, 150);
      });

      return () => cancelAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [mobileNumber, error, clearError]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateMobileNumber(mobileNumber);
    if (validationError) {
      setErrors({ mobile: validationError });
      return;
    }

    setErrors({});
    const result = await sendOtp(mobileNumber);
    if (result.success) {
      toast.success(result.message || 'OTP sent successfully!');
      setShowLoading(true);
      setTimeout(() => {
        router.push(Routes.VERIFY_OTP);
      }, 2000);
    } else {
      if (result.shouldRedirect) {
        toast.info(result.message || 'OTP already sent. Please wait before requesting a new one.');
        setShowLoading(true);
        setTimeout(() => {
          router.push(Routes.VERIFY_OTP);
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to send OTP');
      }
    }
  };

  return (
    <>
      {showLoading && <LoadingOverlay />}
      <Card className="w-full max-w-md rounded-[20px] bg-[#16171B] px-6 py-6 mb-6 md:mb-8 lg:mb-14">
        <CardHeader>
          <CardTitle className="leading-[100%] mt-2 font-sansation-bold text-[26px] text-left text-white">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="mobile"
                  className="font-satoshi-variable font-400 text-18px text-white"
                >
                  Phone Number
                </Label>
                <Input
                  ref={mobileInputRef}
                  id="mobile"
                  type="number"
                  isMobileNumber={true}
                  placeholder="Enter Phone"
                  className="h-[56px] w-full font-satoshi-variable font-400 text-[16px]"
                  required
                  value={mobileNumber}
                  onChange={(e) => updateMobileNumber(e.target.value)}
                  pattern="\d{10}"
                />
                {errors.mobile && <span className="text-red-500 text-xs">{errors.mobile}</span>}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-[56px] cursor-pointer mt-4 hover:bg-[#3DBF50] bg-[#4EF162] font-satoshi-bold text-[16px] text-black"
              disabled={!canSendOtp(mobileNumber) || isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
          <div className="flex mt-4 mb-4 justify-center text-center">
            <span className="text-white mr-1 font-satoshi-variable text-[14px] font-medium">
              Don’t have an account?
            </span>
            <Link
              className="text-[#4EF162] font-satoshi-variable font-bold text-[14px]"
              href="/register"
            >
              Signup
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
