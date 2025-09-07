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





export const selectFilteredProductsByCategory = createSelector(
  selectProductsState,
  (state) => {
    const { products, searchTerm, selectedCategories } = state;


    if ((!selectedCategories || selectedCategories.length === 0) && !searchTerm) {
      return products;
    }

    return products.filter(product => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const matchesSearch =
        !searchTerm || product.title.toLowerCase().includes(searchTerm.toLowerCase());

    
      return matchesCategory && matchesSearch;
    });
  }
);

export const selectPaginationInfo = createSelector(
  selectProductsState,
  (state) => ({
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    totalItems: state.totalItems
  })
);

export const selectPriceRange = createSelector(
  selectProductsState,
  (state) => state.priceRange
);

