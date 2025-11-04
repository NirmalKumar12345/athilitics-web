# Athletics Web Developer Guidelines

## 📁 Folder Structure

This Next.js 15 project follows a feature-based architecture with clear separation of concerns:

```
src/
├── api/                    # Auto-generated API client (OpenAPI)
│   ├── core/              # API core configurations
│   ├── models/            # TypeScript type definitions
│   └── services/          # API service classes
├─  // Actions
  sendOtp: (mobileNumber: string) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    shouldRedirect?: boolean; // For special error handling
  }>;
  verifyOtp: (otp: string) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;              # Next.js App Router structure
│   ├── (auth)/           # Route groups for authentication
│   ├── api/              # API routes (server-side)
│   ├── constants/        # App-level constants
│   ├── dashboard/        # Dashboard pages
│   ├── types/            # App-specific types
│   ├── useAuth/          # Authentication utilities
│   └── utils/            # App-level utilities
├── components/            # Reusable UI components
│   ├── registerUser/     # Registration flow components
│   └── ui/               # Base UI components (shadcn/ui)
├── constants/             # Global constants and storage keys
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
└── services/             # Client-side service layer (Zustand stores)
```

### Key Principles:

- **Feature-based organization**: Group related files by feature/domain
- **Separation of concerns**: API, UI, business logic are clearly separated
- **Reusability**: Components and hooks are designed for reuse
- **Type safety**: Strong TypeScript typing throughout

## 🏗️ Architecture Overview

### Data Flow:

1. **API Layer** (`/api`): Auto-generated OpenAPI client
2. **Service Layer** (`/services`): Zustand stores with business logic
3. **Hook Layer** (`/hooks`): Custom hooks for component integration
4. **Component Layer** (`/components`): Presentational components

## 📝 Naming Conventions

### Files and Directories:

- **Components**: PascalCase (`FormInput.tsx`, `SportsRoleDetails.tsx`)
- **Hooks**: camelCase with `use` prefix (`useLocation.ts`, `useOrganizer.ts`)
- **Services**: camelCase (`organizerService.ts`, `sportsService.ts`)
- **Types/Interfaces**: PascalCase (`Organizer.ts`, `AuthenticateRequestParams`)
- **Constants**: SCREAMING_SNAKE_CASE (`STORAGE_KEYS`, `CACHE_DURATION`)
- **Directories**: camelCase (`registerUser/`, `useAuth/`)

### Variables and Functions:

```typescript
// Variables: camelCase
const userData = {};
const isLoading = false;

// Functions: camelCase
const handleSubmit = () => {};
const fetchUserData = async () => {};

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const CACHE_DURATION = 5 * 60 * 1000;

// Interfaces/Types: PascalCase
interface UserProfile {
  id: number;
  name: string;
}

type ApiResponse<T> = {
  data: T;
  success: boolean;
};
```

## 📋 Formik Usage Guidelines

### Basic Formik Setup:

```typescript
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const validationSchema = Yup.object({
  organization_name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Organization name is required'),
  mobile_number: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
});

// Component with Formik
const MyForm = () => {
  const formik = useFormik({
    initialValues: {
      organization_name: '',
      mobile_number: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        await apiCall(values);
      } catch (error) {
        setFieldError('general', 'Submission failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Formik Integration with Custom Components:

```typescript
// Pass formik props to child components
<SportsAndRoleDetails formik={formik} />

// In child component:
interface Props {
  formik: FormikProps<Partial<Organizer>>;
}

