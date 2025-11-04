import * as Yup from 'yup';

// ID Number validation function
export const validateIdNumber = (idType: string, idNumber: string): string | null => {
  if (!idNumber.trim()) {
    return 'ID number is required';
  }

  switch (idType) {
    case 'AADHAAR':
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(idNumber)) {
        return 'Aadhaar number must be exactly 12 digits';
      }
      break;
    case 'PASSPORT':
      const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
      if (!passportRegex.test(idNumber.toUpperCase())) {
        return 'Passport number must be 1 letter followed by 7 digits (e.g., A1234567)';
      }
      break;
    case 'DL':
      const dlRegex = /^[A-Z0-9]{10,20}$/;
      if (!dlRegex.test(idNumber.toUpperCase())) {
        return "Driver's license must be 10-20 alphanumeric characters";
      }
      break;
    case 'OTHER':
      if (idNumber.length < 5) {
        return 'ID number must be at least 5 characters';
      }
      break;
    default:
      return 'Please select an ID type first';
  }
  return null;
};

// Custom Yup method for ID number validation
const addIdNumberValidation = () => {
  Yup.addMethod(Yup.string, 'idNumber', function (idTypeField: string) {
    return this.test('id-number-format', function (value: string | undefined) {
      const idType = this.parent[idTypeField];
      if (!value || !idType) return true; // Let required validation handle empty values

      const error = validateIdNumber(idType, value);
      if (error) {
        return this.createError({ message: error });
      }
      return true;
    });
  });
};

// Initialize custom validation method
addIdNumberValidation();

// Declare module to extend Yup's StringSchema
declare module 'yup' {
  interface StringSchema {
    idNumber(idTypeField: string): StringSchema;
  }
}

// ID Proof validation schema
const idProofSchema = Yup.object().shape({
  id_type: Yup.string()
    .oneOf(['AADHAAR', 'DL', 'PASSPORT', 'OTHER'], 'Please select a valid ID type')
    .required('ID type is required'),

  id_number: Yup.string().trim().required('ID number is required').idNumber('id_type'),

  id_photo_key: Yup.string().required('ID photo is required'),
});

// Organizer verification schema
const organizerVerificationSchema = Yup.object().shape({
  organizer_name: Yup.string()
    .trim()
    .required('Organizer name is required')
    .min(2, 'Organizer name must be at least 2 characters')
    .test(
      'full-name',
      'Please enter both first name and last name',
      function (value: string | undefined) {
        if (!value) return false;
        const nameParts = value.trim().split(' ');
        return nameParts.length >= 2 && nameParts[0].length > 0 && nameParts[1].length > 0;
      }
    ),

  contact_number: Yup.string()
    .trim()
    .required('Contact number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number starting with 6-9'),

  id_proof: idProofSchema,

  organizer_venue_photo_key: Yup.string().required('Organizer venue photo is required'),
});

// GPS Location schema
const gpsLocationSchema = Yup.object().shape({
  latitude: Yup.number()
    .required('GPS latitude is required')
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),

  longitude: Yup.number()
    .required('GPS longitude is required')
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),

  accuracy: Yup.number().required('GPS accuracy is required').min(0, 'Invalid accuracy'),
});

// Venue photo schema
const venuePhotoSchema = Yup.object().shape({
  photo_key: Yup.string().required('Photo key is required'),
  photo_type: Yup.string()
    .oneOf(['OTHER'], 'Invalid photo type')
    .required('Photo type is required'),
  gps_latitude: Yup.number().optional().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  gps_longitude: Yup.number()
    .optional()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
});

// Venue preparedness schema
const venuePreparednessSchema = Yup.object().shape({
  equipment_available: Yup.boolean().required(),
  safety_arrangements: Yup.boolean().required(),
  seating_arrangements: Yup.boolean().required(),
  ground_condition_ok: Yup.boolean().required(),
});

// Venue verification schema
const venueVerificationSchema = Yup.object().shape({
  venue_name: Yup.string()
    .trim()
    .required('Venue name is required')
    .min(2, 'Venue name must be at least 2 characters'),

  venue_address: Yup.string()
    .trim()
    .required('Venue address is required')
    .min(10, 'Venue address must be at least 10 characters'),

  venue_photos: Yup.array()
    .of(venuePhotoSchema)
    .min(2, 'At least 2 venue photos are required')
    .required('Venue photos are required'),

  gps_location: gpsLocationSchema,

  venue_preparedness: venuePreparednessSchema,
});

// Authenticity checks schema
const authenticityChecksSchema = Yup.object().shape({
  branding_present: Yup.boolean().required('Please confirm whether branding/signage is present'),

  discrepancies: Yup.string()
    .trim()
    .max(500, 'Discrepancies description must not exceed 500 characters')
    .optional(),
});

export const fieldVerificationValidationSchema = Yup.object().shape({
  verifier_token: Yup.string().required('Verifier token is required'),

  verifier_id: Yup.string().trim().required('Verifier ID is required'),

  organizer_verification: organizerVerificationSchema,

  venue_verification: venueVerificationSchema,

  authenticity_checks: authenticityChecksSchema,

});

// Validation helper functions
export const validateFormData = (formData: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  try {
    fieldVerificationValidationSchema.validateSync(formData, { abortEarly: false });
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      err.inner.forEach((error) => {
        if (error.path) {
          // Convert nested path to flat key for easier error display
          const errorKey = error.path.replace(/\./g, '_').replace(/\[(\d+)\]/g, '_$1');
          errors[errorKey] = error.message;
        }
      });
    }
  }

  return errors;
};

// Individual field validation
export const validateField = (fieldName: string, value: any, formData?: any): string | null => {
  try {
    const schema = fieldVerificationValidationSchema;
    const fieldPath = fieldName.split('.');

    // Get the relevant part of the schema for this field
    let currentSchema: any = schema;
    for (const path of fieldPath) {
      if (currentSchema.fields && currentSchema.fields[path]) {
        currentSchema = currentSchema.fields[path];
      }
    }

    // Validate the specific field
    currentSchema.validateSync(value);
    return null;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return err.message;
    }
    return null;
  }
};

// Helper function to get validation error message for ID number
export const getIdFormatHint = (idType: string): string => {
  switch (idType) {
    case 'AADHAAR':
      return 'Format: 12 digits (e.g., 123456789012)';
    case 'PASSPORT':
      return 'Format: 1 letter + 7 digits (e.g., A1234567)';
    case 'DL':
      return 'Format: 10-20 alphanumeric characters';
    case 'OTHER':
      return 'Format: Minimum 5 characters';
    default:
      return '';
  }
};
