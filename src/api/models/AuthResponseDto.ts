export interface VerifyOtpResponseDto {
  message: string;
  token: string;
  organizerId: number | null;
}

export interface OtpResponseDto {
  success: boolean;
  message?: string;
  error?: string;
  shouldRedirect?: boolean;
  retryAfter?: number;
}
