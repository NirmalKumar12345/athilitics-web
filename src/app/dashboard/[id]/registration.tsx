'use client';

import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { FormikProps } from 'formik';
import RegistrationCard from './registration-card';

export default function Registration({
  formik,
  hasSubmitted = false,
}: {
  formik: FormikProps<Partial<TournamentUpdateList>>;
  hasSubmitted?: boolean;
}) {
  const { values, errors, setFieldValue } = formik;

  const clearFieldError = (field: string) => {
    formik.setFieldError(field, undefined);
  };

  return (
    <section className="flex flex-col gap-6 max-w-4xl mx-auto">
      <RegistrationCard
        date={values.registration_start_date ?? ''}
        onChangeDate={(v) => {
          setFieldValue('registration_start_date', v);
          clearFieldError('registration_start_date');
        }}
        endDate={values.registration_end_date ?? undefined}
        setEndDate={(v) => {
          setFieldValue('registration_end_date', v);
          clearFieldError('registration_end_date');
        }}
        errors={hasSubmitted ? errors : {}}
        clearFieldError={clearFieldError}
        tournamentDate={values.tournament_date ?? ''}
      />
    </section>
  );
}
