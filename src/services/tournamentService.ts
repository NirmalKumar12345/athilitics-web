import { TournamentResponse } from '@/api/models/tournament';
import { TournamentDTO } from '@/api/models/TournamentDTO';
import { Tournament } from '@/api/models/TournamentList';
import { TournamentRegistrationList } from '@/api/models/TournamentRegistrationList';
import { TournamentUpdateDTO } from '@/api/models/TournamentUpdateDTO';
import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { UploadResponseDto } from '@/api/models/UploadResponseDto';
import { TournamentControllerService } from '@/api/services/TournamentControllerService';
import { isErrorWithMessage } from '@/utils/errorUtils';
import { create } from 'zustand';
import { storage, STORAGE_KEYS } from './storage';

interface TournamentStore {
  tournaments: { [id: number]: TournamentUpdateList } | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: { [id: number]: number } | null;
  getTournamentById: (id: number, forceRefresh?: boolean) => Promise<TournamentUpdateList | null>;
  updateTournament: (id: number, data: Partial<TournamentUpdateDTO>) => Promise<void>;
  publishTournament: (tournamentId: number) => Promise<void>;
  createTournament: (data: TournamentDTO) => Promise<TournamentResponse>;
  setTournaments: (tournament: TournamentUpdateList | null) => void;
  updateTournamentData: (updates: Partial<TournamentUpdateList>) => void;
  clearTournaments: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  acceptTournamentTerms: (params: {
    organizerId: number;
    tournamentTermsAccepted: boolean;
  }) => Promise<void>;
  uploadTournamentProfilePicture: (file: File) => Promise<UploadResponseDto>;
  getTournamentsByOrganizerId: (organizerId: string) => Promise<Tournament[]>;
  downloadTournamentRegistrationsExcel: (tournamentId: number) => Promise<Blob>;
  getTournamentRegistrations: (tournamentId: number) => Promise<TournamentRegistrationList>;
}
const CACHE_DURATION = 5 * 60 * 1000;

