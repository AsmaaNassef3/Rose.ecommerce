// =====================================
// 1. PRODUCT SELECTORS (product.selector.ts)
// =====================================

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.initalstate';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

export const selectIsLoading = createSelector(
  selectProductsState,
  (state) => state.isLoading
);

export const selectCurrentPage = createSelector(
  selectProductsState,
  (state) => state.currentPage
);

export const selectTotalPages = createSelector(
  selectProductsState,
  (state) => state.totalPages
);

export const selectError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectSearchTerm = createSelector(
  selectProductsState,
  (state) => state.searchTerm
);

export const selectSelectedCategories = createSelector(
  selectProductsState,
  (state) => state.selectedCategories
);

export const selectPriceRange = createSelector(
  selectProductsState,
  (state) => state.priceRange
);

// Since you're doing server-side filtering, just return the products from state
export const selectFilteredProductsByCategory = createSelector(
  selectProductsState,
  (state) => state.products
);

export const selectPaginationInfo = createSelector(
  selectProductsState,
  (state) => ({
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalItems: state.totalItems
  })
);

export const selectHasActiveFilters = createSelector(
  selectProductsState,
  (state) => {
    const { searchTerm, selectedCategories, priceRange } = state;
    return !!(
      searchTerm ||
      (selectedCategories && selectedCategories.length > 0) ||
      (priceRange.min !== null || priceRange.max !== null)
    );
  }
);

export const selectCurrentFilters = createSelector(
  selectProductsState,
  (state) => ({
    searchTerm: state.searchTerm,
    selectedCategories: state.selectedCategories,
    priceRange: state.priceRange
  })
);