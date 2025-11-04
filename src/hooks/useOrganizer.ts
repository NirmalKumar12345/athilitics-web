import { Organizer } from '@/api/models/Organizer';
import { UploadResponseDto } from '@/api/models/UploadResponseDto';
import { OrganizersControllerService } from '@/api/services/OrganizersControllerService';
import useOrganizerStore, { organizerService } from '@/services/organizerService';
import { useEffect } from 'react';

/**
 * Custom hook to manage organizer state with Zustand
 *
 * @param autoFetch - Whether to automatically fetch the organizer on mount (default: true)
 * @returns Object containing organizer data, loading state, error, and utility functions
 */
export const useOrganizer = (autoFetch = true) => {
  const {
    currentOrganizer,
    isLoading,
    error,
    getOrganizerById,
    updateOrganizer: updateOrganizerAPI,
    uploadProfileImage,
    clearOrganizer,
    updateOrganizerData,
  } = useOrganizerStore();

  // Auto-fetch organizer data when organizerId changes
  useEffect(() => {
    if (autoFetch && !currentOrganizer) {
      getOrganizerById();
    }
  }, [autoFetch, currentOrganizer, getOrganizerById]);

  // Utility functions
  const refreshOrganizer = (forceRefresh = true) => {
    return getOrganizerById(forceRefresh);
  };

  const updateOrganizerProfile = async (data: Partial<Organizer>) => {
    return updateOrganizerAPI(data);
  };

  const uploadImage = async (file: File): Promise<UploadResponseDto> => {
    return uploadProfileImage(file);
  };

  const uploadDocument = async (file: File): Promise<any> => {
    return OrganizersControllerService.uploadDocument(file);
  };

  const updateLocalData = (updates: Partial<Organizer>) => {
    updateOrganizerData(updates);
  };

  const clearOrganizerData = () => {
    clearOrganizer();
  };

  return {
    organizer: currentOrganizer,
    isLoading,
    error,
    refreshOrganizer,
    updateOrganizerProfile,
    uploadImage,
    uploadDocument,
    updateLocalData,
    clearOrganizer: clearOrganizerData,
    hasOrganizer: !!currentOrganizer,
  };
};

/**
 * Hook to get organizer data without automatic fetching
 * Useful when you just want to access cached data
 */
const useOrganizerState = () => {
  const { currentOrganizer, isLoading, error } = useOrganizerStore();

  return {
    organizer: currentOrganizer,
    isLoading,
    error,
    hasOrganizer: !!currentOrganizer,
  };
};

/**
 * Hook for organizer actions without state subscription
 * Useful for components that only need to trigger actions
 */
const useOrganizerActions = () => {
  return {
    fetchOrganizer: organizerService.getOrganizerById,
    updateOrganizerProfile: organizerService.updateOrganizerProfile,
    uploadProfileImage: organizerService.uploadProfileImage,
    updateLocalData: organizerService.updateOrganizerData,
    clearOrganizer: organizerService.clearOrganizer,
    getCurrentOrganizer: organizerService.getCurrentOrganizer,
  };
};
