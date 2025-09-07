import { createReducer, on } from "@ngrx/store";
import { initialProductsState } from "./products.initalstate";
import * as ProductsActions from './products.actions';



export const productsReducer = createReducer(

  initialProductsState, on(ProductsActions.loadProducts, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),


   on(ProductsActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    products: response.products,
    currentPage: response.metadata.currentPage,
    totalPages: response.metadata.totalPages,
    totalItems: response.metadata.totalItems,
  })),

  
    on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
,

    on(ProductsActions.updateSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
    isLoading: true, 
    error: null
  })),

 on(ProductsActions.updateSelectedCategories, (state, { categories }) => ({
  ...state,
  selectedCategories: categories,
  isLoading: true,   
  error: null
})),

  on(ProductsActions.updatePriceRange, (state, { min, max, page }) => ({
    ...state,
    priceRange: { min, max },
    currentPage: page ?? 1,
    isLoading: true,
  })),
)