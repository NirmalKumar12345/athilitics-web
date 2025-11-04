import useSportsStore, { Sport, sportsService } from '@/services/sportsService';
import { useEffect } from 'react';

/**
 * Custom hook to manage sports data with Zustand
 *
 * @param autoFetch - Whether to automatically fetch sports on mount (default: true)
 * @returns Object containing sports data, loading state, error, and utility functions
 */
export const useSports = (autoFetch = true) => {
  const { sports, sportsOptions, isLoading, error, getAllSports, clearSports, setSports, sportAssets, getSportAssetUrl } =
    useSportsStore();
  // Fetch asset URL for a sport
  const fetchSportAssetUrl = async (id: number, type?: string) => {
    return await getSportAssetUrl(id, type);
  };

  // Auto-fetch sports data on mount
  useEffect(() => {
    if (autoFetch && sports.length === 0 && !isLoading) {
      getAllSports();
    }
  }, [autoFetch, sports.length, isLoading, getAllSports]);

  // Utility functions
  const refreshSports = (forceRefresh = true) => {
    return getAllSports(forceRefresh);
  };

  const updateSports = (newSports: Sport[]) => {
    setSports(newSports);
  };

  const clearSportsData = () => {
    clearSports();
  };

  return {
    sports,
    sportsOptions,
    isLoading,
    error,
    refreshSports,
    updateSports,
    clearSports: clearSportsData,
    hasSports: sports.length > 0,
    sportAssets,
    fetchSportAssetUrl,
  };
};

/**
 * Hook to get sports data without automatic fetching
 * Useful when you just want to access cached data
 */
const useSportsState = () => {
  const { sports, sportsOptions, isLoading, error } = useSportsStore();

  return {
    sports,
    sportsOptions,
    isLoading,
    error,
    hasSports: sports.length > 0,
  };
};

/**
 * Hook for sports actions without state subscription
 * Useful for components that only need to trigger actions
 */
const useSportsActions = () => {
  return {
    fetchSports: sportsService.getAllSports,
    setSports: sportsService.setSports,
    clearSports: sportsService.clearSports,
    getSportsOptions: sportsService.getSportsOptions,
    getCurrentSports: sportsService.getCurrentSports,
  };
};
