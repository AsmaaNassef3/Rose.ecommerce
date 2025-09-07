import {  HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ICategoriesResponse } from '../../../shared/interfaces/categories/categories';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(  private httpClient : HttpClient) { }

  getAllCategories():Observable<ICategoriesResponse> {
    return this.httpClient.get<ICategoriesResponse>(`${environment.baseUrl}api/v1/categories`);
  }

  getCategoriesWithProductCount(): Observable<any> {
    return this.httpClient.get<any>(`${environment.baseUrl}products/count-by-category`);
  }
  DleteMyAccount(): Observable<any> {
    return this.httpClient.delete<any>(`${environment.baseUrl}api/v1/auth/deleteMe`);

}
}