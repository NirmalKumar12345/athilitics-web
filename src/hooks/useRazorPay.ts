import { RazorPayDto, RazorPayResponse } from '@/api/models/RazorPayDto';
import useRazorPayStore, { razorPayServices } from '@/services/razorPayServices';
import { useEffect } from 'react';

/**
 * Custom hook to manage RazorPay state with Zustand
 *
 * @param autoFetch - Whether to clear RazorPay data on mount (default: false)
 * @returns Object containing linked account data, loading state, error, and utility functions
 */
export const useRazorPay = (autoFetch = false) => {
    const {
        linkedAccount,
        isLoading,
        error,
        createLinkedAccount: createLinkedAccountAPI,
        clearRazorPayData: clearRazorPayDataAPI,
        updateLinkedAccount: updateLinkedAccountAPI,
    } = useRazorPayStore();

    useEffect(() => {
        if (autoFetch) {
            clearRazorPayDataAPI();
        }
    }, [autoFetch, clearRazorPayDataAPI]);

    const createLinkedAccount = async (data: RazorPayDto): Promise<RazorPayResponse | null> => {
        return createLinkedAccountAPI(data);
    };

    const updateLinkedAccount = async (data: RazorPayDto): Promise<RazorPayResponse | null> => {
        return updateLinkedAccountAPI(data);
    };

    const getLinkedAccountDetails = async (): Promise<RazorPayResponse | null> => {
        return razorPayServices.getLinkedAccountDetails();
    };

    const getBusinessTypes = async (forceRefresh?: boolean) => {
        return razorPayServices.getBusinessTypes(forceRefresh);
    };

    const getBusinessCategories = async (forceRefresh?: boolean) => {
        return razorPayServices.getBusinessCategories(forceRefresh);
    };

    const getBusinessSubcategories = async (category: string, forceRefresh?: boolean) => {
        return razorPayServices.getBusinessSubcategories(category, forceRefresh);
    };

    const clearRazorPayData = () => {
        clearRazorPayDataAPI();
    };

    return {
        linkedAccount,
        isLoading,
        error,
        createLinkedAccount,
        updateLinkedAccount,
        getLinkedAccountDetails,
        clearRazorPayData,
        hasLinkedAccount: !!linkedAccount,
        getBusinessTypes,
        getBusinessCategories,
        getBusinessSubcategories,
    };
};

/**
 * Hook to get RazorPay state without automatic actions
 * Useful when you just want to access cached data
 */
export const useRazorPayState = () => {
    const { linkedAccount, isLoading, error } = useRazorPayStore();

    return {
        linkedAccount,
        isLoading,
        error,
        hasLinkedAccount: !!linkedAccount,
    };
};

/**
 * Hook for RazorPay actions without state subscription
 * Useful for components that only need to trigger actions
 */
export const useRazorPayActions = () => {
    return {
        createLinkedAccount: razorPayServices.createLinkedAccount,
        updateLinkedAccount: razorPayServices.updateLinkedAccount,
        clearRazorPayData: razorPayServices.clearRazorPayData,
        getBusinessTypes: razorPayServices.getBusinessTypes,
        getBusinessCategories: razorPayServices.getBusinessCategories,
        getBusinessSubcategories: razorPayServices.getBusinessSubcategories,
    };
};
