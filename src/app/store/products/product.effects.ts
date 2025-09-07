import { Injectable, inject } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as ProductsActions from './products.actions';
import { ProductsService } from '../../core/services/services/products.service';
import { catchError, map, of, switchMap, withLatestFrom, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectProductsState } from './product.selector';
import { ProductsState } from './products.initalstate';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductsService);
  private store = inject(Store);

 
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      withLatestFrom(this.store.select(selectProductsState)),
      switchMap(([{ page }, state]) =>
        this.productService.getAllProducts(page, {
          search: state.searchTerm,
          categories: state.selectedCategories,
          minPrice: state.priceRange.min,
          maxPrice: state.priceRange.max
        }).pipe(
          map((res) => ProductsActions.loadProductsSuccess({ response: res })),
          catchError((error) =>
            of(ProductsActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );


  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateSearchTerm),
      withLatestFrom(this.store.select(selectProductsState)),
      switchMap(([{ searchTerm, page }, state]) =>
        this.productService.getAllProducts(page ?? 1, {
          search: searchTerm,
          categories: state.selectedCategories,
          minPrice: state.priceRange.min,
          maxPrice: state.priceRange.max
        }).pipe(
          map((res) => ProductsActions.loadProductsSuccess({ response: res })),
          catchError((error) =>
            of(ProductsActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );


  updateSelectedCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateSelectedCategories),
      withLatestFrom(this.store.select(selectProductsState)),
      switchMap(([{ categories, page }, state]) =>
        this.productService.getAllProducts(page ?? 1, {
          search: state.searchTerm,
          categories,
          minPrice: state.priceRange.min,
          maxPrice: state.priceRange.max
        }).pipe(
          map((res) => ProductsActions.loadProductsSuccess({ response: res })),
          catchError((error) =>
            of(ProductsActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );


  updatePriceRange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updatePriceRange),
      withLatestFrom(this.store.select(selectProductsState)),
      switchMap(([{ min, max, page }, state]) =>
        this.productService.getAllProducts(page ?? 1, {
          search: state.searchTerm,
          categories: state.selectedCategories,
          minPrice: min,
          maxPrice: max
        }).pipe(
          map((res) => ProductsActions.loadProductsSuccess({ response: res })),
          catchError((error) =>
            of(ProductsActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
