/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { AgeBracketsList } from '../models/AgeBracketsList';
/* tslint:disable */
export class AgeControllerService {
  /**
   * @param page
   * @param limit
   * @returns GenericList OK
   * @throws ApiError
   */
  public static getAllAgeBrackets(): CancelablePromise<AgeBracketsList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/age-brackets',
    });
  }
}
