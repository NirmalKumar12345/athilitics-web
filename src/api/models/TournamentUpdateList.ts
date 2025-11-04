/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import { CategoryList } from './CategoryList';

/* eslint-disable */
export type TournamentUpdateList = {
  id: number;
  event_name: string;
  sports_id: number | null;
  event_type: string;
  format_name: string;
  skill_level: string[];
  event_descriptions: string;
  tournament_type: string | null;
  organizer_name: string;
  recurring_tournament: boolean;
  tournament_date: string | null;
  tournament_start_time: string | null;
  tournament_end_time: string | null;
  venue_address?: string;
  no_of_courts: number | null;
  tournament_profile: string | null;
  registration_start_date: string | null;
  registration_end_date: string | null;
  current_participants?: number | null;
  entry_fee: number | null;
  organization_id: number;
  auto_messages: boolean;
  organization_address: boolean;
  allow_In_App_Wallet_Payment: boolean;
  allow_player_score_submission: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  tournament_status: string | null;
  categories?: CategoryList[];
};
