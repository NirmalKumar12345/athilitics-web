import { EMAIL_REGEX } from '@/app/constants/regex';
import * as Yup from 'yup';

export const registerUserValidationSchema = Yup.object().shape({
  organization_name: Yup.string().trim().required('Organisation name is required'),

  organizer_name: Yup.string()
    .trim()
    .required('Organizer name is required')
    .test('full-name', 'Both first name and last name are required', function (value) {
      if (!value) return false;
      const nameParts = value.trim().split(' ');
      return nameParts.length >= 2 && nameParts[0].length > 0 && nameParts[1].length > 0;
    }),

  mobile_number: Yup.string().trim().required('Phone number is required'),

  organization_email: Yup.string()
    .trim()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Enter a valid email address'),

  website_link: Yup.string().trim().optional(),

  social_links: Yup.array().of(Yup.string()).optional(),

  primary_sports: Yup.array()
    .of(Yup.number())
    .min(1, 'Primary sport is required')
    .required('Primary sport is required'),

  other_sports: Yup.array().of(Yup.number()).optional(),

  organization_role: Yup.string().trim().required('Organisation role is required'),

  organization_experience: Yup.number().optional().nullable(),

  venue: Yup.string().trim().required('Venue/Club address is required'),

  stateId: Yup.mixed().required('State is required'),

  cityId: Yup.mixed().required('City is required'),

  pin: Yup.string()
    .trim()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Pincode must be 6 digits'),

  document_url: Yup.string().trim().optional(),

  organization_profile: Yup.string().trim().optional(),
  //paymentAccountValidationSchema
  email: Yup.string()
    .trim()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Enter a valid email address'),
  phone: Yup.string()
    .trim()
    .required('Phone number is required'),
  legal_business_name: Yup.string()
    .trim()
    .min(4, 'Minimum 4 characters')
    .max(200, 'Maximum 200 characters')
    .when(['business_type'], {
      is: (business_type: string) => business_type !== 'individual',
      then: schema => schema.required('Legal business name is required'),
      otherwise: schema => schema.optional(),
    }),
  business_type: Yup.string()
    .trim()
    .required('Business type is required'),
  profile: Yup.object().when(['business_type'], {
    is: (business_type: string) => business_type !== 'individual',
    then: schema => schema.shape({
      category: Yup.string().trim().required('Business category is required'),
      subcategory: Yup.string().trim().required('Business subcategory is required'),
      description: Yup.string().trim().optional(),
    }),
    otherwise: schema => schema.shape({
      category: Yup.string().trim().optional(),
      subcategory: Yup.string().trim().optional(),
      description: Yup.string().trim().optional(),
    }),
  }),
  address: Yup.object().shape({
    line1: Yup.string().trim().required('Address line 1 is required'),
    line2: Yup.string().trim().required('Address line 2 is required'),
    state: Yup.string().trim().required('State is required'),
    city: Yup.string().trim().required('City is required'),
    postal_code: Yup.string()
      .trim()
      .required('Postal code is required')
      .matches(/^[0-9]{6}$/, 'Postal code must be 6 digits'),
    country: Yup.string().trim().required('Country is required'),
  }),

  //bank details
  bank_account: Yup.object().shape({
    name: Yup.string().trim().required('Account name is required'),
    account_number: Yup.string()
      .trim()
      .required('Account number is required')
      .matches(/^\d{9,18}$/, 'Account number must be 9-18 digits'),
    confirm_account_number: Yup.string()
      .trim()
      .required('Confirm account number is required')
      .oneOf([Yup.ref('account_number')], 'Account numbers must match'),
    ifsc: Yup.string()
      .trim()
      .required('IFSC code is required')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code'),
  }),
  legal_info: Yup.object().when(['business_type'], {
          is: (business_type: string) => business_type !== 'individual',
          then: schema => schema.shape({
              pan: Yup.string()
                  .trim()
                  .required('PAN number is required')
                  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN number'),
              gst: Yup.string().trim().required('GST is required'),
          }),
          otherwise: schema => schema.shape({
              pan: Yup.string().trim().optional(),
              gst: Yup.string().trim().optional(),
          }),
      }),

});

