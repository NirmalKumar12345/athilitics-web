/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RazorPayDto = {
    name: string;
    email: string;
    phone: string;
    legal_business_name: string;
    business_type: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    profile: {
        category: string;
        subcategory: string;
        description: string;
    };
    legal_info: {
        pan: string;
        gst: string;
    };
    bank_account: {
        name: string;
        ifsc: string;
        account_number: string;
        confirm_account_number?: string;
    };
}



export type RazorPayLinkedAccountData = {
    id: string;
    reference_id: string;
    bank_account: {
        name: string;
        ifsc: string;
        account_number: string;
        confirm_account_number?: string;
    };
    legal_info: {
        pan: string;
        gst: string;
    };
    profile: {
        category: string;
        subcategory: string;
        description: string;
    };
    email: string;
    phone: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    legal_business_name: string;
    business_type: string;
    status: string;
    activation_url: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
};

export type RazorPayResponse = {
    success: boolean;
    message?: string;
    data: RazorPayLinkedAccountData;
};