const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournaments: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  getTournamentsByOrganizerId: async (organizerId: string): Promise<Tournament[]> => {
    set({ isLoading: true, error: null });
    try {
      const data = await TournamentControllerService.getTournamentsByOrganizerId(organizerId);
      set({ isLoading: false });
      return data.tournaments || [];
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch tournaments' });
      return [];
    }
  },
  getTournamentRegistrations: async (tournamentId: number): Promise<TournamentRegistrationList> => {
    set({ isLoading: true, error: null });
    try {
      const data = await TournamentControllerService.getTournamentRegistrations(tournamentId);
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch tournament registrations' });
      return [];
    }
  },
  setTournaments: (tournament: TournamentUpdateList | null) => {
    const id = tournament?.id;
    if (!id) return;
    set((state) => ({
      tournaments: { ...(state.tournaments || {}), [id]: tournament },
      lastFetched: { ...(state.lastFetched || {}), [id]: Date.now() },
    }));
    if (tournament) {
      storage.set(
        STORAGE_KEYS.tournaments,
        {
          data: tournament,
          timestamp: Date.now(),
        },
        id
      );
    } else {
      storage.remove(STORAGE_KEYS.tournaments, id);
    }
  },
  updateTournamentData: (updates: Partial<TournamentUpdateList>) => {
    const { tournaments, setTournaments } = get();
    if (tournaments && updates.id && tournaments[updates.id]) {
      const updated = { ...tournaments[updates.id], ...updates };
      setTournaments(updated);
    }
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  getTournamentById: async (
    id: number,
    forceRefresh = false
  ): Promise<TournamentUpdateList | null> => {
    const { tournaments, lastFetched, setTournaments, setLoading, setError } = get();
    if (!forceRefresh && tournaments && lastFetched && tournaments[id]) {
      const isCacheValid = Date.now() - lastFetched[id] < CACHE_DURATION;
      if (isCacheValid) {
        return tournaments[id];
      }
    }
    if (!forceRefresh) {
      const cachedData = storage.get(STORAGE_KEYS.tournaments, id);
      if (cachedData && cachedData.data) {
        const isCacheValid = Date.now() - cachedData.timestamp < CACHE_DURATION;
        if (isCacheValid) {
          setTournaments(cachedData.data);
          return cachedData.data;
        }
      }
    }
    setLoading(true);
    setError(null);
    try {
      const response = await TournamentControllerService.getTournamentById(id);
      setTournaments(response.tournament);
      setLoading(false);
      return response.tournament;
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Failed to fetch tournament data';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  },
  updateTournament: async (id: number, data: Partial<TournamentUpdateDTO>): Promise<void> => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      await TournamentControllerService.updateTournament(id, {
        event_name: data.event_name,
        sports_id: data.sports_id,
        event_type: data.event_type,
        format_name: data.format_name,
        skill_level: data.skill_level,
        event_descriptions: data.event_descriptions,
        recurring_tournament: data.recurring_tournament,
        tournament_type: data.tournament_type,
        tournament_date: data.tournament_date,
        tournament_start_time: data.tournament_start_time,
        tournament_end_time: data.tournament_end_time,
        venue_address: data.venue_address,
        tournament_profile: data.tournament_profile,
        no_of_courts: data.no_of_courts,
        auto_messages: data.auto_messages,
        organization_address: data.organization_address,
        registration_start_date: data.registration_start_date,
        registration_end_date: data.registration_end_date,
        visibility: data.visibility,
        allow_In_App_Wallet_Payment: data.allow_In_App_Wallet_Payment,
        allow_player_score_submission: data.allow_player_score_submission,
        entry_fee: data.entry_fee,
      });
      console.log('[TournamentService] Tournament updated successfully');
      await get().getTournamentById(id, true);
      setLoading(false);
    } catch (error) {
      console.error('[TournamentService] Error updating tournament:', error);
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Failed to update tournament';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  publishTournament: async (tournamentId: number): Promise<void> => {
    const { setLoading, setError, getTournamentById } = get();
    setLoading(true);
    setError(null);

    try {
      await TournamentControllerService.publishTournament(tournamentId);
      console.log('[TournamentService] Tournament published successfully');
      await getTournamentById(tournamentId, true);
      setLoading(false);
    } catch (error) {
      console.error('[TournamentService] Error publishing tournament:', error);
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Failed to publish tournament';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  createTournament: async (data: TournamentDTO): Promise<TournamentResponse> => {
    const { setLoading, setError, getTournamentById } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await TournamentControllerService.createTournament(data);
      console.log('[TournamentService] Tournament created successfully');
      await getTournamentById(response.data.tournamentId, true);
      setLoading(false);
      return response;
    } catch (error) {
      console.error('[TournamentService] Error creating tournament:', error);
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Failed to create tournament';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  acceptTournamentTerms: async (params: {
    organizerId: number;
    tournamentTermsAccepted: boolean;
  }) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      await TournamentControllerService.acceptTournamentTerms(params);
      setLoading(false);
    } catch (error) {
      const errorMessage = isErrorWithMessage(error)
        ? error.message
        : 'Failed to accept tournament terms';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  uploadTournamentProfilePicture: async (file: File): Promise<UploadResponseDto> => {
    const { setError } = get();
    try {
      return await TournamentControllerService.uploadTournamentProfilePicture(file);
    } catch (error) {
      console.error('[TournamentService] Error uploading tournament profile picture:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload tournament profile picture';
      setError(errorMessage);
      throw error;
    }
  },

  clearTournaments: () => {
    set({
      tournaments: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    });
    storage.remove(STORAGE_KEYS.tournaments);
  },
  downloadTournamentRegistrationsExcel: async (tournamentId: number) => {
  try {
    const blob = await TournamentControllerService.downloadTournamentRegistrationsExcel(tournamentId);
    return blob;
  } catch (error) {
    console.error('[TournamentService] Failed to download Excel:', error);
    throw error;
  }
},

}));

export const tournamentService = {
  getTournamentById: (id: number, forceRefresh = false) =>
    useTournamentStore.getState().getTournamentById(id, forceRefresh),
  updateTournament: (id: number, data: Partial<TournamentUpdateDTO>) =>
    useTournamentStore.getState().updateTournament(id, data),
  publishTournament: (tournamentId: number) =>
    useTournamentStore.getState().publishTournament(tournamentId),
  createTournament: (data: TournamentDTO) => useTournamentStore.getState().createTournament(data),
  updateTournamentData: (updates: Partial<TournamentUpdateList>) =>
    useTournamentStore.getState().updateTournamentData(updates),
  clearTournaments: () => useTournamentStore.getState().clearTournaments(),
  acceptTournamentTerms: (params: { organizerId: number; tournamentTermsAccepted: boolean }) =>
    useTournamentStore.getState().acceptTournamentTerms(params),
  uploadTournamentProfilePicture: (file: File) =>
    useTournamentStore.getState().uploadTournamentProfilePicture(file),
  getTournaments: () => useTournamentStore.getState().tournaments,
  isLoading: () => useTournamentStore.getState().isLoading,
  getError: () => useTournamentStore.getState().error,
  getTournamentsByOrganizerId: (organizerId: string) =>
    useTournamentStore.getState().getTournamentsByOrganizerId(organizerId),
  getTournamentRegistrations: (tournamentId: number) =>
    useTournamentStore.getState().getTournamentRegistrations(tournamentId),
  downloadTournamentRegistrationsExcel: (tournamentId: number) =>
    useTournamentStore.getState().downloadTournamentRegistrationsExcel(tournamentId),
};

export default useTournamentStore;
