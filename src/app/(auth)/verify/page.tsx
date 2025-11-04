'use client';
import { VerifyOtpResponseDto } from '@/api/models/AuthResponseDto';
import { Routes } from '@/app/constants/routes';
import { InputOTPControlled } from '@/components/inputOTPForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{ otp?: string }>({});
  const otpInputRef = useRef<HTMLInputElement>(null);
  const [showLoading, setShowLoading] = useState(false);

  const {
    isLoading,
    error,
    mobileNumber,
    verifyOtp,
    sendOtp,
    canVerifyOtp,
    clearError,
    getTimeRemaining,
  } = useUser();

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const sessionMobile = sessionStorage.getItem('mobileNumber');
      console.log('[VerifyOTP] Mobile number from session storage:', sessionMobile);
    }
  }, [mobileNumber]);

  const [timer, setTimer] = useState(0);
  const [isResendEnabled, setResendEnabled] = useState(false);
  const [timerInitialized, setTimerInitialized] = useState(false);

  useEffect(() => {
    const initTimer = () => {
      const remaining = getTimeRemaining();
      if (remaining > 0 || timerInitialized) {
        setTimer(remaining);
        setResendEnabled(remaining <= 0);
        setTimerInitialized(true);
      } else {
        setTimeout(initTimer, 100);
      }
    };

    initTimer();
  }, [getTimeRemaining, timerInitialized]);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      const otpInput = document.querySelector('[data-input-otp-container] input');
      if (otpInput) {
        (otpInput as HTMLInputElement).focus();
      }
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [otp, error, clearError]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: { otp?: string } = {};
    if (!otp) newErrors.otp = 'Please Enter the OTP';
    else if (otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';
    setErrors(newErrors);

    if (otpInputRef.current) {
      otpInputRef.current.blur();
    }

    if (Object.keys(newErrors).length > 0) return;
    try {
      const result: VerifyOtpResponseDto = await verifyOtp(otp);
      toast.success(result.message || 'OTP verified successfully!');
      setShowLoading(true);
      setTimeout(() => {
        const fieldVerificationToken = sessionStorage.getItem('fieldVerificationToken');
        if (fieldVerificationToken) {
          sessionStorage.removeItem('fieldVerificationToken');
          router.replace(`/fieldVerification/${fieldVerificationToken}`);
          return;
        }
        
        if (!result.organizerId) {
          sessionStorage.setItem('mobileNumber', mobileNumber);
          router.replace(Routes.PROFILE);
        } else {
          router.replace(Routes.DASHBOARD);
        }
      }, 2000); // Show loading for 2 seconds
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      toast.error(err.message || 'Failed to verify OTP');
    }
  };

  const handleResendOTP = async () => {
    if (!isResendEnabled || !mobileNumber) return;

    const result = await sendOtp(mobileNumber);

    if (result.success) {
      toast.success('OTP resent successfully');

      const newTimer = result.retryAfter || 120;
      setTimer(newTimer);
      setResendEnabled(false);
    } else {
      toast.error('Failed to resend OTP');
    }
  };

  useEffect(() => {
    let interval: number | NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        const remaining = getTimeRemaining();
        setTimer(remaining);

        if (remaining <= 0) {
          setResendEnabled(true);
        }
      }, 1000);
    } else {
      setResendEnabled(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, getTimeRemaining]);

  return (
    <>
      {showLoading && <LoadingOverlay />}
      <Card className="max-w-lg w-full mx-auto rounded-[20px] bg-[#16171B] h-auto px-4 sm:px-8 md:px-10 lg:px-12 mb-6 md:mb-8 lg:mb-14 py-6 md:py-6">
        <CardHeader className="px-0">
          <CardTitle className="leading-[100%] mt-0 sm:mt-0 lg:mt-0 font-sansation-bold text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] text-left text-white">
            Verify OTP
          </CardTitle>
          <span className="font-satoshi-variable font-400 text-[14px] sm:text-[16px] lg:text-[18px] text-white mt-1 sm:mt-2">
            OTP Sent to your {mobileNumber}
          </span>
        </CardHeader>
        <CardContent className="px-0 pb-4 sm:pb-6 lg:pb-0">
          <form onSubmit={handleVerifyOtp}>
            <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="otp"
                  className="font-satoshi-variable font-400 text-[14px] sm:text-[16px] lg:text-18px text-white"
                >
                  Enter OTP
                </Label>
                <InputOTPControlled
                  value={otp}
                  onChange={setOtp}
                  isSuccess={false}
                  isError={!!error}
                  inputRef={otpInputRef as React.RefObject<HTMLInputElement>}
                />
                {errors.otp && <span className="text-red-500 text-xs">{errors.otp}</span>}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-[48px] sm:h-[52px] lg:h-[56px] cursor-pointer mt-3 sm:mt-4 hover:bg-[#3DBF50] bg-[#4EF162] font-satoshi-bold text-[14px] sm:text-[15px] lg:text-[16px] text-black"
              disabled={!canVerifyOtp(otp)}
            >
              {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
            </Button>
            <div className="text-center text-white font-satoshi-variable text-[12px] sm:text-[13px] lg:text-[14px] font-medium mt-2 mb-3 sm:mb-4">
              {isResendEnabled ? (
                <p className="text-white font-satoshi-variable text-[12px] sm:text-[13px] lg:text-[14px] font-medium">
                  Didn't receive the OTP?{' '}
                  <span
                    className="underline cursor-pointer text-[#4EF162] font-satoshi-variable font-bold text-[12px] sm:text-[13px] lg:text-[14px]"
                    onClick={handleResendOTP}
                  >
                    Resend
                  </span>
                </p>
              ) : (
                `Resend OTP available in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                  2,
                  '0'
                )}`
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