const SportsAndRoleDetails = ({ formik }: Props) => {
  const { values, errors, setFieldValue, setFieldError } = formik;

  return (
    <FormInput
      label="Organization Name"
      value={values.organization_name || ''}
      onChange={(e) => setFieldValue('organization_name', e.target.value)}
      error={errors.organization_name}
    />
  );
};
```

## 🧩 Reusable Components Structure

### Base UI Components (`/components/ui/`)

Built on shadcn/ui, these are the foundation components:

```typescript
// Example: Button component
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn('base-button-styles', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Form Components (`/components/`)

Composite components built from base UI:

```typescript
// FormInput.tsx - Combines Label + Input + Error display
interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  // ... other props
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  ...props
}) => {
  return (
    <div className="form-field-wrapper">
      <Label htmlFor={props.id}>
        {label} {required && '*'}
      </Label>
      <Input
        value={value}
        onChange={onChange}
        className={error ? 'error-state' : ''}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

### Feature Components (`/components/registerUser/`)

Complex, feature-specific components:

```typescript
// SportsRoleDetails.tsx
interface Props {
  formik: FormikProps<Partial<Organizer>>;
}

const SportsAndRoleDetails = ({ formik }: Props) => {
  const { sports } = useSports();
  const { values, setFieldValue } = formik;

  return (
    <div className="sports-role-section">
      <MultiSelect
        options={sports}
        value={values.primary_sports}
        onChange={(selected) => setFieldValue('primary_sports', selected)}
      />
    </div>
  );
};
```

## 🌐 API Calling Patterns

### Service Layer Pattern (Recommended)

Use Zustand stores as a service layer:

```typescript
// services/organizerService.ts
import { create } from 'zustand';
import { OrganizersControllerService } from '@/api/services';

interface OrganizerStore {
  currentOrganizer: Organizer | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getOrganizerById: (forceRefresh?: boolean) => Promise<Organizer | null>;
  updateOrganizer: (data: Partial<Organizer>) => Promise<void>;
  clearOrganizer: () => void;
}

const useOrganizerStore = create<OrganizerStore>((set, get) => ({
  currentOrganizer: null,
  isLoading: false,
  error: null,

  getOrganizerById: async (forceRefresh = false) => {
    const { currentOrganizer, setLoading, setError } = get();

    // Check cache first
    if (!forceRefresh && currentOrganizer) {
      return currentOrganizer;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await OrganizersControllerService.getSelf();
      set({ currentOrganizer: response, isLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },
}));

// Export both store and service object
export default useOrganizerStore;

export const organizerService = {
  getOrganizerById: () => useOrganizerStore.getState().getOrganizerById(),
  updateOrganizer: () => useOrganizerStore.getState().updateOrganizer(),
  // ... other methods
};
```

### Hook Layer Integration:

```typescript
// hooks/useOrganizer.ts
export const useOrganizer = (autoFetch = true) => {
  const { currentOrganizer, isLoading, error, getOrganizerById } = useOrganizerStore();

  useEffect(() => {
    if (autoFetch && !currentOrganizer) {
      getOrganizerById();
    }
  }, [autoFetch, currentOrganizer, getOrganizerById]);

  return {
    organizer: currentOrganizer,
    isLoading,
    error,
    refreshOrganizer: getOrganizerById,
    hasOrganizer: !!currentOrganizer,
  };
};
```

### Component Usage:

```typescript
// In components
const MyComponent = () => {
  const { organizer, isLoading, error, refreshOrganizer } = useOrganizer();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{organizer?.organization_name}</h1>
      <Button onClick={() => refreshOrganizer(true)}>Refresh</Button>
    </div>
  );
};
```

### Error Handling Pattern:

```typescript
// Consistent error handling across API calls
const handleApiCall = async (apiFunction: () => Promise<any>) => {
  try {
    setLoading(true);
    setError(null);

    const result = await apiFunction();
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    setError(errorMessage);
    console.error('API Error:', error);

    // Optional: Show toast notification
    toast.error(errorMessage);

    return null;
  } finally {
    setLoading(false);
  }
};
```

### ✨ Updated API Pattern (Authentication Example)

Following the refactored login/verify pages, here's the recommended pattern for authentication flows:

#### User Service (`services/userService.ts`):

```typescript
import { create } from 'zustand';
import { authenticate, signUp } from '@/app/services/data/auth.service';

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

  // Actions - Return structured results instead of throwing
  sendOtp: (mobileNumber: string) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  verifyOtp: (otp: string) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  mobileNumber: '',
  otpSent: false,

  sendOtp: async (mobileNumber: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authenticate({ mobileNumber }, 'SEND_OTP');

      // Update state and persist
      set({ mobileNumber, otpSent: true, isLoading: false });
      sessionStorage.setItem('mobileNumber', mobileNumber);
      sessionStorage.setItem('otpSent', 'true');

      // Handle retryAfter timer if provided in successful response
      const retryAfterSeconds = response?.retryAfter;
      if (retryAfterSeconds && typeof retryAfterSeconds === 'number') {
        get().setRetryAfter(retryAfterSeconds);
      }

      return {
        success: true,
        message: response.message || 'OTP sent successfully!',
        retryAfter: retryAfterSeconds,
      };
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
      const errorType = error?.response?.data?.error;

      set({ error: errorMessage, isLoading: false });

      // Special handling for specific error types
      if (errorType === 'OtpAlreadySentException') {
        // Handle retryAfter timer from error response
        const retryAfterSeconds = error?.response?.data?.retryAfter;
        if (retryAfterSeconds && typeof retryAfterSeconds === 'number') {
          get().setRetryAfter(retryAfterSeconds);
        }

        // Still set the mobile number and OTP sent state for navigation
        set({ mobileNumber, otpSent: true });

        return {
          success: false,
          error: errorType,
          message: errorMessage,
          shouldRedirect: true, // Flag for special handling in components
          retryAfter: retryAfterSeconds,
        };
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
}));
```

#### User Hook (`hooks/useUser.ts`):

```typescript
export const useUser = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    mobileNumber,
    otpSent,
    sendOtp,
    verifyOtp,
    clearError,
    checkAuthentication,
  } = useUserStore();

  // Auto-initialization
  useEffect(() => {
    checkAuthentication();
    // Restore session state
    const storedMobile = sessionStorage.getItem('mobileNumber');
    const storedOtpSent = sessionStorage.getItem('otpSent');
    if (storedMobile && storedOtpSent === 'true') {
      setMobileNumber(storedMobile);
      setOtpSent(true);
    }
  }, []);

  // Utility functions
  const validateMobileNumber = (mobile: string): string | null => {
    if (!mobile) return 'Please Enter Your Mobile Number';
    if (mobile.length !== 10) return 'Mobile number must be 10 digits';
    if (!/^[6-9]\d{9}$/.test(mobile)) return 'Please enter a valid mobile number';
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

    // Actions
    sendOtp,
    verifyOtp,
    clearError,

    // Utilities
    validateMobileNumber,
    canSendOtp: (mobile: string) => /^[6-9]\d{9}$/.test(mobile) && !isLoading,
    canVerifyOtp: (otp: string) => otp.length === 6 && !isLoading,
  };
};
```

#### Refactored Component (`app/(auth)/login/page.tsx`):

```typescript
export default function Login() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<{ mobile?: string }>({});

  const {
    isLoading, error, isAuthenticated, sendOtp,
    validateMobileNumber, canSendOtp, clearError
  } = useUser();

  // Authentication redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(Routes.dashboard);
    }
  }, [isAuthenticated, router]);

  // Clear errors when user types
  useEffect(() => {
    if (error) clearError();
  }, [mobile, error, clearError]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationError = validateMobileNumber(mobile);
    if (validationError) {
      setErrors({ mobile: validationError });
      return;
    }

    setErrors({});

    // Call service - no mutation needed!
    const result = await sendOtp(mobile);

    if (result.success) {
      toast.success(result.message);
      router.push('/verify');
    } else {
      // Handle special error cases with structured response
      if (result.shouldRedirect) {
        toast.info(result.message || 'OTP already sent. Redirecting...');
        setTimeout(() => router.push('/verify'), 1500);
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <form onSubmit={handleSendOtp}>
      <Input
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Enter Phone Number"
      />
      {errors.mobile && <span className="error">{errors.mobile}</span>}

      <Button type="submit" disabled={!canSendOtp(mobile)}>
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </form>
  );
}
```

### Key Benefits of This Refactored Pattern:

1. **🧹 Clean Components**: No API logic, only UI concerns
2. **🔄 Consistent Returns**: Structured success/error responses
3. **📱 Session Persistence**: Automatic state restoration
4. **✅ Built-in Validation**: Reusable validation functions
5. **🎯 Type Safety**: Full TypeScript support
6. **🧪 Easy Testing**: Service layer is easily mockable
7. **🔧 Error Handling**: Centralized, consistent error management

### Migration Pattern from React Query:

❌ **Before (with React Query in component)**:

```typescript
const sendOtpMutation = useMutation({
  mutationFn: () => authenticate({ mobileNumber: mobile }, 'SEND_OTP'),
  onSuccess: (data) => {
    // Success logic mixed with API call
    sessionStorage.setItem('mobileNumber', mobile);
    router.push('/verify');
  },
  onError: (error) => {
    // Error handling scattered
    toast.error(error?.response?.data?.message);
  },
});

// In component
sendOtpMutation.mutate();
```

✅ **After (with Zustand service)**:

```typescript
const { sendOtp, isLoading } = useUser();

const handleSendOtp = async () => {
  const result = await sendOtp(mobile);

  if (result.success) {
    toast.success(result.message);
    router.push('/verify');
  } else {
    toast.error(result.error);
  }
};
```

### 🕰️ Dynamic Retry Timer Pattern

The authentication system now supports dynamic retry timers based on server responses:

#### Server Response Format:

```typescript
// Success response with retry timer
{
  success: true,
  message: "OTP sent successfully",
  retryAfter: 120 // seconds
}

// Error response with retry timer
{
  error: "OtpAlreadySentException",
  message: "OTP already sent. Please wait before requesting a new one.",
  retryAfter: 85 // remaining seconds
}
```

#### Store Implementation:

```typescript
// Timer state in Zustand store
interface UserStore {
  retryAfter: number; // Timer duration in seconds
  retryTimestamp: number | null; // When timer was set

  setRetryAfter: (seconds: number) => void;
  getTimeRemaining: () => number;
}

// Timer methods
setRetryAfter: (seconds: number) => {
  const timestamp = Date.now();
  set({ retryAfter: seconds, retryTimestamp: timestamp });
  // Persist for page refreshes
  sessionStorage.setItem('retryAfter', seconds.toString());
  sessionStorage.setItem('retryTimestamp', timestamp.toString());
},

getTimeRemaining: () => {
  const { retryAfter, retryTimestamp } = get();
  if (!retryTimestamp || retryAfter <= 0) return 0;

  const elapsed = Math.floor((Date.now() - retryTimestamp) / 1000);
  return Math.max(0, retryAfter - elapsed);
},
```

#### Component Usage (Verify Page):

```typescript
const VerifyOTP = () => {
  const { getTimeRemaining, sendOtp } = useUser();
  const [timer, setTimer] = useState(0);
  const [isResendEnabled, setResendEnabled] = useState(false);

  // Initialize timer from store
  useEffect(() => {
    const remaining = getTimeRemaining();
    setTimer(remaining);
    setResendEnabled(remaining <= 0);
  }, [getTimeRemaining]);

  // Update timer every second
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

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

    return () => clearInterval(interval);
  }, [timer, getTimeRemaining]);

  const handleResendOTP = async () => {
    const result = await sendOtp(mobileNumber);

    if (result.success) {
      // Use server-provided retry timer
      const newTimer = result.retryAfter || 120;
      setTimer(newTimer);
      setResendEnabled(false);
    }
  };

  return (
    <div>
      {isResendEnabled ? (
        <button onClick={handleResendOTP}>Resend OTP</button>
      ) : (
        <span>
          Resend available in {Math.floor(timer / 60)}:
          {String(timer % 60).padStart(2, '0')}
        </span>
      )}
    </div>
  );
};
```

#### Benefits:

- ✅ **Server-Controlled**: Timer respects server-side rate limiting
- ✅ **Persistent**: Survives page refreshes and navigation
- ✅ **Accurate**: Uses timestamps to calculate remaining time
- ✅ **Flexible**: Different timer values for different scenarios
- ✅ **User-Friendly**: Clear feedback on when retry is available

## 🏪 State Management (Zustand)

### Store Structure:

```typescript
interface MyStore {
  // State
  data: DataType | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchData: () => Promise<void>;
  updateData: (updates: Partial<DataType>) => void;
  clearData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

### Caching Strategy:

```typescript
// services/storage.ts - Centralized storage utility
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing JSON for key "${key}":`, error);
      return null;
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// In store with caching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchWithCache = async () => {
  const cached = storage.get(STORAGE_KEYS.data);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    set({ data: cached.data });
    return cached.data;
  }

  const fresh = await apiCall();
  storage.set(STORAGE_KEYS.data, {
    data: fresh,
    timestamp: Date.now(),
  });

  return fresh;
};
```

### Multiple Store Pattern:

```typescript
// Separate stores for different domains
export const useSportsStore = create<SportsStore>(() => ({}));
export const useOrganizerStore = create<OrganizerStore>(() => ({}));
export const useLocationStore = create<LocationStore>(() => ({}));

