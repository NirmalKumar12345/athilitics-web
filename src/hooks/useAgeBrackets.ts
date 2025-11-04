import useAgeBracketsStore, { AgeBracket, ageBracketsService } from '@/services/ageBracketsService';
import { useEffect } from 'react';

/**
 * Custom hook to manage age brackets data with Zustand
 *
 * @param autoFetch - Whether to automatically fetch age brackets on mount (default: true)
 * @returns Object containing age brackets data, loading state, error, and utility functions
 */
export const useAgeBrackets = (autoFetch = true) => {
  const {
    ageBrackets,
    ageBracketOptions,
    isLoading,
    error,
    getAllAgeBrackets,
    clearAgeBrackets,
    setAgeBrackets,
  } = useAgeBracketsStore();

  // Auto-fetch age brackets data on mount
  useEffect(() => {
    if (autoFetch && ageBrackets.length === 0 && !isLoading) {
      getAllAgeBrackets();
    }
  }, [autoFetch, ageBrackets.length, isLoading, getAllAgeBrackets]);

  // Utility functions
  const refreshAgeBrackets = (forceRefresh = true) => {
    return getAllAgeBrackets(forceRefresh);
  };

  const updateAgeBrackets = (newAgeBrackets: AgeBracket[]) => {
    setAgeBrackets(newAgeBrackets);
  };

  const clearAgeBracketsData = () => {
    clearAgeBrackets();
  };

  return {
    ageBrackets,
    ageBracketOptions,
    isLoading,
    error,
    refreshAgeBrackets,
    updateAgeBrackets,
    clearAgeBrackets: clearAgeBracketsData,
    hasAgeBrackets: ageBrackets.length > 0,
  };
};

/**
 * Hook to get age brackets data without automatic fetching
 * Useful when you just want to access cached data
 */
export const useAgeBracketsState = () => {
  const { ageBrackets, ageBracketOptions, isLoading, error } = useAgeBracketsStore();

  return {
    ageBrackets,
    ageBracketOptions,
    isLoading,
    error,
    hasAgeBrackets: ageBrackets.length > 0,
  };
};

/**
 * Hook for age brackets actions without state subscription
 * Useful for components that only need to trigger actions
 */
export const useAgeBracketsActions = () => {
  return {
    fetchAgeBrackets: ageBracketsService.getAllAgeBrackets,
    setAgeBrackets: ageBracketsService.setAgeBrackets,
    clearAgeBrackets: ageBracketsService.clearAgeBrackets,
    getAgeBracketOptions: ageBracketsService.getAgeBracketOptions,
    getCurrentAgeBrackets: ageBracketsService.getCurrentAgeBrackets,
  };
};
