/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TournamentUpdateDTO = {
  event_name?: string;
  sports_id?: number;
  organization_id?: number;
  event_type?: string;
  format_name?: string;
  skill_level?: Array<string>;
  event_descriptions?: string;
  tournament_type?: string;
  tournament_date?: string;
  tournament_start_time?: string;
  tournament_end_time?: string;
  venue_address?: string;
  auto_messages?: boolean;
  organization_address?: boolean;
  no_of_courts?: number;
  tournament_profile?: string;
  registration_start_date?: string;
  registration_end_date?: string;
  visibility?: string;
  allow_In_App_Wallet_Payment?: boolean;
  allow_player_score_submission?: boolean;
  recurring_tournament?: boolean; 
  entry_fee?: number;
  publish_tournament?: boolean;
};
