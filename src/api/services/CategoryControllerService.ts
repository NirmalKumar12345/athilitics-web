/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { CategoryDTO } from '../models/CategoryDTO';
import { CategoryList } from '../models/CategoryList';
import { GenericResponseObject } from '../models/GenericResponseObject';
/* tslint:disable */
export class CategoryControllerService {
  /**
   * DELETE /tournament-category/{id}
   * @param id Category ID to delete
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static deleteCategory(id: number): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `/tournament-category/${id}`,
    });
  }
  /**
   * @param requestBody
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static createCategory(requestBody: CategoryDTO): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/tournament-category/create',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param page
   * @param limit
   * @returns GenericList OK
   * @throws ApiError
   */
  public static getAllCategories(): CancelablePromise<CategoryList> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/tournament-category/all',
    });
  }

  /**
   * PATCH /tournament-category/{id}
   * @param id Category ID to update
   * @param requestBody Partial category data to update
   * @returns GenericResponseObject OK
   * @throws ApiError
   */
  public static updateCategory(id: number, requestBody: Partial<CategoryDTO>): CancelablePromise<GenericResponseObject> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: `/tournament-category/${id}`,
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
