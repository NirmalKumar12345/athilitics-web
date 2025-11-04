/**
 * A custom hook that provides a caching mechanism for tab-specific validation in a Formik form.
 * 
 * This function validates form data for a specific tab and caches the results to optimize performance.
 * It ensures that validation is only re-run when the form values change, reducing redundant computations.
 * 
 * @returns {Function} A function that validates a specific tab's data.
 * The returned function accepts the following parameters:
 * - `formik` (FormikProps<Partial<TournamentUpdateList>>): The Formik instance managing the form state.
 * - `tab` (string): The name of the tab to validate. Must be one of ['tourDetails', 'registration', 'Division', 'Category', 'organization'].
 * 
 * The returned function performs validation for the specified tab and all preceding tabs in the tab order.
 * If validation errors are found, it updates the Formik errors state and returns an object with the tab name and errors.
 * If no errors are found, it returns `null`.
 */

import { TournamentUpdateList } from '@/api/models/TournamentUpdateList';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { getTabValidationSchema } from './validationSchemas';
import { collectTabValidationErrors } from './validationUtils';

export function useTabValidationCache() {
  const validationCache: Record<
    string,
    {
      values: Partial<TournamentUpdateList>;
      errors: FormikProps<Partial<TournamentUpdateList>>['errors'] | null;
    }
  > = {};

  useEffect(() => {
    return () => {
      Object.keys(validationCache).forEach((key) => delete validationCache[key]);
    };
  }, []);

  return async (formik: FormikProps<Partial<TournamentUpdateList>>, tab: string) => {
    const tabOrder = ['tourDetails', 'registration', 'Division', 'Category', 'organization'];
    const tabIndex = tabOrder.indexOf(tab);

    for (let i = 0; i <= tabIndex; i++) {
      const currentTab = tabOrder[i];
      const schema = getTabValidationSchema(currentTab);

      const cachedResult = validationCache[currentTab];
      if (cachedResult && JSON.stringify(cachedResult.values) === JSON.stringify(formik.values)) {
        if (cachedResult.errors) {
          formik.setErrors(cachedResult.errors);
          return { tab: currentTab, errors: cachedResult.errors };
        }
        continue;
      }

      const validationErrors = await collectTabValidationErrors(schema, formik.values);
      validationCache[currentTab] = {
        values: { ...formik.values },
        errors: validationErrors?.errors || null,
      };
      if (validationErrors) {
        formik.setErrors(validationErrors.errors);
        return { tab: currentTab, errors: validationErrors.errors };
      }
    }
    return null;
  };
}
