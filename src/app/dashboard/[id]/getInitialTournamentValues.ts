import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { getTimeFromISO } from '@/lib/time-utils';

export function getInitialTournamentValues(
  tournaments: Partial<TournamentUpdateList> | null | undefined
): Partial<TournamentUpdateList> {
  return {
    event_name: tournaments?.event_name || '',
    sports_id: tournaments?.sports_id || 0,
    event_type: tournaments?.event_type || '',
    organization_id: tournaments?.organization_id || 0,
    format_name: tournaments?.format_name || '',
    organizer_name: tournaments?.organizer_name || '',
    skill_level: tournaments?.skill_level || [],
    event_descriptions: tournaments?.event_descriptions || '',
    tournament_type: tournaments?.tournament_type || '',
    recurring_tournament: tournaments?.recurring_tournament || false,
    tournament_date: tournaments?.tournament_date || '',
    tournament_start_time: getTimeFromISO(tournaments?.tournament_start_time || ''),
    tournament_end_time: getTimeFromISO(tournaments?.tournament_end_time || ''),
    venue_address: tournaments?.venue_address || '',
    tournament_profile: tournaments?.tournament_profile || '',
    no_of_courts: tournaments?.no_of_courts || null,
    registration_start_date: tournaments?.registration_start_date || '',
    registration_end_date: tournaments?.registration_end_date || '',
    auto_messages: tournaments?.auto_messages || false,
    organization_address: tournaments?.organization_address || false,
    allow_In_App_Wallet_Payment: tournaments?.allow_In_App_Wallet_Payment || true,
    allow_player_score_submission: tournaments?.allow_player_score_submission || false,
    categories: tournaments?.categories || [],
    visibility: tournaments?.visibility || '',
  };
}
