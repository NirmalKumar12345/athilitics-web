/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GenericResponseObject } from '../models/GenericResponseObject';
import { TournamentResponse } from '../models/tournament';
import { TournamentDTO } from '../models/TournamentDTO';
import { TournamentList } from '../models/TournamentList';
import { TournamentRegistrationList } from '../models/TournamentRegistrationList';
import { TournamentUpdateDTO } from '../models/TournamentUpdateDTO';
import { TournamentUpdateList } from '../models/TournamentUpdateList';
import { UploadResponseDto } from '../models/UploadResponseDto';
/* tslint:disable */
export class TournamentControllerService {
  /**
   * @param requestBody
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static createTournament(
    requestBody: TournamentDTO
  ): CancelablePromise<TournamentResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/tournaments/create',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Get tournament by ID
   * @param id string (tournament ID)
   * @returns any OK
   * @throws ApiError
   */
  public static getTournamentById(id: number): CancelablePromise<{
    tournament: TournamentUpdateList;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/tournaments/{id}',
      path: { id },
    });
  }
  /**
   * @param page
   * @param limit
   * @returns { tournament: Tournament[] } OK
   * @throws ApiError
   */
  public static getAllTournament(): CancelablePromise<{ tournament: TournamentUpdateList[] }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/tournaments/all',
    });
  }
  /*
   * @param id string (tournament ID)
   * @param requestBody TournamentDTO (tournament data)
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static updateTournament(
    id: number,
    requestBody: TournamentUpdateDTO
  ): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: `/tournaments/update/${id}`,
      path: { id },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Publish a tournament
   * @param tournament_id number (required)
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static publishTournament(tournament_id: number): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/tournaments/publish',
      body: { tournament_id },
      mediaType: 'application/json',
    });
  }
  /**
   * Get tournaments by organizer ID
   * @param id Organizer ID
   * @returns TournamentList OK
   * @throws ApiError
   */
  public static getTournamentsByOrganizerId(id: string): Promise<TournamentList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/tournaments/organizer/${id}`,
    });
  }

  /**
   * Accept tournament terms for an organizer
   * @param requestBody { organizerId: number, tournamentTermsAccepted: boolean }
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static acceptTournamentTerms(requestBody: {
    organizerId: number;
    tournamentTermsAccepted: boolean;
  }): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/tournaments/accept-terms',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Upload tournament profile picture
   * @param file File to upload
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static uploadTournamentProfilePicture(
    file: File
  ): CancelablePromise<UploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return __request(OpenAPI, {
      method: 'POST',
      url: '/tournaments/upload-profile',
      body: formData,
      mediaType: 'multipart/form-data',
    });
  }

  /**
   * Get all registrations for a specific tournament with user details
   * @param tournamentId number (required)
   * @returns any OK
   * @throws ApiError
   */
  public static getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistrationList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/tournament-registration/tournament/${tournamentId}`,
      path: { tournamentId },
    });
  }
  /**
   * Download all registrations for a specific tournament in Excel format
   * @param tournamentId number (required)
   * @returns Blob Excel file
   * @throws ApiError
   */
  public static async downloadTournamentRegistrationsExcel(tournamentId: number): Promise<Blob> {
    const response = await __request(OpenAPI, {
      method: 'GET',
      url: `/tournament-registration/tournament/${tournamentId}/download-excel`,
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: 'blob',
    });
    if (response instanceof Blob) {
      return response;
    }
    if (response instanceof ArrayBuffer) {
      return new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    return new Blob([], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

}
