'use client';

import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { FormikProps } from 'formik';
import OrganizationCard from './organization-card';

export default function OrganizationControl({
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
      <OrganizationCard
        autoMessages={values.auto_messages ?? false}
        onToggleAutoMessages={(v) => setFieldValue('auto_messages', v)}
        allowWallet={values.allow_In_App_Wallet_Payment ?? true}
        onToggleAllowWallet={(v) => setFieldValue('allow_In_App_Wallet_Payment', v)}
        allowPlayerScoreSubmission={values.allow_player_score_submission ?? false}
        onToggleAllowPlayerScoreSubmission={(v) =>
          setFieldValue('allow_player_score_submission', v)
        }
        visibility={values.visibility ?? ''}
        onChangeVisibility={(v) => {
          setFieldValue('visibility', v);
          clearFieldError('visibility');
        }}
        errors={hasSubmitted ? errors : {}}
      />
    </section>
  );
}
