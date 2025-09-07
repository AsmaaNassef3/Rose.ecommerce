import { createAction, props } from '@ngrx/store';
import { ProductsResponse } from '../../shared/interfaces/products/productmodel';



export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ page: number }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ response: ProductsResponse}>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);


export const updateSearchTerm = createAction(
  '[Products] Update Search Term',
  props<{ searchTerm: string, page?: number }>()
);
export const updateSelectedCategories = createAction(
  '[Products] Update Selected Categories',
  props<{ categories: string[]; page?: number  }>()
);  
export const updatePriceRange = createAction(
  '[Products] Update Price Range',
  props<{ min: number | null; max: number | null; page?: number }>()
);