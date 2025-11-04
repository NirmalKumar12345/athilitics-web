import * as Yup from 'yup';

// Reusable function for end time validation
export function validateEndTimeAtLeast30MinAfterStart(
  endTimeValue: string,
  startTimeValue: string
): string {
  if (!endTimeValue || !startTimeValue) {
    return '';
  }
  const [sh, sm] = startTimeValue.split(':').map(Number);
  const [eh, em] = endTimeValue.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  if (endMinutes - startMinutes < 30) {
    return 'End time must be at least 30 minutes after start time';
  }
  return '';
}

const tourDetailsValidationSchema = Yup.object().shape({
  tournament_type: Yup.string().trim().required('Tournament type is required'),
  tournament_date: Yup.string().trim().required('Tournament date is required'),
  tournament_start_time: Yup.string().trim().required('Tournament start time is required'),
  tournament_end_time: Yup.string()
    .trim()
    .test(
      'endTime-30min-after-startTime',
      'End time must be at least 30 minutes after start time',
      function (value) {
        const { tournament_start_time } = this.parent;
        return !validateEndTimeAtLeast30MinAfterStart(value || '', tournament_start_time || '');
      }
    ),
  venue_address: Yup.string().trim().required('Venue address is required'),
  no_of_courts: Yup.number()
    .required('Number of Tables/Courts is required')
    .typeError('Number of Tables/Courts must be a valid number')
    .min(1, 'Must be at least 1')
    .max(100, 'Must be at most 100'),
});

const registrationValidationSchema = Yup.object().shape({
  registration_start_date: Yup.string()
    .trim()
    .required('Registration start date is required')
    .test(
      'startDate-before-tournament',
      'Registration start date must be before tournament date',
      function (value) {
        const { tournament_date } = this.parent;
        if (!value || !tournament_date) return true;
        return value < tournament_date;
      }
    ),
  registration_end_date: Yup.string()
    .trim()
    .required('Registration end date is required')
    .test(
      'endDate-after-startDate',
      'Registration end date cannot be before start date',
      function (value) {
        const { registration_start_date } = this.parent;
        if (!value || !registration_start_date) return true;
        // Compare as ISO date strings (YYYY-MM-DD)
        return value >= registration_start_date;
      }
    )
    .test(
      'endDate-before-or-equal-tournament',
      'Registration end date must be before or on tournament date',
      function (value) {
        const { tournament_date } = this.parent;
        if (!value || !tournament_date) return true;
        return value <= tournament_date;
      }
    ),
});

const CategoryValidationSchema = Yup.object().shape({
  categories: Yup.array()
    .of(
      Yup.object().shape({
        ageBracket: Yup.mixed().required('Age limit is required'),
        gender_type: Yup.string().trim().required('Gender type is required'),
        maximum_participants: Yup.number()
          .required('Maximum Participants is required')
          .min(1, 'Maximum Participants must be at least 1'),
        format_type: Yup.string().trim().required('Format type is required'),
        entry_fee: Yup.number()
          .typeError('Entry fee must be a valid number')
          .required('Entry fee is required')
          .min(0, 'Entry fee must be 0 or greater'),
      })
    )
    .min(1, 'At least one category is required'),
});
const organizationValidationSchema = Yup.object().shape({
  visibility: Yup.string().trim().required('Visibility is required'),
});

export const combinedValidationSchema = Yup.object().shape({
  ...tourDetailsValidationSchema.fields,
  ...registrationValidationSchema.fields,
  ...CategoryValidationSchema.fields,
  ...organizationValidationSchema.fields,
});

export const getTabValidationSchema = (tab: string) => {
  switch (tab) {
    case 'tourDetails':
      return tourDetailsValidationSchema;
    case 'registration':
      return registrationValidationSchema;
    case 'Category':
      return CategoryValidationSchema;
    case 'organization':
      return organizationValidationSchema;
    default:
      return Yup.object();
  }
};
