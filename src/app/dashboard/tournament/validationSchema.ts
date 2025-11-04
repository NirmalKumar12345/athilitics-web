import { htmlToText } from '@/app/utils/htmlToText';
import * as Yup from 'yup';

export const tournamentFormValidationSchema = Yup.object().shape({
  event_name: Yup.string().trim().required('Event name is required'),
  sports_id: Yup.mixed()
    .test(
      'not-zero',
      'Sport is required',
      (value) => value !== 0 && value !== undefined && value !== null
    )
    .required('Sport is required'),
  event_type: Yup.string().trim().required('Event type is required'),
  format_name: Yup.string().trim().required('Event format is required'),
  skill_level: Yup.array()
    .of(Yup.string())
    .min(1, 'Skill level is required')
    .required('Skill level is required'),
  event_descriptions: Yup.string()
    .trim()
    .required('Event description is required')
    .test('html-content', 'Event description is required', (value) => {
      return !!htmlToText(value)?.trim();
    }),
});
