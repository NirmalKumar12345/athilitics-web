/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { GenericResponseObject } from '../models/GenericResponseObject';
import { Organizer } from '../models/Organizer';
import { OrganizerList } from '../models/OrganizerList';
import { OrganizersUpdateDTO } from '../models/OrganizersUpdateDTO';
import { UploadResponseDto } from '../models/UploadResponseDto';
/* tslint:disable */
export class OrganizersControllerService {
  public static getAllOrganizers(page?: number, limit?: number): CancelablePromise<OrganizerList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/organizers/all',
      query: {
        page: page,
        limit: limit,
      },
    });
  }
  /**
   * Get organizer by ID
   * @param id Organizer ID
   * @returns OrganizerDTO OK
   * @throws ApiError
   */
  public static getSelf(): CancelablePromise<Organizer> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/organizers/self`,
    });
  }
  /**
   * @param requestBody
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static updateOrganizer(
    requestBody: OrganizersUpdateDTO
  ): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: `/organizers/update`,
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Upload Document
   * @param file The file to upload
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static uploadDocument(file: File): CancelablePromise<UploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return __request(OpenAPI, {
      method: 'POST',
      url: '/organizers/upload-document',
      body: formData,
      mediaType: 'multipart/form-data',
    });
  }

  /**
   * Upload Profile
   * @param file The file to upload
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static uploadProfile(file: File): CancelablePromise<UploadResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return __request(OpenAPI, {
      method: 'POST',
      url: '/organizers/upload-profile',
      body: formData,
      mediaType: 'multipart/form-data',
    });
  }
}
