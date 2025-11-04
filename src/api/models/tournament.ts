export type Tournament = {
  tournamentId: number;
  sports_id?: number;
  event_type: string;
  event_description: string;
  organization_id: number;
  event_name: string;
  skill_level: string[];
  format_name: string;
  tournament_profile: string;
};

export type TournamentResponse = {
  message: string;
  data: Tournament;
};
