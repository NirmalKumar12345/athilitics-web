import { Organizer } from '@/api/models/Organizer';
import { UploadResponseDto } from '@/api/models/UploadResponseDto';
import { OrganizersControllerService } from '@/api/services/OrganizersControllerService';
import { logout } from '@/app/utils/storageService';
import { create } from 'zustand';
import { storage, STORAGE_KEYS } from './storage';

interface OrganizerStore {
  currentOrganizer: Organizer | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  getOrganizerById: (forceRefresh?: boolean) => Promise<Organizer | null>;
  updateOrganizer: (data: Partial<Organizer>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<UploadResponseDto>;
  setCurrentOrganizer: (organizer: Organizer | null) => void;
  updateOrganizerData: (updates: Partial<Organizer>) => void;
  clearOrganizer: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const CACHE_DURATION = 5 * 60 * 1000;

const useOrganizerStore = create<OrganizerStore>((set, get) => ({
  currentOrganizer: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  setCurrentOrganizer: (organizer: Organizer | null) => {
    set({ currentOrganizer: organizer, lastFetched: organizer ? Date.now() : null });
    if (organizer) {
      storage.set(STORAGE_KEYS.currentOrganizer, {
        data: organizer,
        timestamp: Date.now(),
      });
    } else {
      storage.remove(STORAGE_KEYS.currentOrganizer);
    }
  },

  updateOrganizerData: (updates: Partial<Organizer>) => {
    const { currentOrganizer, setCurrentOrganizer } = get();
    if (currentOrganizer) {
      const updatedOrganizer = { ...currentOrganizer, ...updates };
      setCurrentOrganizer(updatedOrganizer);
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  getOrganizerById: async (forceRefresh = false): Promise<Organizer | null> => {
    const { currentOrganizer, lastFetched, setCurrentOrganizer, setLoading, setError } = get();

    if (!forceRefresh && currentOrganizer && lastFetched) {
      const isCacheValid = Date.now() - lastFetched < CACHE_DURATION;
      if (isCacheValid) {
        return currentOrganizer;
      }
    }

    if (!forceRefresh) {
      const cachedData = storage.get(STORAGE_KEYS.currentOrganizer);
      if (cachedData && cachedData.data) {
        const isCacheValid = Date.now() - cachedData.timestamp < CACHE_DURATION;
        if (isCacheValid) {
          setCurrentOrganizer(cachedData.data);
          return cachedData.data;
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[OrganizerService] Fetching organizer data...');
      const response = await OrganizersControllerService.getSelf();
      const organizerData = response as any;
      setCurrentOrganizer(organizerData);
      setLoading(false);
      return organizerData;
    } catch (error) {
      logout();
      console.error('[OrganizerService] Error fetching organizer:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch organizer data';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  },

  updateOrganizer: async (data: Partial<Organizer>) => {
    const { setLoading, setError } = get();

    setLoading(true);
    setError(null);

    try {
      await OrganizersControllerService.updateOrganizer({
        organization_name: data.organization_name,
        organizer_name: data.organizer_name,
        mobile_number: data.mobile_number,
        organization_email: data.organization_email,
        website_link: data.website_link,
        document_name: data.document_name,
        social_links: data.social_links?.filter(Boolean) || [],
        primary_sports:
          data.primary_sports && data.primary_sports.length > 0
            ? data.primary_sports.map((id) => Number(id))
            : undefined,
        other_sports:
          data.other_sports && data.other_sports.length > 0
            ? data.other_sports.map((id) => Number(id))
            : undefined,
        organization_role: data.organization_role,
        organization_experience: data.organization_experience,
        no_of_annual_events_hosted: data.no_of_annual_events_hosted,
        venue: data.venue,
        cityId: data.cityId || undefined,
        stateId: data.stateId || undefined,
        pin: data.pin,
        organization_profile: data.organization_profile || undefined,
        document_url: data.document_url || undefined,
      });
      // Refresh organizer data after successful update
      console.log('[OrganizerService] Organizer updated successfully');
      await get().getOrganizerById(true);
      setLoading(false);
    } catch (error) {
      console.error('[OrganizerService] Error updating organizer:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update organizer profile';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  uploadProfileImage: async (file: File): Promise<UploadResponseDto> => {
    const { setError } = get();
    try {
      return await OrganizersControllerService.uploadProfile(file);
    } catch (error) {
      console.error('[OrganizerService] Error uploading profile image:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload profile image';
      setError(errorMessage);
      throw error;
    }
  },


  clearOrganizer: () => {
    set({
      currentOrganizer: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    });
    storage.remove(STORAGE_KEYS.currentOrganizer);
  },
}));

// Export the store and convenience methods
export const organizerService = {
  // Get organizer by ID with optional force refresh
  getOrganizerById: (forceRefresh = false) =>
    useOrganizerStore.getState().getOrganizerById(forceRefresh),

  // Get current organizer from store (synchronous)
  getCurrentOrganizer: () => useOrganizerStore.getState().currentOrganizer,

  // Update organizer profile via API
  updateOrganizerProfile: (data: Partial<Organizer>) =>
    useOrganizerStore.getState().updateOrganizer(data),

  // Upload profile image
  uploadProfileImage: (file: File) => useOrganizerStore.getState().uploadProfileImage(file),

  // Upload document
  uploadDocument: (file: File) => OrganizersControllerService.uploadDocument(file),

  // Update organizer data in store only (local update)
  updateOrganizerData: (updates: Partial<Organizer>) =>
    useOrganizerStore.getState().updateOrganizerData(updates),

  // Clear organizer data
  clearOrganizer: () => useOrganizerStore.getState().clearOrganizer(),

  // Check if organizer is currently loading
  isLoading: () => useOrganizerStore.getState().isLoading,

  // Get any error state
  getError: () => useOrganizerStore.getState().error,
};

export default useOrganizerStore;
