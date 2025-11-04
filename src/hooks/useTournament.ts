import { TournamentResponse } from '@/api/models/tournament';
import { TournamentDTO } from '@/api/models/TournamentDTO';
import { TournamentUpdateDTO } from '@/api/models/TournamentUpdateDTO';
import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import useTournamentStore, { tournamentService } from '@/services/tournamentService';
import { useCallback, useEffect } from 'react';

/**
 * Custom hook to manage tournament state with Zustand
 *
 * @param autoFetch - Whether to automatically fetch tournaments on mount (default: true)
 * @param tournamentId - The tournament ID to fetch (required if autoFetch is true)
 * @returns Object containing tournament data, loading state, error, and utility functions
 */
export const useTournament = (autoFetch = true, tournamentId?: number) => {
  const {
    tournaments,
    isLoading,
    error,
    getTournamentById,
    updateTournament: updateTournamentAPI,
    publishTournament: publishTournamentAPI,
    createTournament: createTournamentAPI,
    updateTournamentData,
    clearTournaments,
    acceptTournamentTerms: acceptTournamentTermsAPI,
    getTournamentsByOrganizerId,
  } = useTournamentStore();
  const getTournamentRegistrations = async (id: number) => {
    return tournamentService.getTournamentRegistrations(id);
  };

  const downloadTournamentExcelFile = useCallback(
    async (tournamentId: number) => {
      try {
        const blob = await tournamentService.downloadTournamentRegistrationsExcel(tournamentId);
        const isExcelMime = blob.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isZipHeader = async (blob: Blob) => {
          const arr = await blob.slice(0, 2).arrayBuffer();
          const bytes = new Uint8Array(arr);
          return bytes[0] === 0x50 && bytes[1] === 0x4B;
        };

        // Get event_name for filename
        let eventName = '';
        if (tournamentId && tournaments && tournaments[tournamentId] && tournaments[tournamentId].event_name) {
          // Replace spaces with underscores, remove non-alphanumeric except underscore, preserve capitalization
          eventName = tournaments[tournamentId].event_name
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '');
        } else {
          eventName = `tournament_${tournamentId}_registrations`;
        }
        const fileName = `${eventName}.xlsx`;

        if (blob instanceof Blob && (isExcelMime || (blob.size > 0 && await isZipHeader(blob)))) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          setTimeout(() => {
            if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
              (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
            }
          }, 100);
          return;
        }

        if (blob instanceof Blob) {
          const reader = new FileReader();
          reader.onload = function () {
            console.error('Excel download failed, blob content:', reader.result);
            alert('Failed to download Excel file.\nDebug info: ' + reader.result);
          };
          reader.readAsText(blob);
        } else {
          alert('Failed to download Excel file.');
        }
      } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download Excel file.');
      }
    },
    [tournaments]
  );
  const fetchTournamentsByOrganizerId = async (organizerId: string) => {
    return getTournamentsByOrganizerId(organizerId);
  };

  useEffect(() => {
    if (autoFetch && (!tournaments || !tournamentId || !tournaments[tournamentId])) {
      if (tournamentId) getTournamentById(tournamentId);
    }
  }, [autoFetch, tournaments, tournamentId, getTournamentById]);

  const refreshTournaments = (id: number, forceRefresh = true) => {
    return getTournamentById(id, forceRefresh);
  };

  const updateTournament = async (id: number, data: TournamentUpdateDTO) => {
    return updateTournamentAPI(id, data);
  };

  const publishTournament = async (tournamentId: number) => {
    return publishTournamentAPI(tournamentId);
  };

  const createTournament = async (data: TournamentDTO): Promise<TournamentResponse> => {
    return createTournamentAPI(data);
  };

  const updateLocalData = (updates: Partial<TournamentUpdateList>) => {
    updateTournamentData(updates);
  };

  const clearTournamentData = () => {
    clearTournaments();
  };

  const acceptTournamentTerms = async (params: {
    organizerId: number;
    tournamentTermsAccepted: boolean;
  }) => {
    return acceptTournamentTermsAPI(params);
  };

  const uploadTournamentProfilePicture = async (file: File) => {
    return tournamentService.uploadTournamentProfilePicture(file);
  };

  return {
    tournaments: tournamentId && tournaments ? tournaments[tournamentId] : null,
    isLoading,
    error,
    refreshTournaments,
    getTournamentById,
    updateTournament,
    publishTournament,
    createTournament,
    updateLocalData,
    clearTournaments: clearTournamentData,
    acceptTournamentTerms,
    hasTournaments: !!(tournamentId && tournaments && tournaments[tournamentId]),
    uploadTournamentProfilePicture,
    fetchTournamentsByOrganizerId,
    getTournamentRegistrations,
    downloadTournamentExcelFile,
  };
};

/**
 * Hook to get tournament data without automatic fetching
 * Useful when you just want to access cached data
 */
export const useTournamentState = () => {
  const { tournaments, isLoading, error } = useTournamentStore();

  return {
    tournaments,
    isLoading,
    error,
    hasTournaments: !!tournaments,
  };
};

/**
 * Hook for tournament actions without state subscription
 * Useful for components that only need to trigger actions
 */
export const useTournamentActions = () => {
  return {
    getTournamentById: tournamentService.getTournamentById,
    updateTournament: tournamentService.updateTournament,
    publishTournament: tournamentService.publishTournament,
    createTournament: tournamentService.createTournament,
    updateLocalData: tournamentService.updateTournamentData,
    clearTournaments: tournamentService.clearTournaments,
    acceptTournamentTerms: tournamentService.acceptTournamentTerms,
  };
};
