/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GenericResponseObject } from '../models/GenericResponseObject';
import { SportsList } from '../models/SportsList';

export class SportsControllerService {
  /**
   * @param page
   * @param limit
   * @returns GenericList OK
   * @throws ApiError
   */
  public static getAllSports(): Promise<SportsList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/sports/all',
    }) as Promise<SportsList>;
  }

  /**
   * Get asset URL for a sport
   * @param id - Sport ID
   * @param type - Optional asset type
   * @returns Asset URL object
   */
  public static getSportAsset(id: number, type?: string): Promise<{ assetUrl: string | null }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/sports/${id}/asset`,
      query: type ? { type } : undefined,
    }) as Promise<{ assetUrl: string | null }>;
  }
  /**
   * @param requestBody
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static createSport(requestBody: {
    name: string;
  }): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/sports/create',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
