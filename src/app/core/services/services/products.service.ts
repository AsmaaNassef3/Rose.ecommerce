import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../../../shared/interfaces/products/productmodel';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient : HttpClient) { }

  getAllProducts(
    page: number = 1,
    filters?: { 
      search?: string; 
      categories?: string[]; 
      minPrice?: number | null; 
      maxPrice?: number | null;
    }
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '7');

    if (filters) {
      if (filters.search) {
        params = params.set('keyword', filters.search);
      }
      if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach(categoryId => {
          params = params.append('category', categoryId);
        });
      }
      if (filters.minPrice !== null && filters.minPrice !== undefined) {
        params = params.set('price[gte]', filters.minPrice.toString());
      }
      if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
        params = params.set('price[lte]', filters.maxPrice.toString());
      }
    }

    return this.httpClient.get<ProductsResponse>(
      `${environment.baseUrl}api/v1/products`,
      { params }
    );
  }

}
