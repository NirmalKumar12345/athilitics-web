import { CategoryDTO } from '@/api/models/CategoryDTO';
import useCategoryStore, { categoryService } from '@/services/categoryService';
import { useEffect } from 'react';

/**
 * Custom hook to manage category state with Zustand
 *
 * @param autoFetch - Whether to automatically fetch categories on mount (default: true)
 * @returns Object containing category data, loading state, error, and utility functions
 */
export const useCategory = (autoFetch = true) => {
  const {
    categories,
    isLoading,
    error,
    fetchAllCategories,
    createCategory: createCategoryAPI,
    updateCategory: updateCategoryAPI,
    deleteCategory: deleteCategoryAPI,
  } = useCategoryStore();

  // Auto-fetch categories when the hook is mounted
  useEffect(() => {
    if (autoFetch && !categories) {
      fetchAllCategories();
    }
  }, [autoFetch, categories, fetchAllCategories]);

  // Utility functions
  const refreshCategories = () => {
    return fetchAllCategories();
  };

  const createCategory = async (data: CategoryDTO) => {
    return createCategoryAPI(data);
  };

  const updateCategory = async (id: number, data: Partial<CategoryDTO>) => {
    return updateCategoryAPI(id, data);
  };

  const deleteCategory = async (id: number) => {
    return deleteCategoryAPI(id);
  };

  return {
    categories,
    isLoading,
    error,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    hasCategories: !!categories,
  };
};

/**
 * Hook to get category data without automatic fetching
 * Useful when you just want to access cached data
 */
export const useCategoryState = () => {
  const { categories, isLoading, error } = useCategoryStore();

  return {
    categories,
    isLoading,
    error,
    hasCategories: !!categories,
  };
};

/**
 * Hook for category actions without state subscription
 * Useful for components that only need to trigger actions
 */
export const useCategoryActions = () => {
  return {
    fetchAllCategories: categoryService.fetchAllCategories,
    createCategory: categoryService.createCategory,
    updateCategory: categoryService.updateCategory,
    deleteCategory: categoryService.deleteCategory,
  };
};
