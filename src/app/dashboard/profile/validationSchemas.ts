import * as Yup from 'yup';

const profileValidationSchema = Yup.object().shape({
  organization_name: Yup.string().trim().required('Organisation name is required'),
  organizer_name: Yup.string()
    .trim()
    .required('Name is required')
    .test('full-name', 'Both first name and last name are required', function (value) {
      if (!value) return false;
      const nameParts = value.trim().split(' ');
      return nameParts.length >= 2 && nameParts[0].length > 0 && nameParts[1].length > 0;
    }),
  mobile_number: Yup.string().trim().required('Phone number is required'),
  organization_email: Yup.string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email address'),
});

const sportsValidationSchema = Yup.object().shape({
  primary_sports: Yup.array()
    .min(1, 'Primary sport is required')
    .required('Primary sport is required'),
  organization_role: Yup.string().trim().required('Organisation role is required'),
});

const addressValidationSchema = Yup.object().shape({
  venue: Yup.string().trim().required('Venue/Club address is required'),
  stateId: Yup.number().required('State is required'),
  cityId: Yup.number().required('City is required'),
  pin: Yup.string()
    .trim()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
});

const notifyValidationSchema = Yup.object().shape({
  // Add notify validation fields if needed
});

// Combined schema for the entire form
export const combinedValidationSchema = Yup.object().shape({
  ...profileValidationSchema.fields,
  ...sportsValidationSchema.fields,
  ...addressValidationSchema.fields,
  ...notifyValidationSchema.fields,
});

// Helper function to get validation schema for a specific tab
export const getTabValidationSchema = (tab: string) => {
  switch (tab) {
    case 'profile':
      return profileValidationSchema;
    case 'sport':
      return sportsValidationSchema;
    case 'address':
      return addressValidationSchema;
    case 'notify':
      return notifyValidationSchema;
    default:
      return Yup.object();
  }
};