// Combine in a custom hook when needed
export const useRegistrationData = () => {
  const sports = useSports();
  const organizer = useOrganizer();
  const location = useLocation();

  return {
    sports,
    organizer,
    location,
    // Combined loading state
    isLoading: sports.isLoading || organizer.isLoading || location.isLoading,
  };
};
```

## 📦 Constants Management

### Storage Keys:

```typescript
// constants/storageKeys.ts
const STORAGE_PREFIX = 'athletics_web_';

export const STORAGE_KEYS = {
  AUTH_TOKEN: `${STORAGE_PREFIX}auth_token`,
  MOBILE_NUMBER: `${STORAGE_PREFIX}mobile_number`,
  CURRENT_ORGANIZER: `${STORAGE_PREFIX}current_organizer`,
  SPORTS_DATA: `${STORAGE_PREFIX}sports_data`,
  // ... more keys
} as const;

// Grouped exports for better organization
export const AUTH_KEYS = {
  TOKEN: STORAGE_KEYS.AUTH_TOKEN,
  MOBILE: STORAGE_KEYS.MOBILE_NUMBER,
} as const;

export const CACHE_KEYS = {
  ORGANIZER: STORAGE_KEYS.CURRENT_ORGANIZER,
  SPORTS: STORAGE_KEYS.SPORTS_DATA,
} as const;
```

### API Constants:

```typescript
// constants/api.ts
export const API_ENDPOINTS = {
  ORGANIZERS: '/organizers',
  SPORTS: '/sports',
  LOCATIONS: '/locations',
} as const;

