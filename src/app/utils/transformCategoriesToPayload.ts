// Utility to transform categories data to payload for category creation

interface CategoryFormData {
  ageBracket?: { id: number };
  gender_type?: string;
  maximum_participants?: number;
  divisions_label?: string;
  divisions_alias?: string;
  format_type?: string;
  entry_fee?: number;
  waiting_list?: boolean;
  organizerId?: number;
}

export function transformCategoriesToPayload(
  categoriesData: CategoryFormData[],
  tournamentId: number
) {
  return (categoriesData || [])
    .filter((cat: CategoryFormData) => cat.ageBracket?.id)
    .map((cat: CategoryFormData) => ({
      tournamentId,
      organizerId: cat.organizerId || 0,
      divisions_label: 'temp',
      divisions_alias: 'temp',
      age_group: cat.ageBracket!.id,
      gender_type: cat.gender_type || '',
      format_type: cat.format_type || '',
      entry_fee: typeof cat.entry_fee === 'string' ? Number(cat.entry_fee) || 0 : cat.entry_fee || 0,
      waiting_list: cat.waiting_list || false,
      maximum_participants: cat.maximum_participants || 0,
    }));
}

// New function to transform a single category to object payload
export function transformCategoryToObjectPayload(
  categoryData: CategoryFormData,
  tournamentId: number
) {
  return {
    tournamentId,
    organizerId: categoryData.organizerId || 0,
    divisions_label: 'temp',
    divisions_alias: 'temp',
    age_group: categoryData.ageBracket?.id || 0,
    gender_type: categoryData.gender_type || '',
    format_type: categoryData.format_type || '',
    entry_fee: typeof categoryData.entry_fee === 'string' ? Number(categoryData.entry_fee) || 0 : categoryData.entry_fee || 0,
    waiting_list: categoryData.waiting_list || false,
    maximum_participants: categoryData.maximum_participants || 0,
  };
}

export function transformCategoryToUpdatePayload(
  categoryData: CategoryFormData
) {
  return {
    divisions_label: 'temp',
    divisions_alias: 'temp',
    age_group: categoryData.ageBracket?.id || 0,
    gender_type: categoryData.gender_type || '',
    format_type: categoryData.format_type || '',
    entry_fee: typeof categoryData.entry_fee === 'string' ? Number(categoryData.entry_fee) || 0 : categoryData.entry_fee || 0,
    waiting_list: categoryData.waiting_list || false,
    maximum_participants: categoryData.maximum_participants || 0,
  };
}
