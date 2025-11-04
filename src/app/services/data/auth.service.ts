
import { OtpResponseDto, VerifyOtpResponseDto } from '@/api/models/AuthResponseDto';
import { Endpoints } from '@/app/constants/Endpoints';
import { AuthenticateRequestParams } from '@/app/types/auth';
import { getHttpClient } from '@/app/utils/axiosClient';

export const sendOtp = (request: AuthenticateRequestParams): Promise<OtpResponseDto> => {
  return getHttpClient(Endpoints.auth.SEND_OTP, 'POST', request);
};
export const verifyOtp = (request: AuthenticateRequestParams): Promise<VerifyOtpResponseDto> => {
  return getHttpClient(Endpoints.auth.VERIFY_OTP, 'POST', request);
};

export const signUp = (request: AuthenticateRequestParams): Promise<OtpResponseDto> => {
  return getHttpClient(Endpoints.auth.SIGN_UP, 'POST', request);
};
