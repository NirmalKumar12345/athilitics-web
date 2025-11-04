'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import * as React from 'react';

export function InputOTPControlled({
  value,
  onChange,
  isSuccess,
  isError,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  isSuccess?: boolean;
  isError?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}) {
  const otpRef = inputRef || React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (otpRef && 'current' in otpRef && otpRef.current) {
      otpRef.current.focus();
    }
  }, []);

  const getBorderColor = (index: number) => {
    if (isSuccess) return 'border-green-500';
    if (isError) return 'border-red-500';
    return '';
  };

  return (
    <div className="space-y-2">
      <InputOTP ref={otpRef} maxLength={6} value={value} onChange={onChange}>
        <InputOTPGroup>
          {[...Array(6)].map((_, index) => (
            <React.Fragment key={index}>
              <InputOTPSlot index={index} className={getBorderColor(index)} />
              {index === 2 && <InputOTPSeparator />}
            </React.Fragment>
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
