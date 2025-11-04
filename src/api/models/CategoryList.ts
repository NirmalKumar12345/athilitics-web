/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CategoryList = Array<{
  id: number;
  ageBracket: {
    id?: number;
    label: string;
    minAge: number;
    maxAge: number;
    notes: string;
  };
  gender_type: string;
  tournamentId: number;
  organizerId: number;
  divisions_label: string;
  divisions_alias: string;
  format_type: string;
  entry_fee: number;
  waiting_list: boolean;
  maximum_participants: number;
  created_at: string;
  updated_at: string;
}>;
