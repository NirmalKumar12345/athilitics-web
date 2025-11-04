import { CategoryDTO } from '@/api/models/CategoryDTO';
import { CategoryList } from '@/api/models/CategoryList';
import { CategoryControllerService } from '@/api/services/CategoryControllerService';
import { isErrorWithMessage } from '@/utils/errorUtils';
import { create } from 'zustand';

interface CategoryStore {
  categories: CategoryList | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllCategories: () => Promise<CategoryList | null>;
  createCategory: (data: CategoryDTO) => Promise<void>;
  updateCategory: (id: number, data: Partial<CategoryDTO>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setCategories: (categories: CategoryList | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: null,
  isLoading: false,
  error: null,

  setCategories: (categories: CategoryList | null) => set({ categories }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  fetchAllCategories: async (): Promise<CategoryList | null> => {
    const { setLoading, setError, setCategories } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      const response = await CategoryControllerService.getAllCategories();
      setCategories(response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error('[CategoryService] Error fetching categories:', error);
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Failed to fetch categories';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  },

  createCategory: async (data: CategoryDTO): Promise<void> => {
    const { setLoading, setError } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      await CategoryControllerService.createCategory(data);
      console.log('[CategoryService] Category created successfully');
      await useCategoryStore.getState().fetchAllCategories();
      setLoading(false);
    } catch (error) {
      console.error('[CategoryService] Error creating category:', error);
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Failed to create category';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  updateCategory: async (id: number, data: Partial<CategoryDTO>): Promise<void> => {
    const { setLoading, setError } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      await CategoryControllerService.updateCategory(id, data);
      console.log('[CategoryService] Category updated successfully');
      await useCategoryStore.getState().fetchAllCategories();
      setLoading(false);
    } catch (error) {
      console.error('[CategoryService] Error updating category:', error);
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Failed to update category';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },

  deleteCategory: async (id: number): Promise<void> => {
    const { setLoading, setError } = useCategoryStore.getState();
    setLoading(true);
    setError(null);

    try {
      await CategoryControllerService.deleteCategory(id);
      console.log('[CategoryService] Category deleted successfully');
      await useCategoryStore.getState().fetchAllCategories();
      setLoading(false);
    } catch (error) {
      console.error('[CategoryService] Error deleting category:', error);
      const errorMessage = isErrorWithMessage(error) ? error.message : 'Failed to delete category';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  },
}));

export const categoryService = {
  fetchAllCategories: () => useCategoryStore.getState().fetchAllCategories(),
  createCategory: (data: CategoryDTO) => useCategoryStore.getState().createCategory(data),
  updateCategory: (id: number, data: Partial<CategoryDTO>) => useCategoryStore.getState().updateCategory(id, data),
  deleteCategory: (id: number) => useCategoryStore.getState().deleteCategory(id),
  getCategories: () => useCategoryStore.getState().categories,
  isLoading: () => useCategoryStore.getState().isLoading,
  getError: () => useCategoryStore.getState().error,
};

export default useCategoryStore;
