import { AgeControllerService } from '@/api/services/AgeControllerService';
import { create } from 'zustand';
import { storage, STORAGE_KEYS } from './storage';
import { isErrorWithMessage } from '@/utils/errorUtils';

export interface AgeBracket {
  id: number;
  label: string;
  minAge: number;
  maxAge: number;
  notes: string;
}

interface AgeBracketOption {
  label: string;
  value: string;
  id: number;
}

interface AgeBracketsStore {
  ageBrackets: AgeBracket[];
  ageBracketOptions: AgeBracketOption[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  getAllAgeBrackets: (forceRefresh?: boolean) => Promise<AgeBracket[]>;
  setAgeBrackets: (ageBrackets: AgeBracket[]) => void;
  clearAgeBrackets: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Cache duration in milliseconds (30 minutes for age brackets data)
const CACHE_DURATION = 30 * 60 * 1000;

const useAgeBracketsStore = create<AgeBracketsStore>((set, get) => ({
  ageBrackets: [],
  ageBracketOptions: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  setAgeBrackets: (ageBrackets: AgeBracket[]) => {
    const ageBracketOptions = ageBrackets.map((bracket) => ({
      label: bracket.label,
      value: bracket.id.toString(),
      id: bracket.id,
    }));

    set({
      ageBrackets,
      ageBracketOptions,
      lastFetched: Date.now(),
      error: null,
    });

    // Cache the data
    storage.set(STORAGE_KEYS.ageBracketsData, {
      data: ageBrackets,
      timestamp: Date.now(),
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearAgeBrackets: () => {
    set({ ageBrackets: [], ageBracketOptions: [], lastFetched: null, error: null });
    storage.remove(STORAGE_KEYS.ageBracketsData);
  },

  getAllAgeBrackets: async (forceRefresh = false) => {
    const { ageBrackets, lastFetched, setLoading, setError, setAgeBrackets } = get();

    // Return cached data if available and not expired
    if (!forceRefresh && ageBrackets.length > 0 && lastFetched) {
      const isExpired = Date.now() - lastFetched > CACHE_DURATION;
      if (!isExpired) {
        return ageBrackets;
      }
    }

    // Check localStorage cache
    if (!forceRefresh) {
      const cachedData = storage.get(STORAGE_KEYS.ageBracketsData);
      if (cachedData?.data && cachedData?.timestamp) {
        const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
        if (!isExpired) {
          setAgeBrackets(cachedData.data);
          return cachedData.data;
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      const data = await AgeControllerService.getAllAgeBrackets();
      if (data) {
        setAgeBrackets(data);
        return data;
      } else {
        setAgeBrackets([]);
        return [];
      }
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Failed to fetch age brackets data';
      setError(errorMessage);
      console.error('Error fetching age brackets:', error);

      // Return empty array on error
      setAgeBrackets([]);
      return [];
    } finally {
      setLoading(false);
    }
  },
}));

// Service object for direct access to actions
export const ageBracketsService = {
  getAllAgeBrackets: () => useAgeBracketsStore.getState().getAllAgeBrackets(),
  setAgeBrackets: (ageBrackets: AgeBracket[]) =>
    useAgeBracketsStore.getState().setAgeBrackets(ageBrackets),
  clearAgeBrackets: () => useAgeBracketsStore.getState().clearAgeBrackets(),
  getAgeBracketOptions: () => useAgeBracketsStore.getState().ageBracketOptions,
  getCurrentAgeBrackets: () => useAgeBracketsStore.getState().ageBrackets,
};

export default useAgeBracketsStore;
