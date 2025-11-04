'use client';
import { VerifyOtpResponseDto } from '@/api/models/AuthResponseDto';
import { AuthenticateRequestParams } from '@/app/types/auth';
import useUserStore, { userService } from '@/services/userService';
import { useEffect } from 'react';

/**
 * Custom hook for user authentication and management
 * Provides a clean interface for components to interact with user state
 */
export const useUser = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    mobileNumber,
    otpSent,
    retryAfter,
    retryTimestamp,
    sendOtp,
    verifyOtp,
    signUpUser,
    setMobileNumber,
    setOtpSent,
    setRetryAfter,
    restoreRetryTimer,
    getTimeRemaining,
    clearOtpFlow,
    logout,
    checkAuthentication,
    setError,
  } = useUserStore();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthentication();

    // Restore OTP flow state from session storage
    if (typeof window !== 'undefined') {
      const storedMobile = sessionStorage.getItem('mobileNumber');
      const storedOtpSent = sessionStorage.getItem('otpSent');
      const storedRetryAfter = sessionStorage.getItem('retryAfter');
      const storedRetryTimestamp = sessionStorage.getItem('retryTimestamp');

      console.log('[useUser] Restoring from session storage:', {
        storedMobile,
        storedOtpSent,
        storedRetryAfter,
        storedRetryTimestamp,
      });

      // Always restore mobile number if it exists in session storage
      if (storedMobile) {
        console.log('[useUser] Restoring mobile number:', storedMobile);
        setMobileNumber(storedMobile);
      }

      // Restore OTP sent state
      if (storedOtpSent === 'true') {
        console.log('[useUser] Restoring OTP sent state');
        setOtpSent(true);
      }

      // Restore retry timer if it's still valid
      if (storedRetryAfter && storedRetryTimestamp) {
        const retryAfterNum = parseInt(storedRetryAfter);
        const timestampNum = parseInt(storedRetryTimestamp);

        console.log('[useUser] Found timer in session storage:', {
          storedRetryAfter,
          storedRetryTimestamp,
          retryAfterNum,
          timestampNum,
          isValidRetry: !isNaN(retryAfterNum),
          isValidTimestamp: !isNaN(timestampNum),
        });

        if (!isNaN(retryAfterNum) && !isNaN(timestampNum)) {
          // Restore the original timer values
          restoreRetryTimer(retryAfterNum, timestampNum);
          console.log('[useUser] Timer restored successfully');
        } else {
          console.log('[useUser] Invalid timer data in session storage');
        }
      } else {
        console.log('[useUser] No timer data found in session storage:', {
          hasRetryAfter: !!storedRetryAfter,
          hasTimestamp: !!storedRetryTimestamp,
        });
      }
    }
  }, [checkAuthentication, setMobileNumber, setOtpSent, restoreRetryTimer]);

  // Authentication methods
  const handleSendOtp = async (mobile: string) => {
    return await sendOtp(mobile);
  };

  const handleVerifyOtp = async (otp: string): Promise<VerifyOtpResponseDto> => {
    return await verifyOtp(otp);
  };

  const handleSignUp = async (params: AuthenticateRequestParams) => {
    return await signUpUser(params);
  };

  const handleLogout = () => {
    logout();
  };

  const handleClearError = () => {
    setError(null);
  };

  // OTP flow management
  const handleClearOtpFlow = () => {
    clearOtpFlow();
  };

  const handleUpdateMobileNumber = (mobile: string) => {
    setMobileNumber(mobile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobileNumber', mobile);
    }
  };

  // Utility methods
  const isValidMobile = (mobile: string) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const validateMobileNumber = (mobile: string): string | null => {
    if (!mobile) return 'Please Enter Your Mobile Number';
    if (mobile.length !== 10) return 'Mobile number must be 10 digits';
    if (!isValidMobile(mobile)) return 'Please enter a valid mobile number';
    return null;
  };

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    mobileNumber,
    otpSent,

    // Timer state
    retryAfter,
    retryTimestamp,
    getTimeRemaining,

    // Actions
    sendOtp: handleSendOtp,
    verifyOtp: handleVerifyOtp,
    signUp: handleSignUp,
    logout: handleLogout,
    clearError: handleClearError,

    // OTP flow management
    clearOtpFlow: handleClearOtpFlow,
    updateMobileNumber: handleUpdateMobileNumber,

    // Utilities
    isValidMobile,
    validateMobileNumber,

    // Computed values
    hasUser: !!user,
    canSendOtp: (mobile: string) => isValidMobile(mobile) && !isLoading,
    canVerifyOtp: (otp: string) => otp.length === 6 && !isLoading, // Assuming 6-digit OTP
  };
};

/**
 * Hook to access user state without automatic initialization
 * Useful when you just need to read the current state
 */
const useUserState = () => {
  const { user, isLoading, error, isAuthenticated, mobileNumber, otpSent } = useUserStore();

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    mobileNumber,
    otpSent,
    hasUser: !!user,
  };
};

/**
 * Hook for user actions without state subscription
 * Useful for components that only need to trigger actions
 */
const useUserActions = () => {
  return {
    sendOtp: userService.sendOtp,
    logout: userService.logout,
    checkAuth: userService.checkAuth,
    getCurrentUser: userService.getCurrentUser,
    isAuthenticated: userService.isAuthenticated,
  };
};
