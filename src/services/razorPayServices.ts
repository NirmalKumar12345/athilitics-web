


import { RazorPayBusinessCategory } from '@/api/models/RazorPayBusinessCategory';
import { RazorPayDto, RazorPayResponse } from '@/api/models/RazorPayDto';
import { RazorPayControllerService } from '@/api/services/RazorPayControllerService';
import { isErrorWithMessage } from '@/utils/errorUtils';
import { create } from 'zustand';
import { storage, STORAGE_KEYS } from './storage';


interface BusinessType {
    id: number;
    display_name: string;
    internal_name: string;
}

interface RazorPayStore {
    linkedAccount: RazorPayResponse | null;
    isLoading: boolean;
    error: string | null;
    businessTypes: BusinessType[];
    businessTypesOptions: { label: string; value: string; id: number }[];
    lastFetchedBusinessTypes: number | null;
    businessCategories: RazorPayBusinessCategory[];
    lastFetchedBusinessCategories: number | null;
    businessSubcategories: RazorPayBusinessCategory[];
    lastFetchedBusinessSubcategories: Record<string, number | null>;
    createLinkedAccount: (data: RazorPayDto) => Promise<RazorPayResponse | null>;
    getLinkedAccountDetails: () => Promise<RazorPayResponse | null>;
    clearRazorPayData: () => void;
    setLinkedAccount: (data: RazorPayResponse | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    getBusinessTypes: (forceRefresh?: boolean) => Promise<BusinessType[]>;
    setBusinessTypes: (types: BusinessType[]) => void;
    getBusinessCategories: (forceRefresh?: boolean) => Promise<RazorPayBusinessCategory[]>;
    setBusinessCategories: (categories: RazorPayBusinessCategory[]) => void;
    getBusinessSubcategories: (category: string, forceRefresh?: boolean) => Promise<RazorPayBusinessCategory[]>;
    setBusinessSubcategories: (category: string, subcategories: RazorPayBusinessCategory[]) => void;
    updateLinkedAccount: (data: RazorPayDto) => Promise<RazorPayResponse | null>;
}

const CACHE_DURATION = 30 * 60 * 1000;

const useRazorPayStore = create<RazorPayStore>((set, get) => ({
    businessSubcategories: [],
    lastFetchedBusinessSubcategories: {},
    setBusinessSubcategories: (category: string, subcategories: RazorPayBusinessCategory[]) => {
        set((state) => ({
            ...state,
            businessSubcategories: subcategories,
            lastFetchedBusinessSubcategories: {
                ...state.lastFetchedBusinessSubcategories,
                [category]: Date.now(),
            },
            error: null,
        }));
        storage.set(STORAGE_KEYS.razorPayData + `_businessSubcategories_${category}`, {
            data: subcategories,
            timestamp: Date.now(),
        });
    },
    getBusinessSubcategories: async (category: string, forceRefresh = false) => {
        const { lastFetchedBusinessSubcategories, setBusinessSubcategories, setLoading, setError } = get();
        const lastFetched = lastFetchedBusinessSubcategories[category] || null;
        // Check in-memory cache
        if (!forceRefresh && lastFetched) {
            const isExpired = Date.now() - lastFetched > CACHE_DURATION;
            if (!isExpired) {
                const cached = storage.get(STORAGE_KEYS.razorPayData + `_businessSubcategories_${category}`);
                if (cached?.data) {
                    return cached.data;
                }
            }
        }
        setLoading(true);
        setError(null);
        try {
            const result = await RazorPayControllerService.getBusinessSubcategories(category);
            if (result && Array.isArray(result)) {
                setBusinessSubcategories(category, result);
                return result;
            } else {
                setBusinessSubcategories(category, []);
                return [];
            }
        } catch (error) {
            setError('Failed to fetch business subcategories');
            setBusinessSubcategories(category, []);
            return [];
        } finally {
            setLoading(false);
        }
    },
    businessCategories: [],
    lastFetchedBusinessCategories: null,
    setBusinessCategories: (categories: RazorPayBusinessCategory[]) => {
        set({
            businessCategories: categories,
            lastFetchedBusinessCategories: Date.now(),
            error: null,
        });
        storage.set(STORAGE_KEYS.razorPayData + '_businessCategories', {
            data: categories,
            timestamp: Date.now(),
        });
    },
    getBusinessCategories: async (forceRefresh = false) => {
        const { businessCategories, lastFetchedBusinessCategories, setBusinessCategories, setLoading, setError } = get();
        if (!forceRefresh && businessCategories.length > 0 && lastFetchedBusinessCategories) {
            const isExpired = Date.now() - lastFetchedBusinessCategories > CACHE_DURATION;
            if (!isExpired) {
                return businessCategories;
            }
        }
        if (!forceRefresh) {
            const cachedData = storage.get(STORAGE_KEYS.razorPayData + '_businessCategories');
            if (cachedData?.data && cachedData?.timestamp) {
                const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
                if (!isExpired) {
                    setBusinessCategories(cachedData.data);
                    return cachedData.data;
                }
            }
        }
        setLoading(true);
        setError(null);
        try {
            const result = await RazorPayControllerService.getBusinessCategories();
            if (result && Array.isArray(result)) {
                setBusinessCategories(result);
                return result;
            } else {
                setBusinessCategories([]);
                return [];
            }
        } catch (error) {
            setError('Failed to fetch business categories');
            setBusinessCategories([]);
            return [];
        } finally {
            setLoading(false);
        }
    },
    linkedAccount: null,
    isLoading: false,
    error: null,
    businessTypes: [],
    businessTypesOptions: [],
    lastFetchedBusinessTypes: null,

    setLinkedAccount: (data: RazorPayResponse | null) => set({ linkedAccount: data }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    setBusinessTypes: (types: BusinessType[]) => {
        const businessTypesOptions = types.map((type) => ({
            label: type.display_name,
            value: type.id.toString(),
            id: type.id,
        }));
        set({
            businessTypes: types,
            businessTypesOptions,
            lastFetchedBusinessTypes: Date.now(),
            error: null,
        });
        storage.set(STORAGE_KEYS.razorPayData + '_businessTypes', {
            data: types,
            timestamp: Date.now(),
        });
    },
    getBusinessTypes: async (forceRefresh = false) => {
        const { businessTypes, lastFetchedBusinessTypes, setBusinessTypes, setLoading, setError } = get();
        if (!forceRefresh && businessTypes.length > 0 && lastFetchedBusinessTypes) {
            const isExpired = Date.now() - lastFetchedBusinessTypes > CACHE_DURATION;
            if (!isExpired) {
                return businessTypes;
            }
        }
        if (!forceRefresh) {
            const cachedData = storage.get(STORAGE_KEYS.razorPayData + '_businessTypes');
            if (cachedData?.data && cachedData?.timestamp) {
                const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
                if (!isExpired) {
                    setBusinessTypes(cachedData.data);
                    return cachedData.data;
                }
            }
        }
        setLoading(true);
        setError(null);
        try {
            const result = await RazorPayControllerService.getBusinessTypes();
            if (result && Array.isArray(result.data)) {
                setBusinessTypes(result.data);
                return result.data;
            } else {
                setBusinessTypes([]);
                return [];
            }
        } catch (error) {
            setError('Failed to fetch business types');
            setBusinessTypes([]);
            return [];
        } finally {
            setLoading(false);
        }
    },
    createLinkedAccount: async (data: RazorPayDto): Promise<RazorPayResponse | null> => {
        const { setLoading, setError } = useRazorPayStore.getState();
        setLoading(true);
        setError(null);
        try {
            const response = await RazorPayControllerService.createLinkedAccount(data);
            setLoading(false);
            return response;
        } catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Failed to create linked account. Please try again.';
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    },

    /**
     * Update linked account for the authenticated user
     */
    updateLinkedAccount: async (data: RazorPayDto): Promise<RazorPayResponse | null> => {
        const { setLoading, setError } = useRazorPayStore.getState();
        setLoading(true);
        setError(null);
        try {
            const response = await RazorPayControllerService.updateLinkedAccount(data);
            setLoading(false);
            return response;
        } catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Failed to update linked account. Please try again.';
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    },

    /**
     * Fetch linked account details for the authenticated user
     */
    getLinkedAccountDetails: async (): Promise<RazorPayResponse | null> => {
        const { setLinkedAccount, setLoading, setError } = useRazorPayStore.getState();
        setLoading(true);
        setError(null);
        try {
            const response = await RazorPayControllerService.getLinkedAccountDetails();
            setLinkedAccount(response);
            return response;
        } catch (error) {
            const errorMessage = isErrorWithMessage(error)
                ? error.message
                : 'Failed to fetch linked account details.';
            setError(errorMessage);
            setLinkedAccount(null);
            return null;
        } finally {
            setLoading(false);
        }
    },
    clearRazorPayData: () => {
        set({
            linkedAccount: null,
            error: null,
            businessTypes: [],
            businessTypesOptions: [],
            lastFetchedBusinessTypes: null,
            businessCategories: [],
            lastFetchedBusinessCategories: null,
            businessSubcategories: [],
            lastFetchedBusinessSubcategories: {},
        });
        storage.remove(STORAGE_KEYS.razorPayData);
        storage.remove(STORAGE_KEYS.razorPayData + '_businessTypes');
        storage.remove(STORAGE_KEYS.razorPayData + '_businessCategories');
        // Remove all subcategory caches
        Object.keys(localStorage)
            .filter((key) => key.startsWith(STORAGE_KEYS.razorPayData + '_businessSubcategories_'))
            .forEach((key) => localStorage.removeItem(key));
    },
}));

export const razorPayServices = {
    createLinkedAccount: (data: RazorPayDto) => useRazorPayStore.getState().createLinkedAccount(data),
    updateLinkedAccount: (data: RazorPayDto) => useRazorPayStore.getState().updateLinkedAccount(data),
    getLinkedAccountDetails: () => useRazorPayStore.getState().getLinkedAccountDetails(),
    clearRazorPayData: () => useRazorPayStore.getState().clearRazorPayData(),
    getLinkedAccount: () => useRazorPayStore.getState().linkedAccount,
    isLoading: () => useRazorPayStore.getState().isLoading,
    getError: () => useRazorPayStore.getState().error,
    getBusinessTypes: (forceRefresh?: boolean) => useRazorPayStore.getState().getBusinessTypes(forceRefresh),
    getBusinessTypesOptions: () => useRazorPayStore.getState().businessTypesOptions,
    getCurrentBusinessTypes: () => useRazorPayStore.getState().businessTypes,
    getBusinessCategories: (forceRefresh?: boolean) => useRazorPayStore.getState().getBusinessCategories(forceRefresh),
    getCurrentBusinessCategories: () => useRazorPayStore.getState().businessCategories,
    getBusinessSubcategories: (category: string, forceRefresh?: boolean) => useRazorPayStore.getState().getBusinessSubcategories(category, forceRefresh),
    getCurrentBusinessSubcategories: (category: string) => {
        const cached = storage.get(STORAGE_KEYS.razorPayData + `_businessSubcategories_${category}`);
        return cached?.data || [];
    },
};

export default useRazorPayStore;