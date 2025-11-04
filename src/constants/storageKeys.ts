/**
 * Centralized localStorage keys and storage constants
 * All localStorage keys should be defined here to avoid duplication and maintain consistency
 */

// Storage prefixes
export const STORAGE_PREFIX = 'athletics_';

// Core authentication and user data keys
const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'authToken',
  MOBILE_NUMBER: 'mobileNumber',
  OTP: 'otp',

  // User/Organization data
  ORGANIZATION_ID: 'organizationId',
  USER_PROFILE: 'userProfile',

  // App state
  PAGE_TITLE: 'PageTitle',
  LOOKUP_VALUES: 'LookUpValues',

  // Zustand store cache (with prefix)
  ROLE_LIST: `${STORAGE_PREFIX}roleList`,
  CURRENT_ORGANIZER: `${STORAGE_PREFIX}currentOrganizer`,
  SPORTS_DATA: `${STORAGE_PREFIX}sportsData`,
  DIVISION_DATA: `${STORAGE_PREFIX}divisionData`,
  AGE_BRACKETS_DATA: `${STORAGE_PREFIX}ageBracketsData`,
  TOURNAMENT_DATA: `${STORAGE_PREFIX}tournamentData`,
  RAZOR_PAY_DATA: `${STORAGE_PREFIX}razorPayData`,

  // Dynamic lookup key generator
  getLookupKey: (objVal: string) => `${STORAGE_PREFIX}lookup_${objVal}`,
} as const;

// Storage key validation
function isValidStorageKey(key: string): boolean {
  return Object.values(STORAGE_KEYS).includes(key as any) || key.startsWith(STORAGE_PREFIX);
}

// Export individual key groups for better organization
const AUTH_KEYS = {
  TOKEN: STORAGE_KEYS.AUTH_TOKEN,
  MOBILE: STORAGE_KEYS.MOBILE_NUMBER,
  OTP: STORAGE_KEYS.OTP,
} as const;

const USER_KEYS = {
  ORGANIZATION_ID: STORAGE_KEYS.ORGANIZATION_ID,
  PROFILE: STORAGE_KEYS.USER_PROFILE,
} as const;

const APP_KEYS = {
  PAGE_TITLE: STORAGE_KEYS.PAGE_TITLE,
  LOOKUP_VALUES: STORAGE_KEYS.LOOKUP_VALUES,
} as const;

export const CACHE_KEYS = {
  ROLE_LIST: STORAGE_KEYS.ROLE_LIST,
  CURRENT_ORGANIZER: STORAGE_KEYS.CURRENT_ORGANIZER,
  SPORTS_DATA: STORAGE_KEYS.SPORTS_DATA,
  DIVISION_DATA: STORAGE_KEYS.DIVISION_DATA,
  AGE_BRACKETS_DATA: STORAGE_KEYS.AGE_BRACKETS_DATA,
  TOURNAMENT_DATA: STORAGE_KEYS.TOURNAMENT_DATA,
  RAZOR_PAY_DATA: STORAGE_KEYS.RAZOR_PAY_DATA,
} as const;
