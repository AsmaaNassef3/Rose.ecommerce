import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Cartitems } from '../../../shared/interfaces/cart/cartitems';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor( private httpClient : HttpClient) { }


cartNum:WritableSignal<number> = signal(0)

 addProductToChart(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}api/v1/cart`,data)
  }

getLoggedUserCart():Observable<Cartitems>{
    return this.httpClient.get<Cartitems>(`${environment.baseUrl}api/v1/cart`)
  }

removeProductFromCart(productId:string):Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}api/v1/cart/${productId}`)
  }
  updateCartItemQuantity(productId: string, quantity: number): Observable<any> {      
    return this.httpClient.put(`${environment.baseUrl}api/v1/cart/${productId}`, { quantity });
  } 
  clearUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}api/v1/cart`);
  }
  
}