export const CACHE_DURATION = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 10 * 60 * 1000, // 10 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;
```

## 🎯 Best Practices

### 1. Component Design:

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Props**: Use default parameters instead of defaultProps
- **Ref Forwarding**: Use `forwardRef` for reusable components that need refs

### 2. Performance:

- **Lazy Loading**: Use `React.lazy()` for large components
- **Memoization**: Use `useMemo` and `useCallback` judiciously
- **Bundle Splitting**: Separate vendor and app bundles

### 3. Error Handling:

- **Error Boundaries**: Implement error boundaries for crash protection
- **Consistent Error Format**: Use consistent error message structure
- **User-Friendly Messages**: Show actionable error messages to users

### 4. Accessibility:

- **ARIA Labels**: Include proper ARIA attributes
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Color Contrast**: Maintain WCAG AA color contrast ratios

### 5. Testing Strategy:

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import FormInput from './FormInput';

describe('FormInput', () => {
  it('displays error message when provided', () => {
    render(
      <FormInput
        label="Test"
        value=""
        onChange={() => {}}
        error="Required field"
      />
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });
});

// Hook testing
import { renderHook, act } from '@testing-library/react';
import { useOrganizer } from './useOrganizer';

describe('useOrganizer', () => {
  it('fetches organizer data on mount', async () => {
    const { result } = renderHook(() => useOrganizer());

    await act(async () => {
      await result.current.refreshOrganizer();
    });

    expect(result.current.organizer).toBeDefined();
  });
});
```

## 🔄 Development Workflow

### 1. Feature Development:

1. Create types/interfaces first
2. Build API service methods
3. Create Zustand store
4. Build custom hooks
5. Create components
6. Write tests
7. Update documentation

### 2. Code Review Checklist:

- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility attributes are included
- [ ] Performance considerations are addressed
- [ ] Tests are written and passing
- [ ] Documentation is updated

### 3. Git Conventions:

```bash
# Branch naming
feature/user-registration
bugfix/form-validation-issue
hotfix/api-timeout

# Commit messages
feat: add organizer registration form
fix: resolve mobile number validation issue
docs: update API integration guide
refactor: simplify component prop interface
```

This architecture ensures maintainable, scalable, and developer-friendly codebase for the athletics web application.
