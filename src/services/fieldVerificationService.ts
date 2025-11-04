import { UploadResponseDto } from '@/api/models/UploadResponseDto';
import { StorageService } from '@/app/utils/storageService';
import { create } from 'zustand';

// Types for Field Verification
export interface VerificationAssignment {
  assignment_id: number;
  organizer: {
    id: number;
    organization_name: string;
    organizer_name: string;
    mobile_number: string;
    venue: string;
    venue_address: string;
  };
  event_details?: {
    event_name: string | null;
    scheduled_at: string | null;
  };
}

export interface IdProofData {
  id_type: 'AADHAAR' | 'DL' | 'PASSPORT' | 'OTHER';
  id_number: string;
  id_photo_key?: string;
}

export interface VenuePhotoData {
  photo_key: string;
  photo_type: 'ENTRANCE' | 'ACTIVITY' | 'SIGNAGE' | 'OTHER';
  gps_latitude?: number;
  gps_longitude?: number;
}

export interface GpsLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface VenuePreparednessData {
  equipment_available: boolean;
  safety_arrangements: boolean;
  seating_arrangements: boolean;
  ground_condition_ok: boolean;
}

export interface FieldVerificationFormData {
  verifier_token: string;
  verifier_id?: string;
  organizer_verification: {
    organizer_name: string;
    id_proof: IdProofData;
    contact_number: string;
    organizer_venue_photo_key?: string;
  };
  venue_verification: {
    venue_name: string;
    venue_address: string;
    venue_photos: VenuePhotoData[];
    gps_location: GpsLocationData;
    venue_preparedness: VenuePreparednessData;
  };
  authenticity_checks: {
    branding_present: boolean;
    discrepancies?: string;
  };
  final_verification: {
    verifier_comments: string;
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
  };
}

export interface VerificationSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    result_id: number;
    assignment_id: number;
    final_status: string;
    organizer_verification_status: string;
    verification_date: string;
  };
}

interface FieldVerificationStore {
  assignment: VerificationAssignment | null;
  formData: Partial<FieldVerificationFormData>;
  isLoading: boolean;
  error: string | null;

  // Actions
  getAssignmentByToken: (token: string) => Promise<VerificationAssignment | null>;
  uploadIdPhoto: (file: File) => Promise<UploadResponseDto>;
  submitVerification: (data: FieldVerificationFormData) => Promise<VerificationSubmissionResponse>;
  updateFormData: (updates: Partial<FieldVerificationFormData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

// API base URL - adjust based on your backend configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get authentication headers
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if user is authenticated
  const authToken = StorageService.authToken.getValue();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

const isAuthenticated = (): boolean => {
  const authToken = StorageService.authToken.getValue();
  return !!authToken;
};

const handleAuthError = (methodName: string): Error => {
  StorageService.authToken.clear();

  const error = new Error(`Authentication required for ${methodName}. Please login again.`);
  (error as any).isUnauthorized = true;
  (error as any).redirectToLogin = true;
  return error;
};

const useFieldVerificationStore = create<FieldVerificationStore>((set, get) => ({
  assignment: null,
  formData: {},
  isLoading: false,
  error: null,

  getAssignmentByToken: async (token: string): Promise<VerificationAssignment | null> => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated()) {
        throw handleAuthError('field verification access');
      }

      const response = await fetch(`${API_BASE_URL}/field-Verification/${token}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        throw handleAuthError('field verification access');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (result && result.assignment_id && result.organizer) {
        set({ assignment: result });
        return result;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('[FieldVerificationService] Error fetching assignment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch assignment';
      setError(errorMessage);

      throw error;
    } finally {
      setLoading(false);
    }
  },

  uploadIdPhoto: async (file: File): Promise<UploadResponseDto> => {
    const { setError } = get();

    try {
      setError(null);

      if (!isAuthenticated()) {
        throw handleAuthError('file upload');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Get headers without Content-Type for multipart/form-data
      const headers: Record<string, string> = {};
      const authToken = StorageService.authToken.getValue();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      const response = await fetch(`${API_BASE_URL}/field-verification/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        throw handleAuthError('file upload');
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as UploadResponseDto;
    } catch (error) {
      console.error('[FieldVerificationService] Error uploading ID photo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload ID photo';
      setError(errorMessage);
      throw error;
    }
  },

  submitVerification: async (
    data: FieldVerificationFormData
  ): Promise<VerificationSubmissionResponse> => {
    const { setLoading, setError } = get();

    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated before making the request
      if (!isAuthenticated()) {
        throw handleAuthError('verification submission');
      }

      const response = await fetch(
        `${API_BASE_URL}/field-verification/${data.verifier_token}/submit`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (response.status === 401) {
        throw handleAuthError('verification submission');
      }

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return result as VerificationSubmissionResponse;
    } catch (error) {
      console.error('[FieldVerificationService] Error submitting verification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit verification';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  updateFormData: (updates: Partial<FieldVerificationFormData>) => {
    set((state) => ({
      formData: { ...state.formData, ...updates },
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearData: () => {
    set({
      assignment: null,
      formData: {},
      isLoading: false,
      error: null,
    });
  },
}));

export default useFieldVerificationStore;

// Export service functions for use in components
export const fieldVerificationService = {
  getAssignmentByToken: (token: string) =>
    useFieldVerificationStore.getState().getAssignmentByToken(token),
  uploadIdPhoto: (file: File) => useFieldVerificationStore.getState().uploadIdPhoto(file),
  submitVerification: (data: FieldVerificationFormData) =>
    useFieldVerificationStore.getState().submitVerification(data),
  updateFormData: (updates: Partial<FieldVerificationFormData>) =>
    useFieldVerificationStore.getState().updateFormData(updates),
  clearData: () => useFieldVerificationStore.getState().clearData(),
};
