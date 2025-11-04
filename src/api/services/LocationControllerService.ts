/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { CityDTO } from '../models/CityDTO';
import { StateDTO } from '../models/StateDTO';

/* tslint:disable */

export class LocationControllerService {
  /**
   * @returns GenericList OK
   * @throws ApiError
   */
  public static getStates(): CancelablePromise<StateDTO[]> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/location/states',
    });
  }
  /**
   * Get cities by stateId
   * @param stateId number (required)
   * @returns CityDTO OK
   * @throws ApiError
   */

  public static getCitiesByStateId(stateId: number): CancelablePromise<CityDTO[]> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/location/cities',
      query: {
        stateId: stateId,
      },
    });
  }

  /**
   * Get pincodes by cityId
   * @param cityId number (required)
   * @returns Array<{ id: number, code: string }> OK
   * @throws ApiError
   */
  public static getPincodesByCityId(
    cityId: number
  ): CancelablePromise<{ id: number; code: string }[]> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/location/pincode',
      query: {
        cityId: cityId,
      },
    });
  }
}
