const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || `${window.location.protocol}//${window.location.host}/api`;

export const Endpoints = {
  auth: {
    SEND_OTP: NEXT_PUBLIC_API_URL + '/auth/send-otp',
    VERIFY_OTP: NEXT_PUBLIC_API_URL + '/auth/verify-otp',
    SIGN_UP: NEXT_PUBLIC_API_URL + '/auth/sign-up',
  },
};
