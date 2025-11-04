import { OtpResponseDto, VerifyOtpResponseDto } from '@/api/models/AuthResponseDto';
import { sendOtp, signUp, verifyOtp } from '@/app/services/data/auth.service';
import { AuthenticateRequestParams } from '@/app/types/auth';
import { StorageService } from '@/app/utils/storageService';
import { create } from 'zustand';

interface User {
  id?: number;
  name?: string;
  mobileNumber?: string;
  // Add other user properties as needed
}

interface UserStore {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // OTP flow state
  mobileNumber: string;
  otpSent: boolean;
  retryAfter: number; // Timer in seconds for OTP retry
  retryTimestamp: number | null; // Timestamp when retry timer was set

  // Actions
  sendOtp: (mobileNumber: string) => Promise<OtpResponseDto>;
  verifyOtp: (otp: string) => Promise<VerifyOtpResponseDto>;
  signUpUser: (params: AuthenticateRequestParams) => Promise<OtpResponseDto>;
  setMobileNumber: (mobile: string) => void;
  setOtpSent: (sent: boolean) => void;
  setRetryAfter: (seconds: number) => void;
  restoreRetryTimer: (retryAfter: number, timestamp: number) => void;
  getTimeRemaining: () => number;
  clearOtpFlow: () => void;
  logout: () => void;
  checkAuthentication: () => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Helper function to handle OTP already sent exception
const handleOtpAlreadySentException = (
  error: any,
  mobileNumber: string,
  errorMessage: string,
  errorType: string,
  setMobileNumber: (mobile: string) => void,
  setOtpSent: (sent: boolean) => void,
  setRetryAfter: (seconds: number) => void
) => {
  // Still set the mobile number and OTP sent state for navigation
  setMobileNumber(mobileNumber);
  setOtpSent(true);

  // Handle retryAfter timer
  const retryAfterSeconds = error?.response?.data?.retryAfter;
  if (retryAfterSeconds && typeof retryAfterSeconds === 'number') {
    setRetryAfter(retryAfterSeconds);
  }

  // Store in session storage for persistence
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('mobileNumber', mobileNumber);
    sessionStorage.setItem('otpSent', 'true');
  }

  return {
    success: false,
    error: errorType || 'OtpAlreadySentException',
    message: errorMessage,
    shouldRedirect: true, // Flag to indicate should redirect to verify page
    retryAfter: retryAfterSeconds,
  };
};

