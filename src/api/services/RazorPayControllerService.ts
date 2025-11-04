import { RazorPayBusinessCategory } from '../models/RazorPayBusinessCategory';
// ...existing code...
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */

import { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import { RazorPayBusinessCategoryList } from '../models/RazorPayBusinessCategory';
import { RazorPayBusinessTypeList } from '../models/RazorPayBusinessType';
import { RazorPayDto, RazorPayResponse } from '../models/RazorPayDto';

export class RazorPayControllerService {
    /**
     * Get business subcategories by category
     * @param category string (required)
     * @returns RazorPayBusinessCategory[] OK
     * @throws ApiError
     */
    public static getBusinessSubcategories(category: string): CancelablePromise<RazorPayBusinessCategory[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/razorpay-route/business-subcategories',
            query: { category },
        });
    }

    /**
     * Get detailed linked account information for the authenticated user
     * @returns RazorPayResponse OK
     * @throws ApiError
     */
    public static getLinkedAccountDetails(): CancelablePromise<RazorPayResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/razorpay-route/linked-account/details',
        });
    }
    /**
     * Create a new Razorpay linked account for the authenticated user
     * @param requestBody object containing linked account details
     * @returns any OK
     * @throws ApiError
     */
    public static createLinkedAccount(
        requestBody: RazorPayDto
    ): CancelablePromise<RazorPayResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/razorpay-route/linked-account/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get supported business types for Razorpay linked accounts
     * @returns RazorPayBusinessTypeList OK
     * @throws ApiError
     */
    public static getBusinessTypes(): CancelablePromise<RazorPayBusinessTypeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/razorpay-route/business-types',
        });
    }

    /**
     * Get supported business categories for Razorpay linked accounts
     * @returns RazorPayBusinessCategoryList OK
     * @throws ApiError
     */
    public static getBusinessCategories(): CancelablePromise<RazorPayBusinessCategoryList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/razorpay-route/business-categories',
        });
    }

    /**
     * Update linked account for the authenticated user
     * @param requestBody RazorPayDto
     * @returns RazorPayResponse OK
     * @throws ApiError
     */
    public static updateLinkedAccount(
        requestBody: RazorPayDto
    ): CancelablePromise<RazorPayResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/razorpay-route/linked-account/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}