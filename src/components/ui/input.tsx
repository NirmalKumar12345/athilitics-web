import { cn } from '@/lib/utils';
import * as React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    isMobileNumber?: boolean;
    showBorder?: boolean;
    showFocusBorder?: boolean;
    leftIcon?: React.ReactNode;
  }
>(
  (
    {
      className,
      type,
      disabled,
      isMobileNumber,
      showBorder = true,
      showFocusBorder = true,
      leftIcon = false,
      ...props
    },
    ref
  ) => {
    const [error, setError] = React.useState<string | null>(null);
    const [value, setValue] = React.useState<string>(isMobileNumber ? '+91' : '');

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const value = input.value;

      if (isMobileNumber && type === 'number') {
        const userInput = value.replace('+91', '');
        const indianMobileRegex = /^[6-9]\d{0,9}$/;

        if (!indianMobileRegex.test(userInput)) {
          setError('Please enter a valid mobile number.');
        } else {
          setError(null);
        }

        if (userInput.length > 10) {
          input.value = userInput.slice(0, 10);
        }
        setValue(`+91${userInput}`);
      } else if (type === 'number') {
        if (value.length > 10) {
          input.value = value.slice(0, 10);
        }
        setValue(value);
        setError(null);
      } else if (type === 'text') {
        setValue(value);
        setError(null);
      } else if (type === 'email') {
        setValue(value);
        setError(null);
      }
    };
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </span>
          )}
          {isMobileNumber && (
            <div className="absolute left-4 flex items-center gap-1">
              <img
                src="https://flagcdn.com/w20/in.png"
                alt="India Flag"
                className="w-5 h-4 object-cover"
              />
              <span className="text-white text-sm">+91</span>
            </div>
          )}
          <input
            ref={ref}
            type={type}
            data-slot="input"
            className={cn(
              'file:font-satoshi-variable placeholder:text-[16px] placeholder:text-[#F5F5F585] placeholder:font-satoshi-light selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md bg-black px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              showFocusBorder
                ? 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
                : '',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              className,
              error ? 'border-destructive' : '',
              isMobileNumber ? 'pl-20' : '',
              leftIcon ? 'pl-10' : '',
              disabled ? 'text-gray-50' : 'text-white',
              'text-[18px]',
              showBorder ? 'border border-[#3C3B3B]' : ''
            )}
            value={value}
            onInput={handleInput}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
