import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { getBestsellerResponse } from '../../../shared/interfaces/bestseller/bestseller';
import { popularItems } from '../../../shared/interfaces/home/popularitems';

@Injectable({
  providedIn: 'root'
})
export class PestsellerService {
 searchTerm = signal<string>('');
  constructor( private http: HttpClient) { }


getPestsellerData():Observable<any>{
    return this.http.get(`${environment.baseUrl}api/v1/best-seller`);
  }

getAllProducts():Observable<popularItems>{
    return this.http.get<popularItems>(`${environment.baseUrl}api/v1/products`);
  }


  getSpecificProduct(productId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}api/v1/products/${productId}`);
  }

}
