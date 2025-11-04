import { CategoryList } from "./CategoryList";

export type Tournament = {
  registered_count?: number;
  participants?: any[];
  id: number;
  event_name: string;
  sports_id: number;
  event_type: string;
  sportsName: string;
  format_name: string;
  skill_level: string[];
  current_participants?: number;
  event_descriptions: string;
  tournament_type: string;
  tournament_date: string | null;
  tournament_start_time: string | null;
  tournament_end_time: string | null;
  venue_address?: string;
  no_of_courts: number;
  registration_start_date: string | null;
  registration_end_date: string | null;
  auto_messages: boolean;
  organization_address: boolean;
  entry_fee: string;
  tournament_status: string | null;
  organization_id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  tournament_profile?: string;
  categories?: CategoryList[];
};

export type TournamentList = {
  tournaments: Tournament[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};
