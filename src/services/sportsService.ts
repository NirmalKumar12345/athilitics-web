import { SportsControllerService } from '@/api/services/SportsControllerService';
import { create } from 'zustand';
import { storage, STORAGE_KEYS } from './storage';

export interface Sport {
  id: number;
  name: string;
  canPrimarySports: boolean;
}

interface SportOption {
  label: string;
  value: string;
  id: number;
  canPrimarySports: boolean;
}

interface SportsStore {
  sports: Sport[];
  sportsOptions: SportOption[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  sportAssets: Record<number, string | null>;

  // Actions
  getAllSports: (forceRefresh?: boolean) => Promise<Sport[]>;
  setSports: (sports: Sport[]) => void;
  clearSports: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getSportAssetUrl: (id: number, type?: string) => Promise<string | null>;
  setSportAssetUrl: (id: number, url: string | null) => void;
}

// Cache duration in milliseconds (30 minutes for sports data)
const CACHE_DURATION = 30 * 60 * 1000;

const useSportsStore = create<SportsStore>((set, get) => ({
  sports: [],
  sportsOptions: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  sportAssets: {},
  setSportAssetUrl: (id: number, url: string | null) => {
    set((state) => ({
      ...state,
      sportAssets: { ...state.sportAssets, [id]: url },
    }));
    // Optionally cache asset URLs in localStorage
    storage.set(`${STORAGE_KEYS.sportsData}_asset_${id}`, url);
  },

  getSportAssetUrl: async (id: number, type?: string) => {
    const { sportAssets, setSportAssetUrl } = get();
    // Check in-memory cache
    if (sportAssets && sportAssets[id]) {
      return sportAssets[id];
    }
    // Check localStorage cache
    const cachedUrl = storage.get(`${STORAGE_KEYS.sportsData}_asset_${id}`);
    if (cachedUrl) {
      setSportAssetUrl(id, cachedUrl);
      return cachedUrl;
    }
    // Fetch from API
    try {
      const result = await SportsControllerService.getSportAsset(id, type);
      setSportAssetUrl(id, result.assetUrl);
      return result.assetUrl;
    } catch (error) {
      console.error('Error fetching sport asset:', error);
      setSportAssetUrl(id, null);
      return null;
    }
  },

  setSports: (sports: Sport[]) => {
    const sportsOptions = sports.map((sport) => ({
      label: sport.name,
      value: sport.id.toString(),
      id: sport.id,
      canPrimarySports: sport.canPrimarySports,
    }));

    set({
      sports,
      sportsOptions,
      lastFetched: Date.now(),
      error: null,
    });

    // Cache the data
    storage.set(STORAGE_KEYS.sportsData, {
      data: sports,
      timestamp: Date.now(),
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearSports: () => {
    set({ sports: [], sportsOptions: [], lastFetched: null, error: null });
    storage.remove(STORAGE_KEYS.sportsData);
  },

  getAllSports: async (forceRefresh = false) => {
    const { sports, lastFetched, setLoading, setError, setSports } = get();

    // Return cached data if available and not expired
    if (!forceRefresh && sports.length > 0 && lastFetched) {
      const isExpired = Date.now() - lastFetched > CACHE_DURATION;
      if (!isExpired) {
        return sports;
      }
    }

    // Check localStorage cache
    if (!forceRefresh) {
      const cachedData = storage.get(STORAGE_KEYS.sportsData);
      if (cachedData?.data && cachedData?.timestamp) {
        const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
        if (!isExpired) {
          setSports(cachedData.data);
          return cachedData.data;
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      const data = await SportsControllerService.getAllSports();
      if (data) {
        setSports(data);
        return data;
      } else {
        setSports([]);
        return [];
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch sports data';
      setError(errorMessage);
      console.error('Error fetching sports:', error);

      // Return empty array on error
      setSports([]);
      return [];
    } finally {
      setLoading(false);
    }
  },
}));

// Service object for direct access to actions
export const sportsService = {
  getAllSports: () => useSportsStore.getState().getAllSports(),
  setSports: (sports: Sport[]) => useSportsStore.getState().setSports(sports),
  clearSports: () => useSportsStore.getState().clearSports(),
  getSportsOptions: () => useSportsStore.getState().sportsOptions,
  getCurrentSports: () => useSportsStore.getState().sports,
  getSportAssetUrl: (id: number, type?: string) => useSportsStore.getState().getSportAssetUrl(id, type),
};

export default useSportsStore;