const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  mobileNumber: '',
  otpSent: false,
  retryAfter: 0,
  retryTimestamp: null,

  // Actions
  sendOtp: async (mobileNumber: string): Promise<OtpResponseDto> => {
    const { setLoading, setError, setMobileNumber, setOtpSent } = get();

    setLoading(true);
    setError(null);

    try {
      const response = await sendOtp({ mobileNumber });

      // Store mobile number in both store and session storage
      setMobileNumber(mobileNumber);
      setOtpSent(true);

      // Handle retryAfter timer if provided in successful response
      const retryAfterSeconds = response?.retryAfter;
      if (retryAfterSeconds && typeof retryAfterSeconds === 'number') {
        get().setRetryAfter(retryAfterSeconds);
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mobileNumber', mobileNumber);
        sessionStorage.setItem('otpSent', 'true');
      }

      setLoading(false);

      return {
        success: true,
        message: response.message || 'OTP sent successfully!',
        retryAfter: retryAfterSeconds,
      };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
      const errorType = error?.response?.data?.error;

      setError(errorMessage);
      setLoading(false);

      // Special handling for OtpAlreadySentException
      if (errorType === 'OtpAlreadySentException') {
        const { setMobileNumber, setOtpSent, setRetryAfter } = get();
        return handleOtpAlreadySentException(
          error,
          mobileNumber,
          errorMessage,
          errorType,
          setMobileNumber,
          setOtpSent,
          setRetryAfter
        );
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  verifyOtp: async (otp: string): Promise<VerifyOtpResponseDto> => {
    const { mobileNumber, setLoading } = get();

    console.log('[UserService] verifyOtp called with:', { otp, mobileNumber });

    if (!mobileNumber) {
      console.log('[UserService] No mobile number found in store, checking session storage...');

      // Try to get mobile number from session storage
      let sessionMobile = '';
      if (typeof window !== 'undefined') {
        sessionMobile = sessionStorage.getItem('mobileNumber') || '';
        console.log('[UserService] Mobile from session storage:', sessionMobile);
      }
      if (!sessionMobile) {
        throw new Error('Mobile number not found');
      }

      // Update store with session mobile number
      set({ mobileNumber: sessionMobile });
      console.log('[UserService] Updated store with session mobile number:', sessionMobile);
    }

    setLoading(true);

    try {
      const currentMobile = get().mobileNumber;

      const response = await verifyOtp({ mobileNumber: currentMobile, otp });

      // Store auth token
      if (response.token) {
        StorageService.authToken.setValue(response.token);
      }
      set({ isAuthenticated: true });

      get().clearOtpFlow();
      setLoading(false);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to verify OTP';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  },

  signUpUser: async (params: AuthenticateRequestParams): Promise<OtpResponseDto> => {
    const { setLoading, setError, setMobileNumber, setOtpSent } = get();
    setLoading(true);
    setError(null);
    try {
      const response = await signUp(params);
      if (params.mobileNumber) {
        setMobileNumber(params.mobileNumber);
        setOtpSent(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('mobileNumber', params.mobileNumber);
          sessionStorage.setItem('otpSent', 'true');
        }
      }
      setLoading(false);
      return {
        success: true,
        message: response.message || 'Account created successfully!',
      };
    } catch (error: any) {
      const errorMessage = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message || 'Failed to create account';
      const errorType = error?.response?.data?.error;

      setError(errorMessage);
      setLoading(false);

      if (errorType === 'OtpAlreadySentException') {
        const { setMobileNumber, setOtpSent, setRetryAfter } = get();
        return handleOtpAlreadySentException(
          error,
          params.mobileNumber || '',
          errorMessage,
          errorType,
          setMobileNumber,
          setOtpSent,
          setRetryAfter
        );
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  setMobileNumber: (mobile: string) => {
    console.log('[UserService] setMobileNumber called with:', mobile);
    set({ mobileNumber: mobile });

    // Also save to session storage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mobileNumber', mobile);
    }
  },

  setOtpSent: (sent: boolean) => {
    set({ otpSent: sent });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('otpSent', sent.toString());
    }
  },

  setRetryAfter: (seconds: number) => {
    const timestamp = Date.now();
    set({ retryAfter: seconds, retryTimestamp: timestamp });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('retryAfter', seconds.toString());
      sessionStorage.setItem('retryTimestamp', timestamp.toString());
    }
  },

  restoreRetryTimer: (retryAfter: number, timestamp: number) => {
    // Direct restore without creating new timestamp
    set({ retryAfter, retryTimestamp: timestamp });
  },

  getTimeRemaining: () => {
    const { retryAfter, retryTimestamp } = get();
    if (!retryTimestamp || retryAfter <= 0) {
      return 0;
    }
    const elapsed = Math.floor((Date.now() - retryTimestamp) / 1000);
    const remaining = Math.max(0, retryAfter - elapsed);

    return remaining;
  },

  clearOtpFlow: () => {
    set({ mobileNumber: '', otpSent: false, retryAfter: 0, retryTimestamp: null });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mobileNumber');
      sessionStorage.removeItem('otpSent');
      sessionStorage.removeItem('retryAfter');
      sessionStorage.removeItem('retryTimestamp');
    }
  },

  logout: () => {
    // Clear all user data and tokens
    set({
      user: null,
      isAuthenticated: false,
      mobileNumber: '',
      otpSent: false,
      error: null,
    });

    // Clear storage
    StorageService.clearAll?.();

    // Clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  },

  checkAuthentication: () => {
    const token = StorageService.authToken.getValue();
    const isAuth = !!token;

    set({ isAuthenticated: isAuth });
    return isAuth;
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));

export default useUserStore;

// Export service object for direct access to actions
export const userService = {
  sendOtp: (mobile: string) => useUserStore.getState().sendOtp(mobile),
  verifyOtp: (otp: string) => useUserStore.getState().verifyOtp(otp),
  signUp: (params: AuthenticateRequestParams) => useUserStore.getState().signUpUser(params),
  logout: () => useUserStore.getState().logout(),
  checkAuth: () => useUserStore.getState().checkAuthentication(),
  getCurrentUser: () => useUserStore.getState().user,
  isAuthenticated: () => useUserStore.getState().isAuthenticated,
};
