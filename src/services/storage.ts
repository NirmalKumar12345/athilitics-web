import { CACHE_KEYS, STORAGE_PREFIX } from '@/constants/storageKeys';

export const STORAGE_KEYS = {
  roleList: CACHE_KEYS.ROLE_LIST,
  currentOrganizer: CACHE_KEYS.CURRENT_ORGANIZER,
  sportsData: CACHE_KEYS.SPORTS_DATA,
  divisionData: CACHE_KEYS.DIVISION_DATA,
  ageBracketsData: CACHE_KEYS.AGE_BRACKETS_DATA,
  tournaments: CACHE_KEYS.TOURNAMENT_DATA,
  razorPayData: CACHE_KEYS.RAZOR_PAY_DATA,

  getLookupKey: (objVal: string) => `${STORAGE_PREFIX}lookup_${objVal}`,
};

export const storage = {
  get: (key: string, id?: number) => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      if (id !== undefined && parsed && typeof parsed === 'object') {
        return parsed[id] || null;
      }
      return parsed;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
      return null;
    }
  },
  set: (key: string, value: any, id?: number) => {
    if (typeof window === 'undefined') return;
    if (id !== undefined) {
      let all: { [key: number]: any } = {};
      const existing = localStorage.getItem(key);
      if (existing) {
        try {
          all = JSON.parse(existing);
        } catch {}
      }
      all[id] = value;
      localStorage.setItem(key, JSON.stringify(all));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove: (key: string, id?: number) => {
    if (typeof window === 'undefined') return;
    if (id !== undefined) {
      const existing = localStorage.getItem(key);
      if (existing) {
        try {
          const all: { [key: number]: any } = JSON.parse(existing);
          delete all[id];
          localStorage.setItem(key, JSON.stringify(all));
        } catch {}
      }
    } else {
      localStorage.removeItem(key);
    }
  },
  clearAll: () => {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};
